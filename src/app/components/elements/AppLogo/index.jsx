import React from 'react';
import PropTypes from 'prop-types';
import SvgImage from 'app/components/elements/SvgImage';
import { APP_ICON } from 'app/client_config';

const AppLogo = () => {
    return <SvgImage name={APP_ICON} width="80px" height="40px" />;
};

export default AppLogo;
