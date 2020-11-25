import { List, Set } from 'immutable';
import React from 'react';
import Autocomplete from 'react-autocomplete';
import { connect } from 'react-redux';
import { Column, Row, Title } from '@livechat/ui-kit';
import ChatLayout from 'app/components/modules/chat/ChatLayout';
import * as chatActions from 'app/redux/ChatReducer';

class NewConversation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            to: '',
            message: '',
        };
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const {
            username,
            chatList,
            setNewConversation,
            setConversation,
        } = this.props;
        if (chatList && this.state.submitting) {
            const newChat = chatList.filter(c => c.has('members') && Set(c.get('members').filter(m => m !== username)).equals(Set([this.state.to])));
            if (!newChat.isEmpty()) {
                this.setState({
                    to: '',
                    message: '',
                    submitting: false,
                });
                setNewConversation(false);
                setConversation(newChat.get(0).toJS());
            }
        }
    }

    matchAutocompleteUser(item, value) {
        return item.toLowerCase().indexOf(value.toLowerCase()) > -1;
    }

    onSubmit(e) {
        e.preventDefault();
        const { to, message } = this.state;
        this.setState({ submitting: true });
        this.props.startChat(to, message);
    }

    render() {
        const { 
            minimize,
            setNewConversation,
        } = this.props;
        const {
            submitting,
            to,
            message,
        } = this.state;
        const title = "New Conversation";
        return (
            <ChatLayout title={title} minimize={minimize} showChatList={() => setNewConversation(false)}>
                <div className='ChatListBackground'>
                    <form
                        onSubmit={this.onSubmit}
                    >
                        <Row>
                            <Column>
                                <Title style={{margin: '0.5em', width: '5em'}}>
                                    Recipient:
                                </Title>
                            </Column>
                            <Column>
                                <Autocomplete
                                    wrapperStyle={{
                                        display: 'inline-block',
                                        width: '100%',
                                        margin: '0.5em',
                                    }}
                                    inputProps={{
                                        type: 'text',
                                        className: 'input-group-field',
                                        autoComplete: 'off',
                                        autoCorrect: 'off',
                                        autoCapitalize: 'off',
                                        spellCheck: 'false',
                                        disabled: submitting,
                                    }}
                                    renderMenu={items => (
                                        <div
                                            className="react-autocomplete-input"
                                            children={items}
                                        />
                                    )}
                                    items={this.props.following}
                                    getItemValue={item => item}
                                    shouldItemRender={
                                        this.matchAutocompleteUser
                                    }
                                    renderItem={(item, isHighlighted) => (
                                        <div
                                            className={
                                                isHighlighted ? 'active' : ''
                                            }
                                        >
                                            {item}
                                        </div>
                                    )}
                                    value={to || ''}
                                    onChange={e => {
                                        this.setState({
                                            to: e.target.value
                                        });
                                    }}
                                    onSelect={val =>
                                        this.setState({ to: val })
                                    }
                                />
                            </Column>
                        </Row>
                        <Row>
                            <Column>
                                <Title style={{margin: '0.5em', width: '5em'}}>
                                    Message:
                                </Title>
                            </Column>
                            <Column>
                                <input type='text' value={message} onChange={e => this.setState({message: e.target.value})}
                                    style={{margin: '0.5em'}}
                                />
                            </Column>
                        </Row>
                        <Row>
                            <button
                                type="submit"
                                disabled={submitting || !to || !message}
                                className="button"
                                style={{margin: '0.5em'}}
                            >
                                Create
                            </button>
                        </Row>
                    </form>
                </div>
            </ChatLayout>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const currentAccount = state.user.get('current');
        const username = currentAccount.get('username');
        const chatList = state.chat.get('chatList');
        return {
            ...ownProps,
            username,
            chatList,
            following: state.global.getIn([
                'follow',
                'getFollowingAsync',
                username,
                'blog_result',
            ], List()).toJS(),
        };
    },
    dispatch => ({
        startChat: (to, message) => {
            dispatch(chatActions.startChat({ to, message }));
        },
    }),
)(NewConversation);
