import React from 'react';
import { Button, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";

import './TransactionId.scss';

class TransactionId extends React.Component {

    handleClose = () => {
        this.props.actions.closeTransaction();
    };

    render() {
        return (
            <Modal show={this.props.modal.transaction} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Held Transaction Number</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center">To retrieve this transaction, please use the following
                        number:
                    </p>
                    {this.props.till &&
                    <h4 className="text-center">{this.props.till.held}</h4>
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
        till: state.till
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(modalActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(TransactionId);
