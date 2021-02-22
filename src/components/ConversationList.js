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
<<<<<<< HEAD

        // add event handler for message inserted. Triggered from server when a new message is added to one of the users conversations
=======
    
>>>>>>> 349bf81b7ae2485684ae092055383e003ea86825
        proxy.on('eventReceived', (type, data) => {
            switch (type) {
                case "message-inserted.weavy":
                    messageReceived(data);
                    break;
                default:
            }
        });
    }, [proxy])

<<<<<<< HEAD
    // Message received handler
    const messageReceived = (data) => {

        // get message from realtime data
        let message = JSON.parse(data);  
        // try to get conversation from the current list      
        let conversation = conversationsRef.current.find((c) => { return c.id === message.conversationId });
        if (conversation) {
            // update the last message and read status
            conversation.last_message.text = message.text;
            conversation.is_read = false;

            // update the conversation list
=======
    
    const messageReceived = (data) => {        
        
        let d = JSON.parse(data);
        console.log("Message received in conversation list...", d)
        let conversationId = d.conversation;
        let c = conversationsRef.current.find((c) => { return c.id === conversationId });
        if (c) {
            c.last_message.text = d.text;
            c.is_read = false;
>>>>>>> 349bf81b7ae2485684ae092055383e003ea86825
            setConversations([...conversationsRef.current])
        }
    };

    // sort conversation list by last message
    const sortByCreated = (list) => {
        return list.sort((a, b) => {
            return new Date(b.last_message.created_at) - new Date(a.last_message.created_at);
        });
    }

    // conversation click handler
    const handleConversationClick = (id) => {
        conversationProps.onSelectConversation(id);
        setCurrentConversation(id);
    }
<<<<<<< HEAD

    // renderer for the List Item
    const ConversationItemRender = (props) => {
        let conversation = props.dataItem;
        let title = (conversation.is_room ?? false) ? conversation.name : (conversation.members.filter((m) => { return m.id !== conversationProps.user.id })[0].name)
        let message = conversation.last_message != null ? conversation.last_message.text.substring(0, 50) : '';

        return (
            <div className={'row conversation-list-item ' + (currentConversation === conversation.id ? 'selected ' : ' ') + (!conversation.is_read ? 'unread' : '')} style={{ margin: 0 }} onClick={handleConversationClick.bind(this, conversation.id)}>
                <div className="col-1">
                    <Avatar shape='circle' type='image'>
                        <AuthImage src={`${API_URL}${conversation.thumb.replace('{options}', '92')}`} />
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
=======
  
>>>>>>> 349bf81b7ae2485684ae092055383e003ea86825

    useEffect(() => {

        // get the converstions for the user
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