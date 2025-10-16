import React, { useState, useEffect, useCallback } from "react";
import { Paper, Box, Typography, useTheme } from "@mui/material";
import { useLocation } from "react-router";
import ConversationListItem from "../components/UI components/chat/ConversationListItem";
import ChatContainer from "../components/UI components/chat/ChatContainer"; 
import type { ConversationModel } from "../components/UI components/chat/MockChatServiceData";

// Mock Data Service
import { 
    getAllConversations, 
    sendNewMessage, 
    markConversationAsRead,
    subscribeToNewConversationEvents
} from '../components/UI components/chat/MockChatServiceData'; 


type ConversationListItemData = Omit<ConversationModel, 'messages'>;

const ConnectionsPage: React.FC = () => {
    const [conversations, setConversations] = useState<ConversationListItemData[]>(getAllConversations());
    const location = useLocation();
    const index = location.state?.id;
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>( index !== undefined ? conversations[index].id :
        conversations[0]?.id || null
    );
    const theme = useTheme();
    
    const refreshConversations = useCallback(() => {
        console.log("ConnectionsPage: Refreshing conversations list due to external event.");
        const sortedConversations = getAllConversations();
        setConversations(sortedConversations);
        
        if (!selectedConversationId && sortedConversations.length > 0) {
             setSelectedConversationId(sortedConversations[0].id);
        }
    }, [selectedConversationId]); 
    

    useEffect(() => {
        const unsubscribe = subscribeToNewConversationEvents(() => {
            refreshConversations();
        });

        return () => unsubscribe();
    }, [refreshConversations]); 

    useEffect(() => {
        if (selectedConversationId) {
            console.log(`Marking conversation ${selectedConversationId} as read.`);
            markConversationAsRead(selectedConversationId);
            refreshConversations(); 
        }
    }, [selectedConversationId, refreshConversations]);


    const handleSelectConversation = (id: string) => {
        setSelectedConversationId(id);
        markConversationAsRead(id);
        refreshConversations(); 
    };

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    useEffect(() => {
        refreshConversations();
    }, []);


    return (
        <Box className="flex w-full h-full justify-center items-center pt-12"> 
            
            <Paper className="flex w-full max-w-7xl shadow-xl overflow-hidden rounded-lg min-h-[600px] h-[800px]">
                
                {/* Conversation List */}
                <Box className="w-full sm:w-1/3 min-w-[300px] border-r border-gray-200 flex flex-col h-full bg-white">
                    <Typography variant="h5" className="p-4 font-bold border-b text-gray-800">
                        Connections
                    </Typography>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.map((conv) => (
                            <ConversationListItem
                                key={conv.id}
                                conversationId={conv.id}
                                partnerName={conv.partnerName}
                                partnerPictureUrl={conv.partnerPictureUrl}
                                lastMessageText={conv.lastMessageText}
                                lastMessageTime={conv.lastMessageTime}
                                unreadCount={conv.unreadCount}
                                isSelected={conv.id === selectedConversationId}
                                onSelect={handleSelectConversation}
                            />
                        ))}
                    </div>
                </Box>

                {/* Chat Container */}
                <Box className="flex-1 flex justify-center items-stretch bg-white">
                    {selectedConversation ? (
                        <ChatContainer 
                            conversationId={selectedConversationId!}
                            partnerName={selectedConversation.partnerName}
                            sendMessage={sendNewMessage}
                            onMessageSent={refreshConversations} 
                        />
                    ) : (
                        <Box className="flex items-center justify-center p-8 text-center text-gray-500 w-full h-full">
                            <Typography variant="h6">
                                Select a conversation to start chatting.
                            </Typography>
                        </Box>
                    )}
                </Box>
                
            </Paper>
        </Box>
    );
};

export default ConnectionsPage;