import React from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import axios from "axios";
import toastr from "toastr";
import $ from "jquery";

import * as userActions from "../../redux/actions/user.action";

import './Dashboard.scss';
import Header from "./Header";

class Dashboard extends React.Component {

    componentDidMount() {
        $("#record-transactions").focus();

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };
        axios.get("/v1/user/details", { headers: headers })
            .then(response => {
                console.log(response);
                toastr.success("User Details Retrieved!", "User Details");

                this.props.actions.retrieveDetails(response.data.user);
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    }

    render() {
        return (
            <main>
                <Header/>
                <header className="col-4 text-center widget widget-shadow names">
                    <h1>Welcome, {this.props.user.name}</h1>
                    <h4>@{this.props.user.username}</h4>
                    <h5 className="text-uppercase">{this.props.user.role && this.props.user.role.description}</h5>
                </header>
                <main className="container d-flex">
                    <section className="col-6 card text-center widget widget-shadow stock">
                        <header className="card-img-top">
                            <span><i className="fa fa-sitemap"/></span>
                        </header>
                        <main className="card-body">
                            <h5 className="card-title">Stock Management</h5>
                            <p className="card-text">Manage the stock that is available within the shop!</p>
                            <Link to="/app/stock" className="btn btn-success">Go now!</Link>
                        </main>
                    </section>
                    <section className="col-6 card text-center widget widget-shadow transactions">
                        <header className="card-img-top">
                            <span><i className="fa fa-money"/></span>
                        </header>
                        <main className="card-body">
                            <h5 className="card-title">Record Transactions</h5>
                            <p className="card-text">Record transactions for a customer!</p>
                            <Link to="/app/till" className="btn btn-success" id="record-transactions">Go now!</Link>
                        </main>
                    </section>
                </main>
                {this.props.user.role && this.props.user.role.description === 'Administrator' &&
                <footer className="col-3 text-center widget widget-shadow buttons">
                    <p>Register a new user for the application</p>
                    <Link to='/app/register' className='btn btn-primary'>Register</Link>
                </footer>
                }
            </main>
        )
    }

}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        user: state.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(userActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
