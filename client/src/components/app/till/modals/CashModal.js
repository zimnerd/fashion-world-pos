import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";
import * as settingsActions from "../../../../redux/actions/settings.action";

import './CashModal.scss';

class CashModal extends React.Component {

    handleClose = () => {
        this.props.actions.modal.closeCash();
    };

    completeSale = () => {
        this.handleClose();
        this.props.actions.till.resetTotals();
        let transactionsToComplete = this.props.till.transactions.filter(item => !item.hold);
        let transaction = {
            tax: this.props.settings.tax,
            shop: this.props.settings.shop,
            till: this.props.settings.till,
            transactions: transactionsToComplete,
            totals: this.props.till.totals,
            type: this.props.till.laybye ? "L/B" : "INV",
            stype: this.props.till.laybye ? "Laybye" : "Cash",
            method: "Cash",
            auth: ""
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

                toastr.success("Transaction Completed!", "Create Transaction");

                this.printReceipt(response.data.number);
                this.saveSettings(transaction.type);
                this.props.actions.till.deactivateLayBye();
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

    saveSettings = (type) => {
        let till = this.props.settings.till;
        till.DepNo = Number(till.DepNo) + 1;
        if (type === "L/B") {
            till.LbNo = Number(till.LbNo) + 1;
        } else {
            till.InvNo = Number(till.InvNo) + 1;
        }

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

    render() {
        return (
            <Modal show={this.props.modal.cash} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cash Payment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.props.till.transactions &&
                        this.props.till.transactions.length === 0 &&
                        <p>There are no transaction line items to pay for!</p>
                    }
                    {this.props.till.transactions &&
                        this.props.till.transactions.length > 0 &&
                        <p>Complete this transaction as a cash payment?</p>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                        Cancel
                    </Button>
                    {this.props.till.transactions &&
                        this.props.till.transactions.length > 0 &&
                        <Button variant="primary" onClick={this.completeSale}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CashModal);
