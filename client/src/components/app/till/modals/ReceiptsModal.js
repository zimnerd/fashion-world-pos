import React from 'react';
import { Button, Card, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import * as modalActions from "../../../../redux/actions/modal.action";

import './ReceiptsModal.scss';

class ReceiptsModal extends React.Component {

    openDebtor = () => {
        this.props.actions.closeReceiptsModal();
        this.props.actions.openDebtorReceipts();
    };

    handleClose = () => {
        this.props.actions.closeReceiptsModal();
    };

    render() {
        return (
            <Modal show={this.props.modal.receipts} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Receipt Options</Modal.Title>
                </Modal.Header>
                <Modal.Body className="receipts-modal">
                    <Card onClick={this.openDebtor} className="text-center success">
                        <Card.Header>
                            <span><i className="fa fa-money"/></span>
                        </Card.Header>
                        <Card.Body>
                            <Card.Title>Receipts</Card.Title>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReceiptsModal));
