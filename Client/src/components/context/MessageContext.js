import React, { createContext, useState, useEffect , useContext } from 'react';


const MessageContext = createContext();


export const useMessages = () => {
    return useContext(MessageContext);
};


export const MessageProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);

    const getAllMessages = async () => {
        try {
            const res = await fetch("http://localhost:7123/msg/messages");
            const data = await res.json();
            setMessages(data.reverse());
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getAllMessages();
    }, []);


    return (
        <MessageContext.Provider value={{ messages, getAllMessages }}>
            {children}
        </MessageContext.Provider>
    );
};
