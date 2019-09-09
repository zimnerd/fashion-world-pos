import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import axios from 'axios';
import toastr from 'toastr';
import $ from "jquery";

import * as authActions from '../../redux/actions/auth.action';
import * as settingsActions from '../../redux/actions/settings.action';

import './Login.scss';

class Login extends React.Component {

    state = {
        username: '',
        password: '',
        till: ''
    };
    canSubmit = '';
    tills = [];
    defaultTill;
    myTill = '';


    componentDidMount(): void {
        let usernameField = $('#username');
        usernameField.focus();
        let userTills = [];
        if (localStorage.getItem('tills') != null) {
            this.tills = JSON.parse(localStorage.getItem('tills'))
        }
        this.tills.forEach(function (item, key) {
            if (item.default_tillno === 1) {
                userTills[item.user] = item;
            }

        });
        this.defaultTill = userTills;

    }

    componentDidUpdate(): void {
        document.getElementById("till").value = this.state.till;
        console.log("UPDATED...")
        console.log(this.state.till)


    }


    onSubmit = event => {
        event.preventDefault();
        this.props.actions.auth.errorReset();
        const getTill = () => {
            if (this.state.till === undefined || this.state.till === '') {
                toastr.error("Please select a till", "Retrieve Till Details");
                return;
            } else {
                toastr.success("Till number retrieved ", "Retrieve Till Details");
                this.props.actions.settings.retrieveTillNumber(this.state.till);
                getTillDetails();
            }
        };

        const getTillDetails = () => {
            axios.get(`/v1/settings/till/${this.state.till}`)
                .then(response => {
                    toastr.success("Till Details Retrieved!", "Retrieve Till Details");
                    this.props.actions.settings.retrieveTill(response.data.till);
                    getControl();
                })
                .catch(error => {
                    if (error) {
                        this.canSubmit = false;
                        toastr.error("There are no details on record for this till number", "Retrieve Till Details");
                        return;
                    } else {
                        toastr.error("Unknown error.");
                        return;
                    }
                });
        }


        getTill();

        const getControl = () => {
            axios.get(`/v1/settings/till/${this.state.till}/controls`)
                .then(response => {
                    toastr.success("Till Controls Retrieved!", "Retrieve Till Controls");
                    this.props.actions.settings.retrieveTillControls(response.data.control);
                    doLogin();
                })
                .catch(error => {
                    if (error) {
                        console.log(error);
                        toastr.error("There are no controls on record for this till number ", "Retrieve Till Controls");
                        return;
                    } else {
                        toastr.error("Unknown error.");
                        return
                    }
                });
        };


        const doLogin = () => {
            axios.post('/v1/user/login', {username: this.state.username, password: this.state.password})
                .then(async response => {
                    await this.updateControls();
                    toastr.success('Login Successful!', 'Login User');
                    this.props.actions.auth.loginUser(response.data.success.token);
                    this.props.history.push('/app/dashboard');
                })
                .catch(error => {
                    if (error) {
                        toastr.error('The username and password combination is invalid!', 'Unauthorized');
                        return;
                    } else {
                        toastr.error('The information you have supplied is invalid!', 'Validation');
                        this.props.auth.actions.validationError(error.response.data.errors);
                        return;
                    }
                });
        }
    };

    updateControls = async () => {
        let controls = this.props.settings.controls;
        controls.user = this.state.username;

        await axios.put(`/v1/settings/till/${this.props.settings.number}/controls`, controls)
            .then(response => {
                toastr.success('Updated till controls!', 'Update Till Controls');

                this.props.actions.settings.retrieveTillControls(response.data.controls);
            })
            .catch(error => {
                if (error.response.status === 404) {
                    toastr.error("There are no controls on record for this till number!", "Retrieve Till Controls");
                    return false;
                }
            });
    };

    handleChange = event => {
        event.preventDefault();
        let formValues = this.state;
        let name = event.target.name;
        formValues[name] = event.target.value;
        this.setState(formValues);
    };

    handleName = event => {
        event.preventDefault();
        let formValues = this.state;
        let name = event.target.name;
        formValues[name] = event.target.value;
        if (event.target.value !== '' && this.defaultTill[event.target.value] !== undefined) {
            this.myTill = this.defaultTill[event.target.value].tillno;
            formValues['till'] = this.myTill;
            localStorage.setItem("myTill", this.myTill);
            $("#till").val(this.myTill);
        } else {
            formValues['till'] = '';
        }

        this.setState(formValues);
    };

    changeTill = event => {
        event.preventDefault();
        let formValues = this.state;
        let name = event.target.name;
        formValues[name] = event.target.value;
        localStorage.setItem("myTill", event.target.value);
        this.setState(formValues);
    };

    keyDown = e => {

        let event = window.event ? window.event : e;
        if (event.keyCode === 13) { //enter
            if (this.state.password !== "" && this.state.username !== "") {
                return false;
            }

            //e.preventDefault();
            let usernameField = $('#username');
            let passwordField = $('#password');

            if (usernameField.is(':focus')) {
                passwordField.focus();
                return true;
            }

            usernameField.focus();
            return true;
        }

        return false;
    };


    render() {
        return (
            <section>
                <section className="p-5 widget text-center">
                    <img src="/assets/logo_plain.png" alt="Login Logo"/>
                </section>
                <section className="col-6 widget widget-shadow no-top">
                    <header>
                        <h1 className="text-center">Login User</h1>
                        <hr/>
                    </header>
                    <main>
                        <form id='login-form'>
                            <main onKeyDown={this.keyDown} className="p-3">
                                <section className='form-group col-md-12'>
                                    <label>Username:</label>
                                    <input id='username' name='username' className='form-control' type='text'
                                           value={this.state.username}
                                           onChange={this.handleName} placeholder='Username' required/>
                                    {this.props.auth.errors['username'] &&
                                    <p className="error">{this.props.auth.errors['username']}</p>}
                                </section>
                                <section className='form-group col-md-12'>
                                    <label>Password:</label>
                                    <input id='password' name='password' className='form-control' type='password'
                                           value={this.state.password}
                                           onChange={this.handleChange} placeholder='Password' required/>
                                    {this.props.auth.errors['password'] &&
                                    <p className="error">{this.props.auth.errors['password']}</p>}
                                </section>

                                <section className='form-group col-md-6'>
                                    <label>Till Number:</label>
                                    <select className="form-control" name='till' id='till'
                                            onChange={this.changeTill.bind(this)}
                                            defaultValue={this.state.till}
                                            required>
                                        <option value=''>Select a till</option>
                                        {
                                            this.tills.filter(function (tillInfo) {
                                                return tillInfo.user === $('#username').val().trim();
                                            }).map((item, index) => {
                                                return (
                                                    <option key={index}
                                                            value={item.tillno}>{item.tillno}</option>
                                                )
                                            })
                                        }

                                    </select>
                                    {this.props.auth.errors['till'] &&
                                    <p className="error">{this.props.auth.errors['till']}</p>}
                                </section>

                            </main>
                            <footer className="pl-3 pr-3 pb-3 text-right">
                                <button className='btn btn-primary w-25' onClick={this.onSubmit}>Login</button>
                            </footer>
                        </form>
                    </main>
                </section>
            </section>
        )
    }

}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            auth: bindActionCreators(authActions, dispatch),
            settings: bindActionCreators(settingsActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
