import React from 'react';
import NotFoundMessage from 'app/components/cards/NotFoundMessage';

class NotFound extends React.Component {
    render() {
        return (
            <div>
                <NotFoundMessage />
            </div>
        );
    }
}

module.exports = {
    path: '*',
    component: NotFound,
};
