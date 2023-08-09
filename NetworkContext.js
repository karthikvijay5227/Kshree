import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
    const [isNetworkAvailable, setIsNetworkAvailable] = useState(true);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsNetworkAvailable(state.isConnected);
        });

        return () => unsubscribe();
    }, []);

    return (
        <NetworkContext.Provider value={isNetworkAvailable}>
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetworkStatus = () => {
    return useContext(NetworkContext);
};
