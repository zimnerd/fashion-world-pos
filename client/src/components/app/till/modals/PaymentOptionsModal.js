import React from 'react';
import { Button, Card, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";

import './PaymentOptionsModal.scss';

class PaymentOptionsModal extends React.Component {

    handleClose = () => {
        this.props.actions.closePayments();
    };

    render() {
        return (
            <Modal show={this.props.modal.payments} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Payment Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card>
                        <Card.Header>
                            <span><i className="fa fa-vcard-o"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Voucher</Card.Title>
                        </Card.Body>
                    </Card>
                    <hr/>
                    <Card>
                        <Card.Header>
                            <span><i className="fa fa-plus"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Split to Multiple Invoices</Card.Title>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header>
                            <span><i className="fa fa-money"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Split to Invoice Amount</Card.Title>
                        </Card.Body>
                    </Card>
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
        modal: state.modal
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(modalActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PaymentOptionsModal);
