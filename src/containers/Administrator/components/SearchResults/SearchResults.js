import React from 'react';
import { Link } from 'react-router-dom';

import './SearchResults.css';


class SearchResults extends React.Component {

    state = {
        searchResults: null
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        // console.log('------------------------------------');
        // console.log('[SearchResults.js] getDerivedStateFromProps');
        // console.log(nextProps);
        // console.log(prevState);
        // console.log('------------------------------------');

        if (nextProps.results) {

            let newSearchResults = null;

            if (nextProps.results.length === 0) {

                newSearchResults = <tr><td>No records found.</td></tr>
            
            } else {
                const sortedResults = sortResultsByName(nextProps.results);
                newSearchResults = sortedResults.map(
                    (student, index) => {
                        return (
                            <tr key={index} >
                                <td className="studentItem">
                                    <Link to={'/administrator/search/'+ student.user_no}>{ student.last_name }, { student.first_name } { student.user_no }</Link>
                                </td>
                            </tr>);                                            
                    });
            }

            return {
                searchResults: newSearchResults
            };  
        } else {
            return null;
        }
    }

    render () {
        // console.log('------------------------------------');
        // console.log('[SearchResults.js] render');
        // console.log(this.state.searchResults ? this.state.searchResults.length : 0);
        // console.log(this.props);
        
        let styleClassesArray = ['SearchResults'];

        if (this.props.results && !this.props.loading) {
            styleClassesArray.push('fadein');
        } else if (!this.props.results && this.props.loading){
            styleClassesArray.push('fadeout');
        }

        const styleClasses = styleClassesArray.join(' ');

        // console.log(styleClasses)
        // console.log('------------------------------------');

        return (
            <div className={styleClasses}>

                <h4>Search Results</h4>

                <table id="searchResults">
                    <tbody>
                        { this.state.searchResults }
                    </tbody>
                </table>

            </div>
        );
    }
} 

const sortResultsByName = (searchResults) => {        
    searchResults.sort((a, b) => {
      if (a.last_name < b.last_name) {
        return -1;
      }
      if (a.last_name > b.last_name) {
        return 1;
      }
      if (a.first_name < b.first_name) {
        return -1;
      }
      if (a.first_name > b.first_name) {
        return 1;
      }
      return 0;
    });

    return searchResults;
};

export default SearchResults;