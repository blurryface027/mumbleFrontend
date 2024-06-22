import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
} from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import { useAuthContext } from "./AuthContext";

// Define the shape of the context value
interface ISocketContext {
  websocket: ReconnectingWebSocket | null;
  onlineUsers: string[];
}

// Create the context
const SocketContext = createContext<ISocketContext | undefined>(undefined);

// Custom hook to use the context
export const useSocketContext = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

// Determine WebSocket URL based on environment
const wsURL = "wss://mumblebackend-production.up.railway.app/ws";
const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { authUser, isLoading } = useAuthContext();
  const websocketRef = useRef<ReconnectingWebSocket | null>(null);

  useEffect(() => {
    // If the user is authenticated and not loading, establish the WebSocket connection
    if (authUser && !isLoading) {
      const websocket = new ReconnectingWebSocket(
        `${wsURL}?userId=${authUser.id}`
      );
      websocketRef.current = websocket;

      // Handle incoming messages
      websocket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        if (data.type === "getOnlineUsers") {
          setOnlineUsers(data.content);
        }
      };

      // Cleanup on unmount
      return () => {
        websocket.close();
        websocketRef.current = null;
      };
    } else if (!authUser && !isLoading) {
      if (websocketRef.current) {
        websocketRef.current.close();
        websocketRef.current = null;
      }
    }
  }, [authUser, isLoading]);

  return (
    <SocketContext.Provider
      value={{ websocket: websocketRef.current, onlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
