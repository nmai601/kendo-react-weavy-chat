import React, { useEffect, useState, useContext, useRef } from 'react';
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
        console.log("Message received in conversation list...", d)
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
       
        <ul>
            {conversations.map((c) => {
                let title = (c.is_room ?? false) ? c.name : (c.members.filter((m) => { return m.id !== conversationProps.user.id })[0].name)
                let message = c.last_message != null ? c.last_message.text.substring(0, 50) : '';

                return <li  key={c.id} onClick={handleConversationClick.bind(this, c.id)} className={'list-item ' + (currentConversation === c.id ? 'selected ' : ' ') + (!c.is_read ? 'unread' : '')}>
                    <div className="list-item-container">
                        <Avatar shape='circle' type='image' style={{ backgroundColor: '#fff' }}>
                            <AuthImage src={`${API_URL}${c.thumb.replace('{options}', '32')}`} />
                        </Avatar>
                        <div className="list-item-content">
                            <div>{title}</div>
                            <small>{message}</small>
                        </div>
                    </div>
                </li>
            })}
        </ul>
    )
};

export default React.memo(ConversationList);