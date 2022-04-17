import React from 'react';
import moondark from './moon.png';
import moonlight from './moon_light.png';
const DarkModeBtn = ({ toggleBody }) => {
    return (
        <div style={{ marginLeft: '20px' }}>
            <button
                id="darkMode"
                style={{ cursor: 'pointer' }}
                onClick={e => toggleBody(e)}
            >
                {' '}
                <div id="moon">
                    <img
                        src={moondark}
                        alt="moonlight"
                        width="40px"
                        style={{ marginLeft: '10px' }}
                    />
                </div>
            </button>
        </div>
    );
};

export default DarkModeBtn;
