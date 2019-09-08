import React from 'react';
import { Button, Form, Modal, Table } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './RetrieveHeldModal.scss';

class RetrieveHeldModal extends React.Component {

    state = {
        number: ""
    };

    componentDidMount = () => {
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

    handleChange = event => {
        this.setState({
            number: event.target.value
        });
    };

    handleClose = () => {
        this.props.actions.modal.closeRetrieveHeld();
    };

    selectSale = async sale => {
        this.props.actions.till.setTransactions(sale.transactions);
        let totals = {
            total: 0,
            subtotal: 0,
            vat: 0,
            discount: 0,
            items: 0,
            held: true,
            heldNum: sale.docnum
        };
        for (let x = 0, len = sale.transactions.length; x < len; x++) {
            let saleItem = sale.transactions[x];
            totals = this.props.mapHeldItems(saleItem, totals);
            totals.items++;
        }

        await this.props.actions.till.setTotals(totals);
        this.handleClose();
    };

    render() {
        return (
            <Modal show={this.props.modal.retrieveHeld} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Retrieve Held Transactions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <p className="text-center">Select a held transaction:</p>
                        <Table>
                            <thead>
                            <tr>
                                <th>Doc Num</th>
                                <th>Type</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.till.sales && this.props.till.sales.length === 0 &&
                            <tr>
                                <td colSpan="2" className="text-center">There are no held transactions.</td>
                            </tr>
                            }
                            {this.props.till.sales && this.props.till.sales.map((item, index) => {
                                return (
                                    <tr key={index} onClick={() => this.selectSale(item)}>
                                        <td>{item.docnum}</td>
                                        <td>{item.type}</td>
                                    </tr>
                                )
                            })
                            }
                            </tbody>
                        </Table>
                    </Form>
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
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RetrieveHeldModal);
