type Film = {
    /**
     * filmId as defined by the database
     */
    filmId: number,
    /**
     * title
     */
    title: string,
    /**
     * genreId
     */
    genreId: number,
    /**
     * ageRating
     */
    ageRating: string,
    /**
     * directorId
     */
    directorId: number,
    /**
     * directorFirstName
     */
    directorFirstName: string,
    /**
     * directorLastName
     */
    directorLastName: string,
    /**
     * rating
     */
    rating: number
    /**
     * releaseDate
     */
    releaseDate: Date,
    /**
     * description
     */
    description: string,
    /**
     * runtime
     */
    runtime: number,
    /**
     * numReviews
     */
    numReviews: number

    // image_filename: string,
}