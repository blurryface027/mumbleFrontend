
import { useEffect } from 'react';
import { useSocketContext } from '../context/SocketContext';
import useConversation from '../zustand/useConversation'; 
import notificationSound from '../assets/sounds/notification.mp3';
import { MessageType } from '../zustand/useConversation'; 

const useListenMessages = () => {
  const { websocket } = useSocketContext();
  const {messages, setMessages } = useConversation(); 

  useEffect(() => {
    if (websocket) {
      const handleNewMessage = (event: MessageEvent) => {
        const newMessage: MessageType = JSON.parse(event.data); 
        if (!newMessage.body || !newMessage.createdAt || isNaN(Date.parse(newMessage.createdAt))) {
          console.warn("Invalid message received:", newMessage);
          return;
        }
        newMessage.shouldShake = true; 
        const sound = new Audio(notificationSound);
        sound.play();
        setMessages([...messages,newMessage]);
      };

      websocket.addEventListener('message', handleNewMessage);

      return () => {
        websocket.removeEventListener('message', handleNewMessage);
      };
    }
  }, [websocket,messages, setMessages]);


};

export default useListenMessages;

