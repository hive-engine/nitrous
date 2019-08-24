/* eslint react/prop-types: 0 */
import React from 'react';
import tt from 'counterpart';
import classNames from 'classnames';
import { FormattedDate, FormattedNumber } from 'react-intl';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

class PendingOrderItem extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            isBusy: false,
        };
    }

    cancelOrderHandler = e => {
        e.preventDefault();
        const { item: { txId, type }, cancelOrder } = this.props;
        this.setState({ isBusy: true }, () => {
            cancelOrder({ type, txId }, err => {
                this.setState({ isBusy: false });
            });
        });
    };

    render() {
        const { item } = this.props;
        const timestamp = new Date(item.timestamp * 1000);
        const price = parseFloat(item.price);
        const quantity = parseFloat(item.quantity);
        const sum = parseFloat((price * quantity).toFixed(5));
        const { isBusy } = this.state;
        return (
            <tr>
                <td className="text-center">
                    <FormattedDate
                        value={timestamp}
                        year="2-digit"
                        month="2-digit"
                        day="2-digit"
                        hour12={false}
                        hour="2-digit"
                        minute="2-digit"
                        second="2-digit"
                    />
                </td>
                <td className="text-center">
                    <strong className="symbol">{item.symbol}</strong>
                </td>
                <td className={classNames('text-center', 'uppercase')}>
                    <a
                        className={classNames('type', item.type)}
                        href={`https://steem-engine.com/?p=market&t=${
                            item.symbol
                        }`}
                        target="_blank"
                    >
                        <strong>
                            {tt(['pendingorders_jsx', item.type], {
                                fallback: item.type,
                            })}
                        </strong>
                    </a>
                </td>
                <td className="text-right">
                    <span className="price">
                        <FormattedNumber
                            value={price}
                            minimumSignificantDigits={1}
                        />{' '}
                        <i>STEEM</i>
                    </span>
                </td>
                <td className="text-right">
                    <span className="price">
                        <FormattedNumber
                            value={quantity}
                            minimumSignificantDigits={1}
                        />
                    </span>
                </td>
                <td className="text-right">
                    <span className="price">
                        <FormattedNumber
                            value={sum}
                            minimumSignificantDigits={1}
                        />{' '}
                        <i>STEEM</i>
                    </span>
                </td>
                <td className="text-center">
                    <span data-whatinput="mouse" className="button__cancel">
                        <button
                            disabled={isBusy}
                            className="button hollow alert tiny"
                            onClick={this.cancelOrderHandler}
                        >
                            Cancel
                        </button>
                        {isBusy && <LoadingIndicator type="circle" inline />}
                    </span>
                </td>
            </tr>
        );
    }
}

const PendingOrderList = ({ pendingOrders, cancelOrder }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th className="text-center">
                        {tt('pendingorders_jsx.timestamp')}
                    </th>
                    <th className="text-center">
                        {tt('pendingorders_jsx.symbol')}
                    </th>
                    <th className="text-center">
                        {tt('pendingorders_jsx.type')}
                    </th>
                    <th className="text-right">
                        {tt('pendingorders_jsx.price')}
                    </th>
                    <th className="text-right">
                        {tt('pendingorders_jsx.quantity')}
                    </th>
                    <th className="text-right">
                        {tt('pendingorders_jsx.sum')}
                    </th>
                    <th className="text-center">Action</th>
                </tr>
            </thead>
            <tbody>
                {pendingOrders.map(item => (
                    <PendingOrderItem
                        key={item.txId}
                        item={item}
                        cancelOrder={cancelOrder}
                    />
                ))}
                {pendingOrders.length === 0 ? <EmptyPendingOrders /> : null}
            </tbody>
        </table>
    );
};

const EmptyPendingOrders = () => {
    return (
        <tr>
            <td className="text-center" colSpan="7">
                No Data
            </td>
        </tr>
    );
};

const PendingOrders = ({ account, cancelOrder }) => {
    const pendingOrders = account.has('pending_orders')
        ? account.get('pending_orders').toJS()
        : null;
    const cancelOrderHandler = ({ type, txId }, cb) => {
        const username = account.get('name');
        cancelOrder(
            {
                account: username,
                type,
                txId,
            },
            cb
        );
    };
    return (
        <div className="PendingOrders">
            <div className="row">
                <div className="column small-12">
                    <br />
                    <h4>{tt('g.pending-orders')}</h4>
                    <br />
                </div>
            </div>
            <div className="row">
                <div className="column small-12 PendingOrders__list">
                    {pendingOrders ? (
                        <PendingOrderList
                            pendingOrders={pendingOrders}
                            cancelOrder={cancelOrderHandler}
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default PendingOrders;
