import React from 'react';
import { Button, Modal, Table } from "react-bootstrap";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import $ from "jquery";

import * as modalActions from "../../../../redux/actions/modal.action";
import * as tillActions from "../../../../redux/actions/till.action";
import * as stockActions from "../../../../redux/actions/stock.action";

import './ProductStyleModal.scss';
import toastr from "toastr";

class ProductStyleModal extends React.Component {

    handleClose = () => {
        this.props.actions.modal.closeProductStyles();
    };

    componentDidUpdate(): void {
        $("tr[tabindex=0]").focus();
    }

    selectProduct = (product) => {
        let transactions = this.props.till.transactions;
        if (typeof transactions === "undefined") {
            transactions = [];
        }

        if (typeof product.serialCode !== "undefined") {
            let codes = product.serialCode.split(" ");
            if (codes.length === 2) {
                product.code = codes[0];
                product.serialno = codes[1];
            }
        }

        if (typeof product.serialno !== "undefined" && this.props.till.laybye) {
            toastr.error("You are unable to have handsets/airtime in a Lay-Bye sale.", "Invalid Selection");
            this.handleClose();
            return;
        }

        transactions.unshift(product);
        this.props.actions.till.setTransactions(transactions);
        this.handleClose();
        this.props.mapLineItem(product);
        this.props.mapTransactions();
        this.props.retrieveCombo(product.code);
    };

    keyDown = e => {
        let event = window.event ? window.event : e;
        let idx = $("tr:focus").attr("tabindex");
        if (event.keyCode === 40) { //down
            idx++;
            if (idx > this.props.stock.product.info.length - 1) {
                idx = 0;
            }
            $("tr[tabindex=" + idx + "]").focus();
        }
        if (event.keyCode === 38) { //up
            idx--;
            if (idx < 0) {
                idx = this.props.stock.product.info.length - 1;
            }
            $("tr[tabindex=" + idx + "]").focus();
        }

        if (event.keyCode === 13) { //enter
            let items = this.props.stock.product.info.filter(item => Number(item.QOH) > 0);
            let item = items[idx];

            let colour = this.props.stock.product.colours.find(colour => colour.code === item.CLR);
            let price = this.props.stock.product.prices.find(price => price.sizes === item.SIZES);

            if (typeof price === "undefined") {
                let size = item.SIZES;
                let price = Number(item.sp);

                if (isNaN(price)) {
                    item = this.props.stock.product.items[idx];
                    price = Number(item.sp);
                }

                const product = {
                    description: this.props.stock.product.description,
                    code: `${item.code}`,
                    serialCode: `${item.code} ${item.serialno}`,
                    colour: colour.colour,
                    clrcode: colour.code,
                    size: size,
                    qoh: 1.00,
                    disc: 0.00,
                    cost: item.cp,
                    staff: item.sp,
                    retail: item.sp,
                    qty: 1
                };

                product.subtotal = price * product.qty;
                product.total = product.disc > 0 ? product.subtotal * product.disc / 100 : product.subtotal;
                this.selectProduct(product);
            } else {
                let markdown = price.mdp > 0;
                const disc = markdown ? price.mdp / price.rp * 100 : 0;

                const product = {
                    code: `${item.STYLE}`,
                    description: this.props.stock.product.description,
                    size: item.SIZES,
                    colour: colour.colour,
                    clrcode: colour.code,
                    price: Number(price.rp),
                    mdp: price.mdp,
                    markdown: markdown,
                    qty: 1,
                    qoh: item.QOH,
                    disc: disc.toFixed(2),
                    cost: price.sp,
                    staff: price.stfp,
                    retail: price.rp
                };

                product.subtotal = product.price * product.qty;
                product.total = product.disc > 0 ? product.subtotal * product.disc / 100 : product.subtotal;
                this.selectProduct(product);
            }

        }
    };

    render() {
        return (
            <Modal show={this.props.modal.styles} onHide={this.handleClose}
                   size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Product Styles Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped hover>
                        <thead>
                        <tr>
                            <th>Code</th>
                            {this.props.stock.product && this.props.stock.product.serial &&
                            <th>Serial No.</th>
                            }
                            <th>Colour</th>
                            <th>Size</th>
                            <th>Quantity on Hand</th>
                            <th>Unit Price</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody onKeyDown={this.keyDown}>
                        {this.props.stock.product &&
                        this.props.stock.product.info.map((item, index) => {
                            let colour = this.props.stock.product.colours.find(colour => colour.code === item.CLR);
                            let price = this.props.stock.product.prices.find(price => price.sizes === item.SIZES);

                            if (typeof price === "undefined") {
                                let values = [];
                                let size = item.SIZES;
                                let indexVal = 0;
                                for (let item of this.props.stock.product.items) {
                                    if (item === null) {
                                        continue;
                                    }

                                    let price = Number(item.sp);

                                    const product = {
                                        description: this.props.stock.product.description,
                                        code: `${item.code}`,
                                        serialCode: `${item.code} ${item.serialno}`,
                                        colour: colour.colour,
                                        clrcode: colour.code,
                                        size: size,
                                        qoh: this.props.stock.product.info[0].QOH,
                                        disc: 0.00,
                                        cost: item.cp,
                                        staff: item.sp,
                                        retail: item.sp,
                                        qty: 1
                                    };

                                    product.subtotal = price * product.qty;
                                    product.total = product.disc > 0 ? product.subtotal * product.disc / 100 : product.subtotal;

                                    let value = (
                                        <tr id={"row-" + indexVal} tabIndex={indexVal}
                                            onClick={() => this.selectProduct(product)} key={indexVal}>
                                            <td>{product.code}</td>
                                            <td>{product.colour}</td>
                                            <td>{product.size}</td>
                                            <td>{product.qoh}</td>
                                            <td>{product.total.toFixed(2)}</td>
                                            <td/>
                                        </tr>
                                    );

                                    if (this.props.stock.product.serial) {
                                        value = (
                                            <tr id={"row-" + indexVal} tabIndex={indexVal}
                                                onClick={() => this.selectProduct(product)} key={indexVal}>
                                                <td>{product.code}</td>
                                                <td>{item.serialno}</td>
                                                <td>{product.colour}</td>
                                                <td>{product.size}</td>
                                                <td>{product.qoh}</td>
                                                <td>{product.total.toFixed(2)}</td>
                                                <td/>
                                            </tr>
                                        );
                                    }

                                    values.push(value);
                                    indexVal++;
                                }

                                if (values.length === 0) {
                                    return (
                                        <tr>
                                            <td colspan="6" className="text-center">There are no products available!</td>
                                        </tr>
                                    );
                                }

                                return values;
                            }

                            let markdown = price.mdp > 0;
                            const disc = markdown ? price.mdp / price.rp * 100 : 0;

                            if (Number(item.QOH) > 0) {
                                const product = {
                                    code: `${item.STYLE}`,
                                    description: this.props.stock.product.description,
                                    size: item.SIZES,
                                    colour: colour.colour,
                                    clrcode: colour.code,
                                    price: Number(price.rp),
                                    mdp: price.mdp,
                                    markdown: markdown,
                                    qty: 1,
                                    qoh: item.QOH,
                                    disc: disc.toFixed(2),
                                    cost: price.sp,
                                    staff: price.stfp,
                                    retail: price.rp
                                };

                                product.subtotal = product.price * product.qty;
                                product.total = product.disc > 0 ? product.subtotal * product.disc / 100 : product.subtotal;

                                return (
                                    <tr id={"row-" + index} tabIndex={index} onClick={() => this.selectProduct(product)}
                                        key={index}>
                                        <td>{product.code}</td>
                                        <td>{product.colour}</td>
                                        <td>{product.size}</td>
                                        <td>{product.qoh}</td>
                                        <td>{product.total.toFixed(2)}</td>
                                        <td>{markdown && <span className="badge badge-danger">Markdown</span>}</td>
                                    </tr>
                                )
                            }
                        })
                        }
                        </tbody>
                    </Table>
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
        stock: state.stock,
        auth: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            modal: bindActionCreators(modalActions, dispatch),
            till: bindActionCreators(tillActions, dispatch),
            stock: bindActionCreators(stockActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductStyleModal);
