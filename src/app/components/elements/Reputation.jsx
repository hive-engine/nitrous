import React from 'react';
import tt from 'counterpart';

export default ({ value }) => {
    if (isNaN(value)) {
        return null;
    }
    return (
        <span className="Reputation" title={tt('g.reputation')}>
            ({Math.floor(value)})
        </span>
    );
};
