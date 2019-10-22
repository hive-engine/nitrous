import React, { Component } from 'react';
import tt from 'counterpart';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';

const SelectToken = props => {
    var options = props.input_token_type.map(function(token_name, index) {
        return <option value={index}>{token_name}</option>;
    });

    return (
        <div
            className="input-group"
            style={{ marginBottom: props.marginBottom }}
        >
            <input
                className="input-group-field"
                type="text"
                placeholder={tt('g.amount')}
                value={props.amount}
                // ref="amount"
                autoComplete="off"
                onChange={props.amountChange}
                disabled={props.inputDisabled}
            />
            <div className="pd-0 bg-x">
                <select onChange={props.selectedChange}>{options}</select>
                {/* <select>
                    {props.input_token_type.map((token_name, i) => {
                        return <option>{token_name}</option>;
                    })}
                </select> */}
            </div>
        </div>
    );
};

export default class SidebarSwap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: 0,
            output_amount: 0,
            selectedValue: '',
        };

        const { sct_to_steemp, steem_to_dollor, steem_to_krw } = this.props;
        // I should get ratio between tokens from .. api.
        const sctm_to_steemp = 9.999;
        const krwp_to_steemp = 6.47;
        const steem_to_steemp = 1.0;
        const sbd_to_steemp = 6.47;

        this.ratio_toke_by_steem = [
            sct_to_steemp,
            sctm_to_steemp,
            krwp_to_steemp,
            steem_to_steemp,
            sbd_to_steemp,
        ];

        this.input_token_type = ['SCT', 'SCTM', 'KRWP', 'STEEM', 'SBD'];
        this.output_token_type = ['SCT', 'SCTM', 'KRWP', 'STEEM', 'SBD'];

        this.swap_fee = 1.0;
        this.selected_token = [0, 0];
        this.input_amount = 0;

        // Functions
        this.onSubmit = this.onSubmit.bind(this);
        this.amountChange = this.amountChange.bind(this);
        this.inputSelected = this.inputSelected.bind(this);
        this.outputSelected = this.outputSelected.bind(this);
    }

    inputSelected(e) {
        console.log('-- PromotePost.inputSelected -->', e.target.value);
        this.selected_token[0] = e.target.value * 1;
        /// update value  amount * a/b
        this.calculateOutput();
    }

    outputSelected(e) {
        console.log('-- PromotePost.outputSelected -->', e.target.value);
        this.selected_token[1] = e.target.value * 1;
        /// update value  amount * a/b
        this.calculateOutput();
    }

    componentDidMount() {}

    amountChange(e) {
        const amount = e.target.value;
        this.input_amount = amount;
        /// update value  amount * a/b
        this.calculateOutput();
    }

    onSubmit(e) {
        console.log(e);
    }

    calculateOutput() {
        const amount = this.input_amount;
        const a = this.ratio_toke_by_steem[this.selected_token[0]];
        const b = this.ratio_toke_by_steem[this.selected_token[1]];
        var output_amount = amount * ((100 - this.swap_fee) / 100.0) * a / b;
        this.setState({ amount, output_amount });
    }

    render() {
        const {
            amount,
            output_amount,
            loading,
            amountError,
            trxError,
        } = this.state;

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
                            {/* input component */}
                            <SelectToken
                                amount={amount}
                                amountChange={this.amountChange}
                                selectedChange={this.inputSelected}
                                selectedValue={this.state.selectedValue}
                                input_token_type={this.input_token_type}
                                marginBottom={0}
                                inputDisabled={false}
                            />

                            <div className="text-center">
                                {/* <Icon name="dropdown-arrow" /> */}
                                {'▼'}
                            </div>

                            <SelectToken
                                amount={output_amount}
                                amountChange={this.amountChange}
                                selectedChange={this.outputSelected}
                                selectedValue={this.state.selectedValue}
                                input_token_type={this.output_token_type}
                                marginBottom={10}
                                inputDisabled={true}
                            />
                        </div>
                        <div className="text-right">
                            <span
                                className="articles__icon-100"
                                title={`수수료는 ${this.swap_fee}%입니다.`}
                            >
                                <button className="button" disabled={true}>
                                    {'수수료'}
                                </button>
                            </span>

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
