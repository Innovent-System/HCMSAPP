import { useState, useContext, useEffect } from 'react';
import { makeStyles } from "@mui/styles";
import Controls from '../../../components/controls/Controls';
import { useForm, Form } from "../../../components/useForm";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { InputAdornment, IconButton, Link, Box, Container, Typography, Paper, CircularProgress } from "../../../deps/ui";
import { Visibility, VisibilityOff, Person } from '../../../deps/ui/icons';
import { green } from '../../../deps/ui/colorschema';
import { AppRoutesThunk, AuthThunk } from '../../../store/actions/httpactions';
import { useDispatch } from "react-redux";
import { API_USER_LOGIN } from '../../../services/UrlService';
import Auth from '../../../services/AuthenticationService';
import { SocketContext } from '../../../services/socketService';


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

  const socket = useContext(SocketContext);

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

  useEffect(() => {

    return () => {
      socket.off("joinclient");
      socket.off("joincompany");
    }
  }, []);

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
          Auth.setItem("userInfo", { "email": data.email, "c_Id": data.clientId, "com_Id": data.companyId, username: data.username });
          socket.emit("joinclient", data.clientId);
          socket.emit("joincompany", data.companyId);
          navigate("/dashboard");
          setLoader(false);
        }
        else {
          setLoader(false);
        }
      });

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
    <>
      <Box className={classes.Root}>

        <Box
          display="flex"
          flexDirection="column"
          height="100%"
          justifyContent="center"
        >
          <Container className={classes.Transparent} component={Paper}
            elevate={3} maxWidth="sm">

            <Box display='flex' alignItems='center' flexDirection='column'>


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
                style={{ width: '60%' }}
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

              <Controls.Input
                name="password"
                label="Password"
                value={values.password}
                type={values.isShowPassword ? 'text' : 'password'}
                onChange={handleInputChange}
                style={{ width: '60%' }}
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

              <Box mb={2} display='flex' justifyContent='center' alignItems='center'>

                <Box className={classes.Wrapper}>
                  <Controls.Button
                text="Login"
                    type="submit"
                    disabled={loader}
                  />

                  {loader && (
                    <CircularProgress size={24} className={classes.ButtonProgress} />
                  )}
                </Box>

                <Controls.Button text="Reset" color="inherit" onClick={() => { setLoader(false); resetForm() }} />
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
