import React, { useState, useEffect, useContext, useRef } from 'react';
import { Chat } from '@progress/kendo-react-conversational-ui';
import { API_URL, API_TOKEN } from '../constants';
import { ConnectionContext } from '../connection-context';

const Conversation = (props) => {
    const [messages, setMessages] = useState([]);
    const proxy = useContext(ConnectionContext);
    const messagesRef = useRef();

messagesRef.current = messages;

    useEffect(() => {
        if(!proxy) return;
        proxy.on('eventReceived', (type, data) => {
            switch(type){
                case "message-inserted.weavy": 
                    let json = JSON.parse(data);
                    if(json.createdBy.id !== props.user.id){
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

        if (!props.conversationid) return;

        fetch(API_URL + '/api/conversations/' + props.conversationid + '/messages', {
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
    }, [props.conversationid]);

    const addNewMessage = (event) => {
        setMessages([...messages, event.message]);
        let json = JSON.stringify({ text: event.message.text });
        fetch(API_URL + '/api/conversations/' + props.conversationid + '/messages', {
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