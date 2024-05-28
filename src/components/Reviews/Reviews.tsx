import axios from "axios";
import React, {useEffect} from "react";
import Typography from "@mui/material/Typography";
import ReviewCard from "./ReviewCard";
import {BASE_URL} from "../../config";


const Reviews = ({film}: {film: Film}) => {
    const [reviews, setReviews] = React.useState<Review[]>([])
    // const [film, setFilm] = React.useState<Film>()
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    const getReviews = async () => {
        await axios.get(`${BASE_URL}/films/${film.filmId}/reviews`)
            .then((response) => {
                //console.log(response.data)
                setErrorFlag(false)
                setErrorMessage("")
                setReviews(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }

    React.useEffect(() => {
        getReviews()
    }, [])

    const list_of_reviews = () => {
        return reviews
            .map((item: Review) =>
            {
                return (
                    <ReviewCard key={item.reviewerId} review={item} film={film} ></ReviewCard>
                )
            })

    }

    if (errorFlag) {
        return (
            <div style={{ color: "red"}}>
                {errorMessage}
            </div>
        )
    } else {
        return (
            <>
                {list_of_reviews()}
            </>
        )
    }

}

export default Reviews;