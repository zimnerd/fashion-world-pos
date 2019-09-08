import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import axios from 'axios';
import toastr from 'toastr';

import * as authActions from "../../redux/actions/auth.action";

import Header from "../app/Header";
import './Register.scss';
import $ from "jquery";

class Register extends React.Component {

    state = {
        name: '',
        email: '',
        username: '',
        password: '',
        role: 'RM',
        confirm: ''
    };

    componentDidMount(): void {
        let nameField = $('#name');
        nameField.focus();
    }

    onSubmit = event => {
        event.preventDefault();
        this.props.actions.errorReset();

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.post('/v1/user/register', this.state, { headers })
            .then(response => {
                console.log(response);
                toastr.success('You have been registered successfully!', 'Register User');

                this.props.history.push('/app/dashboard');
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 500) {
                    toastr.error('There was an error when trying to register your account!', 'Register User');
                } else {
                    toastr.error('The information you have supplied is invalid!', 'Validation');
                    this.props.actions.validationError(error.response.data.errors);
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

    keyDown = e => {
        let event = window.event ? window.event : e;
        if (event.keyCode === 13) { //enter
            if (this.state.name !== "" && this.state.email !== "" && this.state.role !== ""
                && this.state.username !== "" && this.state.password !== "" && this.state.confirm !== "") {
                return false;
            }

            e.preventDefault();
            let nameField = $('#name');
            let emailField = $('#email');
            let roleField = $('#role');
            let usernameField = $('#username');
            let passwordField = $('#password');
            let confirmField = $('#confirm');

            if (nameField.is(':focus')) {
                emailField.focus();
                return true;
            }

            if (emailField.is(':focus')) {
                roleField.focus();
                return true;
            }

            if (roleField.is(':focus')) {
                usernameField.focus();
                return true;
            }

            if (usernameField.is(':focus')) {
                passwordField.focus();
                return true;
            }

            if (passwordField.is(':focus')) {
                confirmField.focus();
                return true;
            }

            nameField.focus();
            return true;
        }

        return false;
    };

    render() {
        return (
            <section>
                <Header/>
                <section className="col-6 widget widget-shadow register">
                    <header>
                        <h1 className="text-center">Register User</h1>
                        <hr/>
                    </header>
                    <main>
                        <form id='register-form'>
                            <main onKeyDown={this.keyDown} className="p-3 d-flex">
                                <div className="col-6">
                                    <section className='form-group'>
                                        <label>Name:</label>
                                        <input id='name' name='name' className='form-control' type='text'
                                               value={this.state.name}
                                               onChange={this.handleChange} placeholder='Name' required/>
                                        {this.props.auth.errors['name'] && <p className="error">{this.props.auth.errors['name']}</p>}
                                    </section>
                                    <section className='form-group'>
                                        <label>Email Address:</label>
                                        <input id='email' name='email' className='form-control' type='email'
                                               value={this.state.email}
                                               onChange={this.handleChange} placeholder='Email Address' required/>
                                        {this.props.auth.errors['email'] && <p className="error">{this.props.auth.errors['email']}</p>}
                                    </section>
                                    <section className='form-group'>
                                        <label>Role:</label>
                                        <select id='role' name='role' placeholder='Role'
                                                value={this.state.role}
                                                onChange={this.handleChange} className='form-control' required>
                                            {this.props.auth.roles &&
                                            this.props.auth.roles.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.code}>{item.description}</option>
                                                )
                                            })
                                            }
                                        </select>
                                        {this.props.auth.errors['role'] && <p className="error">{this.props.auth.errors['role']}</p>}
                                    </section>
                                </div>
                                <div className="col-6">
                                    <section className='form-group'>
                                        <label>Username:</label>
                                        <input id='username' name='username' className='form-control' type='text'
                                               value={this.state.username}
                                               onChange={this.handleChange} placeholder='Username' required/>
                                        {this.props.auth.errors['username'] && <p className="error">{this.props.auth.errors['username']}</p>}
                                    </section>
                                    <section className='form-group'>
                                        <label>Password:</label>
                                        <input id='password' name='password' className='form-control' type='password'
                                               value={this.state.password}
                                               onChange={this.handleChange} placeholder='Password' required/>
                                        {this.props.auth.errors['password'] && <p className="error">{this.props.auth.errors['password']}</p>}
                                    </section>
                                    <section className='form-group'>
                                        <label>Confirm Password:</label>
                                        <input id='confirm' name='confirm' placeholder='Confirm Password'
                                               value={this.state.confirm}
                                               onChange={this.handleChange} className='form-control' type='password' required/>
                                        {this.props.auth.errors['confirm'] && <p className="error">{this.props.auth.errors['confirm']}</p>}
                                    </section>
                                </div>
                            </main>
                            <footer className="text-right">
                                <button className='btn btn-primary' onClick={this.onSubmit}>Register</button>
                                <Link to='/app/dashboard' className='btn btn-danger float-left'>Back</Link>
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
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);
