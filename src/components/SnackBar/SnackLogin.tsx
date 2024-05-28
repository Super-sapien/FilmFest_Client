import * as React from 'react';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertColor, AlertProps} from '@mui/material/Alert';
import {useSnackStore} from "../../store/snack";


// TODO: Get snackbar working as a global function

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SnackLogin = () => {
    // const [open, setOpen] = React.useState(open);
    const snackMessage = useSnackStore(state => state.snackMessage)
    const snackStatus = useSnackStore(state => state.snackStatus)
    const snackOpen = useSnackStore(state => state.openSnack)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)


    // const handleClick = () => {
    //     setOpen(true);
    // };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };

    return (
        <>
        {/*{open &&*/}
        <Stack spacing={2} sx={{ width: '100%' }}>
            {/*<Button variant="outlined" onClick={handleClick}>*/}
            {/*    Open success snackbar*/}
            {/*</Button>*/}
            <Snackbar open={snackOpen} autoHideDuration={6000} onClose={handleClose}>

                <Alert onClose={handleClose} severity={snackStatus as AlertColor} sx={{ width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
            {/*<Alert severity="error">This is an error message!</Alert>*/}
            {/*<Alert severity="warning">This is a warning message!</Alert>*/}
            {/*<Alert severity="info">This is an information message!</Alert>*/}
            {/*<Alert severity="success">This is a success message!</Alert>*/}
        </Stack>
{/*}*/}
    </>
    );
}

export default SnackLogin;