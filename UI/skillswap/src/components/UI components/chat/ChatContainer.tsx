import React, { useState, useRef, useEffect } from "react";
import { Typography, TextField, Box, Button, useTheme } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { getConversationMessages } from './MockChatServiceData'; 
import type { MessageModel } from "./MockChatServiceData";

interface MessageProps extends MessageModel {
    senderName: string;
}


const MessageComponent: React.FC<MessageProps> = (props) => {
    const theme = useTheme();
    
    const senderStyle = {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        className: 'rounded-tr-none text-white',
    };

    const receiverStyle = {
        backgroundColor: theme.palette.secondary.main, 
        color: theme.palette.secondary.contrastText,
        className: 'rounded-tl-none', 
    };

    const bubbleStyles = props.isSender ? senderStyle : receiverStyle;

    return (
        <Box className={`flex ${props.isSender ? 'justify-end' : 'justify-start'}`}>
            <Box 
                className={`max-w-xs p-3 rounded-xl shadow-sm ${bubbleStyles.className}`} 
                style={{ backgroundColor: bubbleStyles.backgroundColor, color: bubbleStyles.color }}
            >
                <p className="text-sm">{props.text}</p>
                <span className={`text-xs block mt-1 text-right`}
                style={{ color: bubbleStyles.color, opacity: 0.6}}>
                    {props.timestamp}
                </span>
            </Box>
        </Box>
    );
};


interface ChatContainerProps {
    conversationId: string;
    partnerName: string;
    sendMessage: (conversationId: string, text: string) => void;
    onMessageSent: () => void; 
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
    conversationId, 
    partnerName, 
    sendMessage, 
    onMessageSent 
}) => {
    const [messages, setMessages] = useState<MessageProps[]>([]); 
    const [message, setMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const loadedMessages = getConversationMessages(conversationId) || [];
        setMessages(loadedMessages as MessageProps[]);
        scrollToBottom(); 
    }, [conversationId]); 
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };

    const handleSubmit = () => {
        if (!message.trim()) return; 
        sendMessage(conversationId, message);
        onMessageSent(); 
        setMessage('');
    };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };


    return (
        <Box className="w-full h-full flex flex-col"> 
            
            {/* Header */}
            <Typography variant="h5" className="p-4 font-bold border-b text-gray-800 flex-shrink-0">
                Chat with {partnerName}
            </Typography>

            {/* Chat Message Area */}
            <Box className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.map(msg => (
                    <MessageComponent key={msg.id} {...msg} senderName={msg.isSender ? "You" : partnerName} />
                ))}
                <Box ref={chatEndRef} />
            </Box>

            {/* Input Area */}
            <Box className="p-4 border-t border-gray-200 flex items-end space-x-3 bg-gray-50 flex-shrink-0">
                <TextField
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1"
                    multiline
                    maxRows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown as any} 
                    fullWidth
                    InputProps={{
                        className: "bg-white rounded-lg",
                    }}
                />
                <Button
                    onClick={handleSubmit}
                    disabled={!message.trim()}
                    color="primary"
                    variant="contained"
                    sx={{ 
                        p: 0, 
                        minWidth: 0,
                    }}
                    className="h-14 w-14 flex items-center justify-center flex-shrink-0 disabled:bg-gray-400 rounded-full"
                >
                    <SendIcon className="h-6 w-6" />
                </Button>
            </Box>
        </Box>
    );
};

export default ChatContainer;