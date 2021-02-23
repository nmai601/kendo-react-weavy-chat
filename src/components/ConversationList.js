import React, { useEffect, useState, useContext, useRef } from 'react';
import { Avatar } from '@progress/kendo-react-layout';
import UserContext from "../user-context";
import ConnectionContext from '../connection-context';
import { API_URL } from '../constants';


const ConversationList = (conversationProps) => {
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const conversationsRef = useRef();
    const { user } = useContext(UserContext);
    const {proxy} = useContext(ConnectionContext);
    conversationsRef.current = conversations;
       
    useEffect(() => {
        
        if (!proxy) return;

        // add event handler for message inserted. Triggered from server when a new message is added to one of the users conversations
        proxy.on('eventReceived', (type, data) => {
            switch (type) {
                case "message-inserted.weavy":
                    
                    messageReceived(data);
                    break;
                default:
            }
        });
    }, [proxy])

    // Message received handler
    const messageReceived = (data) => {

        // get message from realtime data
        let message = JSON.parse(data);  
        
        // try to get conversation from the current list      
        let conversation = conversationsRef.current.find((c) => { return c.id === message.conversation });
        if (conversation) {
            
            // update the last message and read status
            conversation.last_message.text = message.text;
            conversation.is_read = false;

            // update the conversation list
            setConversations([...conversationsRef.current])
        }
    };

    // sort conversation list by last message
    const sortByCreated = (list) => {
        return list.sort((a, b) => {
            return new Date(b?.last_message?.created_at) - new Date(a?.last_message?.created_at);
        });
    }

    // conversation click handler
    const handleConversationClick = (id) => {        
        conversationProps.onSelectConversation(id);
        setCurrentConversation(id);
    }

    useEffect(() => {

        // get the converstions for the user
        fetch(API_URL + '/api/conversations/', {
            method: 'GET',
            credentials: 'include',        
            headers: {
                'Accept': 'application/json'                        
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
                let title = (c.is_room ?? false) ? c.name : (c.members.filter((m) => { return m.id !== user.id })[0].name)
                let message = c.last_message != null ? c.last_message.text.substring(0, 50) : '';

                return <li  key={c.id} onClick={handleConversationClick.bind(this, c.id)} className={'list-item ' + (currentConversation === c.id ? 'selected ' : ' ') + (!c.is_read ? 'unread' : '')}>
                    <div className="list-item-container">
                        <Avatar shape='circle' type='image' style={{ backgroundColor: '#fff' }}>                            
                            <img src={`${API_URL}${c.thumb.replace('{options}', '34')}`}/>
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