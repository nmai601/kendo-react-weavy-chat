import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '@progress/kendo-theme-bootstrap/dist/all.css';
import React from 'react';
import LoginForm from './LoginForm';
import ConnectionProvider from './connection-provider';
import UserProvider from './user-provider';
import Conversation from './Conversation';

const App = () => {  
  return (
    <UserProvider>
      <ConnectionProvider>
        <Conversation/>
        <LoginForm />
      </ConnectionProvider>
    </UserProvider>
  );
}
export default App;
