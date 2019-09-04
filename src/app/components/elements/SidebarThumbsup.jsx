import React from 'react';
import tt from 'counterpart';

const SidebarThumbsup = ({ thumbsUpReceiveList, thumbsUpSendList }) => {
    const viewCnt = 3;
    let receiveTop = [];
    let sendTop = [];

    for (let i = 0; i < viewCnt; i++) {
        receiveTop.push({
            account: thumbsUpReceiveList.getIn([i, 'author']),
            amount: thumbsUpReceiveList.getIn([i, 'amount']),
        });
        sendTop.push({
            account: thumbsUpSendList.getIn([i, 'thumbup_account']),
            amount: thumbsUpSendList.getIn([i, 'amount']),
        });
    }

    const styleToken = { color: 'rgb(0, 120, 167)' };
    const styleBurn = { color: 'red' };

    return (
        <div className="c-sidebar__module">
            <div className="c-sidebar__header" style={styleToken}>
                <h3 className="c-sidebar__h3">Thumbs Up(Receiver)</h3>
            </div>
            <div className="c-sidebar__content">
                <ul className="c-sidebar__list-small">
                    {receiveTop.map((value, index) => {
                        return (
                            <li className="c-sidebar__list-item">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>
                                        Top {index + 1}. {value.account}
                                    </div>
                                    <div>
                                        <span className="integer">
                                            {value.amount}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            <br />
            <div className="c-sidebar__header" style={styleToken}>
                <h3 className="c-sidebar__h3">Thumbs Up(Sender)</h3>
            </div>
            <div className="c-sidebar__content">
                <ul className="c-sidebar__list-small">
                    {sendTop.map((value, index) => {
                        return (
                            <li className="c-sidebar__list-item">
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>
                                        Top {index + 1}. {value.account}
                                    </div>
                                    <div>
                                        <span className="integer">
                                            {value.amount}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export default SidebarThumbsup;
