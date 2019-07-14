import React from 'react';
import Icon from 'app/components/elements/Icon';

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.onNextPage = this.onNextPage.bind(this);
        this.onPreviousPage = this.onPreviousPage.bind(this);
    }

    onNextPage() {
        this.props.onNextPage();
    }

    onPreviousPage() {
        this.props.onPreviousPage();
    }

    render() {
        const { previousAvailable, nextAvailable } = this.props;

        return (
            <div className="Pagination">
                <button
                    disabled={!previousAvailable}
                    className="button-previous"
                    onClick={this.onPreviousPage}
                >
                    <Icon name="chevron-left" size="1_5x" />
                </button>
                {/* implement page numbers */}
                <button
                    disabled={!nextAvailable}
                    className="button-next"
                    onClick={this.onNextPage}
                >
                    <Icon name="chevron-left" size="1_5x" />
                </button>
            </div>
        );
    }
}

export default Pagination;
