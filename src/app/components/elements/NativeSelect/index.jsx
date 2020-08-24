import React from 'react';
import PropTypes from 'prop-types';

const NativeSelect = ({ options, className, currentlySelected, onChange }) => {
    const handleChange = event => {
        onChange(event.target);
    };

    const opts = options.map((item, index) => {
        return (
            <option
                key={`${index}::${item.label}::${item.value}`}
                value={item.value}
                disabled={item.disabled ? item.disabled : false}
            >
                {item.label}
            </option>
        );
    });

    return (
        <select
            onChange={handleChange}
            className={`nativeSelect ${className}`}
            value={currentlySelected}
        >
            {opts}
        </select>
    );
};

NativeSelect.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            label: PropTypes.string,
            link: PropTypes.string,
        })
    ).isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    currentlySelected: PropTypes.string.isRequired,
};
NativeSelect.defaultProps = {
    className: '',
};

export default NativeSelect;
