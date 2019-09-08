import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './ExchangeInvoiceSearch.scss';

class ExchangeInvoiceSearch extends React.Component {

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
        this.props.actions.modal.closeExchangeSearch();
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

        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/transactions/${this.state.docNo}/stock`, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Transaction found!", "Find Transaction");

                this.mapHeldSales(response.data.lineItems.transactions);
                this.props.actions.till.setTransactions(response.data.lineItems.transactions);
                this.props.actions.till.activateExchange();

                this.props.actions.modal.closeExchangeSearch();
                this.setState({
                    docNo: ""
                });
            })
            .catch(async error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error("Transaction could not be found!", "Find Transaction");
                    this.props.actions.modal.closeExchangeSearch();
                    this.props.actions.till.activateExchange();
                    this.props.actions.till.setNotFound();
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

    render() {
        return (
            <Modal show={this.props.modal.exchangeSearch} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Exchange Invoice Search</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Enter the invoice number you would like an exchange for:</p>
                    <Form onSubmit={this.findDocument}>
                        <div className="form-group">
                            <label>Invoice Number:</label>
                            <input name="invoice" type="text" className="form-control" placeholder="Invoice Number" id="searchDocNo"
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

export default connect(mapStateToProps, mapDispatchToProps)(ExchangeInvoiceSearch);
