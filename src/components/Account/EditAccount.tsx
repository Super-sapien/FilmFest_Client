import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import {Checkbox, Input, InputAdornment, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios, {AxiosError} from "axios";
import {useAuthStore} from "../../store";
import {useSnackStore} from "../../store/snack";
import removeEmptyFields from "../Middleware/RemoveEmptyFields";
import {BASE_URL} from "../../config";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EditAccount = (props: any) => {
    const navigate = useNavigate();

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [image, setImage] = React.useState<File>();
    const [currentPassword, setCurrentPassword] = React.useState('');

    const [showPassword, setShowPassword] = React.useState(false);
    const [showUploadPictureBtn, setShowUploadPictureBtn] = React.useState(false);
    const [disableRemovePictureBtn, setDisableRemovePictureBtn] = React.useState(false);
    const [disableUploadPictureBtn, setDisableUploadPictureBtn] = React.useState(false);
    const [showDeletePictureBtn, setShowDeletePictureBtn] = React.useState(false);

    const setMessage = useSnackStore(state => state.setSnackMessage)
    const setStatus = useSnackStore(state => state.setSnackStatus)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)
    const authState = useAuthStore(state => state.userAuth);

    const setImageHandler = (e: any) => {
        const imgFile = e.target.files[0]
        setImage(imgFile)
    };

    const handleSubmitImage = async () => {
        try {
            if (image === undefined) {
                setStatus('warning')
                setMessage("No image has been selected yet")
                setSnackOpen(true)
                return;
            }
            if (!["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(image.type)) {
                setStatus('error')
                setMessage("Invalid image type. Please upload a jpeg, png, or gif")
                setSnackOpen(true)
                return;
            }
            await axios.put(`${BASE_URL}/users/${authState.userId}/image`,
                image, {headers: {'X-Authorization': authState.token, 'Content-Type': image.type}})
            setStatus('success')
            setMessage('Profile Image updated')
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error')
            setMessage('Couldn\'t upload image')
        }
        setSnackOpen(true)
    }

    const handleDeleteImage = async () => {
        try {
            await axios.delete(`${BASE_URL}/users/${authState.userId}/image`,
                {headers: {'X-Authorization': authState.token}})
            setStatus('success')
            setMessage('Profile Image Deleted')
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error')
            setMessage('Couldn\'t delete image')
        }
        setSnackOpen(true)
    };

    const handleSubmitText = async () => {
        try {
            const userData = {email, firstName, lastName, password, currentPassword}
            const cleanedData = removeEmptyFields(userData)
            if (Object.keys(cleanedData).length === 0 && // user hasn't updated or deleted an image
                image === undefined ) {
                setStatus('warning')
                setMessage('You need to change something first')
                setSnackOpen(true)
                return;
            }
            await axios.patch(`${BASE_URL}/users/${authState.userId}`,
                cleanedData,
                {headers: {'X-Authorization': authState.token}})
            setStatus('success')
            setMessage('Your details have been updated')
            navigate(0); // TODO: Replace this with proper state management
        } catch (error) {
        const e = (error as AxiosError).response;
        if (!e) return
        setStatus('error')
        setMessage(e.statusText)
        }
        setSnackOpen(true)
    };

    const handleClose = (event: any, reason: any) => {
        if (reason && reason === "backdropClick") {
            return
        } else {
            props.openSetter(false);
        }
    };
    const handleBtnClose = () => {
        props.openSetter(false);
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const uploadPictureHandler = () => {
        setShowUploadPictureBtn(prevState => !prevState)
        setDisableRemovePictureBtn(prevState => !prevState)
    }
    const deletePictureHandler = () => {
        setShowDeletePictureBtn(prevState => !prevState)
        setDisableUploadPictureBtn(prevState => !prevState)
    }

    return (
        <div>
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Edit your profile"}</DialogTitle>
                <DialogContent>
                    <Box component="form" onSubmit={handleSubmitText} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    onChange={(e) => setFirstName(e.target.value)}
                                    value={firstName}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    onChange={(e) => setLastName(e.target.value)}
                                    value={lastName}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
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
                                    autoComplete="password"
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    value={currentPassword}
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
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    name="newPassword"
                                    label="New Password"
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    autoComplete="new-password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
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
                            <Grid item xs={12}>
                                <FormControlLabel disabled={disableRemovePictureBtn}
                                                  control={<Checkbox onChange={deletePictureHandler}/>}
                                                  label="Remove Profile Picture" />
                                <FormControlLabel disabled={disableUploadPictureBtn}
                                                  control={<Checkbox onChange={uploadPictureHandler} />}
                                                  label="Upload Profile Picture" />
                            </Grid>
                            { showUploadPictureBtn &&
                            <>
                            <Grid item xs={8}>
                                <Button fullWidth variant="contained" component="label"
                                        style={{ background: `linear-gradient(45deg, #03a9f4, #00a0b2)`}}>
                                    Upload Profile Picture
                                    <Input type="file" style={{ display: 'none'}} onChange={setImageHandler}
                                    />
                                </Button>
                            </Grid>
                            <Grid item xs={4}>
                                <Button variant="contained" onClick={handleSubmitImage}>
                                    Confirm Upload
                                </Button>
                            </Grid>
                            </>
                            }
                            { showDeletePictureBtn &&
                            <Grid item xs={4}>
                                <Button variant="contained" onClick={handleDeleteImage}>
                                    Confirm Delete
                                </Button>
                            </Grid>
                            }
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleBtnClose}>Close</Button>
                    <Button onClick={handleSubmitText}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditAccount;