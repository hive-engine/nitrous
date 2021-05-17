// https://gist.github.com/aVolpe/b364a8fcd10f1ba833d97e9ab278f42c
import React from 'react';

// USAGE
// <EmbeddedGist gist="aVolpe/fffbe6a9e9858c7e3546fb1d55782152"/>
// <EmbeddedGist gist="aVolpe/fffbe6a9e9858c7e3546fb1d55782152" file="SetUtils.java"/>

class EmbeddedGist extends React.Component {
    constructor(props) {
        super(props);
        this.gist = props.gist;
        this.file = props.file;
        this.stylesheetAdded = false;
        this.state = {
            loading: true,
            src: '',
        };
    }

    // The Gist JSON data includes a stylesheet to add to the page
    // to make it look correct. `addStylesheet` ensures we only add
    // the stylesheet one time.
    addStylesheet = href => {
        if (!this.stylesheetAdded) {
            this.stylesheetAdded = true;
            const link = document.createElement('link');
            link.type = 'text/css';
            link.rel = 'stylesheet';
            link.href = href;

            document.head.appendChild(link);
        }
    };

    componentDidMount() {
        const { gist, file } = this.props;

        // Create a JSONP callback that will set our state
        // with the data that comes back from the Gist site
        const gistCallback = EmbeddedGist.nextGistCallback();
        window[gistCallback] = function(gistData) {
            this.setState({
                loading: false,
                src: gistData.div,
            });
            this.addStylesheet(gistData.stylesheet);
        }.bind(this);

        let url = 'https://gist.github.com/' + gist + '.json?callback=' + gistCallback;
        if (file) {
            url += '&file=' + file;
        }

        // Add the JSONP script tag to the document.
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.head.appendChild(script);
    }

    render() {
        const { src, loading } = this.state;
        if (loading) {
            return <div>loading...</div>;
        }

        // eslint-disable-next-line react/no-danger
        return <div dangerouslySetInnerHTML={{ __html: src }} />;
    }
}

// Each time we request a Gist, we’ll need to generate a new
// global function name to serve as the JSONP callback.
let gistCallbackId = 0;
EmbeddedGist.nextGistCallback = () => {
    const callbackName = 'embed_gist_callback_' + gistCallbackId;
    gistCallbackId += 1;
    return callbackName;
};

export default EmbeddedGist;
