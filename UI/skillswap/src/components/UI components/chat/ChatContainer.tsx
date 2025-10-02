import MessageComponent from "./MessageComponent";
import { Paper, Typography, TextField } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { useState, useRef } from "react";

const data = [
    { id: 1, text: "Hey, are we still meeting up for the project review?", isSender: false, timestamp: "9:30 AM", senderName: "Alex" },
    { id: 2, text: "Yes, absolutely! Did you get the info pack?", isSender: true, timestamp: "9:32 AM", senderName: "You" },
    { id: 3, text: "I did thanks", isSender: false, timestamp: "9:35 AM", senderName: "Alex" },
    { id: 4, text: "Cool Chat Later", isSender: true, timestamp: "9:38 AM", senderName: "You" },
    { id: 5, text: "This message is long just to test how the wrapping looks and to ensure that the maximum width constraints are working on both the sender and receiver sides.", isSender: false, timestamp: "9:45 AM", senderName: "Alex" },
];

const ChatContainer: React.FC = () => {
    const [messages, setMessages] = useState(data);
    const [message, setMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };

    const handleSubmit = () => {
        if (!message.trim()) return; 

        const now = new Date();
        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newMessage = {
            id: messages.length + 1,
            text: message,
            isSender: true,
            timestamp: timestamp,
            senderName: "You"
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);
        
        // Clear the input field
        setMessage('');
        scrollToBottom()
    };

    return (
            <Paper className="w-full max-w-xl bg-gray-50 p-4 sm:p-6 h-[80vh] flex flex-col">
                <Typography className="flex justify-center text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Messages</Typography>

                {/* Chat Message Area */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {messages.map(msg => (
                        <MessageComponent key={msg.id} {...msg} />
                    ))}
                </div>

                {/* Input Area */}
                <div className="mt-6 pt-4 border-t flex justify-center items-center space-x-3">
                    <TextField
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 p-3 "
                        multiline
                        maxRows={5}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-150 shadow-md h-15 w-15"
                    >
                        <SendIcon />
                    </button>
                </div>
            </Paper>
            );
}


export default ChatContainer