import React, { useState, useEffect, useContext, useRef } from 'react';
import { Chat } from '@progress/kendo-react-conversational-ui';
import { API_URL, API_TOKEN } from '../constants';
import { ConnectionContext } from '../connection-context';

const Conversation = (props) => {
    const [messages, setMessages] = useState([]);
    const proxy = useContext(ConnectionContext);
    const messagesRef = useRef();
    const conversationRef = useRef();
    messagesRef.current = messages;
    conversationRef.current = props.conversationId

    useEffect(() => {
        if (!proxy) return;

         // add event handler for message inserted. Triggered from server when a new message is added to one of the users conversations
        proxy.on('eventReceived', (type, data) => {
            switch (type) {
                case "message-inserted.weavy":
                    let message = JSON.parse(data);
                    if (message.createdBy.id !== props.user.id) {

                        // add incoming message to messages list
                        setMessages([...messagesRef.current, {
                            text: message.text,
                            timestamp: new Date(message.createdAt),
                            author: { id: message.createdBy.id, name: message.createdBy.name }
                        }]);
                    }
                    break;
                default:
            }
        });
    }, [proxy])

    useEffect(() => {

        if (!props.conversationId) return;

        // get the messages for the current conversation
        fetch(API_URL + '/api/conversations/' + props.conversationId + '/messages', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + API_TOKEN
            }
        })
            .then(res => res.json())
            .then((r) => {
                setMessages(r.data.map((m) => {
                    return {
                        text: m.text,
                        timestamp: new Date(m.created_at),
                        author: { id: m.created_by.id, name: m.created_by.name }
                    }
                }));
            });
    }, [props.conversationId]);

    // add new message handler
    const addNewMessage = (event) => {
        // add message
        setMessages([...messages, event.message]);
        
        // create new message model
        let json = JSON.stringify({ text: event.message.text });
        fetch(API_URL + '/api/conversations/' + props.conversationId + '/messages', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + API_TOKEN
            },
            body: json
        });
    };

    return (
        <div>
            <Chat
                user={props.user}
                placeholder="Type a message..."
                messages={messages}
                onMessageSend={addNewMessage}
            />
        </div>
    );
}

export default Conversation;