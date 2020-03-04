import React from 'react';

var Iframe = React.createClass({
    render: function() {
        return (
            <div>
                <iframe
                    src={this.props.src}
                    height={this.props.height}
                    width={this.props.width}
                />
            </div>
        );
    },
});

const ExchangeNow = ({ sct_to_steemp, steem_to_dollor, steem_to_krw }) => {
    return (
        <div className="c-sidebar__module">
            <div />
            <Iframe
                width="480"
                height="280"
                src="https://changenow.io/embeds/exchange-widget/v1?amount=1&from=btc&link_id=390fe008f10e29&to=xmr"
                frameborder="0"
                scrolling="no"
                style="overflow-y: hidden;"
            >
                Can't load widget
            </Iframe>
        </div>
    );
};

export default ExchangeNow;
