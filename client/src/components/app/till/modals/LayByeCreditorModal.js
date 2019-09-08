import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";
import * as settingsActions from "../../../../redux/actions/settings.action";
import * as authActions from "../../../../redux/actions/auth.action";

import './LayByeCreditorModal.scss';

class LayByeCreditorModal extends React.Component {

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

    mapHeldSales = sales => {
        let totals = {
            total: 0,
            subtotal: 0,
            vat: 0,
            discount: 0,
            items: 0
        };
        for (let x = 0, len = sales.length; x < len; x++) {
            let sale = sales[x];
            totals = this.props.mapLineItem(sale, totals);
            totals.items++;
        }
        this.props.actions.till.setTotals(totals);
    };

    printReceipt = number => {
        let a = document.createElement('a');
        a.href = `http://localhost:8000/api/v1/transactions/${number}/print`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    saveSettings = (type) => {
        let till = this.props.settings.till;
        till.DepNo = Number(till.DepNo) + 1;
        till.InvNo = Number(till.InvNo) + 1;
        till.LbNo = Number(till.LbNo) + 1;
        till.CrnNo = Number(till.CrnNo) + 1;
        till.PayNo = Number(till.PayNo) + 1;

        axios.post(`/v1/settings/till/${this.props.settings.number}`, till)
            .then(response => {
                console.log(response.data);

                toastr.success("Till Details updated!", "Update Settings");

                this.props.actions.settings.saveTill(response.data.till);
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

    refundTransaction = async debtor => {
        let method = "Cash";

        this.props.actions.modal.closeLayByeCreditor();
        let transactionsToComplete = this.props.till.transactions.filter(item => !item.hold);
        let transaction = {
            tax: this.props.settings.tax,
            shop: this.props.settings.shop,
            till: this.props.settings.till,
            transactions: transactionsToComplete,
            totals: this.props.till.totals,
            type: this.props.till.laybye ? "LBC" : "CRN",
            method: method,
            stype: debtor.stype ? this.props.till.debtor.stype : "Refund",
            auth: this.props.auth.auth,
            debtor: debtor,
            tendered: 0
        };

        this.props.actions.till.resetTotals();
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
                this.saveSettings(transaction.type);

                this.props.actions.till.setCompletedTransaction({
                    type: transaction.type,
                    number: response.data.number
                });
                this.props.actions.modal.openTransactionComplete();
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

    handleSuccess = async () => {
        let debtor = {
            no: this.props.till.refundData.invNo,
            type: "DCS",
            name: "Laybye Return Debtor",
            cell: this.props.till.refundData.cell,
            email: this.props.till.refundData.email,
            idNo: this.props.till.refundData.idNo,
            balance: this.props.till.refundData.depAmt * -1,
            current: this.props.till.refundData.depAmt * -1
        };

        if (!await this.saveDebtor(debtor)) {
            return;
        }

        if (this.props.till.refundData.found) {
            this.saveRefund();
            this.refundTransaction(debtor);
        } else {
            this.saveRefund();
        }

        this.props.actions.till.deactivateRefund();
        this.props.actions.till.setRefund();

        this.props.actions.till.deactivateCredit();
        this.props.actions.till.deactivateLayBye();
        this.props.actions.till.deactivateReturns();
        this.props.actions.till.deactivateExchange();
        this.props.actions.till.deactivateStaff();
        this.props.actions.till.setCombos();
        this.props.actions.modal.closeLayByeCreditor();
        this.props.actions.auth.setAuth();


        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };
        axios.get('/v1/debtors?stype=Credit,DCS', { headers })
            .then(async response => {
                console.log(response.data);

                toastr.success("Debtors Retrieved!", "Retrieve Debtors");
                await this.props.actions.till.retrieveDebtors(response.data.debtors);
                await this.props.actions.till.nextDebtor(response.data.next);
            })
            .catch(error => {
                console.log(error);

                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    this.props.actions.till.retrieveDebtors();
                    this.props.actions.till.nextDebtor(error.response.data.next);
                    console.log("No debtors found.")
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    saveDebtor = async debtor => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };
        return await axios.post('/v1/debtors', debtor, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Debtor Saved!", "Save Debtor");
                return true;
            })
            .catch(error => {
                console.log(error);
                toastr.error("Unknown error.");

                return false;
            });
    };

    handleClose = () => {
        this.props.actions.modal.closeLayByeCreditor();
        this.props.actions.modal.openCompleteSale();
    };

    render() {
        return (
            <Modal show={this.props.modal.creditor} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Lay-Bye Creditor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Would you like to be saved as a Lay-Bye Creditor?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.handleSuccess}>
                        Yes
                    </Button>
                    <Button variant="danger" onClick={this.handleClose}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

}

function mapStateToProps(state) {
    return {
        modal: state.modal,
        till: state.till,
        auth: state.auth,
        settings: state.settings
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch),
            settings: bindActionCreators(settingsActions, dispatch),
            auth: bindActionCreators(authActions, dispatch)
        }
    };
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LayByeCreditorModal));
