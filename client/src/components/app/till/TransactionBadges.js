import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Badge } from "react-bootstrap";

import * as tillActions from "../../../redux/actions/till.action";

import './TransactionBadges.scss';

class TransactionBadges extends React.Component {

    removeLaybye = () => {
        this.props.actions.deactivateLayBye();
        this.props.actions.setNotFound(false);
    };

    removeExchange = () => {
        this.props.actions.deactivateExchange();
        this.props.actions.setNotFound(false);
    };

    removeStaff = async () => {
        await this.props.actions.deactivateStaff();
        this.props.mapTransactions();
    };

    removeReturns = () => {
        this.props.actions.deactivateReturns();
    };

    removeRefund = () => {
        this.props.actions.resetTotals();
        this.props.actions.resetTransactions();
        this.props.actions.deactivateRefund();
        this.props.actions.setRefund();
        this.props.actions.setNotFound(false);
    };

    removeCredit = () => {
        this.props.actions.deactivateCredit();
    };

    render() {
        return (
            <section className="p-3 widget-shadow badges">
                {this.props.till.laybye &&
                <Badge variant="success">Lay-Bye <span onClick={this.removeLaybye}><i
                    className="fa fa-times"/></span></Badge>
                }
                {this.props.till.returns &&
                <Badge variant="danger">
                    Return for Customer:
                    <span>{this.props.till.returns.customer.name}</span>
                    <span onClick={this.removeReturns}><i className="fa fa-times"/></span>
                </Badge>
                }
                {this.props.till.exchange &&
                <Badge variant="warning">Exchange <span onClick={this.removeExchange}><i
                    className="fa fa-times"/></span>
                </Badge>
                }
                {this.props.till.staff &&
                <Badge variant="info">Staff <span onClick={this.removeStaff}><i
                    className="fa fa-times"/></span>
                </Badge>
                }
                {this.props.till.refund &&
                <Badge variant="dark">Refund <span onClick={this.removeRefund}><i
                    className="fa fa-times"/></span>
                </Badge>
                }
                {this.props.till.credit &&
                <Badge variant="secondary">Credit <span onClick={this.removeCredit}><i
                    className="fa fa-times"/></span>
                </Badge>
                }
            </section>
        )
    }

}

function mapStateToProps(state) {
    return {
        till: state.till
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(tillActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionBadges);
