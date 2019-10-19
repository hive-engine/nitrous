import React, { Component } from 'react';
import tt from 'counterpart';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';

import Icon from 'app/components/elements/Icon';

import { LIQUID_TOKEN_UPPERCASE } from 'app/client_config';

const ShowPriceToken = props => {
    return (
        <li className="c-sidebar__list-item">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <div>{props.symbol}</div>
                <div>
                    <span>{props.price_steem.toFixed(3) + ' STEEM'}</span>
                </div>
            </div>
        </li>
    );
};

export default class SidebarSwap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.amountChange = this.amountChange.bind(this);
    }

    componentDidMount() {}

    amountChange(e) {
        const amount = e.target.value;
        console.log('-- PromotePost.amountChange -->', amount);
        this.setState({ amount });
    }

    onSubmit(e) {
        console.log(e);
    }

    render() {
        const { amount, loading, amountError, trxError } = this.state;

        const { sct_to_steemp, steem_to_dollor, steem_to_krw } = this.props;
        const styleToken = { color: 'rgb(0, 120, 167)' };
        const krwp_to_steem =
            sct_to_steemp * 1000.0 / (sct_to_steemp * steem_to_krw);
        const krwp_to_sct = formatDecimal(
            1000.0 / (sct_to_steemp * steem_to_krw)
        );
        const steem_price = formatDecimal(steem_to_dollor);
        const sct_price = formatDecimal(sct_to_steemp * steem_to_dollor);
        const sct_price_with_krw = formatDecimal(sct_to_steemp * steem_to_krw);
        const locale = tt.getLocale();

        return (
            <div className="c-sidebar__module">
                <div className="c-sidebar__header" style={styleToken}>
                    <h3 className="c-sidebar__h3">Token Swap</h3>
                </div>
                <div className="c-sidebar__content">
                    <div className="swap-form">
                        <div className="swap-input">
                            <div
                                className="input-group"
                                style={{ marginBottom: 0 }}
                            >
                                <input
                                    className="input-group-field"
                                    type="text"
                                    placeholder={tt('g.amount')}
                                    value={amount}
                                    ref="amount"
                                    autoComplete="off"
                                    onChange={this.amountChange}
                                />
                                <div className="pd-0 bg-x">
                                    <select>
                                        <option>
                                            {LIQUID_TOKEN_UPPERCASE}
                                        </option>
                                        <option>{'STEEM'}</option>
                                    </select>
                                </div>
                                <div className="error">{amountError}</div>
                            </div>
                            <div className="text-center">
                                {/* <Icon name="dropdown-arrow" /> */}
                                <span
                                    className="articles__icon-100"
                                    title={'수수료는 1%입니다.'}
                                >
                                    <Icon name="dropdown-arrow" />
                                </span>

                                {/* {'▼'} */}
                            </div>
                            <div className="input-group">
                                <input
                                    className="input-group-field"
                                    type="text"
                                    placeholder={tt('g.amount')}
                                    value={amount / 2}
                                    ref="amount"
                                    autoComplete="off"
                                    onChange={this.amountChange}
                                    disabled={true}
                                />
                                <div className="pd-0 bg-x">
                                    <select>
                                        <option>{'STEEM'}</option>
                                        <option selected>{'SCTM'}</option>
                                    </select>
                                </div>
                                <div className="error">{amountError}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <button type="button" className="button">
                                {'Swap'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
