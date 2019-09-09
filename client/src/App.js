import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as settingsActions from "./redux/actions/settings.action";
import * as authActions from "./redux/actions/auth.action";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/app/Dashboard";
import Till from "./components/app/till/Till";
import StockInformation from "./components/app/stock/StockInformation";
import ProductDetail from "./components/app/stock/ProductDetail";
import './App.scss';

class App extends React.Component {
    componentDidMount = async () => {

        let ip = "localhost:3000/api";
        if (process.env.REACT_APP_IP_HOST != null) {
            ip = process.env.REACT_APP_IP_HOST;
        }
        axios.defaults.baseURL = `http://${ip}`;

        axios.get('/v1/settings/tills')
            .then( response => {
                toastr.success("Tills Retrieved!", "Retrieve Till Number");
                localStorage.setItem('tills',JSON.stringify(response.data.tills));
                this.props.actions.settings.retrieveTills(response.data.tills);
            })
            .catch(error => {
                toastr.error("Unknown error.");
            });


        axios.get('/v1/settings/shop')
            .then(response => {

                toastr.success("Shop Details Retrieved!", "Retrieve Shop Details");
                this.props.actions.settings.retrieveShop(response.data.shop);
            })
            .catch(error => {
                toastr.error("Unknown error.");
            });


        axios.get('/v1/auth/roles')
            .then(response => {

                toastr.success("Roles Retrieved!", "Retrieve Roles");
                this.props.actions.auth.retrieveRoles(response.data.roles);
            })
            .catch(error => {
                toastr.error("Unknown error.");
            });

        axios.get('/v1/settings/reasons')
            .then(response => {

                toastr.success("Reasons Retrieved!", "Retrieve Reasons");
                this.props.actions.settings.retrieveReasons(response.data.reasons);
            })
            .catch(error => {
                toastr.error("Unknown error.");
            });


        axios.get('/v1/settings/tax')
            .then(response => {

                toastr.success("Tax Rate Retrieved!", "Retrieve Tax Rate");
                this.props.actions.settings.retrieveTax(Number(response.data.tax));
            })
            .catch(error => {
                toastr.error("Unknown error.");
            });
    };

    render() {
        return (
            <Router>
                <main>
                    <Route path="/" exact component={Login}/>

                    <Route path="/app/register" component={Register}/>
                    <Route path="/app/dashboard" component={Dashboard}/>

                    <Route path="/app/till" component={Till}/>

                    <Switch>
                        <Route path="/app/stock" exact component={StockInformation}/>
                        <Route path="/app/stock/:code" name="product-detail" component={ProductDetail}/>
                    </Switch>
                </main>
            </Router>
        )
    }

}


function mapStateToProps(state) {
    return {
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            settings: bindActionCreators(settingsActions, dispatch),
            auth: bindActionCreators(authActions, dispatch)
        }
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
