import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea} from '@mui/material';
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {BASE_URL} from "../../config";
import Chip from '@mui/material/Chip';


const imgErrorHandler = (e: any) => {
    e.preventDefault();
    e.target.onerror = null;
    e.target.src = "https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg"
}

const FilmCard = ({film, genres}: {film: Film, genres: Genre[]}) => {

    const navigate = useNavigate();
    const handleGoToFilm = () => {
        navigate("/films/" + film.filmId);
        window.scrollTo(0, 0);
    }

    const filmDate = new Date(film.releaseDate)
    const timeNow = new Date()

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

    if (film && genres.length > 0) {
        return (
            <Card style={{
                position: 'relative',
                overflow: 'hidden',
                border: 'double 3px transparent',
                borderRadius: 20,
                backgroundImage: `linear-gradient(white, white),
    linear-gradient(65deg, #03a9f4, #00a0b2, #00a0b2)`,
                backgroundOrigin: "border-box",
                backgroundClip: 'content-box, border-box',
            }}
                  sx={{
                      width: 325,
                      m: 2,
                      ":hover": {
                          boxShadow: '0 0 10px rgba(3, 169, 244, 0.7), 0 0 10px rgba(0, 160, 178, 0.7)'
                      },
                      '@media (max-width:380px)': { maxWidth: 300 },
                      '@media (max-width:360px)': { maxWidth: 290 },
                      '@media (max-width:340px)': { maxWidth: 280 },
                      '@media (max-width:320px)': { maxWidth: 270 }
                  }}
            >
                <CardActionArea onClick={handleGoToFilm}>
                    <CardMedia
                        component="img"
                        height="300"
                        style={{ objectFit: 'cover' }}
                        src={`${BASE_URL}/films/${film.filmId}/image`}
                        // ref={imgRefFilm}
                        onError={imgErrorHandler}
                        alt={film.title}
                    />
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', color: '#00a0b2', fontWeight: 'bold' }} >
                            { film.title }
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>

                            <Chip label={film.ageRating || 'Unknown'} color={getAgeRatingColor(film.ageRating)}
                                  sx={{ height: '20px' }} />
                        </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} component="div">
                            Release{timeNow < filmDate ? 's' : 'd'}: {filmDate.toLocaleDateString('en-NZ')}
                            {/*<div>Age-rating: { film.ageRating || 'Unknown' }</div>*/}
                            <Chip label={ genres.filter(genre => genre.genreId === film.genreId)[0].name || 'Unknown' } color={getGenreChip(film.genreId)}
                            sx={{ height: '20px' }}/>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CardMedia
                                component="img"
                                height="25"
                                style={{ objectFit: 'cover', width: 25, borderRadius: 50 }}
                                src={`${BASE_URL}/users/${film.directorId}/image`}
                                // ref={imgRefDirector}
                                onError={imgErrorHandler}
                            />
                            <Typography variant="caption" sx={{ ml: 1, display: 'flex', flexDirection: 'row' }} >
                                {film.directorFirstName} {film.directorLastName}
                            </Typography>
                            <Typography sx={{ ml: 'auto', mr: 0.3 }} variant="caption">{film.rating == 0 ? 'No ratings yet' : '⭐ ' + film.rating}</Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Card>
        );
    } else {
        return (
            <></>
        )
    }

}

export default FilmCard;