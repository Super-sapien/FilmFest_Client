import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import {Input, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios from "axios";
import {AxiosError} from "axios";
import {useSnackStore} from "../../store/snack";
import {useAuthStore} from "../../store";
import RemoveEmptyFields from "../Middleware/RemoveEmptyFields";
import {BASE_URL} from "../../config";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CreateFilm = (props: any) => {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [releaseDate, setReleaseDate] = React.useState<Dayjs | null>(dayjs());
    const [genreId, setGenreId] = React.useState('');
    const [ageRating, setAgeRating] = React.useState('');
    const [runtime, setRuntime] = React.useState<Number>();
    const [genres, setGenres] = React.useState<Genre[]>();
    const [image, setImage] = React.useState<File>();

    const setMessage = useSnackStore(state => state.setSnackMessage)
    const setStatus = useSnackStore(state => state.setSnackStatus)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)
    const authState = useAuthStore(state => state.userAuth);

    React.useEffect(() => {
        getGenres()
    }, [genres])

    const getGenres = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/films/genres`)
            setGenres(response.data)
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            //console.log(e.statusText)
        }
    }

    const handleSubmitFilm = async () => {
        try {
            if (image === undefined) {
                setStatus('warning')
                setMessage("No image has been uploaded")
                setSnackOpen(true)
                return;
            }
            if (!["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(image.type)) {
                setStatus('error')
                setMessage("Invalid image type. Please upload a jpeg, png, or gif")
                setSnackOpen(true)
                return;
            }
            const filmData = {title, description, releaseDate: releaseDate ? releaseDate.format('YYYY-MM-DD HH:mm:ss') : null, genreId, runtime, ageRating}
            const cleanedData = RemoveEmptyFields(filmData)
            const response = await axios.post(`${BASE_URL}/films/`,
                cleanedData,
                {headers: {'X-Authorization': authState.token}})
            setStatus('success')
            setMessage('Your film has has been created')
            handleSubmitImage(response)
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error')
            setMessage('Something went wrong, try again')
        }
        setSnackOpen(true)

    }
    const handleSubmitImage = async (response: any) => {
        try {
            await axios.put(`${BASE_URL}/films/${response.data.filmId}/image`,
                image, {headers: {'X-Authorization': authState.token, 'Content-Type': image?.type}})
            setStatus('success')
            setMessage('Film Image uploaded')
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error')
            setMessage('Image failed to upload, try again')
        }
        setSnackOpen(true)
    }

    const setImageHandler = (e: any) => {
        const imgFile = e.target.files[0]
        setImage(imgFile)
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
    }
    const ageRatingsOptions = ['G', 'PG', 'M', 'R13', 'R16', 'R18', 'TBC']

    return (
        <div>
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Create a new film listing"}
                    <Typography style={{display: 'flex', alignItems: 'center', color: 'grey'}}
                                variant="caption">Required fields indicated with *
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="title"
                                    label="Title"
                                    name="title"
                                    autoComplete="title"
                                    autoFocus
                                    onChange={(e) => setTitle(e.target.value)}
                                    value={title}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    multiline
                                    maxRows={5}
                                    margin="normal"
                                    required
                                    fullWidth
                                    inputProps={{
                                        style: {height: 100}
                                    }}
                                    name="description"
                                    label="Description"
                                    type="text"
                                    id="description"
                                    autoComplete="description"
                                    onChange={(e) => setDescription(e.target.value)}
                                    value={description}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    select
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="genre"
                                    label="Genre"
                                    type="dropdown"
                                    id="genre"
                                    autoComplete="genre"
                                    onChange={(e) => setGenreId(e.target.value)}
                                    value={genreId}
                                >
                                    {genres?.map((item: Genre) => (
                                        <MenuItem key={item.genreId} value={item.genreId}>{item.name}</MenuItem>
                                    ))}

                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Release date"
                                    value={releaseDate}
                                    format={"YYYY-MM-DD HH:mm:ss"}
                                    onChange={setReleaseDate}
                                />
                                </LocalizationProvider>
                            </Grid>
                        <Grid item xs={12}>
                        <TextField
                            select
                            margin="normal"
                            fullWidth
                            name="ageRating"
                            label="Age rating"
                            type="text"
                            id="ageRating"
                            autoComplete="ageRating"
                            onChange={(e) => setAgeRating(e.target.value)}
                            value={ageRating}
                        >
                            {ageRatingsOptions?.map((item) => (
                                <MenuItem key={item} value={item}>{item}</MenuItem>
                            ))}
                        </TextField>
                        </Grid>
                        <Grid item xs={12}>
                        <TextField
                            margin="normal"
                            fullWidth
                            name="runtime"
                            label="Runtime (minutes)"
                            type="text"
                            id="runtime"
                            autoComplete="runtime"
                            onChange={(e) => setRuntime(Number(e.target.value))}
                            value={runtime}
                        />
                        </Grid>
                        <Grid item xs={12}>
                        <Button fullWidth variant="contained" component="label"
                                style={{ background: `linear-gradient(45deg, #03a9f4, #00a0b2)`}}>
                            Upload Film Image *
                            <Input type="file"  onChange={setImageHandler} required style={{ display: 'none'}}
                            />
                        </Button>
                        </Grid>
                    </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleBtnClose}>Close</Button>
                    <Button onClick={handleSubmitFilm}>Create</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateFilm;