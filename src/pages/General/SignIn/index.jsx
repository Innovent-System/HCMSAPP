import { useState, useContext, useEffect } from 'react';
import { makeStyles } from "../../../deps/ui";
import Controls from '../../../components/controls/Controls';
import { useForm, Form } from "../../../components/useForm";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { InputAdornment, IconButton, Link, Box, Grid, CircularProgress, Card, CardContent, CardMedia, CardActions } from "../../../deps/ui";
import { Visibility, VisibilityOff, Person } from '../../../deps/ui/icons';
import { green } from '../../../deps/ui/colorschema';
import { AppRoutesThunk, AuthThunk, setUserInfo } from '../../../store/actions/httpactions';
import { useDispatch } from "react-redux";
import { API_USER_LOGIN } from '../../../services/UrlService';
import Auth from '../../../services/AuthenticationService';
import bg from '../../../assets/images/bg-1.jpg'
import logo from '../../../assets/images/Innovent-logo.png'

const initialFValues = {
  userName: "",
  password: "",
  isShowPassword: false,
};

const useStyles = makeStyles((theme) => ({
  Root: {
    background: theme.palette.gradients.primary,
    height: '100%',
    padding: 15,
  },
  Transparent: {
    opacity: 0.9,
    textAlign: 'center',
    padding: theme.spacing(4, 0),
  },
  Wrapper: {
    m: 1,
    position: 'relative',
  },
  ButtonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    mt: -12,
    ml: -12,
  }
}));

let clientId;
const SignIn = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [client, setClient] = useState({
    clientId: null,
    companyId: null
  });


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
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // addOrEdit(values, resetForm);
      const signInData = {
        email: values.userName,
        password: values.password
      }
      setLoader(true);
      dispatch(AuthThunk({ url: API_USER_LOGIN, params: signInData })).unwrap().then(res => {
        if (res) {
          const { data } = res;
          dispatch(setUserInfo({
            email: data.email,
            clientId: data.clientId,
            companyId: data.companyId,
            userName: data.userName,
            fkEmployeeId: data.fkEmployeeId,
            userId: data.userId
          }))
          Auth.setItem("userInfo", {
            email: data.email,
            clientId: data.clientId,
            companyId: data.companyId,
            userName: data.userName,
            fkEmployeeId: data.fkEmployeeId,
            userId: data.userId
          });
         
          navigate("/dashboard");

        }

      }).finally(c => setLoader(false));

    }
  };

  const {
    values,
    setValues,
    errors,
    handleInputChange,
    setErrors,
    resetForm,
  } = useForm(initialFValues);


  const handleClickShowPassword = () => {
    setValues({ ...values, isShowPassword: !values.isShowPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };



  return (
    <Card sx={{
      height: "100vh",
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
      zIndex: 5,
      width: '80%',
      "&::after": {
        content: '""',
        height: 'inherit',
        backgroundColor: 'primary.main',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%',
        zIndex: -1
      }
    }}>

      <CardContent sx={{
        display: "flex", height: 'inherit',
        alignItems: 'center',
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "center"
      }}>
        <CardMedia
          component="img"
          // image='/login.png'
          width={300}
          height={200}
          src={logo}
          sx={{ objectFit: "contain", flex: { md: 0, xs: 0 } }}

        />

        <Form onSubmit={handleSubmit}>
          <Grid flexDirection="column" container>
            <Grid item>
              <Controls.Input
                name="userName"
                label="User Name"
                // style={{ width: '60%' }}
                value={values.userName}
                onChange={handleInputChange}
                error={errors.userName}
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary">
                        <Person />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <Controls.Input
                name="password"
                label="Password"
                value={values.password}
                type={values.isShowPassword ? 'text' : 'password'}
                onChange={handleInputChange}
                // style={{ width: '60%' }}
                error={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        color="primary"
                      >
                        {values.isShowPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box p={0.5}>
            <Controls.Button
              text="Login"

              type="submit"
              disabled={loader}
            />

            {loader && (
              <CircularProgress size={24} className={classes.ButtonProgress} />
            )}
            <Controls.Button text="Reset" color="inherit" onClick={() => { setLoader(false); resetForm() }} />

            <Link
              component={RouterLink}
              to="/register"
              variant="body2"
            >
              Forgotten Password
            </Link>

          </Box>


        </Form>
      </CardContent>

    </Card>

  )
}

export default SignIn
