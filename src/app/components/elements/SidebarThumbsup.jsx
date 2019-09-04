import React from 'react';
import tt from 'counterpart';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';

const SidebarThumbsup = ({ thumbsUpReceiveList, thumbsUpSendList }) => {
    if (thumbsUpReceiveList || thumbsUpSendList) {
        console.log(thumbsUpReceiveList);
        console.log(thumbsUpSendList);
    }

    const viewCnt = 3;
    let receiveTop = '';
    let sendTop = '';

    for (let i = 0; i < 3; i++) {
        receiveTop += `
            ${thumbsUpReceiveList.getIn([
                i,
                'author',
            ])}:${thumbsUpReceiveList.getIn([i, 'amount'])}\n`;
        sendTop += `
            ${thumbsUpSendList.getIn([
                i,
                'thumbup_account',
            ])}:${thumbsUpSendList.getIn([i, 'amount'])}\n`;
    }

    return (
        <div className="c-sidebar__module">
            {receiveTop}
            {sendTop}
        </div>
    );
};

export default SidebarThumbsup;
