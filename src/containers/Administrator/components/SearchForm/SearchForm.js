import React from 'react';
import { withRouter } from 'react-router-dom';

import './SearchForm.css';


class SearchForm extends React.Component {

    state = {
        form: {
            lastName: {                 // this must match the id of the form input element
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            }
        },
        formIsValid: false,
        formIsTouched: false,
    }

    onSearch = (event) => {
        // console.log('[SearchForm.js] onSearch');
        event.preventDefault();

        if (this.state.formIsValid) {
            // console.log('[Search.js] onSearch: form is valid');

            this.props.submitted(this.state.form)
        }
    }

    inputChangedHandler(event) {
        const target = event.target;
        const value = target.value.trim();
        const name = target.id;

        this.updateForm(name, value);
    }
    updateForm(name, value) {
        const updatedForm = {
            ...this.state.form
        };
        const updatedFormElement = {
            ...updatedForm[name]
        }

        updatedFormElement.value = value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = !!value.length;
        updatedForm[name] = updatedFormElement;

        this.setState({
          form: updatedForm,
          formIsValid: this.isFormValid(updatedForm),
          formIsTouched: this.isFormTouched(updatedForm)
        });
    }
    checkValidity(value, rules) {
        let isValid = true;
        if (rules.required) {
            isValid = value !== '' && isValid
        }
        return isValid;
    }
    isFormValid(form) {
        let formIsValid = true;
        for (let inputIdentifier in form) {
            formIsValid = form[inputIdentifier].valid && formIsValid;
        }
        return formIsValid;
    }
    isFormTouched(form) {
        let formIsTouched = false;
        for (let inputIdentifier in form) {
            formIsTouched = form[inputIdentifier].touched || formIsTouched;
        }
        return formIsTouched;
    }

    render() {
        return (
            
                <div className="row SearchForm">
                    <div className="col-sm-12 form-group">

                        <table id="search-form-header">
                            <tbody>
                                <tr>
                                    <td className="header-label">Student Search</td>
                                    <td className="search-results">
                                        {this.props.results && !this.props.loading && (this.props.location.pathname !== '/administrator/search') ? 
                                            <span 
                                                onClick={() => this.props.select('search')}>
                                                Search Results
                                            </span> 
                                            : 'Search Results'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <form onSubmit={this.onSearch} style={{backgroundColor: 'silver'}}>

                            <input 
                                autoComplete="off"
                                type="text" 
                                id="lastName" 
                                value={this.state.form.lastName.value}
                                onChange={event => this.inputChangedHandler(event, 'lastName')}
                                maxLength="40"
                                title="Enter the (partial) last name here." 
                                placeholder="Enter the (partial) last name here." 
                                className="form-control" 
                                style={{ float: 'left', width: '300px', marginBottom: '16px' }} />

                            <button 
                                type="submit" 
                                disabled={!this.state.formIsValid}
                                className="btn btn-default"
                                style={{ float: 'left', marginLeft: '8px' }}>
                                Search
                            </button>

                        </form>

                        

                    </div>
                </div>
        );
    }
}
    
export default withRouter(SearchForm);