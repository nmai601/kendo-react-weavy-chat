import React, { useState } from 'react';
import UserContext from './user-context';

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (user) => {
        setUser(user);
    }

    return (
        <UserContext.Provider value={{
            user,
            login
        }}>
            {children}
        </UserContext.Provider>

    );
}

export default UserProvider;