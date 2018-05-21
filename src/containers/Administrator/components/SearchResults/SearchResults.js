import React from 'react';

import './SearchResults.css';


const searchResults = (props) => {

    let searchResultsTable = null;

    if (props.results) {

        if (props.results.length === 0) {

            searchResultsTable = <div style={{margin: '16px'}}>No records found.</div>;
        
        } else {

            const sortedResults = sortResultsByName(props.results);

            const searchResults = sortedResults.map(
                (student, index) => {
                    return (
                        <tr key={index} 
                            onClick={() => props.select(student.user_no)}>
                            <td className="studentItem">
                                { student.last_name }, { student.first_name } { student.user_no }
                            </td>
                        </tr>);
                });
        
            searchResultsTable = (
                <table id="searchResults">
                    <tbody>
                        {searchResults}
                    </tbody>
                </table>
            );    
        }
    }

    return (
        <div>
            <h4>Search Results</h4>

            {!props.loading ? searchResultsTable : null}

        </div>
    );
    
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

export default searchResults;