import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";
import $ from "jquery";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './RefundModal.scss';

class RefundModal extends React.Component {

    state = {
        docNo: ""
    };

    handleChange = event => {
        this.setState({
            docNo: event.target.value
        });
    };

    handleClose = () => {
        this.setState({
            docNo: ""
        });
        this.props.actions.modal.closeRefund();
        this.props.actions.till.deactivateLayBye();
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

    findDocument = (e) => {
        e.preventDefault();

        let type = "INV";
        if (this.props.till.laybye) {
            type = "LB";
        }

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/transactions/${this.state.docNo}/refunds/${type}`, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Refund found!", "Find Refund");

                this.mapHeldSales(response.data.lineItems.transactions);
                this.props.actions.till.setTransactions(response.data.lineItems.transactions);
                this.props.actions.till.activateRefund();
                this.checkLaybye(response.data.lineItems.transactions);
                let refund = {
                    invNo: this.state.docNo,
                    invType: type === "LB" ? "L/B" : type,
                    invDate: response.data.lineItems.date,
                    brNo: response.data.lineItems.branch,
                    found: true
                };

                let person = response.data.lineItems.person;
                if (person !== null) {
                    refund.idNo = person.idNo;
                    refund.cell = person.cell;
                    refund.email = person.email;
                }

                this.props.actions.modal.openRefundDetails();
                this.props.actions.till.setRefund(refund);
                this.props.actions.modal.closeRefund();
                this.setState({
                    docNo: ""
                });
                $('#refundDetailsInvNo').focus();
            })
            .catch( async error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("Transaction could not be found!", "Find Transaction");
                    this.props.actions.modal.openRefundDetails();
                    await this.props.actions.till.setRefund({
                        invNo: this.state.docNo,
                        invType: this.props.till.laybye ? "L/B" : "INV",
                        notFound: true
                    });
                    this.props.actions.modal.closeRefund();
                    $('#refundDetailsInvNo').focus();
                } else if (error.response.status === 422) {
                    toastr.error(error.response.data.error, "Find Transaction");
                } else {
                    toastr.error("Unknown error.");
                }
                this.setState({
                    docNo: ""
                });
            });
    };

    checkLaybye = (transactions) => {
        for (let transaction of transactions) {
            if (transaction.type !== 'L/B') {
                continue;
            }

            this.props.actions.till.activateLayBye();
            break;
        }
    };

    render() {
        return (
            <Modal show={this.props.modal.refund} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    {this.props.till.laybye &&
                    <Modal.Title>Laybye Refund</Modal.Title>
                    }
                    {!this.props.till.laybye &&
                    <Modal.Title>Refund</Modal.Title>
                    }
                </Modal.Header>
                <Modal.Body>
                    <p>Enter the invoice number you would like a refund for:</p>
                    <Form onSubmit={this.findDocument}>
                        <div className="form-group">
                            <label>Invoice Number:</label>
                            <input name="invoice" type="text" className="form-control" placeholder="Invoice Number" id="refundDocNo"
                                   value={this.state.docNo} onChange={this.handleChange}/>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.findDocument}>
                        Continue
                    </Button>
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
        auth: state.auth,
        modal: state.modal,
        till: state.till
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            till: bindActionCreators(tillActions, dispatch),
            modal: bindActionCreators(modalActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RefundModal);
