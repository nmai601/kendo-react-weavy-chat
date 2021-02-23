import React, { useState, useContext } from "react";
import UserContext from "./user-context";
import Messages from './components/Messages';
import ConversationList from './components/ConversationList';

const Conversation = () => {
    const { user } = useContext(UserContext);
    const [currentConversation, setCurrentConversation] = useState();
    return (
        <div>
            {user &&
                <div>
                    <div className="row">
                        <div className="col-4">
                            <ConversationList onSelectConversation={setCurrentConversation} />
                        </div>
                        <div className="col">
                            <Messages conversationId={currentConversation} />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
export default Conversation;