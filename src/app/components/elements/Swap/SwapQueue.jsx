import React, { Component } from 'react';

class SwapQueue extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <p className="waiting-queue">
                There are {`${this.props.item}`} people in front of you.
            </p>
        );
    }
}

export default SwapQueue;
