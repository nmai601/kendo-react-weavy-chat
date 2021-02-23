import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '@progress/kendo-theme-bootstrap/dist/all.css';
import React, { useState, useReducer } from 'react';
import Conversation from './components/Conversation';
import ConversationList from './components/ConversationList';
import LoginForm from './LoginForm';
import UserContext from './UserContext';
import ConnectionContext from './connection-context';
import { hubConnection } from 'signalr-no-jquery';
import { API_URL } from './constants';

const INITIAL_USER_STATE = {
  user: null
};
const INITIAL_CONNECTION_STATE = {
  proxy: null
};

const connectionReducer = (state, action) => {
  switch (action.type) {
    case "connect": {
      //const {  } = action.payload;
      
      const connection = hubConnection(API_URL);
      const hubProxy = connection.createHubProxy('rtm');      
      hubProxy.on('init', (type, data) => {}); // dummy event to get signalR started...
      if (connection) {
          connection.start();
      }

      return {
        ...state,
        proxy: hubProxy
      };
    }
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

const userReducer = (state, action) => {
  switch (action.type) {
    case "login": {
      const { user } = action.payload;
      return {
        ...state,
        user: user
      };
    }
    case "logout":
      return {
        ...state,
        user: null
      };
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

const App = () => {

  const [currentConversation, setCurrentConversation] = useState();
  const [userState, dispatchUser] = useReducer(userReducer, INITIAL_USER_STATE);
  const [connectionState, dispatchConnection] = useReducer(connectionReducer, INITIAL_CONNECTION_STATE);

  const currentUserValue = {
    user: userState.user,
    login: (user) =>
    dispatchUser({
        type: "login",
        payload: { user }
      }),
    logout: () => dispatchUser({ type: "logout" })
  };

  const currentConnectionValue = {
    proxy: connectionState.proxy,
    connect: () =>
      dispatchConnection({
        type: "connect",
        payload: {  }
      })    
  };

  return (
    <UserContext.Provider value={currentUserValue}>
      <ConnectionContext.Provider value={currentConnectionValue}>

        {userState.user && connectionState.proxy &&
          <div>
            <div className="row">
              <div className="col-4">
                <ConversationList onSelectConversation={setCurrentConversation} />
              </div>
              <div className="col">
                <Conversation conversationId={currentConversation} />
              </div>
            </div>
          </div>
        }
        {!userState.user && <LoginForm />}
      </ConnectionContext.Provider>
    </UserContext.Provider>
  );
}
export default App;
