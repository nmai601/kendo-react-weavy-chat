import React from 'react';

const ConnectionContext = React.createContext(
    {
        connect: () => null,
        proxy: null
    }
);

export default ConnectionContext