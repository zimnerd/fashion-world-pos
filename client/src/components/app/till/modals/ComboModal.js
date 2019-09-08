import React from 'react';
import { Button, Modal, Table } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";

import './ComboModal.scss';

class ComboModal extends React.Component {

    handleClose = () => {
        this.props.actions.closeCombo();
    };

    render() {
        return (
            <Modal show={this.props.modal.combo} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Combo Match</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>The following combo has been found with the item that has been scanned: </p>
                    <br/>
                    <Table>
                        <thead>
                        <tr>
                            <th>Code</th>
                            <th>Style</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.till.combos && this.props.till.combos.map((item, index) => {
                            return (<tr key={index}>
                                <td>{item.code}</td>
                                <td>{item.style}</td>
                                <td>{item.description}</td>
                                <td>{item.qty}</td>
                                <td>{item.rp}</td>
                            </tr>)
                        })
                        }
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ComboModal);
