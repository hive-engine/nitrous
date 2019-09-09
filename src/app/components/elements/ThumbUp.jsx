import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import tt from 'counterpart';
import Icon from 'app/components/elements/Icon';
import { LIQUID_TOKEN_UPPERCASE, APP_NAME } from 'app/client_config';
import DropdownMenu from 'app/components/elements/DropdownMenu';
import Dropdown from 'app/components/elements/Dropdown';
import CloseButton from 'app/components/elements/CloseButton';
import Slider from 'react-rangeslider';
import { getThumbUpList } from 'app/utils/SctApi';
import * as transactionActions from 'app/redux/TransactionReducer';
import shouldComponentUpdate from 'app/utils/shouldComponentUpdate';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import { clean_permlink } from 'app/utils/CommentUtil';

const MAX_THUMBUP_DISPLAY = 20;

class ThumbUp extends React.Component {
    static propTypes = {
        // HTML properties
        post: PropTypes.string.isRequired,

        // Redux connect properties.
        author: PropTypes.string, // post was deleted
        permlink: PropTypes.string,
        username: PropTypes.string,
        enable_slider: PropTypes.bool,
        tokenBalances: PropTypes.object,
        thumbup_active: PropTypes.bool,
        dispatchSubmit: PropTypes.func.isRequired,
        max_like_amount: PropTypes.number,
        receive_account: PropTypes.string,
        divide_author: PropTypes.number,
        divide_rewards: PropTypes.number,
        divide_dev: PropTypes.number,
        divide_burn: PropTypes.number,
    };
    static defaultProps = {
        max_like_amount: 1,
        receive_account: 'uni.dev',
        divide_author: 50,
        divide_rewards: 10,
        divide_dev: 20,
        divide_burn: 20,
    };
    constructor(props) {
        super(props);
        const { max_like_amount } = this.props;
        this.state = {
            showWeight: false,
            isMyThumbUp: false,
            thumbCnt: 0,
            thumbAmount: 0,
            thumbList: null,
            sliderWeight: {
                up: max_like_amount,
                down: max_like_amount,
            },
        };

        this.handleWeightChange = up => weight => {
            let w;
            if (up) {
                w = {
                    up: weight,
                    down: this.state.sliderWeight.down,
                };
            } else {
                w = {
                    up: this.state.sliderWeight.up,
                    down: weight,
                };
            }
            this.setState({ sliderWeight: w });
        };

        this.handleButtonWeightChange = (up, weight) => e => {
            let w;
            if (e.target.value > max_like_amount)
                e.target.value = max_like_amount;

            if (weight === -1) {
                weight = e.target.value;
            }

            weight = max_like_amount / 100 * weight;

            if (up) {
                w = {
                    up: weight,
                    down: this.state.sliderWeight.down,
                };
            } else {
                w = {
                    up: this.state.sliderWeight.up,
                    down: weight,
                };
            }

            this.setState({ sliderWeight: w });
            const { username, is_comment } = this.props;

            localStorage.setItem(
                'thumbupWeight' +
                    '-' +
                    username +
                    (is_comment ? '-comment' : ''),
                weight
            );
        };

        this.storeSliderWeight = up => () => {
            const { username, is_comment } = this.props;
            const weight = up
                ? this.state.sliderWeight.up
                : this.state.sliderWeight.down;
            localStorage.setItem(
                'thumbupWeight' +
                    (up ? '' : 'Down') +
                    '-' +
                    username +
                    (is_comment ? '-comment' : ''),
                weight
            );
        };

        this.readSliderWeight = () => {
            const { username, enable_slider, is_comment } = this.props;
            if (enable_slider) {
                const sliderWeightUp = Number(
                    localStorage.getItem(
                        'thumbupWeight' +
                            '-' +
                            username +
                            (is_comment ? '-comment' : '')
                    )
                );
                const sliderWeightDown = Number(
                    localStorage.getItem(
                        'thumbupWeight' +
                            'Down' +
                            '-' +
                            username +
                            (is_comment ? '-comment' : '')
                    )
                );
                this.setState({
                    sliderWeight: {
                        up: sliderWeightUp ? sliderWeightUp : max_like_amount,
                        down: sliderWeightDown
                            ? sliderWeightDown
                            : max_like_amount,
                    },
                });
            }
        };
        this.shouldComponentUpdate = shouldComponentUpdate(this, 'ThumbUp');
    }

    componentWillMount() {
        const { author, permlink, username } = this.props;
        this._checkMyThumbUp(author, permlink, username);
    }

    componentWillReceiveProps(nextProps) {
        const { thumbup_active } = nextProps;
        if (!thumbup_active) {
            this.setState({ showWeight: false });
            if (this.props.thumbup_active) {
                const { author, permlink, username } = this.props;
                this._checkMyThumbUp(author, permlink, username);
            }
        }
    }

    async _checkMyThumbUp(author, permlink, username) {
        // get thumbup list by sct api
        const thumbUpHistory = await getThumbUpList(author, permlink);

        if (author && thumbUpHistory) {
            const cnt = thumbUpHistory.data.cnt;
            const amount = thumbUpHistory.data.amount;
            const list = thumbUpHistory.data.list;
            const isMyThumb = list.some(v => {
                if (v.thumbup_account == username) {
                    return true;
                }
            })
                ? true
                : false;

            this.setState({
                thumbCnt: cnt,
                thumbAmount: amount,
                thumbList: list,
                isMyThumbUp: isMyThumb,
            });
        }
    }

    render() {
        const {
            author,
            username,
            permlink,
            tokenBalances,
            enable_slider,
            dispatchSubmit,
            thumbup_active,
            max_like_amount,
            receive_account,
            divide_author,
            divide_rewards,
            divide_dev,
            divide_burn,
        } = this.props;
        const {
            showWeight,
            isMyThumbUp,
            thumbCnt,
            thumbAmount,
            thumbList,
        } = this.state;

        let thumbs_list = null;

        const slider = up => {
            const b = this.state.sliderWeight.up;
            return (
                <span>
                    <div id="btn_group">
                        <button
                            id="weight-left"
                            onClick={this.handleButtonWeightChange(up, 25)}
                        >
                            {' '}
                            25%{' '}
                        </button>
                        <button
                            id="weight-center"
                            onClick={this.handleButtonWeightChange(up, 50)}
                        >
                            {' '}
                            50%{' '}
                        </button>
                        <button
                            id="weight-center"
                            onClick={this.handleButtonWeightChange(up, 75)}
                        >
                            {' '}
                            75%{' '}
                        </button>
                        <button
                            id="weight-right"
                            onClick={this.handleButtonWeightChange(up, 100)}
                        >
                            {' '}
                            100%{' '}
                        </button>
                    </div>
                    <Slider
                        min={max_like_amount * 0.01}
                        max={max_like_amount}
                        step={max_like_amount / 100}
                        value={b}
                        onChange={this.handleWeightChange(up)}
                        onChangeComplete={this.storeSliderWeight(up)}
                        tooltip={false}
                    />
                    <div className="weight-display">
                        <input
                            type="number"
                            min={max_like_amount * 0.01}
                            max={max_like_amount}
                            value={b}
                            onChange={this.handleButtonWeightChange(up, -1)}
                        />
                    </div>
                    <div className="token-name-display">
                        {LIQUID_TOKEN_UPPERCASE}
                    </div>
                    {tokenBalances ? (
                        <div className="token-balance-display">
                            {tt('g.balances')} : {tokenBalances.get('balance')}{' '}
                            {LIQUID_TOKEN_UPPERCASE}
                        </div>
                    ) : (
                        ''
                    )}
                    {tokenBalances && tokenBalances.get('balance') < b ? (
                        <div className="error-display">
                            {tt('g.insufficient_balance')}
                        </div>
                    ) : (
                        ''
                    )}
                </span>
            );
        };

        // display thumbsup list
        if (thumbCnt > 0) {
            let thumbs = [];

            for (
                let v = 0;
                v < thumbList.length && thumbList.length < MAX_THUMBUP_DISPLAY;
                ++v
            ) {
                const { thumbup_account, thumbup_amount } = thumbList[v];

                if (thumbup_amount > 0) {
                    thumbs.push({
                        value:
                            '+ ' +
                            thumbup_account +
                            ' (' +
                            thumbup_amount +
                            ')',
                        link: '/@' + thumbup_account,
                    });
                }
            }

            thumbs_list = (
                <DropdownMenu
                    selected={thumbCnt + tt('g.thumbsup')}
                    className="Thumbsup__list"
                    items={thumbs}
                    el="div"
                />
            );
        }

        let dropdown = null;
        let thumbUpIcon = null;

        // thumbup button Enable
        if (
            enable_slider &&
            !isMyThumbUp &&
            author !== username &&
            !thumbup_active
        ) {
            let thumbupClick = e => {
                e && e.preventDefault();
                const amount = this.state.sliderWeight.up;

                // check token balance
                if (
                    tokenBalances &&
                    tokenBalances.get('balance') > 0 &&
                    tokenBalances.get('balance') > amount
                ) {
                    const memo =
                        `@${author}/${permlink}: Thumbs up payout (` +
                        `Author = ${amount * divide_author / 100}SCT,` +
                        ` Thumbsup pool = ${amount *
                            divide_rewards /
                            100}SCT,` +
                        ` Developer = ${amount * divide_dev / 100}SCT,` +
                        ` Burn = ${amount * divide_burn / 100}SCT)`;

                    dispatchSubmit({
                        to: receive_account, // for test
                        amount: amount + '',
                        memo,
                        author,
                        permlink,
                        username,
                    });
                }
            };

            dropdown = (
                <Dropdown
                    show={showWeight}
                    onHide={() => this.setState({ showWeight: false })}
                    onShow={() => {
                        this.setState({
                            showWeight: true,
                        });
                        this.readSliderWeight();
                    }}
                    title={<Icon name={'thumbup'} className="upthumb" />}
                >
                    <div className="ThumbUp__adjust_weight">
                        <a
                            href="#"
                            onClick={thumbupClick}
                            className="thumbup_confirm_weight"
                            title={tt('g.thumbsup')}
                        >
                            <Icon size="2x" name={'thumbup'} />
                        </a>
                        {slider(true)}
                        <CloseButton
                            className="ThumbUp__adjust_weight_close"
                            onClick={() => this.setState({ showWeight: false })}
                        />
                    </div>
                </Dropdown>
            );
        } else {
            thumbUpIcon = <Icon name={'thumbup_fill'} className="upthumb" />;
        }

        const classUp = 'ThumbUp__button ThumbUp__button-up';

        return (
            <span className="ThumbUp">
                <span className="ThumbUp__inner">
                    {thumbup_active ? (
                        <span className={classUp}>
                            <LoadingIndicator
                                style={{
                                    display: 'inline-block',
                                    left: '-36rem',
                                }}
                                type="circle"
                            />
                        </span>
                    ) : (
                        <span className={classUp}>
                            {thumbUpIcon}
                            {dropdown}
                        </span>
                    )}
                </span>
                {thumbs_list}
            </span>
        );
    }
}

// connect
export default connect(
    // mapStateToProps
    (state, ownProps) => {
        const post = state.global.getIn(['content', ownProps.post]);
        if (!post) return ownProps;
        const author = post.get('author');
        const permlink = post.get('permlink');
        const thumbup_active = state.global.get(
            `transaction_thumbup_active_${author}_${permlink}`
        );
        const current_account = state.user.get('current');
        const username = current_account
            ? current_account.get('username')
            : null;

        const tokenBalances = current_account
            ? current_account.get('token_balances')
            : null;
        const enable_slider = true;
        const scotConfig = state.app.get('scotConfig');

        const thumbupConfig = scotConfig.getIn(['config', 'thumbupConfig']);

        if (thumbupConfig) {
            console.log(`success load thumbsup config`);
        }

        return {
            post: ownProps.post,
            author,
            permlink,
            username,
            enable_slider,
            tokenBalances,
            thumbup_active,
            max_like_amount: thumbupConfig
                ? thumbupConfig.get('max_like_amount')
                : 100,
            receive_account: thumbupConfig
                ? thumbupConfig.get('receive_account')
                : 'uni.dev',
            divide_author: thumbupConfig
                ? thumbupConfig.get('divide_author')
                : 50,
            divide_rewards: thumbupConfig
                ? thumbupConfig.get('divide_rewards')
                : 10,
            divide_dev: thumbupConfig ? thumbupConfig.get('divide_dev') : 20,
            divide_burn: thumbupConfig ? thumbupConfig.get('divide_burn') : 20,
        };
    },

    dispatch => ({
      dispatchSubmit: ({
          to,
          amount,
          memo,
          author,
          permlink,
          username,
          errorCallback,
          successCallback,
      }) => {
          const transferOperation = {
              contractName: 'tokens',
              contractAction: 'transfer', // for test, transfer 로 변경
              contractPayload: {
                  symbol: LIQUID_TOKEN_UPPERCASE,
                  to: to,
                  quantity: amount,
                  memo: memo ? memo : '',
                  type: 'scot-thumbup',
                  author: author,
                  permlink: permlink,
                  sender: username,
              },
          };
          let operation = {
              id: 'ssc-mainnet1',
              required_auths: [username],
              json: JSON.stringify(transferOperation),
          };
          
          errorCallback = err => {
              console.log(err);
          };

          successCallback = s => {
            console.log(s);
            const get_metadata = () => {
                const meta = {};
                meta.app = `${APP_NAME.toLowerCase()}/0.1`;
                meta.format = 'markdown';
                return meta;
            };

            const __config = {};

            operation = {
                parent_author: author,
                parent_permlink: permlink,
                author: username,
                permlink: clean_permlink(
                    `thumbsup-comment-${author}-${permlink}`
                ), // only one
                category: '',
                title: '',
                body: tt('g.thumbsup_comment', 
                            { username: username, 
                              author:author, 
                              amount:amount, 
                              LIQUID_TOKEN:LIQUID_TOKEN_UPPERCASE 
                            }),
                json_metadata: get_metadata(),
                __config,
            };

            dispatch(
                transactionActions.broadcastOperation({
                    type: 'comment',
                    operation,
                    errorCallback,
                })
            );
          };

          dispatch(
              transactionActions.broadcastOperation({
                  type: 'custom_json',
                  operation,
                  errorCallback,
                  successCallback,
              })
          );
      },
  })
)(ThumbUp);