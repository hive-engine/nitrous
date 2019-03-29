import React from 'react';
import Icon from 'app/components/elements/Icon';

class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.onNextPage = this.onNextPage.bind(this);
        this.onPreviousPage = this.onPreviousPage.bind(this);
    }
    getPageCount() {
        const { length, perPage } = this.props;
        return Math.ceil(length / perPage);
    }

    onPageSelect(pageNumber) {
        this.props.onSelect(pageNumber);
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

                {/* <ul className="pagination-list">
                    {[...Array(this.getPageCount())].map((p, i) => {
                        return (
                            <li
                                className={
                                    currentPage === i + 1 ? `active` : ''
                                }
                                key={`pagination-item-${i}`}
                                onClick={() => this.onPageSelect(i + 1)}
                            >
                                {i + 1}
                            </li>
                        );
                    })}
                </ul> */}
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
