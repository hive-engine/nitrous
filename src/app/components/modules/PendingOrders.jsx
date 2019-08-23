/* eslint react/prop-types: 0 */
import React from 'react';
import tt from 'counterpart';
import classNames from 'classnames';
import { FormattedDate, FormattedNumber } from 'react-intl';

const HistoryItem = ({ item }) => {
    const timestamp = new Date(item.timestamp * 1000);
    const price = parseFloat(item.price);
    const quantity = parseFloat(item.quantity);
    const sum = parseFloat((price * quantity).toFixed(5));
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
                    href={`https://steem-engine.com/?p=market&t=${item.symbol}`}
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
                    <FormattedNumber value={sum} minimumSignificantDigits={1} />{' '}
                    <i>STEEM</i>
                </span>
            </td>
        </tr>
    );
};

const HistoryList = ({ pendingOrders }) => {
    let { buyBook, sellBook, error } = pendingOrders;

    if (!error) {
        buyBook = buyBook.map(e => ({
            ...e,
            type: 'buy',
        }));
        sellBook = sellBook.map(e => ({
            ...e,
            type: 'sell',
        }));
        const items = buyBook
            .concat(sellBook)
            .sort((a, b) => b.timestamp - a.timestamp);
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
                    </tr>
                </thead>
                <tbody>
                    {items.map(item => (
                        <HistoryItem key={item.txId} item={item} />
                    ))}
                </tbody>
            </table>
        );
    }
    return null;
};

const PendingOrders = ({ account }) => {
    const pendingOrders = account.has('pending_orders')
        ? account.get('pending_orders').toJS()
        : null;
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
                        <HistoryList pendingOrders={pendingOrders} />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default PendingOrders;
