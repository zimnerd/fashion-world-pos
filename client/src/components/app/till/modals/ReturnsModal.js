import React from 'react';
import { Button, Form, Modal } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";

import './ReturnsModal.scss';

class ReturnsModal extends React.Component {

    state = {
        name: "",
        cell: "",
        line1: "",
        line2: "",
        line3: "",
        code: "",
        email: "",
        idNumber: "",
        alternateNumber: ""
    };

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleClose = () => {
        this.props.actions.modal.closeReturns();
    };

    activateReturn = () => {
        this.props.actions.till.activateReturns({ returns: { customer: this.state } });
        this.handleClose();
    };

    render() {
        return (
            <Modal show={this.props.modal.returns} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Returns</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-group">
                            <label>Name:</label>
                            <input name="name" type="text" className="form-control"
                                   value={this.state.name} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Cell Number:</label>
                            <input name="cell" type="text" className="form-control" value={this.state.cell}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Address:</label>
                            <input name="line1" type="text" className="form-control"
                                   onChange={this.handleChange}
                                   value={this.state.line1}/>
                            <input name="line2" type="text" className="form-control"
                                   onChange={this.handleChange}
                                   value={this.state.line2}/>
                            <input name="line3" type="text" className="form-control"
                                   onChange={this.handleChange}
                                   value={this.state.line3}/>
                        </div>
                        <div className="form-group">
                            <label>Code:</label>
                            <input name="code" type="text" className="form-control" value={this.state.code}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Email Address:</label>
                            <input name="email" type="email" className="form-control" onChange={this.handleChange}
                                   value={this.state.email}/>
                        </div>
                        <div className="form-group">
                            <label>ID Number:</label>
                            <input name="idNumber" type="text" className="form-control" onChange={this.handleChange}
                                   value={this.state.idNumber}/>
                        </div>
                        <div className="form-group">
                            <label>Alternate Number:</label>
                            <input name="alternateNumber" type="text" className="form-control"
                                   onChange={this.handleChange}
                                   value={this.state.alternateNumber}/>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={this.activateReturn}>
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
        modal: state.modal
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

export default connect(mapStateToProps, mapDispatchToProps)(ReturnsModal);
