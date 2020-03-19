import React from 'react';
import { Link } from 'react-router';
import tt from 'counterpart';

class ExchangeNow extends React.Component {
    componentDidMount() {
        const script = document.createElement('script');

        script.src =
            'https://changenow.io/embeds/exchange-widget/v2/stepper-connector.js';

        document.body.appendChild(script);
    }

    render() {
        var Iframe = React.createClass({
            render: function() {
                return (
                    <div>
                        <iframe
                            id="iframe-widget"
                            name="widget"
                            src={this.props.src}
                            width="100%"
                            height="500px"
                            style={{ border: '0px' }}
                        />
                    </div>
                );
            },
        });

        return (
            <Iframe src="https://changenow.io/embeds/exchange-widget/v2/widget.html" />
        );
    }
}

module.exports = {
    path: '/support.html',
    component: ExchangeNow,
};
