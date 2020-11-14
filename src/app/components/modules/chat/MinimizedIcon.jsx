import React from 'react';
import { connect } from 'react-redux';

class MinimizedIcon extends React.Component {
    render() {
        const { maximize } = this.props;
        return (
            <div
              className="MinimizedIcon"
              onClick={maximize}
            >
              <IconButton color="#fff">
                <ChatIcon />
              </IconButton>
            </div>
        );
    }
}

export default connect(
    (state, ownProps) => ownProps)(MinimizedIcon);

