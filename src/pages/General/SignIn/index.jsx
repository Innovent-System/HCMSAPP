import { useState,useContext,useEffect } from 'react';
import  Controls  from '../../../components/controls/Controls';
import { useForm, Form } from "../../../components/useForm";
import { Link as RouterLink } from "react-router-dom";
import { InputAdornment,IconButton, Link,Box,Container,Typography,Paper,makeStyles,CircularProgress } from "@material-ui/core";
import { Visibility,VisibilityOff,Person } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import bg from '../../../assests/images/bg-1.jpg';
import { handlePostActions } from '../../../store/actions/httpactions';
import { useDispatch } from "react-redux";
import { API_USER_LOGIN } from '../../../services/UrlService'; 
import Auth from '../../../services/AuthenticationService';
import { SocketContext } from '../../../services/socketService';
 


const initialFValues = {
    userName:"",
    password:"",
    isShowPassword: false,
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: theme.palette.background.dark,
      background:`url(${bg})`,
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      height: '100%',
      paddingBottom: theme.spacing(3),
      paddingTop: theme.spacing(3)
    },
    transparent:{
      opacity:0.9,
      textAlign:'center',
      paddingBottom: theme.spacing(2),
      paddingTop: theme.spacing(1)
    },
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    }
  }));

const SignIn = ({setRoutes,setSideMenu}) => {
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);

  const socket = useContext(SocketContext);
  

  const classes = useStyles();
    const validate = (fieldValues = values) => {
        let temp = { ...errors };
        if ("userName" in fieldValues)
          temp.userName = fieldValues.userName ? "" : "This field is required.";
        if ("password" in fieldValues)
          temp.password =
            fieldValues.password ? "" : "This field is required.";
    
        setErrors({
          ...temp,
        });
    
        if (fieldValues == values) return Object.values(temp).every((x) => x == "");
      };

      const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
         // addOrEdit(values, resetForm);
         const signInData = {
           email:values.userName,
           password:values.password
         }
         setLoader(true);
         dispatch(handlePostActions(API_USER_LOGIN,signInData)).then(res => {
           if(res){
            const { data } = res;
            Auth.setItem('employeeInfo',{signIn:true});
            Auth.setItem("appConfigData",{"appRoutes":data.appRoutes,"sideMenuData":data.sideMenuData});
            Auth.setItem("userInfo",{"email":data.email,"c_Id":data.fkClientId,username:data.username});
            setRoutes(data.appRoutes);
            setSideMenu(data.sideMenuData);
            socket.emit("join",data.fkClientId);
            setLoader(false);
           }
           else{
            setLoader(false);
           }
         });
         
        }
      };

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm,
      } = useForm(initialFValues, true, validate);


      const handleClickShowPassword = () => {
        setValues({ ...values, isShowPassword: !values.isShowPassword });
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

    

    return (
      <>
      <Box className={classes.root}>
     
      <Box
      display="flex"
      flexDirection="column"
      height="100%"
      justifyContent="center"
    >
      <Container className={classes.transparent} component={Paper}
      elevate={3} maxWidth="sm">

      <Box  display='flex' alignItems='center' flexDirection='column'>

      
                  <Typography
                    color="textPrimary"
                    variant="h4"
                  >
                    Sign in
                  </Typography>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="body2"
                  >
                    Sign in on the internal platform
                  </Typography>

                  

                </Box>
                <Form onSubmit={handleSubmit}>
              
                <Controls.Input
                    name="userName"
                    label="User Name"
                    style={{width:'60%'}}
                    value={values.userName}
                    onChange={handleInputChange}
                    error={errors.userName}
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                             <IconButton>
                            <Person />
                             </IconButton>
                        </InputAdornment>
                        ),
                    }}
                />

        <Controls.Input
                    name="password"
                    label="Password"
                    value={values.password}
                    type={values.isShowPassword ? 'text' : 'password'}
                    onChange={handleInputChange}
                    style={{width:'60%'}}
                    error={errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            >
                            {values.isShowPassword ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                />

                   <Box mb={2} display='flex' justifyContent='center' alignItems='center'> 

                     <div className={classes.wrapper}>
                      <Controls.Button
                      text="Login"
                      type="submit"
                      disabled={loader}
                      />

                      {loader && (
                      <CircularProgress size={24} className={classes.buttonProgress} />
                    )}
                     </div>
                   
                    <Controls.Button text="Reset"   color="default"  onClick={resetForm} />
                   </Box>
                
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="body2"
                  >
                    Forgotten Password
                  </Link>

                </Form>
        
      </Container>

        </Box>
        
      </Box>
      </>
    )
}

export default SignIn
