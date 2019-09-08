import React from 'react';
import { connect } from "react-redux";
import { DropdownButton, DropdownItem, Form, FormControl, InputGroup, Table } from "react-bootstrap";
import ReactPaginate from 'react-paginate';
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import axios from "axios";
import toastr from "toastr";

import * as stockActions from "../../../redux/actions/stock.action";

import './StockInformation.scss';
import Header from "../Header";

class StockInformation extends React.Component {

    state = {
        limit: 5,
        search: undefined,
        page: undefined,
        items: [],
        toasted: false
    };

    componentDidMount() {
        this.retrieveProducts();
    }

    retrieveProducts = () => {
        const headers = {
            'Authorization': 'Bearer ' + this.props.auth.token
        };

        const params = {
            limit: this.state.limit,
            search: this.state.search,
            page: this.state.page
        };

        axios.get("/v1/products", { headers, params })
            .then(response => {
                console.log(response.data);
                if (!this.state.toasted) {
                    toastr.success("Products Retrieved!", "Retrieve Products");
                    this.setState({ toasted: true })
                }

                this.props.actions.retrieveProducts(response.data.products);
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 401) {
                    toastr.error("You are unauthorized to make this request.", "Unauthorized");
                } else {
                    toastr.error("Unknown error.");
                }
            });
    };

    setLimit = (limit) => {
        this.setState({ limit: limit }, this.retrieveProducts);
    };

    handleChange = event => {
        this.setState({ search: event.target.value }, this.retrieveProducts);
    };

    handlePageClick = data => {
        this.setState({ page: data.selected }, this.retrieveProducts);
    };

    render() {
        return (
            <article>
                <Header/>
                <section className="container widget widget-shadow stocks">
                    <header className="container text-center">
                        <h1>Stock Information</h1>
                        <hr/>
                    </header>
                    <main>
                        <Form>
                            <div className="d-flex">
                                <InputGroup className="m-3">
                                    <InputGroup.Prepend onClick={this.retrieveProducts}>
                                        <InputGroup.Text id="search-addon"><span><i
                                            className="fa fa-search"/></span></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <FormControl
                                        placeholder="Search for a product"
                                        aria-describedby="search-addon"
                                        value={this.state.search}
                                        onChange={this.handleChange}
                                    />
                                </InputGroup>
                                <DropdownButton id="limit" variant="primary" title={this.state.limit} className="m-3">
                                    <DropdownItem onClick={() => this.setLimit(5)}>5</DropdownItem>
                                    <DropdownItem onClick={() => this.setLimit(10)}>10</DropdownItem>
                                    <DropdownItem onClick={() => this.setLimit(15)}>15</DropdownItem>
                                </DropdownButton>
                            </div>
                            <Table striped hover>
                                <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Description</th>
                                    <th/>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    this.props.stock.page && this.props.stock.page.data.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item.code}</td>
                                                <td>{item.descr}</td>
                                                <td>
                                                    <Link to={'stock/' + item.code} className="btn btn-success">
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </Table>
                            <div className="paging">
                                {
                                    this.props.stock.page &&
                                    <ReactPaginate
                                        previousLabel={'previous'}
                                        nextLabel={'next'}
                                        breakLabel={'...'}
                                        pageCount={this.props.stock.page.last_page}
                                        onPageChange={this.handlePageClick}
                                        breakClassName={'break-me'}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={5}
                                        containerClassName={'pagination'}
                                        subContainerClassName={'pages pagination'}
                                        activeClassName={'active'}
                                    />
                                }
                            </div>
                        </Form>
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

export default connect(mapStateToProps, mapDispatchToProps)(StockInformation);
