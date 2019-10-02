import { Map } from 'immutable';
import React from 'react';
import PropTypes from 'prop-types';
import SvgImage from 'app/components/elements/SvgImage';

class AppLogo extends React.Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        width: PropTypes.string.isRequired,
        height: PropTypes.string.isRequired,
    };

    render() {
        const { name, width, height } = this.props;
        return <SvgImage name={name} width={width} height={height} />;
    }
}

import { connect } from 'react-redux';

export default connect((state, ownProps) => {
    const hostConfig = state.app.get('hostConfig', Map()).toJS();
    let name = hostConfig['APP_ICON'];
    let width = hostConfig['APP_ICON_WIDTH'];
    let height = hostConfig['APP_ICON_HEIGHT'];
    if (ownProps.width) {
        width = ownProps.width;
    }
    if (ownProps.height) {
        height = ownProps.height;
    }
    return {
        name,
        width,
        height,
    };
})(AppLogo);
