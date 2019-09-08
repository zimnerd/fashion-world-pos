import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import $ from "jquery";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './TransactionCompleteModal.scss';

class TransactionCompleteModal extends React.Component {

    handleClose = () => {
        this.props.actions.modal.closeTransactionComplete();
        this.props.actions.till.setCompletedTransaction();
        $('#product-code-line').focus();
    };

    printReceipt = () => {
        let a = document.createElement('a');
        a.href = `http://localhost:8000/api/v1/transactions/${this.props.till.completedTransaction.number}/print`;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    render() {
        return (
            <Modal show={this.props.modal.transactionComplete} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Transaction Successfully Completed</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The transaction was successfully completed, here is the document type and number:</p>
                    <div className="text-center">
                        <h4>{this.props.till.completedTransaction &&
                        this.props.till.completedTransaction.type}</h4>
                        <h4>{this.props.till.completedTransaction
                        && this.props.till.completedTransaction.number}</h4>
                    </div>
                    <div className="text-center">
                        <p>Would you like to reprint the receipt?</p>
                        <Button variant="primary" onClick={this.printReceipt}>
                            Reprint
                        </Button>
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
        till: state.till
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

export default connect(mapStateToProps, mapDispatchToProps)(TransactionCompleteModal);
