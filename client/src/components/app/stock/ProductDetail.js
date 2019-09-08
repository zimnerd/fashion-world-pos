import React from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Table } from "react-bootstrap";
import axios from "axios";
import toastr from "toastr";

import * as stockActions from "../../../redux/actions/stock.action";

import Header from "../Header";

import './ProductDetail.scss';

class ProductDetail extends React.Component {

    componentDidMount() {
        const { match: { params } } = this.props;
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        axios.get(`/v1/products/${params.code}`, { headers })
            .then(response => {
                console.log(response.data);

                toastr.success("Product Retrieved!", "Retrieve Product");
                this.props.actions.retrieveProduct(response.data.product);
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    }

    render() {
        return (
            <article>
                <Header/>
                <section className="container widget widget-shadow stock-info">
                    {this.props.stock.product &&
                    <header className="text-center">
                        {this.props.stock.product.image &&
                        <img className="stock-img" src={"data:image/png;base64, " + this.props.stock.product.image} height="200" width="200"/>
                        }
                        <br/>
                        <h1>{this.props.stock.product.description}</h1>
                    </header>
                    }
                    <main className="mt-5">
                        <Table striped>
                            <thead>
                            <tr>
                                <th>Code</th>
                                <th>Colour</th>
                                <th>Size</th>
                                <th>Quantity on Hand</th>
                                <th>Unit Price</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.stock.product
                            && this.props.stock.product.info
                            && this.props.stock.product.info.length === 0
                            &&
                            <tr>
                                <td className="text-center" colSpan="6">There is no stock available!</td>
                            </tr>
                            }

                            {this.props.stock.product &&
                            this.props.stock.product.info.map((item, index) => {
                                let colour = this.props.stock.product.colours.find(colour => colour.code === item.CLR);
                                let price = this.props.stock.product.prices.find(price => price.sizes === item.SIZES);

                                if (typeof price === "undefined") {
                                    let values = [];
                                    let size = item.SIZES;
                                    for (let item of this.props.stock.product.items) {
                                        let price = Number(item.sp);
                                        let value = (
                                            <tr key={index}>
                                                <td>{`${item.code} ${item.serialno}`}</td>
                                                <td>{`${colour.colour}`}</td>
                                                <td>{`${size}`}</td>
                                                <td>1.00</td>
                                                <td>{`${price.toFixed(2)}`}</td>
                                                <td/>
                                            </tr>
                                        );

                                        values.push(value);
                                    }

                                    if (values.length === 0) {
                                        let value = (
                                            <tr key={index}>
                                                <td className="text-center" colSpan="6">There is no stock available!</td>
                                            </tr>
                                        );

                                        values.push(value);
                                    }

                                    return values;
                                }

                                let markdown = price.mdp > 0;
                                let priceValue = markdown ? price.mdp : price.rp;
                                return (
                                    <tr key={index}>
                                        <td>{`${item.STYLE} ${item.SIZES} ${item.CLR}`}</td>
                                        <td>{`${colour.colour}`}</td>
                                        <td>{`${item.SIZES}`}</td>
                                        <td>{`${item.QOH}`}</td>
                                        <td>{`${priceValue}`}</td>
                                        <td>{markdown && <span className="badge badge-danger">Markdown</span>}</td>
                                    </tr>
                                )
                            })
                            }
                            </tbody>
                        </Table>
                    </main>
                </section>
            </article>
        )
    }

}

function mapStateToProps(state) {
    return {
        auth: state.auth,
        stock: state.stock
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(stockActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
