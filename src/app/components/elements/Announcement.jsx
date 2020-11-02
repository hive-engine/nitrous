import PropTypes from 'prop-types';
import React from 'react';

export const Announcement = ({ onClose, title, link }) => (
    <div className="annoucement-banner">
        <p className="announcement-banner__text">
            <a className="announcement-banner__link" href={link}>
                {title}
            </a>
        </p>
        <button className="close-button" type="button" onClick={onClose}>
            &times;
        </button>
    </div>
);

Announcement.propTypes = {
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
};

export default Announcement;
