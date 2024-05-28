import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import {AxiosError} from "axios/index";
import {useSnackStore} from "../../store/snack";
import {useAuthStore} from "../../store";
import removeEmptyFields from "../Middleware/RemoveEmptyFields";
import {BASE_URL} from "../../config";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CreateReview = (props: any) => {
//{film.title}  film: Film,
    // const [open, setOpen] = React.useState(props.open);
    const [rating, setRating] = React.useState('');
    const [review, setReview] = React.useState('');

    const setMessage = useSnackStore(state => state.setSnackMessage)
    const setStatus = useSnackStore(state => state.setSnackStatus)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)

    const authState = useAuthStore(state => state.userAuth);

    const handleCreateReview = async () => {
        try {
            const reviewData = {rating, review}
            const cleanedData = removeEmptyFields(reviewData)
            await axios.post(`${BASE_URL}/films/${props.film.filmId}/reviews`,
                cleanedData, {headers: {'X-Authorization': authState.token}})
            setStatus('success')
            setMessage('Your review has been created')
            props.openSetter(false);
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error')
            setMessage(e.statusText)
            if (e.status === 403) {
                props.openSetter(false);
            }
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
            <DialogTitle>Review</DialogTitle>
            <DialogContent>
                {/*<Box >*/}
                    <Grid container sx={{ width: 400 }} spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                select
                                margin="normal"
                                required
                                fullWidth
                                name="rating"
                                label="Rating"
                                type="dropdown"
                                id="rating"
                                autoComplete="rating"
                                onChange={(e) => setRating(e.target.value)}
                                value={rating}
                            >
                                <MenuItem value={1}>1 - Awful</MenuItem>
                                <MenuItem value={2}>2 - Poor</MenuItem>
                                <MenuItem value={3}>3 - Boring</MenuItem>
                                <MenuItem value={4}>4 - Passable</MenuItem>
                                <MenuItem value={5}>5 - Average</MenuItem>
                                <MenuItem value={6}>6 - Decent</MenuItem>
                                <MenuItem value={7}>7 - Good</MenuItem>
                                <MenuItem value={8}>8 - Quality</MenuItem>
                                <MenuItem value={9}>9 - Excellent</MenuItem>
                                <MenuItem value={10}>10 - Perfect</MenuItem>
                            </TextField>

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
                                name="review"
                                label="Review Text"
                                type="text"
                                id="reviewText"
                                autoComplete="review"
                                onChange={(e) => setReview(e.target.value)}
                                value={review}
                            />
                        </Grid>
                    </Grid>
                {/*</Box>*/}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleBtnClose}>Close</Button>
                <Button onClick={handleCreateReview}>Save</Button>
            </DialogActions>
        </Dialog>
        </div>
    )
}

export default CreateReview;