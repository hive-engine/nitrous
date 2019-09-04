import React from 'react';
import tt from 'counterpart';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';

const SidebarThumbsup = ({ test, thumbsUpReceiveList, thumbsUpSendList }) => {
    if (thumbsUpReceiveList || thumbsUpSendList) {
        console.log(thumbsUpReceiveList);
        console.log(thumbsUpSendList);
    }

    console.log(test);

    return <div className="c-sidebar__module">{test}</div>;
};

export default SidebarThumbsup;
