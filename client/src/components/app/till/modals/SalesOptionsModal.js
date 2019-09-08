import React from 'react';
import { Button, Card, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";
import $ from "jquery";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";
import * as settingsActions from "../../../../redux/actions/settings.action";

import './SalesOptionsModal.scss';

class SalesOptionsModal extends React.Component {

    handleClose = () => {
        this.props.actions.modal.closeSales();
    };

    credit = async () => {
        await this.props.actions.till.setAuthCommand("credit");
        await this.props.actions.modal.openAuthentication();
        await this.handleClose();
        $("#authUsername").focus();
    };

    activateLayBye = () => {
        for (let transaction of this.props.till.transactions) {
            if (typeof transaction.serialno !== "undefined") {
                toastr.error("You are unable to have handsets/airtime in a Lay-Bye sale.", "Invalid Selection");
                this.handleClose();
                return;
            }
        }

        this.props.actions.till.activateLayBye();
        this.handleClose();
    };

    activateStaffPrice = async () => {
        await this.props.actions.till.setAuthCommand("staff");
        await this.props.actions.modal.openAuthentication();
        await this.handleClose();
        $("#authUsername").focus();
    };

    holdAll = async () => {
        for (let item of this.props.till.transactions) {
            item.hold = true;
        }

        this.holdSale();
    };

    holdSale = () => {
        this.handleClose();
        let heldSales = this.props.till.transactions.filter(item => item.hold);
        if (heldSales.length === 0) {
            return;
        }

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        let request = {
            till: this.props.settings.till,
            type: "INV",
            transactions: heldSales
        };

        let transactions = this.props.till.transactions.filter(item => !item.hold);
        this.props.actions.till.setTransactions(transactions);
        axios.post(`/v1/sales`, request, { headers })
            .then(response => {
                console.log(response.data);

                this.props.actions.till.setTransactionId(response.data.sale);
                this.props.actions.modal.openTransaction();

                toastr.success("Transaction Held!", "Hold Transaction");

                this.saveSettings();
                this.loadSales();
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

    saveSettings = () => {
        let till = this.props.settings.till;
        till.TempDocNo = Number(till.TempDocNo) + 1;

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

    loadSales = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/sales`, { headers })
            .then(response => {
                console.log(response.data);

                let actualSales = [];
                for (let key of Object.keys(response.data.lineItems)) {
                    actualSales.push(response.data.lineItems[key]);
                }

                this.props.actions.till.setSales(actualSales);
                toastr.success("Held transactions retrieved!", "Retrieve Held Transactions");
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    this.props.actions.till.setSales();
                    console.log("No held sales found.")
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    retrieveSale = () => {
        this.handleClose();
        this.props.actions.modal.openRetrieveHeld();
    };

    render() {
        return (
            <Modal size="lg" show={this.props.modal.sales} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sales Options</Modal.Title>
                </Modal.Header>
                <Modal.Body className="sales-options">
                    <div className="d-flex">
                        <div className="col-4">
                            <Card onClick={this.credit} className="text-center secondary">
                                <Card.Header>
                                    <span><i className="fa fa-credit-card"/></span>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>Credit</Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-4">
                            <Card onClick={this.activateLayBye} className="text-center success">
                                <Card.Header>
                                    <span><i className="fa fa-hand-grab-o"/></span>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>New Lay-Bye</Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-4">
                            <Card onClick={this.activateStaffPrice} className="text-center info">
                                <Card.Header>
                                    <span><i className="fa fa-money"/></span>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>Staff Price</Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                    <hr/>
                    <div className="d-flex">
                        <div className="col-4">
                            <Card onClick={this.holdAll} className="text-center warning">
                                <Card.Header>
                                    <span><i className="fa fa-hand-o-left"/></span>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>Hold Entire Sale</Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-4">
                            <Card onClick={this.holdSale} className="text-center handwarning">
                                <Card.Header>
                                    <span><i className="fa fa-hand-o-left"/></span>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>Hold Sale</Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                        <div className="col-4">
                            <Card onClick={this.retrieveSale} className="text-center danger">
                                <Card.Header>
                                    <span><i className="fa fa-hand-o-right"/></span>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Title>Retrieve Sale</Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={this.handleClose}>
                        Close
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
        settings: state.settings,
        auth: state.auth
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

export default connect(mapStateToProps, mapDispatchToProps)(SalesOptionsModal);
