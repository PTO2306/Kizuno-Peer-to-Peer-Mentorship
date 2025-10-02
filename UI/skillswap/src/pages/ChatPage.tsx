import PersistentNavBar from "../components/UI components/navbar/PersistentNavBar";
import ChatContainer from "../components/UI components/chat/ChatContainer";

const ChatPage: React.FC = () => {

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
            <PersistentNavBar />
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
            }}>
                <div>
                    <h1>Chat Page</h1>
                    <p style={{ margin: 0, color: '#666' }}>
                        {/* Welcome back{profile?.displayName ? `, ${profile.displayName}` : ''}! */}
                    </p>
                </div>
            </div>
            <ChatContainer />
        </div>
    );
};

export default ChatPage;
