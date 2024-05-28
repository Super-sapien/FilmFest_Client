import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {useNavigate} from "react-router-dom";
import Navbar from "../Navbar";
import {Input, InputAdornment} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import axios, {AxiosError} from "axios";
import {useAuthStore} from "../../store";
import {useSnackStore} from "../../store/snack";
import { BASE_URL } from '../../config';


const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const [userField, setUserField] = React.useState('');
    const [firstNameField, setFirstNameField] = React.useState('');
    const [lastNameField, setLastNameField] = React.useState('');
    const [passField, setPassField] = React.useState('');

    const [image, setImage] = React.useState<File>();

    const setMessage = useSnackStore(state => state.setSnackMessage)
    const setStatus = useSnackStore(state => state.setSnackStatus)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)

    const authState = useAuthStore(state => state.userAuth);
    const setAuth = useAuthStore(state => state.setAuth)
    const removeAuth = useAuthStore(state => state.removeAuth)

    const handleLogOut = () => {
        removeAuth()
        setMessage("You have logged out")
        setStatus('success')
        setSnackOpen(true)
    }

    const setImageHandler = (e: any) => {
        const imgFile = e.target.files[0]
        setImage(imgFile)
    };

    const handleSubmitImage = async (loginResponse: any) => {
        try {
            await axios.put(`${BASE_URL}/users/${loginResponse.data.userId}/image`,
                image, {headers: {'X-Authorization': loginResponse.data.token, 'Content-Type': image?.type}})
            setStatus('success')
            setMessage('Profile Image updated')
            // window.location.reload()
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error')
            setMessage('Error uploading image')
        }
        setSnackOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const user = { userField, firstNameField, lastNameField, passField };
        try {
            if (image !== undefined) {
                if (!["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(image.type)) {
                    setStatus('error')
                    setMessage("Invalid image type. Please upload a jpeg, png, or gif")
                    setSnackOpen(true)
                    return;
                }
            }
            const response = await axios.post(
                `${BASE_URL}/users/register`,
                {
                    email: user.userField,
                    firstName: user.firstNameField,
                    lastName: user.lastNameField,
                    password: user.passField
                });

            const loginResponse = await axios.post(
                `${BASE_URL}/users/login`,
                {email: user.userField, password: user.passField});
            // returns { userId: 11, token: "rand string" }});
            setUserField('');
            setPassField('');
            if (loginResponse.data.userId !== -1) {
                setAuth(loginResponse.data)
                if (image !== undefined) {
                    await handleSubmitImage(loginResponse)
                }
                setStatus('success')
                navigate('/films')
                setMessage('Successfully logged in!')
            } else {
                setStatus('error')
                setMessage('Invalid credentials')
            }
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            if (e.status === 403) {
                // email in use
                setMessage('Email already in use')
                setStatus("warning")
            }
            if (e.status === 400) {
                // invalid request
                setMessage('Invalid input')
                setStatus('error')
            }
        }
        setSnackOpen(true)
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const goToLogin = () => {
        navigate("/login")
    }

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
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                onChange={(e) => setFirstNameField(e.target.value)}
                                value={firstNameField}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                onChange={(e) => setLastNameField(e.target.value)}
                                value={lastNameField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => setUserField(e.target.value)}
                                value={userField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="new-password"
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
                        </Grid>
                        {/* TODO: Add optional profile picture field */}
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" component="label"
                                    style={{ background: `linear-gradient(45deg, #03a9f4, #00a0b2)`}}>
                                Upload Profile Picture
                                <Input type="file" onChange={setImageHandler} style={{ display: 'none'}}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        style={{background: `linear-gradient(45deg, #03a9f4, #00a0b2)`}}
                        sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={goToLogin}>
                                Already have an account? Sign in
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
            }
            { (authState.token.length > 0 && authState.token !== '') &&
                <>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#00a0b2', mt: 5, mb: 3 }}>You can't register while you're logged in</Typography>
                    <Button onClick={handleLogOut}>Click here to log out</Button>
                </>
            }
        </>
    );
}

export default Register;