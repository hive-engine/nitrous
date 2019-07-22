import PropTypes from 'prop-types';
import React from 'react';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import Icon from 'app/components/elements/Icon';
import Rating from 'react-rating';

export default class PostRating extends Rating {
    static propTypes = {
        initialRating: PropTypes.number,
        onChange: PropTypes.func,
    };

    constructor(props) {
        super(props);
        const rating = this.props.initialRating || 0;
        this.state = { value: rating };
        this.onChange = this.props.onChange.bind(this);
    }

    render() {
        // emptySymbol="fa fa-star-o fa-2x medium"
        // fullSymbol="fa fa-star fa-2x medium"
        const { onClick } = this;
        return (
            <Rating
                {...this.props}
                initialRating={this.state.value}
                onChange={this.onChange}
                emptySymbol={<Icon name="unstar" />}
                fullSymbol={<Icon name="star" />}
            />
        );
    }
}
