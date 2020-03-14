import React, { Component } from 'react';
import tt from 'counterpart';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

class Loading extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.onClose();
        }, 15000);
    }

    render() {
        return (
            <div className="PromotePost row">
                <div className="column small-12">
                    <h4>{tt('swap.loading_header')}</h4>
                    <p>{tt('swap.loading_content')}</p>
                    <hr />
                    <br />
                    <div>
                        <LoadingIndicator type="circle" />
                    </div>
                </div>
            </div>
        );
    }
}

export default Loading;
