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
        console.log("Adding handler")
        proxy.on('eventReceived', (type, data) => {
            switch (type) {
                case "message-inserted.weavy":
                    let json = JSON.parse(data);
                    console.log("Message received in conversation ...", json)
                    if (json.createdBy.id !== props.user.id && conversationRef.current == json.conversation) {
                        setMessages([...messagesRef.current, {
                            text: json.text,
                            timestamp: new Date(json.createdAt),
                            author: { id: json.createdBy.id, name: json.createdBy.name }
                        }]);
                    }
                    break;
                default:
            }
        });
    }, [proxy])

    useEffect(() => {

        if (!props.conversationId) return;

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

    const addNewMessage = (event) => {
        setMessages([...messages, event.message]);
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