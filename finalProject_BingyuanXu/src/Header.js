import React from 'react';
import { Link } from "react-router-dom";

class Header extends React.Component {
  state = {
    query: "",
  };

  update = (input) => {
    this.setState({ query: input });
    this.props.search(input);
  }

  render = () => {
    const ifQueryEmpty = this.state.query.length === 0;
    const searchResults = (
      <div className="searchResults">
        {`Found ${this.props.numOfFound} movies with the query "${this.state.query}"`}
      </div>
    );

    return (
      <header className="header">
        <Link to="/">
          <img
            src="https://fontmeme.com/permalink/190707/fd4735271a0d997cbe19a04408c896fc.png"
            alt="netflix-font"
            border="0"
          />
        </Link>
        <div id="navigation" className="navigation">
          <nav>
            <ul>
              <li><Link to="/my-list">My List</Link></li>
            </ul>
          </nav>
        </div>
        <form id="search" className="search">
          <input
            onChange={e => this.update(e.target.value)}
            type="search"
            placeholder="Search for a title..."
            value={this.state.query}
          />
          {ifQueryEmpty ? (<></>) : searchResults}
        </form>
      </header>
    );
  }
}

export default Header;