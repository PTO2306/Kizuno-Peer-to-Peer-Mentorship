import React, { 
    createContext, 
    useContext, 
    useState, 
    useCallback, 
    useMemo 
} from 'react';

export type UserRole = 'Mentor' | 'Mentee';

export interface MessageModel {
    id: number | string;
    text: string;
    isSender: boolean;
    timestamp: string;
}

export interface ConversationModel {
    id: string;
    partnerId: string;
    partnerName: string;
    partnerPictureUrl: string;
    listingTitle: string;
    lastMessageText: string;
    lastMessageTime: string;
    lastMessageSortTimestamp: number; 
    unreadCount: number;
    messages: MessageModel[];
}


interface ChatContextType {
    conversations: ConversationModel[];
    totalUnreadMessages: number;
    refreshConversations: () => void;
    getConversationMessages: (conversationId: string) => MessageModel[] | undefined;
    markConversationAsRead: (conversationId: string) => void;
    startNewConversation: (
        partnerId: string, 
        partnerName: string, 
        initialMessage: string, 
        listingTitle: string
    ) => string;
    sendNewMessage: (conversationId: string, text: string) => void;
}

const CURRENT_USER_ID = "user-001";
const CURRENT_USER_NAME = "You (Coder)";

const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const generateUniqueId = (): string => `chat-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

// Initial Mock Data (used for useState initialization)
const now = Date.now();
const t5m = now - 60000 * 5;      // 5 minutes ago
const t2h = now - 60000 * 60 * 2; // 2 hours ago

export const initialConversations: ConversationModel[] = [
    {
        id: "chat-001",
        partnerId: "partner-A",
        partnerName: "Sarah Chen (Mentee)",
        partnerPictureUrl: "https://dummyimage.com/600x600/303/fff",
        listingTitle: "React/TypeScript Deep Dive",
        lastMessageText: "I'll review the pull request tomorrow morning.",
        lastMessageTime: formatTime(new Date(t5m)),
        lastMessageSortTimestamp: t5m, 
        unreadCount: 0,
        messages: [
            { id: 1, text: "Welcome to the mentorship! I'm happy to help you with React.", isSender: false, timestamp: "Yesterday 10:00 AM" },
            { id: 2, text: "Thanks! I've pushed my first component code to the repo.", isSender: true, timestamp: "Yesterday 10:05 AM" },
            { id: 3, text: "Got it. I'll review the pull request tomorrow morning.", isSender: false, timestamp: formatTime(new Date(t5m)) },
        ],
    },
    {
        id: "chat-002",
        partnerId: "partner-B",
        partnerName: "Alex Johnson (Mentor)",
        partnerPictureUrl: "https://dummyimage.com/600x600/100/fff",
        listingTitle: "Senior Architect Guidance",
        lastMessageText: "Can we schedule a call next week?",
        lastMessageTime: formatTime(new Date(t2h)),
        lastMessageSortTimestamp: t2h, 
        unreadCount: 2, // UNREAD
        messages: [
            { id: 1, text: "I'm interested in your architecture listing. My current project uses microservices.", isSender: true, timestamp: "Today 1:00 PM" },
            { id: 2, text: "That sounds promising. I have some availability on Tuesday.", isSender: false, timestamp: "Today 1:05 PM" },
            { id: 3, text: "Great. Can we schedule a call next week?", isSender: false, timestamp: formatTime(new Date(t2h)) },
        ],
    },
    {
        id: "chat-003",
        partnerId: "partner-C",
        partnerName: "Maya Patel (Mentee)",
        partnerPictureUrl: "https://dummyimage.com/600x600/033/fff",
        listingTitle: "Tailwind UI/UX Design",
        lastMessageText: "Just checking in, did you get my design mocks?",
        lastMessageTime: "2 days ago",
        lastMessageSortTimestamp: now - 60000 * 60 * 24 * 2, 
        unreadCount: 0,
        messages: [
            { id: 1, text: "I'm having trouble with responsive breakpoints in Tailwind. Need your expertise!", isSender: true, timestamp: "2 days ago 8:00 AM" },
            { id: 2, text: "Sure thing! Send over your code sandbox link.", isSender: false, timestamp: "2 days ago 8:15 AM" },
            { id: 3, text: "Just checking in, did you get my design mocks?", isSender: true, timestamp: "2 days ago 11:00 AM" },
        ],
    },
];


const ChatContext = createContext<ChatContextType | undefined>(undefined);


/**
 * Provides the global chat state and service methods to the application.
 */
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [rawConversations, setRawConversations] = useState<ConversationModel[]>(initialConversations);


    const sortedConversations = useMemo(() => {
        return rawConversations
            .slice()
            .sort((a, b) => b.lastMessageSortTimestamp - a.lastMessageSortTimestamp);
    }, [rawConversations]);

    
    const totalUnreadMessages = useMemo(() => {
        return rawConversations.reduce((sum, c) => sum + c.unreadCount, 0);
    }, [rawConversations]);


    const refreshConversations = useCallback(() => {
        setRawConversations(prev => prev.slice()); 
    }, []);

    const getConversationMessages = useCallback((conversationId: string): MessageModel[] | undefined => {
        return rawConversations.find(c => c.id === conversationId)?.messages;
    }, [rawConversations]);

    const markConversationAsRead = useCallback((conversationId: string): void => {
        setRawConversations(prev => {
            const newConversations = prev.map(c => 
                c.id === conversationId ? { ...c, unreadCount: 0 } : c
            );
            return newConversations;
        });
    }, []);

    const startNewConversation = useCallback((
        partnerId: string, 
        partnerName: string, 
        initialMessage: string, 
        listingTitle: string
    ): string => {
        const newConversationId = generateUniqueId();
        const nowTime = Date.now();
        const formattedTime = formatTime(new Date(nowTime));

        const newConversation: ConversationModel = {
            id: newConversationId,
            partnerId: partnerId,
            partnerName: partnerName,
            partnerPictureUrl: "https://dummyimage.com/600x600/255/fff", 
            listingTitle: listingTitle,
            lastMessageText: initialMessage,
            lastMessageTime: formattedTime,
            lastMessageSortTimestamp: nowTime,
            unreadCount: 0,
            messages: [
                { id: nowTime.toString(), text: initialMessage, isSender: true, timestamp: formattedTime }
            ],
        };
        
        setRawConversations(prev => [...prev, newConversation]);
        
        return newConversationId;
    }, []);

    const sendNewMessage = useCallback((conversationId: string, text: string): void => {
        setRawConversations(prev => {
            const nowTime = Date.now();
            const newMessage: MessageModel = {
                id: nowTime.toString(),
                text: text,
                isSender: true, 
                timestamp: formatTime(new Date(nowTime)),
            };

            const updatedConversations = prev.map(c => {
                if (c.id === conversationId) {
                    return {
                        ...c,
                        messages: [...c.messages, newMessage],
                        lastMessageText: text,
                        lastMessageTime: newMessage.timestamp,
                        lastMessageSortTimestamp: nowTime,
                        unreadCount: 0, 
                    };
                }
                return c;
            });

            getConversationMessages(conversationId)

            return updatedConversations;
        });
    }, []);

    const contextValue = useMemo(() => ({
        conversations: sortedConversations,
        totalUnreadMessages,
        refreshConversations,
        getConversationMessages,
        markConversationAsRead,
        startNewConversation,
        sendNewMessage,
    }), [
        sortedConversations, 
        totalUnreadMessages, 
        refreshConversations, 
        getConversationMessages, 
        markConversationAsRead, 
        startNewConversation, 
        sendNewMessage
    ]);

    return React.createElement(ChatContext.Provider, { value: contextValue }, children);
};

/**
 * Custom hook to consume the chat context.
 * @returns The chat state and service functions.
 */
export const useChatData = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatData must be used within a ChatProvider');
    }
    return context;
};