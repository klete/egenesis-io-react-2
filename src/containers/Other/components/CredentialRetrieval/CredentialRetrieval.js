import React, { Component } from 'react';

import axios from 'axios';


class CredentialRetrieval extends Component {

    constructor(props) {
        super(props);

        this.initialState = {
            form: {
                email: {
                    value: '',
                    validation: {
                        required: true
                    },
                    valid: false,
                    touched: false
                },
                lastname: {
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
            message: null,
            error: null,
            loading: false,
            credentials: null
        };

        this.state = {
            ...this.initialState
        };
    }

    submitHandler = (event) => {
        event.preventDefault();

        this.setState({                    
            error: null, 
            loading: true,
            credentials: null
        }, () => {
            this.getCredentials();
            // this.testCredentials();
            // this.testCredentials({success:false});
        });             
    }

    getCredentials = async () => {

        const email = this.state.form.email.value;
        const lastname = this.state.form.lastname.value;
        
        const credentialsData = {
            email: email.toUpperCase(),
            lastname: lastname.toUpperCase()
        };

        try {
            const response = await axios.post('/credentials-lookup', credentialsData)
            
            const credentials = response.data.Items[0];

            this.setState({                    
                error: null, 
                loading: false,
                credentials: credentials,
                message: this.getMessage({success:true})
            });

        } catch (error) {

            this.setState({
                error: error, 
                loading: false,
                credentials: null,
                message: this.getMessage({success:false})
            });

        }
    }

    getMessage = ({success}) => {
        return success ?  <span><b>Your user name and password have been e-mailed to: <span>{this.state.form.email.value}</span></b></span>
                        : <span><b>No records were found for the supplied parameters.</b></span>;
    }

    testCredentials = async (status = {success:true}) => {
        const {success} = status;
        if (success) {

            const waitTime = 2000;

            setTimeout(() => {
    
                const response = {
                    "message":"OK",
                    "status":200,
                    "data":{
                        "Items":
                            [{
                                "password":"somepwd",
                                "last_name":"RIZZO",
                                "user_name":"someusrnm",
                                "first_name":"FRANK"
                                
                            }],
                            "Count":1,
                            "ScannedCount":1
                    }
                };
    
                const credentials = response.data.Items[0];
    
                this.setState({                    
                    error: null, 
                    loading: false,
                    credentials: credentials,
                    message: this.getMessage({success:true})
                });
    
            }, waitTime);

        } else {
            const error = {
                "errorMessage":"{\"message\":\"No user record found!\",\"status\":400,\"count\":0}"
            }
            
            this.setState({
                error: error, 
                loading: false,
                credentials: null,
                message: this.getMessage({success:false})
            });
        }
    }

    resetHandler = (event) => {
        event.preventDefault();
        // console.log('The form was reset');
        this.setState({
            ...this.initialState
        });
    }

    checkValidity(value, rules) {
        let isValid = true;

        if (rules.required) {
            isValid = value !== '' && isValid
        }

        return isValid;
    }

    inputChangedHandler(event) {
        const target = event.target;
        const value = target.value.trim();
        const name = target.id;

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

    render () {

        return (
            <div className="ontainer-fluid">
                <div className="row">
                    <div id="visitors-header">User Name and Password Request</div>
                </div>
                <div className="row" id="visitors-content">

                    <form className="form-horizontal" onSubmit={this.submitHandler} onReset={this.resetHandler}>
                        
                        <div className="form-group">
                            <div className="col-sm-2"></div>
                            <div className="help-block col-sm-6">
                                {this.state.message}                             
                                {this.state.loading ? <p>Checking ...</p> : null}
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label className="control-label col-sm-2">E-Mail Address</label>
                            <div className="col-sm-6">
                                <input 
                                    type="text" 
                                    id="email"
                                    placeholder="Enter your email address here." 
                                    className="form-control"
                                    value={this.state.form.email.value}
                                    onChange={event => this.inputChangedHandler(event, 'email')}
                                    tabIndex="1" />
                            </div>
                            
                        </div>
                        
                        <div className="form-group">
                            <label className="control-label col-sm-2">Last Name</label>
                            <div className="col-sm-6">
                                <input 
                                    type="text" 
                                    id="lastname"
                                    placeholder="Enter your last name here." 
                                    className="form-control"
                                    value={this.state.form.lastname.value}
                                    onChange={event => this.inputChangedHandler(event, 'lastname')}
                            tabIndex="2" />
                            </div>
                            
                        </div>

                        <div className="form-group">
                            
                            <div className="col-sm-offset-2 col-sm-6">
                                
                                <button 
                                    type="reset" 
                                    className="btn btn-default"
                                    disabled={!this.state.formIsTouched}>Clear Form</button>

                                <button 
                                    type="submit" 
                                    disabled={!this.state.formIsValid}
                                    className="btn btn-default"
                                    style={{ marginLeft: '18px'}}>Submit</button>

                            </div>
                            
                        </div>
                    
                    </form>
                    
                </div>
      
            </div>
        );
    }
}

export default CredentialRetrieval;