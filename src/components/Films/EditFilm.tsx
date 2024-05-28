import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import {useSnackStore} from "../../store/snack";
import {useAuthStore} from "../../store";
import axios, {AxiosError} from "axios";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {Input, TextField} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import RemoveEmptyFields from "../Middleware/RemoveEmptyFields";
import {BASE_URL} from "../../config";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import {DateTimeValidationError, PickerChangeHandlerContext} from "@mui/x-date-pickers";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EditFilm = (props: any) => {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const initialReleaseDate = dayjs(props.film.releaseDate).isValid() ? dayjs(props.film.releaseDate) : null;
    const [releaseDate, setReleaseDate] = React.useState<Dayjs | null>(initialReleaseDate);
    const [genreId, setGenreId] = React.useState('');
    const [ageRating, setAgeRating] = React.useState('');
    const [runtime, setRuntime] = React.useState<Number>();

    const setMessage = useSnackStore(state => state.setSnackMessage)
    const setStatus = useSnackStore(state => state.setSnackStatus)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)

    const authState = useAuthStore(state => state.userAuth);

    const [genres, setGenres] = React.useState<Genre[]>();
    const [image, setImage] = React.useState<File>();

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
            setStatus('error');
            setMessage("Error retrieving genres");
            setSnackOpen(true);
        }
    }

    const handleEditFilm = async () => {
        try {
            if (image !== undefined) {
                if (!["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(image?.type)) {
                    setStatus('error')
                    setMessage("Invalid image type. Please upload a jpeg, png, or gif")
                    setSnackOpen(true)
                    return;
                }
            }
            let utcReleaseDate = null;
            if (releaseDate) {
                utcReleaseDate = releaseDate.utc().format('YYYY-MM-DD HH:mm:ss')
            }
            const filmData = {title, description, releaseDate: utcReleaseDate, genreId, runtime, ageRating}
            const cleanedData = RemoveEmptyFields(filmData)
            await axios.patch(`${BASE_URL}/films/${props.film.filmId}`,
                cleanedData,
                {headers: {'X-Authorization': authState.token}})
            setStatus('success')
            setMessage('Your film has has been updated')
            props.setUpdateFlag((prevFlag: boolean) => !prevFlag)
            // window.location.reload()
            if (image !== undefined) {
                await handleSubmitImage()
            }
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error')
            setMessage("Error updating film")
        }
        setSnackOpen(true)
        props.openSetter(false);

    }
    const handleSubmitImage = async () => {
        try {
            await axios.put(`${BASE_URL}/films/${props.film.filmId}/image`,
                image, {headers: {'X-Authorization': authState.token, 'Content-Type': image?.type}})
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error')
            setMessage("Error uploading image")
        }
        setSnackOpen(true)
    }

    const handleDateChange = (value: Dayjs | null, context: PickerChangeHandlerContext<DateTimeValidationError>) => {
        if (value) {
            setReleaseDate(dayjs(value));
        }
    }

    const setImageHandler = (e: any) => {
        const imgFile = e.target.files[0]
        setImage(imgFile)
    };


    const ageRatingsOptions = ['G', 'PG', 'M', 'R13', 'R16', 'R18', 'TBC']

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
    return (
        <>
            <Dialog
                open={props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>Edit film: {props.film.title}</DialogTitle>
                <DialogContent>
                    <Box  >
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    margin="normal"
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
                                        // onChange={setReleaseDate}
                                        onChange={handleDateChange}
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
                                    Upload Film Image
                                    <Input type="file"  onChange={setImageHandler} style={{ display: 'none'}}
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleBtnClose}>Close</Button>
                    <Button onClick={handleEditFilm}>Confirm</Button>
                </DialogActions>

            </Dialog>
        </>
    )
}

export default EditFilm;