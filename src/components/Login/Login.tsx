import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useNavigate} from "react-router-dom";
import Navbar from "../Navbar";
import {InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import axios, {AxiosError} from "axios";
import {useAuthStore} from "../../store";
import {useSnackStore} from "../../store/snack";
import {BASE_URL} from "../../config";


const Login = () => {
    const navigate = useNavigate();

    const [userField, setUserField] = React.useState('');
    const [passField, setPassField] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);

    const setMessage = useSnackStore(state => state.setSnackMessage)
    const setStatus = useSnackStore(state => state.setSnackStatus)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)

    const authState = useAuthStore(state => state.userAuth);
    const setAuth = useAuthStore(state => state.setAuth);
    const removeAuth = useAuthStore(state => state.removeAuth)


    const handleLogOut = () => {
        removeAuth()
        setMessage("You have logged out")
        setStatus('success')
        setSnackOpen(true)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const user = { userField, passField };
        try {
            const response = await axios.post(
                `${BASE_URL}/users/login`,
                {email: user.userField, password: user.passField});
            // returns { userId: 11, token: "rand string" }});

            setUserField('');
            setPassField('');
            if (response.data.userId !== -1) {
                setAuth(response.data)
                setStatus('success')
                navigate('/films')
                setMessage('Successfully logged in')
            } else {
                setStatus('warning')
                setMessage('Something went wrong, try again')
            }
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            if (e.status === 400) {
                setStatus('error')
                setMessage('Invalid input')
            }
            else if (e.status === 401) {
                setStatus('error')
                setMessage('Invalid email or password')
            }
        }
        setSnackOpen(true)
    };


    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    // const goToHome = () => {
    //     navigate("/")
    // }

    const goToRegister = () => {
        navigate("/register")
    }


    // if (


    return (
        <>
        <Navbar />
            {(authState.token.length === 0 || authState.token === '') &&
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar style={{background: `linear-gradient(45deg, #03a9f4, #00a0b2)`}} sx={{ m: 1 }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h4" sx={{ fontWeight: 'bold', color: '#00a0b2'}}>
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={(e) => setUserField(e.target.value)}
                        value={userField}
                    />
                    <TextField
                        // margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassField(e.target.value)}
                        value={passField}
                        InputProps={{
                            endAdornment:
                            <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                            </InputAdornment>
                        }}
                    />

                    <FormControlLabel sx={{ display: 'flex', flexDirection: 'left' }}
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        style={{background: `linear-gradient(45deg, #03a9f4, #00a0b2)`}}
                        sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}
                    >
                        Sign In
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item >
                            <Button onClick={goToRegister}>
                                Don't have an account? Sign Up
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
            }
            { (authState.token.length > 0 && authState.token !== '') &&
            <>
               <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#00a0b2', mt: 5, mb: 3 }}> You are already logged in </Typography>
                <Button onClick={handleLogOut}>Click here to log out</Button>
            </>
            }
        </>
    );
}

export default Login;