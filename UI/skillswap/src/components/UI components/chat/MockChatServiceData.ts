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

export interface ChatState {
    currentUserId: string;
    currentUserName: string;
    conversations: ConversationModel[];
}


const CURRENT_USER_ID = "user-001";
const CURRENT_USER_NAME = "You (Coder)";

const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const now = Date.now();
const t5m = now - 60000 * 5;     // 5 minutes ago
const t2h = now - 60000 * 60 * 2; // 2 hours ago

export const initialConversations: ConversationModel[] = [
    {
        id: "chat-001",
        partnerId: "partner-A",
        partnerName: "Sarah Chen (Mentee)",
        partnerPictureUrl: "https://via.placeholder.com/150/0000FF/FFFFFF?text=SC",
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
        partnerPictureUrl: "https://via.placeholder.com/150/FF0000/FFFFFF?text=AJ",
        listingTitle: "Senior Architect Guidance",
        lastMessageText: "Can we schedule a call next week?",
        lastMessageTime: formatTime(new Date(t2h)),
        lastMessageSortTimestamp: t2h, 
        unreadCount: 2,
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
        partnerPictureUrl: "https://via.placeholder.com/150/00FF00/FFFFFF?text=MP",
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

const appState: ChatState = {
    currentUserId: CURRENT_USER_ID,
    currentUserName: CURRENT_USER_NAME,
    conversations: initialConversations,
};


/**
 * Retrieves and sorts the data for the Conversation List panel (latest message first).
 */
export function getAllConversations(): ConversationModel[] {
    const sortedConversations = appState.conversations
        .slice() 
        .sort((a, b) => b.lastMessageSortTimestamp - a.lastMessageSortTimestamp);

    return sortedConversations.map(c => ({
        ...c,
        messages: [], 
    }));
}

export function getConversationMessages(conversationId: string): MessageModel[] | undefined {
    return appState.conversations.find(c => c.id === conversationId)?.messages;
}

export function markConversationAsRead(conversationId: string): void {
    const conversation = appState.conversations.find(c => c.id === conversationId);
    if (conversation) {
        conversation.unreadCount = 0;
    }
}



const generateUniqueId = (): string => `chat-${Date.now()}-${Math.floor(Math.random() * 10000)}`;



const listeners: (() => void)[] = [];

export const subscribeToNewConversationEvents = (callback: () => void) => {
    listeners.push(callback);
    return () => {
        const index = listeners.indexOf(callback);
        if (index > -1) {
            listeners.splice(index, 1);
        }
    };
};

const notifyNewConversation = () => {
    listeners.forEach(callback => callback());
};


/**
 * Creates a brand new conversation, adds it to the mock state,
 * and notifies the ConnectionsPage to refresh.
 * * @param partnerId The ID of the person the user is messaging (the listing owner).
 * @param initialMessage The first message sent by the user.
 * @param listingTitle The title of the listing the message is about.
 * @returns The ID of the newly created conversation.
 */
export function startNewConversation(
    partnerId: string, 
    partnerName: string,
    initialMessage: string, 
    listingTitle: string
): string {
    const newConversationId = generateUniqueId();
    const nowTime = Date.now();
    const formattedTime = formatTime(new Date(nowTime));

    const newConversation: ConversationModel = {
        id: newConversationId,
        partnerId: partnerId,
        partnerName: partnerName,
        partnerPictureUrl: "https://via.placeholder.com/150/808080/FFFFFF?text=NEW", 
        listingTitle: listingTitle,
        lastMessageText: initialMessage,
        lastMessageTime: formattedTime,
        lastMessageSortTimestamp: nowTime,
        unreadCount: 0,
        messages: [
            {
                id: nowTime.toString(),
                text: initialMessage,
                isSender: true,
                timestamp: formattedTime,
            }
        ],
    };

    appState.conversations.push(newConversation); 
    
    notifyNewConversation();
    
    return newConversationId;
}
export function sendNewMessage(conversationId: string, text: string): void {
    const conversation = appState.conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    const nowTime = Date.now();
    
    const newMessage: MessageModel = {
        id: nowTime.toString(),
        text: text,
        isSender: true,
        timestamp: formatTime(new Date(nowTime)),
    };

    conversation.messages.push(newMessage);
    conversation.lastMessageText = text;
    conversation.lastMessageTime = newMessage.timestamp;
    conversation.lastMessageSortTimestamp = nowTime; 
    conversation.unreadCount = 0; 

    // setTimeout(() => {
    //     simulatePartnerResponse(conversationId, conversation.partnerName);
    // }, 1500 + Math.random() * 1000); 
}

function simulatePartnerResponse(conversationId: string, partnerName: string): void {
    const conversation = appState.conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    const responseTime = Date.now();
    const responseText = `I will get back to you as soon as I have some time!`;

    const response: MessageModel = {
        id: responseTime.toString() + "-r",
        text: responseText,
        isSender: false,
        timestamp: formatTime(new Date(responseTime)),
    };

    conversation.messages.push(response);
    conversation.lastMessageText = responseText;
    conversation.lastMessageTime = response.timestamp;
    conversation.lastMessageSortTimestamp = responseTime; 
    conversation.unreadCount += 1; 

    console.log(`[Simulated] Partner ${partnerName} replied to chat ${conversationId}`);
}