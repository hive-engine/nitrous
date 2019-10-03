import React from 'react';
import tt from 'counterpart';
import { connect } from 'react-redux';
import * as globalActions from 'app/redux/GlobalReducer';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import { GOOGLE_CUSTOM_SEARCH_ID } from 'app/client_config';
import MarkdownViewer from 'app/components/cards/MarkdownViewer';
import { isLoggedIn } from 'app/utils/UserUtil';
import { APP_URL } from 'app/client_config';
import { api } from '@steemit/steem-js';
import ReactHintFactory from 'react-hint';
const ReactHint = ReactHintFactory(React);
import {
    setPostRewardedByUser,
    isPostRewardedByUser,
    updatePostRewardingRecords,
} from 'app/utils/CommentUtil';

class PaidSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.watchSearchResults = this.watchSearchResults.bind(this);
        this.modifySearchResult = this.modifySearchResult.bind(this);
        this.onRenderPreview = this.onRenderPreview.bind(this);
    }

    render() {
        if (isLoggedIn()) {
            return (
                <div className="Search">
                    <div className="row medium-8 large-7 search-content">
                        <ReactHint
                            autoPosition
                            events
                            delay={{ show: 300, hide: 500 }}
                        />
                        <ReactHint
                            persist
                            attribute="data-search"
                            events={{ hover: true }}
                            onRenderContent={this.onRenderPreview}
                            ref={ref => (this.instance = ref)}
                        />
                        <div className="columns">
                            {/* <gcse:search linktarget="_self"></gcse:search> */}
                            <div
                                id="search_renderer"
                                className="gcse-searchbox"
                                data-newWindow="true"
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div />;
        }
    }

    insertCSE() {
        const cx = GOOGLE_CUSTOM_SEARCH_ID;
        let gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
        let s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
    }

    renderCSE() {
        const renderer = () => {
            // Render an element with both search box and search results in div with id 'search_renderer'.
            google.search.cse.element.render({
                div: 'search_renderer',
                tag: 'search',
                gname: 'custom_search',
            });
        };
        const reanderSearch = () => {
            if (document.readyState == 'complete') {
                // Document is ready when CSE element is initialized.
                renderer();
            } else {
                // Document is not ready yet, when CSE element is initialized.
                google.setOnLoadCallback(function() {
                    renderer();
                }, true);
            }
        };
        // Insert it before the CSE code snippet so that cse.js can take the script
        // parameters, like parsetags, callbacks.
        window.__gcse = {
            parsetags: 'explicit', // 'onload', //
            callback: reanderSearch,
        };
        window.__gcse.searchCallbacks = {
            web: {
                // ready: this.watchSearchResults,
                rendered: this.watchSearchResults,
            },
        };
    }

    loadScripts(callback) {
        function loadScript(url, callback) {
            let script = document.createElement('script');
            script.type = 'text/javascript';

            if (script.readyState) {
                //IE
                script.onreadystatechange = function() {
                    if (
                        script.readyState == 'loaded' ||
                        script.readyState == 'complete'
                    ) {
                        script.onreadystatechange = null;
                        if (callback) callback();
                    }
                };
            } else {
                //Others
                script.onload = function() {
                    if (callback) callback();
                };
            }

            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        }

        // loadScript(
        //     'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.slim.min.js',
        //     callback
        // );
        // loadScript('https://cdn.jsdelivr.net/npm/marked/marked.min.js');
    }

    parsePost(element, attribute) {
        const reserved_pages = [
            'feed',
            'transfers',
            'followed',
            'followers',
            'comments',
            'recent-replies',
            'settings',
        ];
        if (element && element.getAttribute(attribute)) {
            let segs = element.getAttribute(attribute).split('/');
            let permlink = segs[segs.length - 1];
            let author = segs[segs.length - 2];

            if (
                author.indexOf('@') != -1 &&
                reserved_pages.indexOf(permlink) == -1
            ) {
                author = author.replace('@', '');
                return {
                    author,
                    permlink,
                    key: '@' + author + '/' + permlink,
                };
            }
            return null;
        }
        return null;
    }

    showRewardPost(element) {
        const res = this.parsePost(element, 'gs-url');
        if (res) {
            const { author, permlink, key } = res;

            const openPage = () => {
                const username = this.props.currentUser.get('username');
                setPostRewardedByUser(author, permlink, username);
                element.setAttribute('href', element.getAttribute('gs-url'));
                element.click();

                //     let win = window.open();
                //     win.location = href;
                //     win.opener = null;
                //     win.blur();
                //     window.focus();
                //     // window.open(href, '_blank');
                // }
            };

            this.props.showRewardPost(author, permlink, openPage);
        }
    }

    renderMarkdown(md) {
        // remove image tag
        // md = md.replace(/(?:!\[(.*?)\]\((.*?)\))/g, '');
        // // let h = marked(md);
        // let h = remarkable.render(md);
        // h = $('<p>')
        //     .html(h)
        //     .find('img')
        //     .remove()
        //     .end()
        //     .html();
        // return <div dangerouslySetInnerHTML={{__html: h }} />

        return (
            <MarkdownViewer
                formId={'search-preview' + '-viewer'}
                text={md}
                jsonMetadata={{}}
                large={false}
                highQualityPost={false}
                removeImages={true}
            />
        );
    }

    onRenderPreview(target, content) {
        // render the preview with steem API
        const res = this.parsePost(target, 'gs-url');
        if (res) {
            const { author, permlink, key } = res;
            api.getContent(author, permlink, (err, result) => {
                if (result && result.body) {
                    let state = {};
                    state[`loading_${key}`] = false;
                    state[`preview_${key}`] = this.renderMarkdown(result.body);
                    this.setState(state);
                }
            });

            return (
                <div className="preview">
                    {this.state[`loading_${key}`] && (
                        <span>
                            <LoadingIndicator type="circle" />
                            <br />
                        </span>
                    )}
                    {this.state[`preview_${key}`]}
                </div>
            );
        }

        return null;
    }

    watchSearchResults() {
        const search_res_titles = 'div.gs-webResult.gs-result a[data-cturl]';
        const search_res_urls = 'div.gs-visibleUrl.gs-visibleUrl-long';

        const modify_search_results = elements => {
            if (elements && elements.length > 0) {
                for (var i = 0; i < elements.length; i++) {
                    var e = elements[i];
                    this.modifySearchResult(e);
                }
            }
        };

        const hide_search_urls = elements => {
            if (elements && elements.length > 0) {
                for (var i = 0; i < elements.length; i++) {
                    var e = elements[i];
                    e.parentNode.removeChild(e);
                }
            }
        };

        const update = (selector, func) => {
            var elements = document.querySelectorAll(selector);
            if (elements.length != 0) {
                func(elements);
            }
        };

        const add_dom_render_observer = (selector, func) => {
            var i = setInterval(function() {
                update(selector, func);
                // clearInterval(i);
            }, 100);
        };

        const execute = update; // add_dom_render_observer

        execute(search_res_titles, modify_search_results);
        execute(search_res_urls, hide_search_urls);
    }

    modifySearchResult(e) {
        const page = this;
        if (!e.hasAttribute('gs-url-disabled')) {
            const res = this.parsePost(e, 'href');
            if (res) {
                const { author, permlink, key } = res;

                // replace 'href' attribute's domain with site origin
                let href = e.getAttribute('href');
                if (
                    href.indexOf(APP_URL) != -1 &&
                    APP_URL !== location.origin
                ) {
                    href = href.replace(APP_URL, location.origin);
                    e.setAttribute('href', href);
                }

                // add the mark that the element is processed
                e.setAttribute('gs-url-disabled', '');
                // update gs-url attribute
                e.setAttribute('gs-url', e.getAttribute('href'));
                // remove the default google custom search url
                e.removeAttribute('data-cturl');
                // remove default click by custom search result
                e.addEventListener('mousedown', event => {
                    event.preventDefault();
                    event.stopPropagation();
                });
                // show preview for element that has data-search attribute
                e.setAttribute('data-search', '');

                // add click event lisnter if post not rewarded
                const username = this.props.currentUser.get('username');
                if (
                    !isPostRewardedByUser(author, permlink, username) &&
                    author !== username
                ) {
                    // add preview and click for title only
                    // if (e.parentNode.getAttribute('class') === 'gs-title') {
                    e.removeAttribute('href');
                    e.addEventListener('click', event => {
                        let href = e.getAttribute('href');
                        if (
                            typeof href === typeof undefined ||
                            href === null ||
                            href === false
                        ) {
                            this.showRewardPost(e);
                        }
                    });
                }

                // set initial loading state
                let state = {};
                state[`loading_${key}`] = true;
                this.setState(state);
                // }
            }
        }
    }

    componentWillMount() {
        if (isLoggedIn()) {
            // update post rewards info
            const username = this.props.currentUser.get('username');
            updatePostRewardingRecords(username);
        }
    }

    componentDidMount() {
        // render search engine
        this.insertCSE();
        this.renderCSE();
        // this.loadScripts(this.watchSearchResults);
        // this.watchSearchResults();
    }
}

const Search = connect(
    (state, ownProps) => {
        const currentUser = state.user.get('current');
        return { ...ownProps, currentUser };
    },

    // mapDispatchToProps
    dispatch => ({
        showRewardPost: (author, permlink, onSuccess) => {
            dispatch(
                globalActions.showDialog({
                    name: 'rewardPost',
                    params: { author, permlink, onSuccess },
                })
            );
        },
    })
)(PaidSearch);

module.exports = {
    path: 'search',
    component: Search,
};
