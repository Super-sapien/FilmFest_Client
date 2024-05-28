import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import {Button} from "@mui/material";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Reviews from "../Reviews/Reviews";
import Navbar from "../Navbar";
import FilmCard from "./FilmCard";
import Box from "@mui/material/Box";
import {AxiosError} from "axios/index";
import CreateReview from "../Reviews/CreateReview";
import {useSnackStore} from "../../store/snack";
import {useAuthStore} from "../../store";
import DeleteFilm from "./DeleteFilm";
import EditFilm from "./EditFilm";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import StarHalfTwoToneIcon from '@mui/icons-material/StarHalfTwoTone';
import MovieFilterTwoToneIcon from '@mui/icons-material/MovieFilterTwoTone';
import {BASE_URL} from "../../config";
import Chip from "@mui/material/Chip";


const imgErrorHandler = (e: any) => {
    e.preventDefault();
    e.target.onerror = null;
    e.target.src = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
}

const Film = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [film, setFilm] = React.useState<Film>()
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [genres, setGenres] = React.useState<Genre[]>([])
    const [similarFilms, setSimilarFilms] = React.useState<Film[]>()

    const [updateFlag, setUpdateFlag] = React.useState(false)

    const setMessage = useSnackStore(state => state.setSnackMessage)
    const setStatus = useSnackStore(state => state.setSnackStatus)
    const setSnackOpen = useSnackStore(state => state.setOpenSnack)

    const authState = useAuthStore(state => state.userAuth);

    const [openReviewModal, setOpenReviewModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openEditModal, setOpenEditModal] = React.useState(false);

    const [tabValue, setTabValue] = React.useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    React.useEffect(() => {
        getFilm()
    }, [id])

    React.useEffect(() => {
        getSimilarFilms()
    }, [film, genres])

    React.useEffect(() => {
        if (updateFlag) {
            getFilm()
            setUpdateFlag(false)
        }
    }, [id, updateFlag])

    const getFilm = async () => {
        try {
            let response = await axios.get(`${BASE_URL}/films/` + id)
            setErrorFlag(false)
            setErrorMessage("")
            setFilm(response.data)
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setErrorFlag(true)
            setErrorMessage(e.toString())
        }

        try {
            let response = await axios.get(`${BASE_URL}/films/genres`)
            setErrorFlag(false)
            setErrorMessage("")
            setGenres(response.data)
        } catch (error) {
            const e = (error as AxiosError).response;
            if (!e) return
            setErrorFlag(true)
            setErrorMessage(e.toString())
        }
    }

    const getSimilarFilms = async () => {
        if (film?.genreId !== undefined && film?.directorId !== undefined && genres.length > 0) {
            const genreParams = new URLSearchParams()
            genreParams.append("genreIds", film.genreId.toString());
            let genreFilmUrl = `${BASE_URL}/films?${genreParams.toString()}`
            const sameGenreResponse = await axios.get(genreFilmUrl)
            const directorParams = new URLSearchParams()
            directorParams.append("directorId", film.directorId.toString())
            let directorFilmUrl = `${BASE_URL}/films?${directorParams.toString()}`
            const sameDirectorResponse = await axios.get(directorFilmUrl)

            const sameGenres = sameGenreResponse.data.films;
            const sameDirector = sameDirectorResponse.data.films;

            const check = new Set<number>();
            const similarFilms = [...sameGenres, ...sameDirector].filter(similarFilm => {
                if (check.has(similarFilm.filmId)) {
                    return false;
                }
                if (similarFilm.filmId === film.filmId) {
                    return false
                }
                check.add(similarFilm.filmId);
                return true;
            })
            //console.log(similarFilms)
            setSimilarFilms(similarFilms)
        }
    }

    const getAgeRatingColor = (ageRating: string) => {
        switch (ageRating) {
            case 'G':
                return 'success';
            case 'PG':
            case 'M':
                return 'warning';
            case 'R13':
            case 'R16':
            case 'R18':
                return 'error';
            default:
                return 'default';
        }
    }

    const getGenreChip = (genreId: number) => {
        switch (genreId) {
            case 0:
                return 'success';
            default: return 'default';
        }
    }

    const list_of_similar_films = () => {
        if (similarFilms !== undefined && similarFilms.length > 0) {
            return similarFilms.map((item: Film) => {
                return (
                    <Box key={item.filmId} sx={{ display: 'inline-block', minWidth: 300 }}>
                        <FilmCard film={item} genres={genres}></FilmCard>
                    </Box>
                )
            })
        }
    }

    const goToFilms = () => {
        navigate("/films")
    }

    const handleOpenReviewModal = () => {
        if (authState.userId !== film?.directorId) {
            setOpenReviewModal(true)
        } else {
            setStatus("warning")
            setMessage("As the Director, you cannot review your own film")
            setSnackOpen(true)
        }
    }
    const handleOpenDeleteModal = () => {
        if (authState.userId === film?.directorId) {
            setOpenDeleteModal(true)
        } else {
            setStatus("warning")
            setMessage("You can only delete your own films!")
            setSnackOpen(true)
        }
    }
    const handleOpenEditModal = () => {
        if (authState.userId === film?.directorId) {
            const isReleased = new Date() > new Date(film.releaseDate)
            if (isReleased) {
                setStatus("warning");
                setMessage("Can't edit a film that has already been released");
                setSnackOpen(true);
            } else {
                setOpenEditModal(true)
            }
        } else {
            setStatus("warning")
            setMessage("You can only edit your own films!")
            setSnackOpen(true)
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

    if (errorFlag || film === undefined) {
        return (
            <div>
                <h1>Film</h1>
                <div style={{ color: "red" }}>
                    {errorMessage}
                </div>
                <Button onClick={goToFilms}>Back to films</Button>
            </div>
        )
    } else {
        const filmDate = new Date(film.releaseDate)
        const timeNow = new Date()
        const isReleased = new Date() > new Date(film.releaseDate)
        return (
            <>
            <Navbar />
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#00a0b2', mt: 5, mb: 3 }}>{film?.title || "Film"}</Typography>

            <Box sx={{ display: 'flex', direction: 'row', justifyContent: 'center' }}>
                <Card sx={{ width: 1000 }}>
                    <CardMedia
                        style={{maxWidth: '100%'}}
                        component="img"
                        height="500"
                        width="500"
                        src={`${BASE_URL}/films/${film.filmId}/image`}
                        onError={imgErrorHandler}
                        alt="a film image"
                    />
                    <CardContent sx={{ m: 1, maxWidth: 1000 }}>
                        <Box>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <Chip label={film.ageRating || 'Unknown'} color={getAgeRatingColor(film.ageRating)}
                                      sx={{ height: '20px', mr: 1 }} />
                                {/*<Chip label={ genres.filter(genre => genre.genreId === film.genreId)[0].name || 'Unknown' } color={getGenreChip(film.genreId)}*/}
                                {/*      sx={{ height: '20px' }}/>*/}
                                <Chip
                                    label={
                                        genres.filter(genre => genre.genreId === film.genreId).map(genre => genre.name)[0] || 'Unknown'
                                    }
                                    color={getGenreChip(film.genreId)}
                                    sx={{ height: '20px' }}
                                />
                        <Typography sx={{ ml: 'auto' }}>
                            Release{timeNow < filmDate ? 's' : 'd'} on {filmDate.toLocaleDateString('en-NZ')}
                        </Typography>
                            </Box>
                            <Typography sx={{textAlign: "start", mt: 2, mb: 2}}>
                                {film.description}
                            </Typography>
                            <Box sx={{display: "flex", flexDirection: "row", width: "100%", justifyContent: "center"}}>
                                 <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
                                        <Typography>
                                            Runtime: {film.runtime} minutes
                                        </Typography>
                                        <Typography>
                                            Number of reviews: {film.numReviews}
                                        </Typography>
                                    <Typography>
                                        Rating: {film.numReviews > 0 ? film.rating : 'Yet to be rated'}
                                    </Typography>
                                 </Box>

                                <Box sx={{ display: 'flex', flexDirection: "row-reverse", alignItems: 'center', flex: 1 }}>
                                    <CardMedia
                                        sx={{ display: 'block', width: 75, height: 75, borderRadius: 50 }}
                                        component="img"
                                        height="300"
                                        src={`${BASE_URL}/users/${film.directorId}/image`}
                                        onError={imgErrorHandler}
                                        alt="director image"
                                    />
                                    <Box sx={{ direction: 'column', mr: 1 }}>
                                        <Typography sx={{ textAlign: 'right' }}>
                                            Directed by
                                        </Typography>
                                        <Typography>
                                            {film.directorFirstName} {film.directorLastName}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        { (authState.token.length > 0 && authState.token !== '' && authState.userId !== film.directorId) &&
                        <Button variant="contained" component="label"
                                style={{ background: `linear-gradient(45deg, #03a9f4, #00a0b2)` }}
                                sx={{ mt: 2 }}
                                onClick={handleOpenReviewModal}>Review</Button>
                        } { (authState.token === '') &&
                            <Button variant="contained" component="label"
                                style={{ background: `linear-gradient(45deg, #03a9f4, #00a0b2)` }}
                                sx={{ mt: 2 }}
                                onClick={() => navigate('../login')}>Log in to Review</Button>
                        } { (authState.userId === film.directorId) &&
                            <Box sx={{ justifyContent: "space-between", mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color={'warning'}
                                    sx={{ mr: 2 }}
                                    onClick={handleOpenDeleteModal}
                                >
                                    Delete Film
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{ background: isReleased ? '#9e9e9e' : `linear-gradient(45deg, #03a9f4, #00a0b2)` }}
                                    onClick={handleOpenEditModal}
                                >
                                    Edit Film
                                </Button>
                            </Box>
                        }
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
                <Card sx={{ width: 1000, mt: 5 }}>
                    <Tabs orientation="horizontal" value={tabValue} onChange={handleTabChange} sx={{  ml: 3 }}>
                        <Tab icon={<StarHalfTwoToneIcon />} label="Reviews" />
                        <Tab icon={<MovieFilterTwoToneIcon />} label="Similar Films" />
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
                            <Box sx={{ display: 'inline-block', minWidth: 300 }}>
                                {film.numReviews > 0 &&
                                <Reviews film={film} />
                                }
                                {film.numReviews === 0 &&
                                    <Typography>
                                        No Reviews Yet
                                    </Typography>
                                }
                            </Box>
                        </TabPanel>
                        <TabPanel tabValue={tabValue} index={1}>
                            {similarFilms !== undefined && similarFilms.length > 0 &&
                            list_of_similar_films() }
                            {similarFilms === undefined || similarFilms.length === 0 &&
                            <Typography>
                                No Similar Films Found
                            </Typography>
                            }
                        </TabPanel>
                        </Box>
                </Card>
            </Box>

                { openReviewModal &&
                <CreateReview openSetter={setOpenReviewModal} open={openReviewModal} film={film} />
                }
                { openDeleteModal &&
                <DeleteFilm openSetter={setOpenDeleteModal} open={openDeleteModal} film={film} />
                }
                { openEditModal &&
                <EditFilm openSetter={setOpenEditModal} open={openEditModal} film={film} setUpdateFlag={setUpdateFlag} />
                }
            </>
        )
    }
}

export default Film;