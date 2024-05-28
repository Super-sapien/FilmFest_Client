import {create} from 'zustand';
import {AlertColor} from "@mui/material/Alert";


interface SnackState {
    snackMessage: string;
    setSnackMessage: (snackMessage: string) => void
    snackStatus: AlertColor | undefined;
    setSnackStatus: (snackStatus: AlertColor | undefined) => void
    openSnack: boolean
    setOpenSnack: (openSnack: boolean) => void
}

const useStore = create<SnackState>((set) =>  ({
    snackMessage: "",
    setSnackMessage: (snackMessage: string) => set(state => {
        return {snackMessage: snackMessage}
    }),
    snackStatus: undefined,
    setSnackStatus: (snackStatus: AlertColor | undefined) => set(state => {
        return {snackStatus: snackStatus}
    }),
    openSnack: false,
    setOpenSnack: (openSnack: boolean) => set(state => {
        return {openSnack: openSnack}
    }),
}))


export const useSnackStore = useStore;
