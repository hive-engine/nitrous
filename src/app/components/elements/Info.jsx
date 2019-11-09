import React from 'react';
import { formatDecimal } from 'app/utils/ParsersAndFormatters';
import Icon from 'app/components/elements/Icon';

const Info = ({ amount, unit, description, icon, background, classname }) => {
    const amnt = formatDecimal(amount);
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
                <span className="item">
                    <div className="amount">
                        <span className="decimal">{amnt}</span>
                        <span className="suffix">{unit}</span>
                    </div>
                    <div className="desc">{description}</div>
                </span>
            </div>
            <div className="img">
                <span className="item">
                    <Icon name={icon} size="3x" />
                </span>
            </div>
        </div>
    );
};

export default Info;
