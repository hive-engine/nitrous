import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import * as chatActions from 'app/redux/ChatReducer';
import { Avatar, ChatList, ChatListItem, Column, Row, Title } from '@livechat/ui-kit';

class ChatListSelect extends React.PureComponent {
    
    componentDidMount() {
        this.componentDidUpdate();
    }

    componentDidUpdate() {
        const {
            username,
            accessToken,
            chatList,
            login,
            fetchChatList,
        } = this.props;
        if (!accessToken) {
            login(username);
        } else if (!chatList) {
            fetchChatList();
        }
    }

    render() {
        const { 
            loading,
            chatList,
            onSelect,
        } = this.props;
        if (loading) {
            return (
               <div
                   style={{
                       flexGrow: 1,
                       minHeight: 0,
                       height: '100%',
                       background: '#fff',
                   }}
               >
                   <center>
                       <LoadingIndicator
                           style={{ marginBottom: '2rem' }}
                           type="circle"
                       />
                   </center>
               </div>
            );
        }
        return (
           <div className='ChatListBackground'>
               <ChatList>
                   {chatList ? chatList.toJS().map(chat => (
                       <ChatListItem key={chat.id} onClick={() => onSelect(chat)}>
                           <Avatar letter={(chat.name ? chat.name : chat.members[0])[0]} />
                           <Column fill>
                               <Row justify>
                                   <Title ellipses>
                                       {chat.name || chat.members.join(', ')}
                                   </Title>
                               </Row>
                           </Column>
                       </ChatListItem>
                   )) : []}
               </ChatList>
           </div>
        );
    }
}

export default connect(
    (state, ownProps) => {
        const currentAccount = state.user.get('current');
        const username = currentAccount.get('username');
        const accessToken = state.chat.getIn(['accessToken', username]);
        const chatList = state.chat.get('chatList');
        const loading = !accessToken || !chatList;
        return {
            ...ownProps,
            username,
            accessToken,
            chatList,
            loading,
        };
    },
    dispatch => ({
        login: (username) => {
            dispatch(chatActions.login({ username }));
        },
        fetchChatList: () => {
            dispatch(chatActions.fetchChatList());
        },
    }),
)(ChatListSelect);
