import React from 'react';
import { SCT_API_BASE_URL } from 'app/client_config';
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
    const thumbsUpViewPageUrl = `${SCT_API_BASE_URL}/manager`;

    return (
        <div className="c-sidebar__module">
            <div className="c-sidebar__header" style={styleToken}>
                <h3 className="c-sidebar__h3">Thumbs Up Top 3(To)</h3>
            </div>
            <div className="c-sidebar__content">
                <ul className="c-sidebar__list-small">
                    {receiveTop.map((value, index) => {
                        return (
                            <li className="c-sidebar__list-item" key={index}>
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
                <h3 className="c-sidebar__h3">Thumbs Up Top 3(From)</h3>
            </div>
            <div className="c-sidebar__content">
                <ul className="c-sidebar__list-small">
                    {sendTop.map((value, index) => {
                        return (
                            <li className="c-sidebar__list-item" key={index}>
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

            <div
                style={{
                    textAlign: 'right',
                    paddingTop: '0.5rem',
                    fontSize: '0.9rem',
                }}
            >
                <a target="_blank" href={thumbsUpViewPageUrl}>
                    more...
                </a>
            </div>
        </div>
    );
};

export default SidebarThumbsup;
