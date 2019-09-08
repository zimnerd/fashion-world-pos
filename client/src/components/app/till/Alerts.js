import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../redux/actions/modal.action";

import './Alerts.scss';

class Alerts extends React.Component {

    render = () => {
        return (
            <section className="alerts widget-shadow mt-3">
                <header>
                    <h6 className="text">Warehouse Alerts</h6>
                    <hr/>
                </header>
                <main>
                    <h6 className="text-center">Coming Soon!</h6>
                </main>
            </section>
        )
    };

}

function mapStateToProps(state) {
    return {
        user: state.user,
        modal: state.modal,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(modalActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Alerts);
