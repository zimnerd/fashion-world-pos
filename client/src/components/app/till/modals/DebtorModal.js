import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './DebtorModal.scss';

class DebtorModal extends React.Component {

    state = {
        new: false,
        debtor: {
            name: "",
            cell: "",
            email: "",
            type: "Staff"
        }
    };

    componentDidMount(): void {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };
        axios.get('/v1/debtors?stype=Credit,DCS', { headers })
            .then(async response => {
                console.log(response.data);

                toastr.success("Debtors Retrieved!", "Retrieve Debtors");
                await this.props.actions.till.retrieveDebtors(response.data.debtors);
                await this.props.actions.till.nextDebtor(response.data.next);
                this.setState({
                    debtor: {
                        ...this.state.debtor, no: response.data.next
                    }
                })
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
    }

    saveDebtor = async () => {
        this.setState({
            debtor: {
                ...this.state.debtor, no: this.props.till.next
            }
        });
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };
        await axios.post('/v1/debtors', this.state.debtor, { headers })
            .then(response => {
                console.log(response.data);
                toastr.success("Debtor Saved!", "Save Debtor");
                this.selectDebtor(response.data.debtor);
            })
            .catch(error => {
                console.log(error);
                toastr.error("Unknown error.");
            });
        this.componentDidMount();
    };

    handleChange = e => {
        this.setState({
            debtor: {
                ...this.state.debtor, [e.target.name]: e.target.value
            }
        });
    };

    handleClose = () => {
        this.props.actions.modal.closeDebtorModal();
    };

    selectDebtor = debtor => {
        this.props.actions.till.setDebtor(debtor);
        this.handleClose();

        if (!this.props.till.staff) {
            this.props.actions.modal.openCompleteSale();
        }
    };

    render() {
        return (
            <Modal size="lg" show={this.props.modal.debtor} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Debtors</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!this.state.new &&
                    <Form>
                        <p>Select the existing debtor from the list below: </p>
                        <Table striped>
                            <thead>
                            <tr>
                                <th>Debtor No.</th>
                                <th>Debtor Type</th>
                                <th>Name</th>
                                <th>Cell</th>
                                <th>Email</th>
                                <th>Balance</th>
                            </tr>
                            </thead>
                            <tbody>
                            {(!this.props.till.debtors || this.props.till.debtors.length === 0) &&
                            <tr>
                                <td colSpan="6" className="text-center">There are no debtors to display!</td>
                            </tr>
                            }
                            {this.props.till.debtors && this.props.till.debtors.map((item, index) => {
                                return (
                                    <tr key={index} onClick={() => this.selectDebtor(item)}>
                                        <td>{item.no}</td>
                                        <td>{item.stype}</td>
                                        <td>{item.name}</td>
                                        <td>{item.cell}</td>
                                        <td>{item.email}</td>
                                        <td>{Number(item.balance).toFixed(2)}</td>
                                    </tr>
                                )
                            })
                            }
                            </tbody>
                        </Table>
                    </Form>
                    }
                    {this.state.new &&
                    <Form>
                        <p>Enter the details of the new debtor: </p>
                        <div className="form-group">
                            <label>Debtor Name: </label>
                            <input name="name" onChange={this.handleChange} value={this.state.debtor.name}
                                   className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Debtor Cell: </label>
                            <input name="cell" onChange={this.handleChange} value={this.state.debtor.cell}
                                   className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Debtor Email: </label>
                            <input name="email" onChange={this.handleChange} value={this.state.debtor.email}
                                   className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Debtor Type: </label>
                            <select onChange={this.handleChange} className="form-control" name="type">
                                <option value="Staff">Staff</option>
                                <option value="Credit">Credit</option>
                                <option value="DCS">Laybye Return</option>
                            </select>
                        </div>
                        <div className="text-center">
                            <Button variant="success" onClick={this.saveDebtor}>Save</Button>
                        </div>
                    </Form>
                    }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DebtorModal));
