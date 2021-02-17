import {ConnectionContext} from './connection-context';
import { hubConnection } from 'signalr-no-jquery';
import {useState, useEffect} from 'react';
import { API_URL, API_TOKEN } from './constants';
const ConnectionProvider = (props) => {

    const [proxy, setProxy] = useState(null);

    useEffect(() => {
        
        const connection = hubConnection(API_URL, { qs: { Bearer: API_TOKEN } });
        const hubProxy = connection.createHubProxy('rtm');
        setProxy(hubProxy);
        hubProxy.on('init', (type, data) => {});

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