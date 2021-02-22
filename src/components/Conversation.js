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
<<<<<<< HEAD

         // add event handler for message inserted. Triggered from server when a new message is added to one of the users conversations
        proxy.on('eventReceived', (type, data) => {
            switch (type) {
                case "message-inserted.weavy":
                    let message = JSON.parse(data);
                    if (message.createdBy.id !== props.user.id) {

                        // add incoming message to messages list
=======
        console.log("Adding handler")
        proxy.on('eventReceived', (type, data) => {
            switch (type) {
                case "message-inserted.weavy":
                    let json = JSON.parse(data);
                    console.log("Message received in conversation ...", json)
                    if (json.createdBy.id !== props.user.id && conversationRef.current == json.conversation) {
>>>>>>> 349bf81b7ae2485684ae092055383e003ea86825
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

<<<<<<< HEAD
        // get the messages for the current conversation
        fetch(API_URL + '/api/conversations/' + props.conversationid + '/messages', {
=======
        fetch(API_URL + '/api/conversations/' + props.conversationId + '/messages', {
>>>>>>> 349bf81b7ae2485684ae092055383e003ea86825
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