import React, { useEffect, useState, useContext, useRef } from 'react';
import { ListView, } from '@progress/kendo-react-listview';
import { Avatar } from '@progress/kendo-react-layout';
import { API_URL, API_TOKEN } from '../constants';
import AuthImage from './AuthImage';
import { ConnectionContext } from '../connection-context';

const ConversationList = (conversationProps) => {
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const conversationsRef = useRef();
    const proxy = useContext(ConnectionContext);
    conversationsRef.current = conversations;

    useEffect(() => {
        if (!proxy) return;
        proxy.on('eventReceived', (type, data) => {
            switch (type) {
                case "message-inserted.weavy":
                    messageReceived(data);
                    break;
                default:
            }
        });
    }, [proxy])

    const messageReceived = (data) => {
        let d = JSON.parse(data);
        let conversationId = d.conversation;
        let c = conversationsRef.current.find((c) => { return c.id === conversationId });
        if (c) {
            c.last_message.text = d.text;
            c.is_read = false;
            setConversations([...conversationsRef.current])
        }
    };

    const sortByCreated = (list) => {
        return list.sort((a, b) => {
            return new Date(b.last_message.created_at) - new Date(a.last_message.created_at);
        });
    }

    const handleConversationClick = (id) => {
        conversationProps.onSelectConversation(id);
        setCurrentConversation(id);
    }
    const ConversationItemRender = (props) => {
        let item = props.dataItem;
        let title = (item.is_room ?? false) ? item.name : (item.members.filter((m) => { return m.id !== conversationProps.user.id })[0].name)
        let message = item.last_message != null ? item.last_message.text.substring(0, 50) : '';

        return (
            <div className={'row conversation-list-item ' + (currentConversation === item.id ? 'selected ' : ' ') + (!item.is_read ? 'unread' : '')} style={{ margin: 0 }} onClick={handleConversationClick.bind(this, item.id)}>
                <div className="col-1">
                    <Avatar shape='circle' type='image'>
                        <AuthImage src={`${API_URL}${item.thumb.replace('{options}', '92')}`} />
                    </Avatar>
                </div>
                <div className="col">
                    <div>
                        {title}
                    </div>
                    <div>
                        <small>{message}</small>
                    </div>
                </div>
            </div>
        )
    }

    useEffect(() => {

        fetch(API_URL + '/api/conversations/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + API_TOKEN
            },
        })
            .then(res => res.json())
            .then((r) => {
                var sorted = sortByCreated(r);
                setConversations(sorted);
                handleConversationClick(sorted[0].id)
            });
    }, []);

    return (
        <ListView
            data={conversations}
            item={ConversationItemRender}
        />
    )
};

export default React.memo(ConversationList);