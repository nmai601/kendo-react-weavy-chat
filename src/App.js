import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '@progress/kendo-theme-bootstrap/dist/all.css';
import React, { useState, useEffect } from 'react';
import { API_URL, API_TOKEN } from './constants';
import Conversation from './components/Conversation';
import ConversationList from './components/ConversationList';
import Loading from './components/Loading';
import ConnectionProvider from './connection-provider';

const App = () => {

  const [currentConversation, setCurrentConversation] = useState();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL + '/api/users/me/', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + API_TOKEN
      }
    })
      .then(res => res.json())
      .then((r) => {
        setUser(r);
        setLoading(false);
      });
  }, [])

  if (loading) {
    return <Loading />;
  }

  return (
    <ConnectionProvider>
      <div>
        <div className="row">
          <div className="col-4">
            <ConversationList onSelectConversation={setCurrentConversation} user={user} />
          </div>
          <div className="col">
            <Conversation conversationId={currentConversation} user={user} />
          </div>
        </div>
      </div>
    </ConnectionProvider>
  );
}
export default App;
