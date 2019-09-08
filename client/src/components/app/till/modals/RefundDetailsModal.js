import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import $ from "jquery";

import * as authActions from "../../../../redux/actions/auth.action";
import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './RefundDetailsModal.scss';

class RefundDetailsModal extends React.Component {

    state = {
        brNo: "",
        invNo: "",
        invType: "",
        invDate: "",
        idNo: "",
        cell: "",
        email: "",
        updated: false
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleClose = () => {
        this.setState({
            brNo: "",
            invNo: "",
            invDate: "",
            invType: "",
            idNo: "",
            cell: "",
            email: "",
            updated: false
        });
        this.props.actions.modal.closeRefundDetails();
        this.props.actions.till.deactivateLayBye();
        this.props.actions.till.setRefund();
    };

    invalidateForm = () => {
        let errors = {};
        if (this.state.invNo === "" || this.state.invNo == null) {
            errors.invNo = "The invoice number is required."
        }

        if ((!this.props.till.refundData.invType && this.state.invType === "")
            || (!this.props.till.refundData.invType && this.state.invType == null)) {
            errors.invType = "The invoice type is required."
        }

        if (this.state.invDate === "" || this.state.invDate == null) {
            errors.invDate = "The invoice date is required."
        }

        if (this.state.cell === "" || this.state.cell == null) {
            errors.cell = "The cell number is required."
        } else if (this.state.cell && this.state.cell.length !== 10) {
            errors.cell = "The cell number needs to be 10 digits."
        }

        if (this.state.idNo === "" || this.state.idNo == null) {
            errors.idNo = "The ID number is required."
        }

        if (this.state.brNo === "" || this.state.brNo == null) {
            errors.brNo = "The branch number is required."
        }

        let keys = Object.keys(errors);
        if (keys.length > 0) {
            this.props.actions.auth.validationError(errors);
            return true;
        }

        return false;
    };

    handleContinue = async () => {
        await this.props.actions.auth.errorReset();
        if (this.invalidateForm()) {
            return;
        }

        let refund = {
            invNo: this.state.invNo,
            invDate: this.state.invDate,
            invType: this.props.till.refundData.invType ? this.props.till.refundData.invType : this.state.invType,
            idNo: this.state.idNo,
            cell: this.state.cell,
            email: this.state.email,
            found: this.state.found,
            brNo: this.props.till.refundData.brNo ? this.props.till.refundData.brNo : this.state.brNo,
            notFound: this.props.till.refundData.notFound
        };
        await this.props.actions.modal.closeRefundDetails();
        this.props.actions.till.setRefund(refund);
        this.props.actions.till.activateRefund();
        this.setState({
            brNo: "",
            invNo: "",
            invDate: "",
            invType: "",
            idNo: "",
            cell: "",
            email: "",
            updated: false
        });
    };

    componentDidUpdate(): void {
        if (this.props.till.refundData && !this.state.updated && this.props.modal.refundDetails) {
            this.setState({
                invNo: this.props.till.refundData.invNo,
                invDate: this.props.till.refundData.invDate,
                idNo: this.props.till.refundData.idNo,
                cell: this.props.till.refundData.cell,
                email: this.props.till.refundData.email,
                brNo: this.props.till.refundData.brNo,
                found: this.props.till.refundData.found,
                updated: true
            });
        }
    }

    keyDown = e => {
        let event = window.event ? window.event : e;
        if (event.keyCode === 13) { //enter

            e.preventDefault();
            let invNoField = $('#refundDetailsInvNo');
            let brNoField = $('#refundDetailsBrNo');
            let cellField = $('#refundDetailsCell');
            let emailField = $('#refundDetailsEmail');
            let idNoField = $('#refundDetailsIdNo');
            let dateField = $('#refundDetailsDate');
            let button = $('#refundDetailsBtn');

            if (brNoField == null) {
                if (invNoField.is(':focus')) {
                    emailField.focus();
                    return true;
                }
            } else if (invNoField.is(':focus')) {
                brNoField.focus();
                return true;
            }

            if (brNoField.is(':focus')) {
                emailField.focus();
                return true;
            }

            if (emailField.is(':focus')) {
                dateField.focus();
                return true;
            }

            if (dateField.is(':focus')) {
                idNoField.focus();
                return true;
            }

            if (idNoField.is(':focus')) {
                cellField.focus();
                return true;
            }

            if (cellField.is(':focus')) {
                button.focus();
                return true;
            }

            invNoField.focus();
            return true;
        }

        return false;
    };

    render() {
        return (
            <Modal show={this.props.modal.refundDetails} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Refund Details</Modal.Title>
                </Modal.Header>
                <Modal.Body onKeyDown={this.keyDown}>
                    <p>Enter the details of the invoice to refund:</p>
                    <Form className="d-flex">
                        <div className="col-6">
                            <div className="form-group">
                                <label>Invoice Number:</label>
                                <input name="invNo" type="text" className="form-control" required
                                       id="refundDetailsInvNo"
                                       value={this.state.invNo} onChange={this.handleChange}/>
                                {this.props.auth.errors['invNo'] &&
                                <p className="error">{this.props.auth.errors['invNo']}</p>}
                            </div>
                            {this.props.till && this.props.till.refundData && !this.props.till.refundData.invType &&
                            <div className="form-group">
                                <label>Invoice Type:</label>
                                <select onChange={this.handleChange} className="form-control" name="invType" required>
                                    <option disabled selected>Select a type</option>
                                    <option value="INV">INV</option>
                                    <option value="L/B">L/B</option>
                                </select>
                                {this.props.auth.errors['invType'] &&
                                <p className="error">{this.props.auth.errors['invType']}</p>}
                            </div>
                            }
                            {this.props.till && this.props.till.refundData && !this.props.till.refundData.brNo &&
                            <div className="form-group">
                                <label>Branch Number:</label>
                                <select onChange={this.handleChange} className="form-control" name="brNo" required>
                                    <option disabled selected>Select a branch</option>
                                    {this.props.settings.codes && this.props.settings.codes.map(item => {
                                            return (
                                                <option value={item.code}>{item.code}</option>
                                            )
                                        }
                                    )}
                                </select>
                                {this.props.auth.errors['brNo'] &&
                                <p className="error">{this.props.auth.errors['brNo']}</p>}
                            </div>
                            }
                            <div className="form-group">
                                <label>Email Address:</label>
                                <input name="email" type="email" className="form-control" id="refundDetailsEmail"
                                       value={this.state.email} onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="form-group">
                                <label>Invoice Date:</label>
                                <input name="invDate" type="date" className="form-control" required
                                       id="refundDetailsDate"
                                       value={this.state.invDate} onChange={this.handleChange}/>
                                {this.props.auth.errors['invDate'] &&
                                <p className="error">{this.props.auth.errors['invDate']}</p>}
                            </div>
                            <div className="form-group">
                                <label>ID Number:</label>
                                <input name="idNo" type="text" className="form-control" required id="refundDetailsIdNo"
                                       value={this.state.idNo} onChange={this.handleChange}/>
                                {this.props.auth.errors['idNo'] &&
                                <p className="error">{this.props.auth.errors['idNo']}</p>}
                            </div>
                            <div className="form-group">
                                <label>Cell Number:</label>
                                <input name="cell" type="text" className="form-control" required id="refundDetailsCell"
                                       value={this.state.cell} onChange={this.handleChange}/>
                                {this.props.auth.errors['cell'] &&
                                <p className="error">{this.props.auth.errors['cell']}</p>}
                            </div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.handleContinue} id="refundDetailsBtn">
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
        settings: state.settings,
        till: state.till
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            auth: bindActionCreators(authActions, dispatch),
            till: bindActionCreators(tillActions, dispatch),
            modal: bindActionCreators(modalActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RefundDetailsModal);
