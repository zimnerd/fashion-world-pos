import React from 'react';
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";

import * as authActions from "../../redux/actions/auth.action";

import './Header.scss';

class Header extends React.Component {

    logout = () => {
        this.props.actions.logout();
    };

    render() {
        return (
            <header className="p-2 shadow">
                <Link to="/" onClick={this.logout()} className="btn btn-danger">Sign Out</Link>
                <button className="btn float-right " onClick={this.props.history.goBack}>
                    <span><i className="fa fa-arrow-left"/></span>
                </button>
            </header>
        )
    }

}

function mapStateToProps(state) {
    return {
        user: state.user,
        till: state.till
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(authActions, dispatch)
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
