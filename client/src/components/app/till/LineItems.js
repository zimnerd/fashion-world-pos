import React from 'react';
import { bindActionCreators } from "redux";
import { Badge, Button } from "react-bootstrap";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as tillActions from "../../../redux/actions/till.action";
import * as modalActions from "../../../redux/actions/modal.action";
import * as stockActions from "../../../redux/actions/stock.action";

import './LineItems.scss';

class LineItems extends React.Component {

    state = {
        allHeld: false
    };

    enterProduct = async event => {
        event.preventDefault();
        let code = this.props.till.code.trim();
        if (code === "") {
            return;
        }

        let codeParts = code.split(" ");
        if (codeParts.length === 0 || codeParts.length > 3) {
            await this.props.actions.till.setCode("Invalid Product Code");
        } else if (codeParts.length === 1) {
            this.props.openStyles(codeParts[0]);
        } else if (codeParts.length === 2) {
            this.retrieveProductWithSerial(codeParts);
        } else if (codeParts.length === 3) {
            this.retrieveProductWithCode(codeParts);
        }
    };

    handleChange = async event => {
        await this.props.actions.till.setCode(event.target.value);
    };

    retrieveProductWithSerial = codeParts => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/products/${codeParts[0]}/${codeParts[1]}`, { headers })
            .then(async response => {
                console.log(response.data);

                toastr.success("Product Retrieved!", "Retrieve Product");

                const product = response.data.product;
                await this.props.createTransaction(product);
                await this.props.mapTransactions();
                await this.props.retrieveCombo(product.code);
                await this.props.actions.till.setCode();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error(error.response.data.error, "Retrieve Product");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    retrieveProductWithCode = codeParts => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/products/${codeParts[0]}/${codeParts[1]}/${codeParts[2]}`, { headers })
            .then(async response => {
                console.log(response.data);

                toastr.success("Product Retrieved!", "Retrieve Product");

                const product = response.data.product;
                await this.props.createTransaction(product);
                await this.props.mapTransactions();
                await this.props.retrieveCombo(product.code);
                await this.props.actions.till.setCode();
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else if (error.response.status === 404) {
                    toastr.error(error.response.data.error, "Retrieve Product");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    reset = async () => {
        await this.props.actions.till.setCode();
    };

    holdItem = async (index) => {
        let transactions = this.props.till.transactions;
        let item = transactions[index];

        if (item.serialno) {
            toastr.error("You cannot hold airtime/handsets!", "Validation");
            return;
        }

        item.hold = !item.hold;

        await this.props.actions.till.setTransactions(transactions);
        this.props.mapTransactions();

        let newCombos = [];
        for (let transaction of this.props.till.transactions) {
            let comboMatch = this.props.till.combos.find(combo => combo.style === transaction.code);
            if (comboMatch) {
                newCombos.push(comboMatch);
            }
        }

        this.props.actions.till.setCombos(newCombos);
    };

    removeItem = async (index) => {
        let transactions = this.props.till.transactions;
        transactions.splice(index, 1);
        await this.props.mapTransactions();
        this.props.actions.till.setTransactions(transactions);

        let newCombos = [];
        for (let transaction of this.props.till.transactions) {
            let comboMatch = this.props.till.combos.find(combo => combo.style === transaction.code);
            if (comboMatch) {
                newCombos.push(comboMatch);
            }
        }

        this.props.actions.till.setCombos(newCombos);

        if (transactions.length === 0) {
            this.props.actions.till.resetTotals();
            this.props.actions.till.resetTransactions();
            this.props.actions.till.deactivateRefund();
            this.props.actions.till.setRefund();
        }
    };

    componentDidMount() {
        this.codeInput.focus();
    };

    handlePriceChange = async (event, index) => {
        let item = this.props.till.transactions[index];
        item.price = event.target.value;
        item.disc = 0;
        item.subtotal = item.price;
        item.total = item.price;
        item.retail = item.price;
        item.mdp = item.price;
        item.markdown = false;

        await this.props.actions.till.setTransactions(this.props.till.transactions);

        let totals = {
            total: 0,
            subtotal: 0,
            vat: 0,
            discount: 0,
            items: 0
        };
        for (let transaction of this.props.till.transactions) {
            totals = await this.props.mapHeldItem(transaction, totals);
        }

        this.props.actions.till.setTotals(totals);
    };

    render() {
        return (
            <section className="col-6 line-items widget-shadow">
                <form className="d-flex">
                    <input ref={(input) => {
                        this.codeInput = input;
                    }} id="product-code-line"
                           onChange={this.handleChange} type="text" onFocus={this.reset}
                           placeholder="Press (f2) to focus" className="form-control" value={this.props.till.code}/>
                    <button className="btn btn-primary" onClick={this.enterProduct}>Enter</button>
                </form>
                <table className="table table-striped table-responsive">
                    <thead>
                    <tr>
                        <th>Code</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Disc. %</th>
                        <th>Total</th>
                        <th colSpan="2"/>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.till.transactions &&
                    this.props.till.transactions.length === 0 &&
                    <tr>
                        <td colSpan="9" className="text-center">No line items added!</td>
                    </tr>
                    }
                    {
                        this.props.till && this.props.till.transactions.map((item, index) =>
                            <tr key={index}>
                                <td>{item.code}</td>
                                <td className="description">
                                    <span>{item.description}</span>
                                    <div className="d-flex">
                                        <small>{item.size + ", " + item.colour}</small>
                                        {item.markdown &&
                                        <span className="badge badge-danger">Markdown</span>
                                        }
                                        {item.combo &&
                                        <span className="badge badge-info">Combo</span>
                                        }
                                    </div>
                                </td>
                                {this.props.till.refundData && this.props.till.refundData.notFound &&
                                <td className="input-change"><input onChange={e => this.handlePriceChange(e, index)}
                                                                 value={item.price}/></td>
                                }
                                {this.props.till.notFound &&
                                <td className="input-change"><input onChange={e => this.handlePriceChange(e, index)}
                                                                    value={item.price}/></td>
                                }
                                {this.props.till.refundData && !this.props.till.refundData.notFound &&
                                <td>{item.price}</td>
                                }
                                {!this.props.till.refundData &&
                                <td>{item.price}</td>
                                }
                                <td><span>{item.disc}</span></td>
                                <td>{Number(item.total).toFixed(2)}</td>
                                <td>
                                    {!item.hold &&
                                    <span onClick={() => this.holdItem(index)}><i className="fa fa-hand-stop-o"/></span>
                                    }
                                    {item.hold &&
                                    <Badge variant="warning">
                                        Hold
                                        <span onClick={() => this.holdItem(index)}><i className="fa fa-times"/></span>
                                    </Badge>
                                    }
                                </td>
                                <td><span onClick={() => this.removeItem(index)}><i className="fa fa-trash"/></span>
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>
            </section>
        )
    }

}

function mapStateToProps(state) {
    return {
        till: state.till,
        auth: state.auth,
        settings: state.settings
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

export default connect(mapStateToProps, mapDispatchToProps)(LineItems);
