import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";
import * as settingsActions from "../../../../redux/actions/settings.action";

import './CompleteRefund.scss';

class CompleteRefund extends React.Component {

    completeRefund = async () => {
        if (this.props.till.refundData.found) {
            await this.saveRefund();
            await this.refundTransaction();
        } else {
            await this.saveRefund();
        }

        this.props.actions.till.deactivateRefund();
        this.props.actions.till.setRefund();

        this.props.actions.till.deactivateCredit();
        this.props.actions.till.deactivateLayBye();
        this.props.actions.till.deactivateReturns();
        this.props.actions.till.deactivateExchange();
        this.props.actions.till.deactivateStaff();
        this.props.actions.till.setCombos();
        this.handleClose();
    };

    mapHeldSales = sales => {
        let totals = {
            total: 0,
            subtotal: 0,
            vat: 0,
            discount: 0,
            items: 0
        };
        for(let x = 0, len = sales.length; x < len; x++) {
            let sale = sales[x];
            totals = this.props.mapLineItem(sale, totals);
            totals.items++;
        }
        this.props.actions.till.setTotals(totals);
    };

    refundTransaction = async () => {
        this.props.actions.till.resetTotals();
        let transactionsToComplete = this.props.till.transactions.filter(item => !item.hold);
        let transaction = {
            tax: this.props.settings.tax,
            shop: this.props.settings.shop,
            till: this.props.settings.till,
            transactions: transactionsToComplete,
            totals: this.props.till.totals,
            type: this.props.till.laybye ? "LBC" : "CRN",
            method: "Cash",
            stype: "Refund",
            auth: this.props.auth.auth
        };

        let heldSales = this.props.till.transactions.filter(item => item.hold);
        this.mapHeldSales(heldSales);
        this.props.actions.till.setTransactions(heldSales);

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.post(`/v1/transactions`, transaction, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Transaction Refunded!", "Refund Transaction");

                this.printReceipt(response.data.number);
                this.saveSettings();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    printReceipt = number => {
        let a = document.createElement('a');
        a.href = `http://localhost:8000/api/v1/transactions/${number}/print`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    saveSettings = () => {
        let till = this.props.settings.till;
        till.CrnNo = Number(till.CrnNo) + 1;

        axios.post(`/v1/settings/till/${this.props.settings.number}`, till)
            .then(response => {
                console.log(response.data);

                toastr.success("Till Details updated!", "Update Settings");

                this.props.actions.settings.saveTill(response.data.till);
                this.handleClose();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    saveRefund = async () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        await axios.post(`/v1/transactions/refunds`, this.props.till.refundData, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Refund saved!", "Save Refund");
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    handleClose = () => {
        this.props.actions.modal.closeCompleteRefund();
    };

    render() {
        return (
            <Modal show={this.props.modal.refundComplete} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Complete Refund</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.till.transactions &&
                    this.props.till.transactions.length === 0 &&
                    <p>There are no transaction line items to refund!</p>
                    }
                    {this.props.till.transactions &&
                    this.props.till.transactions.length > 0 &&
                    <p>Complete this refund?</p>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    {this.props.till.transactions &&
                    this.props.till.transactions.length > 0 &&
                    <Button variant="primary" onClick={this.completeRefund}>
                        Complete
                    </Button>
                    }
                </Modal.Footer>
            </Modal>
        )
    }

}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        modal: state.modal,
        settings: state.settings,
        till: state.till
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch),
            settings: bindActionCreators(settingsActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CompleteRefund);
