import React from 'react';
import {
    formatDecimal,
    parsePayoutAmount,
} from 'app/utils/ParsersAndFormatters';
import Icon from 'app/components/elements/Icon';

const Info = ({ amount, unit, description, icon, background, classname }) => {
    // if (amount && typeof amount === 'string') {
    //   amount = parsePayoutAmount(amount);
    // }

    const amnt = amount; // formatDecimal(amount);
    let cln = 'Info';
    if (classname) {
        cln = cln + ` ${classname}`;
    }
    return (
        <div
            className={cln}
            style={{
                backgroundColor: background,
            }}
        >
            <div className="content">
                <span>
                    <div className="amount">
                        <span className="decimal">{amnt}</span>
                        <span className="suffix">{unit}</span>
                    </div>
                    <div className="desc">{description}</div>
                </span>
            </div>
            <div className="icon">
                <span>
                    <Icon name={icon} size="3x" />
                </span>
            </div>
        </div>
    );
};

export default Info;
