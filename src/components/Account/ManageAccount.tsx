import React from "react";
import Navbar from "../Navbar";
import Typography from "@mui/material/Typography";
import {useSnackStore} from "../../store/snack";
import {useAuthStore} from "../../store";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import axios, {AxiosError} from "axios";
import EditAccount from "./EditAccount";
import {useNavigate} from "react-router-dom";
import CreateFilm from "./CreateFilm";
import Box from "@mui/material/Box";
import MyFilms from "./MyFilms";
import {BASE_URL} from "../../config";

const ManageAccount = () => {
    const navigate = useNavigate();
    const [openEditAccount, setOpenEditAccount] = React.useState(false);
    const [openCreateFilm, setOpenCreateFilm] = React.useState(false);

    const setMessage = useSnackStore(state => state.setSnackMessage)
    const setStatus = useSnackStore(state => state.setSnackStatus)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)

    const authState = useAuthStore(state => state.userAuth);
    const removeAuth = useAuthStore(state => state.removeAuth)

    const [user, setUser] = React.useState<User>();
    const [directedCount, setDirectedCount] = React.useState<number | null>(null)
    const [reviewedCount, setReviewedCount] = React.useState<number | null>(null)

    const handleLogOut = () => {
        removeAuth()
        setMessage("You have logged out")
        setStatus('success')
        setSnackOpen(true)
        navigate('../login')
    }

    React.useEffect(() => {
        getUser()
        }, [])

    const getUser = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/users/${authState.userId}`,
                {headers: {'X-Authorization': authState.token}})
            setStatus('info')
            setMessage("You can edit your profile and create new films from your profile page")
            setUser(response.data)
            setSnackOpen(true)
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            //console.log(e.data)
            setStatus('error')
            setMessage("Error retrieving account details")
            setSnackOpen(true)
            }
        }

    const imgErrorHandler = (e: any) => {
        e.preventDefault();
        e.target.onerror = null;
        e.target.src = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
    }

    const clickEditAccountOpen = () => {
        setOpenEditAccount(true)
    }

    const clickCreateFilmOpen = () => {
        setOpenCreateFilm(true)
    }

    return (
        <>
            <Navbar/>
            { (authState.token.length > 0 && authState.token !== '') &&
            <>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#00a0b2', mt: 5, mb: 3 }}>
               Your Profile
            </Typography>
            <Card sx={{ width: 936, display: 'flex', m: 'auto', p: 4, boxShadow: 5 }}>

                <CardMedia
                    sx={{ display: 'block', width: 200, height: 200, ml: 3, mr: 3, borderRadius: 50, minWidth: 50, minHeight: 50, boxShadow: 5 }}
                    component="img"
                    src={`${BASE_URL}/users/${authState.userId}/image`}
                    onError={imgErrorHandler}
                    alt="My Profile picture"
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mt: 3, mb: 1.5 }}>
                           Name: {user?.firstName} {user?.lastName}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mb: 1.5 }}>
                            Email: {user?.email}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ mb: 1.5 }}>
                            Films Directed: {directedCount}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography>
                            Reviews Made: {reviewedCount}
                        </Typography>
                    </Box>
                </CardContent>

                <CardContent sx={{ ml: 'auto' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Button variant="contained" component="label"
                                style={{ background: `linear-gradient(45deg, #03a9f4, #00a0b2)`, marginBottom: '1rem' }}
                                onClick={clickEditAccountOpen}>
                            Edit Profile
                        </Button>
                        <Button variant="contained" component="label"
                                style={{ background: `linear-gradient(45deg, #03a9f4, #00a0b2)`, marginBottom: '2.5rem' }}
                                onClick={clickCreateFilmOpen}>
                            Create Film
                        </Button>
                        <Button variant="contained" component="label"
                                style={{ background: `linear-gradient(45deg, #03a9f4, #00a0b2)`}}
                                onClick={handleLogOut}>
                            Log out
                        </Button>
                    </Box>
                </CardContent>

                { openEditAccount &&
                <EditAccount openSetter={setOpenEditAccount} open={openEditAccount} />
                }
                { openCreateFilm &&
                <CreateFilm openSetter={setOpenCreateFilm} open={openCreateFilm} />
                }
            </Card>
                <MyFilms
                    directedCount={directedCount}
                    setDirectedCount={setDirectedCount}
                    reviewedCount={reviewedCount}
                    setReviewedCount={setReviewedCount}
                />
            </>
            }
        </>
    )
}

export default ManageAccount;