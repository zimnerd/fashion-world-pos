import React from 'react';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as settingsActions from "../../../redux/actions/settings.action";

import './InformationBar.scss';
import Alerts from "./Alerts";

class InformationBar extends React.Component {

    state = {
        key: 'combos'
    };

    render() {
        return (
            <aside className="info">
                {this.props.settings.haddith &&
                <section className="p-3 widget-shadow"
                      dangerouslySetInnerHTML={{ __html: this.props.settings.haddith.value }}>
                </section>
                }
                {this.props.settings.combos.length > 0 &&
                <section className="p-3 widget-shadow mt-3">
                    {this.props.settings.combos && this.props.settings.combos.length > 0 &&
                    <section>
                        <header>
                            <h6 className="text">Combos</h6>
                            <hr/>
                        </header>
                        <table className="table table-striped table-responsive">
                            <thead>
                            <tr>
                                <th/>
                                <th>Style</th>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Price</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.settings.combos.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}.</td>
                                        <td>{item.style}</td>
                                        <td>{item.description}</td>
                                        <td>{item.qty}</td>
                                        <td>{item.rp}</td>
                                    </tr>
                                )
                            })
                            }
                            </tbody>
                        </table>
                    </section>
                    }
                </section>
                }
                <Alerts/>
            </aside>
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
            settings: bindActionCreators(settingsActions, dispatch)
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InformationBar);
