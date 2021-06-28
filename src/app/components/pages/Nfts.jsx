import React from 'react';
import HelpContent from 'app/components/elements/HelpContent';

class Nfts extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="column large-8 medium-10 small-12">
                    <HelpContent path="nfts" />
                </div>
            </div>
        );
    }
}

module.exports = {
    path: 'nfts.html',
    component: Nfts,
};
