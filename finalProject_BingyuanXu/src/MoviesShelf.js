import React from 'react';
import Movie from './Movie';


export default function MoviesShelf(props) {
  let movies = [];
  let listEle = (<></>);

  if (props.genreObj.name === "My List") {
    movies = props.moviesObj;
  } else {
    movies = props.moviesObj[props.genreObj.id];
  }

  if (movies !== undefined) {
    listEle = (
      <div className="titleList">
        <div className="title">
          <h1>{props.genreObj.name}</h1>
          <div className="titles-wrapper">
            {movies.map(movie => {
              return (
                <Movie
                  key={movie.id}
                  movie={movie}
                  toggleHeart={props.toggleHeart}
                />);
            })}
          </div>
        </div>
      </div>
    );
  }

  return listEle;
};