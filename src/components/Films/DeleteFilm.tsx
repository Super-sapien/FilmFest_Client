import {useSnackStore} from "../../store/snack";
import {useAuthStore} from "../../store";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import axios, {AxiosError} from "axios";
import {BASE_URL} from "../../config";


const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const DeleteFilm = (props: any) => {
    const setMessage = useSnackStore(state => state.setSnackMessage)
    const setStatus = useSnackStore(state => state.setSnackStatus)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)

    const authState = useAuthStore(state => state.userAuth);

    const handleDelete = async () => {
        try {
            await axios.delete(`${BASE_URL}/films/${props.film?.filmId}`,
                {headers: {'X-Authorization': authState.token}})
            setMessage('Film was deleted')
            setStatus('info')
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
    }


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
                <DialogTitle>Are you sure you want to delete this film?</DialogTitle>

                    <DialogActions>
                        <Button onClick={handleBtnClose}>Close</Button>
                        <Button onClick={handleDelete}>Confirm</Button>
                    </DialogActions>

            </Dialog>
        </>
    )
}

export default DeleteFilm;