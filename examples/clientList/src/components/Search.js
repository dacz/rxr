import React, { Component, PropTypes } from 'react';
import styles from './Search.css';

class Search extends Component {

  static propTypes = {
    setFilter: PropTypes.func.isRequired,
    filter:    PropTypes.string
  }

  componentDidMount() {
    this._input.focus();
    this._input.value = this.props.filter;
    this.searchString = this.props.filter;
  }

  searchString = '';
  _input;

  handleKeyUpSearch = (e) => {
    e.preventDefault();
    const val = e.target.value.trim();
    if (val === this.searchString) return false;
    this.searchString = val;
    this.props.setFilter(val);
    return false;
  }

  render() {
    return (
      <div className={ styles.container }>
        <label className={ styles.label } htmlFor="search">Search</label>
        <input
          id="search"
          type="text"
          onKeyUp={ this.handleKeyUpSearch }
          ref={(c) => this._input = c} // eslint-disable-line
          className={ styles.input }
          placeholder="search"
        />
      </div>
    );
  }

}

export default Search;
