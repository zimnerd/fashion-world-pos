import React from 'react';
import { Button, Card, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import $ from "jquery";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './CreditNoteOptionsModal.scss';

class CreditNoteOptionsModal extends React.Component {

    handleClose = () => {
        this.props.actions.modal.closeCredit();
    };

    activateExchange = async () => {
        await this.props.actions.till.setAuthCommand("exchange");
        await this.props.actions.modal.openAuthentication();
        await this.handleClose();
        $("#authUsername").focus();
    };

    refund = async () => {
        await this.props.actions.till.setAuthCommand("refund");
        await this.props.actions.modal.openAuthentication();
        await this.handleClose();
        $("#authUsername").focus();
    };

    laybyeRefund = async () => {
        await this.props.actions.till.activateLayBye();
        await this.props.actions.till.setAuthCommand("refund");
        await this.props.actions.modal.openAuthentication();
        await this.handleClose();
        $("#authUsername").focus();
    };

    render() {
        return (
            <Modal size="lg" show={this.props.modal.credit} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Credit Note Options</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex credit-note-options">
                    <div className="col-4">
                        <Card onClick={this.activateExchange} className="text-center warning">
                            <Card.Header>
                                <span><i className="fa fa-exchange"/></span>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>Exchange</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-4">
                        <Card onClick={this.refund} className="text-center danger">
                            <Card.Header>
                                <span><i className="fa fa-refresh"/></span>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>Refund</Card.Title>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="col-4">
                        <Card onClick={this.laybyeRefund} className="text-center success">
                            <Card.Header>
                                <span><i className="fa fa-refresh"/></span>
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>Laybye Refund</Card.Title>
                            </Card.Body>
                        </Card>
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
        modal: state.modal
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

export default connect(mapStateToProps, mapDispatchToProps)(CreditNoteOptionsModal);
