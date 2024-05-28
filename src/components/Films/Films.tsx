import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Autocomplete,
    Card,
    CardContent,
    FormControl, InputAdornment, InputLabel,
    Select,
    TextField,
} from "@mui/material";

import FilmCard from "./FilmCard";
import Navbar from "../Navbar";
import Typography from "@mui/material/Typography";
import FilmPagination from "../Pagination";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {BASE_URL} from "../../config";
import {useLocation, useNavigate} from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";
import BackspaceIcon from '@mui/icons-material/Backspace';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Tooltip from '@mui/material/Tooltip';


const Films = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [films, setFilms] = React.useState<Film[]>([])
    const [filmCount, setFilmCount] = React.useState(0)

    const [genres, setGenres] = React.useState<Genre[]>([])
    const [selectedGenres, setSelectedGenres] = React.useState<Genre[]>(genres)

    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const [qVal, setQVal] = React.useState('')

    const ageRatingsOptions = ['G', 'PG', 'M', 'R13', 'R16', 'R18', 'TBC']
    const [ageRatingsVal, setAgeRatingsVal] = React.useState<string[]>([])

    const sortByOptions = ['RELEASED_ASC', 'RELEASED_DESC', 'ALPHABETICAL_ASC', 'ALPHABETICAL_DESC', 'RATING_ASC', 'RATING_DESC']
    const sortByDisplayValues = {
        'RELEASED_ASC': 'Release ↑',
        'ALPHABETICAL_ASC': 'A to Z',
        'ALPHABETICAL_DESC': 'Z to A',
        'RELEASED_DESC': 'Release ↓',
        'RATING_ASC': 'Rating ↑',
        'RATING_DESC': 'Rating ↓'
    }
    const [sortByVal, setSortByVal] = React.useState('RELEASED_ASC')

    const [show, setShow] = React.useState(true)

    const [page, setPage] = React.useState(() => {
        const params = new URLSearchParams(location.search);
        return params.get('page') ? Number(params.get('page')) : 1;
    });

    const [pageSize, setPageSize] = React.useState(10);

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 700);

    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth <= 700);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        const fetchFilms = async () => {
            await getFilms();
            await getGenres();
        };
        fetchFilms().catch(error => {
            console.error('An error occurred:', error);
        });
    }, [page, location]);

    const getFilms = async () => {
        let selectedGenreIds: string[] = []
        if (selectedGenres.length > 0) {
            selectedGenres.forEach(g => selectedGenreIds.push(g.genreId.toString()))
        }
        await axios.get(`${BASE_URL}/films`, { params:
                { q: qVal || undefined, ageRatings: ageRatingsVal || undefined, genreIds: selectedGenreIds || undefined,
                    sortBy: sortByVal || undefined, startIndex: (page - 1) * pageSize, count: pageSize }})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setFilms(response.data.films)
                setFilmCount(response.data.count)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const getGenres = async () => {
        await axios.get(`${BASE_URL}/films/genres`)
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setGenres(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    const setPageSizeHandler = (val: any) => {
        setPageSize(val);
    }

    const pageChangeHandler = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        const params = new URLSearchParams(location.search);
        params.set('page', value.toString());
        navigate({ search: params.toString() });
        window.scrollTo(0, 0);
        event.preventDefault()
    }

    const resetFilters = () => {
        setQVal('')
        setSelectedGenres([])
        setAgeRatingsVal([])
        setSortByVal('RELEASED_ASC')
        setPageSize(10)
        setPage(1)
    }

    const setQHandler = (e: any) => {
        setQVal(e.target.value)
    }

    const setAgeRatingsHandler = (value: any) => {
        setAgeRatingsVal(value)
    }

    const setSortByHandler = (value: any) => {
        setSortByVal(value)
    }

    const updateQuery = (e: any) => {
        e.preventDefault()
        setPage(1)
        getFilms()
    }

    const setGenresHandler = (value: any) => {
        setSelectedGenres(value)
    }

    const list_of_films = () => {
        return films
            .map((item: Film) =>
        {
            return (
                    <FilmCard key={item.filmId} film={item} genres={genres}
                              ></FilmCard>
            )
        })
    }

    if (errorFlag) {
        return (
            <div>
                <Navbar/>
                <h1>Films</h1>
                <div style={{ color: "red"}}>
                    {errorMessage}
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <Box component="main" sx={{ display: 'flex',
                    flexDirection: 'column',
                    minHeight: '89vh',
                    backgroundColor: '#f5f5f5'
                }}>
                    <Navbar/>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#00a0b2', mb: 2, mt: 2, textAlign: 'center' }}>Films</Typography>
                    <Container maxWidth="lg" sx={{
                    '@media (max-width:1199px)': { maxWidth: '800px' },
                    '@media (max-width:899px)': { maxWidth: '650px' },
                    }}>
                    {/* once screen-width gets to 1500px, add margin left and right */}
                    <Card style={{ background: `linear-gradient(45deg, #03a9f4, #00a0b2)` }}
                          sx={{ maxWidth: '1500px', mb: 1, ml: 'auto', mr: 'auto', borderRadius: '10px'}}
                    >

                    <form onSubmit={updateQuery}>

                        <CardContent sx={{ mt: 1.75, display: 'flex', flexDirection: 'column', bgcolor: 'white', gap: 2, justifyContent: 'center' }}>

                            <Box sx={{
                                display: 'flex',
                                direction: 'row',
                                gap: 2,
                                flexWrap: 'nowrap',
                                justifyContent: 'center',
                                '@media (max-width:600px)': {
                                    gap: 0,
                                },
                            }}>
                                <TextField id="search-query" label="Includes" size="small" variant="outlined"
                                   value={qVal}
                                   onChange={setQHandler}
                                   sx={{ flexGrow: 1, mr: 'auto' }}
                                   InputProps={{
                                       endAdornment: (
                                           <InputAdornment position="end">
                                               <Tooltip title="Search">
                                                   <IconButton
                                                       edge="end"
                                                       onClick={updateQuery}
                                                   >
                                                       <SearchIcon />
                                                   </IconButton>
                                               </Tooltip>
                                               <Tooltip title="Clear filters">
                                                   <IconButton
                                                       edge="end"
                                                       onClick={() => {
                                                           resetFilters();}}
                                                   >
                                                       <BackspaceIcon />
                                                   </IconButton>
                                               </Tooltip>
                                               <Tooltip title={show ? "Hide Filters" : "Show Filters"}>
                                                   <IconButton
                                                       edge="end"
                                                       onClick={() =>
                                                           setShow(prev => !prev)}>
                                                       {show ? <FilterAltIcon/> : <FilterAltOffIcon/> }
                                                   </IconButton>
                                               </Tooltip>
                                           </InputAdornment>
                                       )
                                   }}/>
                            </Box>

                            {show && genres.length > 0 &&
                            <Box sx={{ display: 'flex', direction: 'row', gap: 2, flexWrap: 'nowrap', justifyContent: 'center',
                            '@media (max-width:1200px)': {
                            flexWrap: 'wrap' },
                            }}>
                                <Autocomplete
                                    size="small"
                                    multiple
                                    limitTags={2}
                                    options={genres}
                                    value={selectedGenres}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option? option.name : ""}
                                    onChange={(e, value) => setGenresHandler(value)}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                variant="outlined"
                                                label={option? option.name : ""}
                                                size="small"
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
                                    style={{ width: 360, minWidth: 312 }}
                                    sx={{ '@media (max-width:373px)': { width: '100%' },
                                        '@media (max-width:1200px)': { maxWidth: 350 }
                                    }}
                                    renderInput={ params => {
                                        const { InputProps, ...restParams } = params;
                                        const { startAdornment, ...restInputProps } = InputProps;
                                        return (
                                            <TextField
                                                label={"Genres"}
                                                value={selectedGenres}
                                                { ...restParams }
                                                InputProps={ {
                                                    ...restInputProps,
                                                    startAdornment: (
                                                        <div style={ {
                                                            maxHeight: 30,
                                                            maxWidth: 200,
                                                            overflowX: 'hidden',
                                                            display: 'flex',
                                                            flexWrap: 'nowrap',
                                                            scrollbarWidth: 'none',
                                                            msOverflowStyle: 'none',

                                                        } }
                                                        >
                                                            {startAdornment}
                                                        </div>
                                                    ),
                                                } }
                                            />
                                        );
                                    } }
                                />

                                <Autocomplete
                                    size="small"
                                    multiple
                                    id="checkboxes-tags-demo"
                                    options={ageRatingsOptions}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option}
                                    value={ageRatingsVal}
                                    limitTags={3}
                                    onChange={(e, value) => setAgeRatingsHandler(value)}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                variant="outlined"
                                                label={option}
                                                size="small"
                                                {...getTagProps({ index })}
                                            />
                                        ))
                                    }
                                    sx={{ width: 360, minWidth: 312, '@media (max-width:1200px)': { maxWidth: 350 } }}
                                    renderInput={ params => {
                                        const { InputProps, ...restParams } = params;
                                        const { startAdornment, ...restInputProps } = InputProps;
                                        return (
                                            <TextField
                                                label={"Age Ratings"}
                                                value={ageRatingsVal}
                                                { ...restParams }
                                                InputProps={ {
                                                    ...restInputProps,
                                                    startAdornment: (
                                                        <div style={ {
                                                            maxHeight: 30,
                                                            maxWidth: 200,
                                                            overflowX: 'hidden',
                                                            display: 'flex',
                                                            flexWrap: 'nowrap',
                                                            scrollbarWidth: 'none',
                                                            msOverflowStyle: 'none',

                                                        } }
                                                        >
                                                            {startAdornment}
                                                        </div>
                                                    ),
                                                } }
                                            />
                                        );
                                    } }
                                />

                                <FormControl size="small" sx={{ minWidth: 118.5 }}>
                                    <InputLabel id="sort-by-select">Sort By</InputLabel>
                                    <Select
                                        labelId="sort-by-select"
                                        value={sortByVal}
                                        onChange={(e) => setSortByHandler(e.target.value)}
                                        label="Sort By"
                                    >
                                        {sortByOptions.map((option) => (
                                            <MenuItem key={option} value={option}>
                                                {sortByDisplayValues[option as keyof typeof sortByDisplayValues]}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl size={"small"}>
                                <InputLabel id={"page-size-select"}>Per Page</InputLabel>
                                <Select
                                    labelId={"page-size-select"}
                                    value={pageSize}
                                    onChange={(e) => setPageSizeHandler(e.target.value)}
                                    label="Per Page"
                                    size={"small"}
                                    sx={{ minWidth: 80, maxWidth: 80 }}
                                    defaultValue={10}
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={15}>15</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                </Select>
                                </FormControl>
                                <Typography variant={"body1"} sx={{ fontWeight: 'bold', color: '#00a0b2', display: 'flex', alignItems: 'center', minWidth: 82, flexWrap: 'wrap',
                                    '@media (max-width:380px)': { fontSize: 16 } }}>
                                    {filmCount === 0 ? "No Results" : (filmCount === 1 ? "1 Result" : filmCount + " Results")}
                                </Typography>
                            </Box>
                            }
                        </CardContent>
                </form>
                </Card>

                <Box sx={{ maxWidth: 1500,  ml: 'auto', mr: 'auto', display: 'grid', gridTemplateColumns: {
                        xs: "repeat(1, minmax(0, 1fr))",
                        md: "repeat(2, minmax(0, 1fr))",
                        lg: "repeat(3, minmax(0, 1fr))"
                    },  boxShadow: 0, placeItems: 'center' }}>
                    {list_of_films()}
                </Box>
                    </Container>
                </Box>
                <Box component="footer" sx={{ mt: 'auto' }}>
                <FilmPagination  count={Math.ceil(filmCount / pageSize)} page={page} filmCount={filmCount} pageSize={pageSize}
                     onChange={(event: React.ChangeEvent<unknown>, value: number) => pageChangeHandler(event, value)} />
                </Box>

            </div>
        )
    }
}

export default Films;