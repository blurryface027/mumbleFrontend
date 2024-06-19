
import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation'; // Importing Zustand hook
import notificationSound from '../assets/sounds/notification.mp3';
import { MessageType } from '../zustand/useConversation'; // Adjust according to your Zustand setup

const useListenMessages = () => {
    const { websocket } = useSocketContext();
    const {messages, setMessages } = useConversation(); // Destructuring setMessages from Zustand hook

    useEffect(() => {
        if (websocket) {
            const handleNewMessage = (event: MessageEvent) => {
                const newMessage: MessageType = JSON.parse(event.data); // Assuming MessageType is correctly defined in Zustand
                newMessage.shouldShake = true; // Example modification to the new message
                const sound = new Audio(notificationSound);
                sound.play();
                setMessages([...messages,newMessage]);
            };

            websocket.addEventListener('message', handleNewMessage);

            return () => {
                websocket.removeEventListener('message', handleNewMessage);
            };
        }
    }, [websocket, setMessages]);

    // Optionally, handle any cleanup or additional effects here

};

export default useListenMessages;

