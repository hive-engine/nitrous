import PropTypes from 'prop-types';
import React from 'react';
import links from 'app/utils/Links';
import { browserHistory } from 'react-router';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';

class Link extends React.Component {
    static propTypes = {
        // HTML properties
        href: PropTypes.string,
        // Redux properties
        appDomain: PropTypes.string,
    };
    constructor(props) {
        super();
        const { href, appDomain } = props;
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'Link');
        this.localLink = href && links.local(appDomain).test(href);
        this.onLocalClick = e => {
            e.preventDefault();
            browserHistory.push(this.props.href);
        };
    }
    render() {
        const { props: { href, children }, onLocalClick } = this;
        if (this.localLink) return <a onClick={onLocalClick}>{children}</a>;
        return (
            <a target="_blank" rel="noopener" href={href}>
                {children}
            </a>
        );
    }
}

import { connect } from 'react-redux';

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        const appDomain = state.app.getIn(['hostConfig', 'APP_DOMAIN']);
        return {
            ...ownProps,
            appDomain,
        };
    }
)(Link);
