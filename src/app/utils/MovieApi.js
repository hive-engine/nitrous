import axios from 'axios';

export async function getMovies(
    languageCode,
    movieType,
    genreId,
    lastMovieId,
    sortBy
) {
    let apiName = 'GetMovies';

    if (sortBy === 'created') {
        apiName = 'GetMoviesOrderedByLastPostAddDate';
    }

    try {
        const response = await axios.get(
            `https://tool.steem.world/AAA/${apiName}?languageCode=${
                languageCode
            }&movieType=${movieType}&genreId=${genreId}&lastMovieId=${
                lastMovieId
            }`
        );

        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function getMoviesForNewList(
    languageCode,
    movieType,
    genreId,
    firstMovieId,
    sortBy
) {
    let apiName = 'GetMoviesForNewList';

    if (sortBy === 'created') {
        apiName = 'GetMoviesOrderedByLastPostAddDateForNewList';
    }

    try {
        const response = await axios.get(
            `https://tool.steem.world/AAA/${apiName}?languageCode=${
                languageCode
            }&movieType=${movieType}&genreId=${genreId}&firstMovieId=${
                firstMovieId
            }`
        );

        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function getMovie(languageCode, movieType, movieId) {
    try {
        const response = await axios.get(
            `https://tool.steem.world/AAA/GetMovie?languageCode=${
                languageCode
            }&movieType=${movieType}&movieId=${movieId}`
        );

        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function getReviews(
    movieType,
    genreId,
    languageCode,
    lastAuthor,
    lastPermlink,
    sortBy
) {
    try {
        const response = await axios.get(
            `https://tool.steem.world/AAA/GetPostsByGenre?movieType=${
                movieType
            }&genreId=${genreId}&languageCode=${languageCode}&lastAuthor=${
                lastAuthor
            }&lastPermlink=${lastPermlink}`
        );

        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function getReviewsForNewList(
    movieType,
    genreId,
    languageCode,
    firstAuthor,
    firstPermlink,
    sortBy
) {
    try {
        const response = await axios.get(
            `https://tool.steem.world/AAA/GetPostsByGenreForNewList?movieType=${
                movieType
            }&genreId=${genreId}&languageCode=${languageCode}&firstAuthor=${
                firstAuthor
            }&firstPermlink=${firstPermlink}`
        );

        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
}
