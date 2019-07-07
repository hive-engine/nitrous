import React from 'react';
import PropTypes from 'prop-types';
import SvgImage from 'app/components/elements/SvgImage';

const SteemLogo = () => {
    return (
        <span className="logo">
            <SvgImage name="steemit" width="150px" height="40px" />
        </span>
    );
};

export default SteemLogo;
