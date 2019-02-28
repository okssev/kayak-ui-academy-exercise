import React, { Component } from 'react';

import MovieIcon from '../../../images/icons/film-strip-with-play-triangle.svg';

import SearchIcon from '../../../images/icons/search-icon.svg';

import styles from './autocomplete.css';

class Autocomplete extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedMovie: { title: '' },
      movies: [],
      showSuggestions: false,
      label: 'Enter a movie name',
      value: '',
      open: false
    };

    this.getInfo = this.getInfo.bind(this);
    this.handleInputChange = this.onChange.bind(this);
    this.openSearch = this.openSearch.bind(this);
    this.handleMovieSelect = this.onSelect.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  getInfo = (query) => {
    fetch("https://api.themoviedb.org/3/search/movie?api_key=cab2afe8b43cf5386e374c47aeef4fca&query=" + encodeURIComponent(query) + "&page=1&include_adult=false")
      .then(response => response.json()).then((results) => {
        this.setState({
          movies: results.results.slice(0, 8)
        });
      });
  }

  onChange = (e) => {
    this.setState({
      value: e.target.value
    }, () => {
      if (this.state.value && this.state.value.length > 2) {
        this.getInfo(this.state.value)
        this.setState({ showSuggestions: true })
      }
      else {
        this.setState({
          showSuggestions: false,
          movies: []
        })
      }
    })
  }

  openSearch = () => {
    this.setState({ open: true })
  }

  onSelect = (e) => {
    let id = e.target.getAttribute('data-id');
    this.state.movies.forEach((movie) => {
      if (movie.id == id) {
        this.setState({
          value: '',
          selectedMovie: movie,
          showSuggestions: false,
          open: false
        });
      }
    });
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ open: false })
    }
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    const { movies } = this.state;
    let suggestions;
    if (this.state.showSuggestions) {
      suggestions = (
        <ul>
          {movies.map((movie, key) => {
            return (
              <li key={key} data-id={movie.id} onClick={this.handleMovieSelect}>
                {movie.title}
                <small>Rating {movie.vote_average}, {new Date(movie.release_date).getFullYear()}
                </small>
              </li>
            );
          })}
        </ul>
      );
    }
    return (
      <div ref={this.setWrapperRef}>
        <div className={styles.container}>
          <div className={styles.searchBox}>
            <div className={styles.movieIconInput}>
              <MovieIcon fill="white" width={25} height={25} />
            </div>
            {this.state.selectedMovie.title ? '' : <label className={styles.inputLabel}>{this.state.label}</label>}
            <input type="text" readOnly value={this.state.selectedMovie.title} onClick={this.openSearch}></input>
            {this.state.open ? (
              <div className={styles.popup}>
                <div className={styles.movieIconPopup}>
                  <MovieIcon fill="black" width={20} height={20} />
                </div>
                <label className={styles.popupLabel}>{this.state.label}</label>
                <input type="text" autoFocus={true} value={this.state.value} onChange={this.handleInputChange} />
                {this.state.movies.length > 0 ? (
                  <div className={styles.suggestionsList}>
                    {suggestions}
                  </div>
                ) : ''}
              </div>
            ) : ''}
            <a href="#" className={styles.searchButton}>
              <SearchIcon width={25} height={25} fill="#ff690f" />
            </a>
          </div>
        </div >
      </div>
    );
  }
}

export default Autocomplete;
