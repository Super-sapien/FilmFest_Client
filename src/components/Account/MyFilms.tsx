import React from "react";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {useSnackStore} from "../../store/snack";
import {useAuthStore} from "../../store";
import axios from "axios";
import {AxiosError} from "axios";
import FilmCard from "../Films/FilmCard";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import StarHalfTwoToneIcon from "@mui/icons-material/StarHalfTwoTone";
import MovieFilterTwoToneIcon from "@mui/icons-material/MovieFilterTwoTone";
import {Card} from "@mui/material";
import {BASE_URL} from "../../config";


const MyFilms = (props: { directedCount: any; setDirectedCount: any; reviewedCount: any; setReviewedCount: any; }) => {
    const [films, setFilms] = React.useState<Film[]>([])
    const [genres, setGenres] = React.useState<Genre[]>([])
    const [directedFilms, setDirectedFilms] = React.useState<Film[]>([])
    const [reviewedFilms, setReviewedFilms] = React.useState<Film[]>([])
    const setMessage = useSnackStore(state => state.setSnackMessage)
    const setStatus = useSnackStore(state => state.setSnackStatus)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)

    const [tabValue, setTabValue] = React.useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const authState = useAuthStore(state => state.userAuth);

    React.useEffect(() => {
        getFilms()
    }, [])

    React.useEffect(() => {
        getMyDirectedFilms()
        getMyReviewedFilms()
    }, [authState.userId])

    const getFilms = async () => {
        try {
            let response = await axios.get(`${BASE_URL}/films/`)
            setFilms(response.data)
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error');
            setMessage(e.statusText);
            setSnackOpen(true);
        }
        try {
            let response = await axios.get(`${BASE_URL}/films/genres`)
            setGenres(response.data)
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error');
            setMessage(e.statusText);
            setSnackOpen(true);
        }
    }

    const getMyDirectedFilms = async () => {
        try {
            let response = await axios.get(`${BASE_URL}/films?`, {params: {directorId: authState.userId}})
            setDirectedFilms(response.data.films)
            props.setDirectedCount(response.data.films.length)
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error');
            setMessage(e.statusText);
            setSnackOpen(true);
        }
    }

    const getMyReviewedFilms = async () => {
        try {
            let response = await axios.get(`${BASE_URL}/films?`, {params: {reviewerId: authState.userId}})
            setReviewedFilms(response.data.films)
            props.setReviewedCount(response.data.films.length)
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setStatus('error');
            setMessage(e.statusText);
            setSnackOpen(true);
        }
    }

    interface TabPanelProps {
        children?: React.ReactNode;
        index: number;
        tabValue: number;
    }

    function TabPanel(props: TabPanelProps) {
        const { children, tabValue, index, ...other } = props;
        return (
            <div
                role="tabpanel"
                hidden={tabValue !== index}
                id={`simple-tabpanel-${index}`}
                aria-labelledby={`simple-tab-${index}`}
                {...other}
            >
                {tabValue === index && (
                    <Box sx={{ height: 510 }}>
                        <> {children} </>
                    </Box>
                )}
            </div>
        );
    }

    return (
        <>
            { (authState.token.length > 0 && authState.token !== '') &&
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
                <Card sx={{ width: 1000, mt: 5, boxShadow: 5 }}>
                <Tabs orientation="horizontal" value={tabValue} onChange={handleTabChange} sx={{  ml: 3 }}>
                    <Tab icon={<StarHalfTwoToneIcon />} label="Reviewed Films" />
                    <Tab icon={<MovieFilterTwoToneIcon />} label="Directed Films" />
                </Tabs>
                <Box sx={{
                    overflowX: 'scroll',
                    whiteSpace: 'nowrap',
                    scrollbarWidth: 'auto',
                    '&::-webkit-scrollbar': {
                        height: '10px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#00a0b2',
                        borderRadius: '10px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#005963',
                    }
                }}>
                <TabPanel tabValue={tabValue} index={0}>

            {reviewedFilms.length > 0 &&
                reviewedFilms.map((item: Film) =>  (
                <Box sx={{ display: 'inline-block', minWidth: 300 }}>
                 <FilmCard key={item.filmId} film={item} genres={genres} />
                </Box>
                ))}

            {reviewedFilms.length === 0 &&
                <Typography>No Reviewed Films</Typography>
            }

                </TabPanel>
                <TabPanel tabValue={tabValue} index={1}>
            {directedFilms !== undefined && directedFilms.length > 0 &&
                directedFilms.map((item: Film) => (
            <Box sx={{ justifyContent: 'flex-start', display: 'inline-block', minWidth: 300 }}>
             <FilmCard key={item.filmId} film={item} genres={genres}/>
            </Box>
               ))}
            {(directedFilms === undefined || directedFilms.length === 0) &&
                <Typography>No Similar Films
                </Typography>
            }
                </TabPanel>
                </Box>
                </Card>
            </Box>
            }
        </>
    )
}

export default MyFilms;