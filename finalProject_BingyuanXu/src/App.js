import React from "react";
import * as MovieAPI from "./MovieAPI";
import { Switch, Route } from "react-router-dom";
import Header from "./Header";
import MoviesShelf from "./MoviesShelf";

class App extends React.Component {
  state = {
    movies: [],                           //for backspace search working
    genre: [],
    showedMovies: []
  };

  toggleHeart = (movie) => {
    let apiResult;

    if (movie.my_list) {
      apiResult = MovieAPI.removeFromList(movie);
    } else {
      apiResult = MovieAPI.addToList(movie);
    }

    apiResult.then(newMovie => this.setState(previous => {
      const showedMovieIndex = previous.showedMovies.findIndex(movieEle => movieEle === movie);
      const moviesIndex = previous.movies.findIndex(movieEle => movieEle === movie);
      const clonedshowedMoviesState = [...previous.showedMovies];
      const clonedMoviesState = [...previous.movies];

      clonedshowedMoviesState.splice(showedMovieIndex, 1, newMovie);
      clonedMoviesState.splice(moviesIndex, 1, newMovie);

      return { showedMovies: clonedshowedMoviesState, movies: clonedMoviesState };
    }));
  }

  sortObj = (obj) => {
    return obj.sort(function (a, b) {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
    });
  }

  getGenreIdMoviesObj = (movies) => {
    const genreIdMoviesObj = {};

    movies.forEach((movie) => {
      movie.genre_ids.forEach((genre) => {
        if (genreIdMoviesObj[genre] !== undefined) {
          genreIdMoviesObj[genre].push(movie);
        } else {
          genreIdMoviesObj[genre] = [movie];
        }
      });
    });

    return genreIdMoviesObj;
  }

  componentDidMount = () => {
    MovieAPI.getAll()
      .then((movies) => MovieAPI.genres()
        .then((genre) => {

          return this.setState(
            {
              showedMovies: movies,
              movies: movies,
              genre: this.sortObj(genre),
            }
          );
        }));
  }

  search = (query) => {
    const searchResult = this.state.movies.filter(movie => {
      const upperCaseTitle = movie.title.toLowerCase();
      const upperCaseOverview = movie.overview.toLowerCase();

      return upperCaseTitle.includes(query.toLowerCase()) || upperCaseOverview.includes(query.toLowerCase())
    });

    this.setState({ showedMovies: searchResult });
  }

  render = () => {
    const showedMovieState = this.state.showedMovies;
    const myListObj = showedMovieState.filter(movie => movie.my_list);
    const moviesObj = this.getGenreIdMoviesObj(showedMovieState);

    return (
      <>
        <Header search={this.search} numOfFound={this.state.showedMovies.length} />
        <Switch>
          <Route exact path="/">
            {this.state.genre.map(genreIdNameObj => (
              <MoviesShelf
                moviesObj={moviesObj}
                genreObj={genreIdNameObj}
                key={genreIdNameObj.id}
                toggleHeart={this.toggleHeart}
              />
            ))}
          </Route>

          <Route exact path="/my-list">
            <MoviesShelf
              moviesObj={myListObj}
              genreObj={{ name: "My List" }}
              toggleHeart={this.toggleHeart}
            />
          </Route>
        </Switch>
      </>
    );
  }
}

export default App;