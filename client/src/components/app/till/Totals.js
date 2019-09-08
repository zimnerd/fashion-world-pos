import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import axios from "axios";
import toastr from "toastr";

import * as tillActions from "../../../redux/actions/till.action";
import * as modalActions from "../../../redux/actions/modal.action";

import './Totals.scss';

class Totals extends React.Component {

    completeRefund = () => {
        this.props.actions.modal.openReasonModal();

        if (this.props.till.laybye) {
            const headers = {
                'Authorization': 'Bearer ' + this.props.auth.token
            };

            axios.get(`/v1/laybyes/${this.props.till.refundData.invNo}/transactions`, { headers })
                .then(response => {
                    console.log(response.data);
                    toastr.success("Refund amount found!", "Find Refund Amount");

                    let total = 0;
                    for (let item of response.data.transactions) {
                        total += Number(item.invAmt);
                    }

                    this.props.till.refundData.depAmt = total;
                    this.props.actions.till.setRefund(this.props.till.refundData);
                })
                .catch(error => {
                    console.log(error);
                    if (error.response.status === 401) {
                        toastr.error("You are unauthorized to make this request.", "Unauthorized");
                    } else if (error.response.status === 404) {
                        toastr.error("Refund amount not found!", "Find Refund Amount");
                    } else {
                        toastr.error("Unknown error.");
                    }
                });
        }
    };

    completeExchange = () => {
        this.props.actions.modal.openCompleteExchange();
    };

    completeCredit = () => {
        this.props.actions.modal.openDebtorModal();
    };

    render() {
        return (
            <aside className="totals">
                <main className="widget-shadow">
                {this.props.till.totals &&
                    <div>
                        <label className="d-flex total">Items: <span className="value">{this.props.till.totals.items}</span></label>
                        <label className="d-flex total">Subtotal: <span className="value">{(this.props.till.totals.subtotal).toFixed(2)}</span></label>
                        <label className="d-flex total">Discount: <span className="value">{(this.props.till.totals.discount).toFixed(2)}</span></label>
                        <label className="d-flex total">Tax Total: <span className="value">{(this.props.till.totals.vat).toFixed(2)}</span></label>

                        <h3 className="sale-total">{(this.props.till.totals.total).toFixed(2)}</h3>
                    </div>
                }
                {!this.props.till.refund &&
                !this.props.till.exchange &&
                !this.props.till.credit &&
                <footer>
                    <button className="btn btn-success" onClick={() => this.props.openModal({ keyCode: 114 })}>Cash/Card
                        (F3)
                    </button>
                </footer>
                }
                {!this.props.till.exchange &&
                !this.props.till.credit &&
                this.props.till.refund &&
                <footer>
                    <button className="btn btn-primary" onClick={this.completeRefund}>
                        Complete Refund
                    </button>
                </footer>
                }
                {!this.props.till.refund &&
                !this.props.till.credit &&
                this.props.till.exchange &&
                <footer>
                    <button className="btn btn-primary" onClick={this.completeExchange}>
                        Complete Exchange
                    </button>
                </footer>
                }
                {!this.props.till.refund &&
                !this.props.till.exchange &&
                this.props.till.credit &&
                <footer>
                    <button className="btn btn-primary" onClick={this.completeCredit}>
                        Complete Credit Sale
                    </button>
                </footer>
                }
                </main>
            </aside>
        )
    }

}

function mapStateToProps(state) {
    return {
        till: state.till,
        auth: state.auth
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

export default connect(mapStateToProps, mapDispatchToProps)(Totals);
