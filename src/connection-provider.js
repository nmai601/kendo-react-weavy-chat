import {ConnectionContext} from './connection-context';
import { hubConnection } from 'signalr-no-jquery';
import {useState, useEffect} from 'react';
import { API_URL } from './constants';
const ConnectionProvider = (props) => {

    const [proxy, setProxy] = useState(null);

    useEffect(() => {
        
        const connection = hubConnection(API_URL);
        const hubProxy = connection.createHubProxy('rtm');
        setProxy(hubProxy);
        hubProxy.on('init', (type, data) => {}); // dummy event to get signalR started...

        if (connection) {
            connection.start();
        }
    }, []);


    return (
        <ConnectionContext.Provider value={proxy}>
            {props.children}
        </ConnectionContext.Provider>

    );
}

export default ConnectionProvider;