import { Box, Avatar, Typography, useTheme } from "@mui/material";

interface ConversationListItemProps {
  conversationId: string;
  partnerName: string;
  partnerPictureUrl: string;
  lastMessageText: string;
  lastMessageTime: string;
  unreadCount: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ConversationListItem: React.FC<ConversationListItemProps> = ({
  conversationId,
  partnerName,
  partnerPictureUrl,
  lastMessageText,
  lastMessageTime,
  unreadCount,
  isSelected,
  onSelect,
}) => {

  const theme = useTheme()

  return (
    <Box
      onClick={() => onSelect(conversationId)}
      className={`flex items-center p-4 cursor-pointer transition duration-150 border-b border-gray-100 ${
        isSelected ? "bg-blue-50 border-r-4 border-blue-500" : "hover:bg-gray-50"
      }`}
    >
      <Avatar src={partnerPictureUrl} alt={partnerName} className="mr-3" />
      <Box className="flex-1 overflow-hidden">
        <Box className="flex justify-between items-start">
          <Typography variant="subtitle1" className="font-semibold truncate">
            {partnerName}
          </Typography>
          <Typography variant="caption" className="text-xs text-gray-500 ml-2 min-w-max">
            {lastMessageTime}
          </Typography>
        </Box>
        <Typography variant="body2" className="text-sm text-gray-600 truncate">
          {lastMessageText}
        </Typography>
      </Box>
      {unreadCount > 0 && (
        <Box
          className="ml-2 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          sx={{ backgroundColor: theme.palette.secondary.main }}
        >
          {unreadCount}
        </Box>
      )}
    </Box>
  );
};

export default ConversationListItem;