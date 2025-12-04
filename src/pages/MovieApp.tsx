import { useEffect, useState } from 'react'

const MovieApp = () => {

    const [loading, setLoading] =  useState(true);
    // useEffect(()=>{
    //     fetch('https://yts.mx/api/v2/list_movies.json?minimum_rating=9&sort_by=year')
    //     .then((response) => response.json)
    //     .then(json => {
    //         console.log(json)
    //         setLoading(false);
    //     });
    // },[]);

    return (
        <>
            <h1>MovieApp</h1>
            <div>{loading? <h1>Loading...</h1> : null} </div>
        </>
    );
}

export default MovieApp