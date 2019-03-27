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
        const { currentPage } = this.props;
        if (currentPage < this.getPageCount()) {
            this.onPageSelect(currentPage + 1);
        }
    }
    onPreviousPage() {
        const { currentPage } = this.props;
        if (currentPage > 1) {
            this.onPageSelect(currentPage - 1);
        }
    }

    render() {
        const { currentPage } = this.props;
        return (
            <div className="Pagination">
                <button
                    className="button-previous"
                    disabled={this.currentPage === 1}
                    onClick={this.onPreviousPage}
                >
                    <Icon name="chevron-left" />
                </button>

                <ul className="pagination-list">
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
                </ul>
                <button
                    className="button-next"
                    onClick={this.onNextPage}
                    disabled={this.currentPage === this.getPageCount()}
                >
                    <Icon name="chevron-left" />
                </button>
            </div>
        );
    }
}

export default Pagination;
