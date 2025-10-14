import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Button,
  TextField,
  // We no longer need useTheme or useMediaQuery because we use Tailwind's responsive classes
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
// import SendIcon from "@mui/icons-material/Send"; // Not used in the final design

// --- Configuration ---
const MAX_CHARACTERS = 500;

type ChatDialogProps = {
  open: boolean;
  onClose: () => void;
  listingId: string | undefined;
  mentorId: string;
  mentorName: string;
  listingTitle: string; 
  type: string;
};

const ChatDialog: React.FC<ChatDialogProps> = ({
  open,
  onClose,
  mentorId,
  mentorName,
  listingId,
  type
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false); 

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    setIsSending(true);
    
    // API CALL PLACEHOLDER
    console.log(`Sending message to ${mentorName} (ID: ${mentorId}).`);
    
    setTimeout(() => {
        setIsSending(false);
        setMessage(""); 
        onClose(); 
    }, 1000);
  };
  
  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.value.length <= MAX_CHARACTERS) {
          setMessage(event.target.value);
      }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          handleSendMessage();
      }
  };


  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{
        paper: {
            className: 'w-full max-w-[calc(100vw-32px)] sm:max-w-[400px] mx-auto rounded-xl sm:rounded-3xl overflow-x-hidden',
    },
  }}
      disableScrollLock
    >
      {/* Dialog Title: "Start Conversation" and Close Button */}
      <DialogTitle 
        className="p-4 text-center font-semibold text-lg relative border-b border-gray-200"
      >
        <Typography variant="h6" className="text-lg font-semibold">
          Start Conversation
        </Typography>
        <IconButton 
          onClick={onClose} 
          aria-label="close"
          color="primary"
          className="absolute right-2 top-2"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      {/* Dialog Content: Messaging Instructions and Input */}
      <DialogContent 
        className="flex flex-col gap-4 p-6 items-center"
      >
        <Box className="flex flex-col justify-center items-center">
            <Typography 
                variant="h5" 
                className="font-bold text-xl sm:text-2xl"
            >
                Message {mentorName}
            </Typography>
            <Typography 
                variant="body2" 
                className="text-gray-600 mt-1 text-sm sm:text-base"
            >
                Introduce yourself and what you'd like to discuss.
            </Typography>
        </Box>
        
        <Box className="relative w-full">
            <TextField
                autoFocus
                multiline
                fullWidth
                variant="outlined"
                placeholder={type === "Mentor" ? `Hi ${mentorName}, I'm interested in learning more about...` : `Hi ${mentorName}, I'd like to offer to teach you more about...`}
                value={message} 
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
                rows={5}
                disabled={isSending}
                className="bg-gray-50 rounded-lg"
                
            />
            <Typography 
                variant="caption" 
                className="absolute right-3 bottom-2 text-xs text-gray-400" 
            >
                {message.length}/{MAX_CHARACTERS}
            </Typography>
        </Box>
      </DialogContent>
      
      {/*Dialog Actions: Send Button*/}
      <DialogActions 
        className="justify-end p-4 border-t border-gray-200"
      >
        <Button
            onClick={handleSendMessage}
            variant="contained"
            color="primary"
            disabled={!message.trim() || isSending}
            className="normal-case min-w-[80px]"
        >
            {isSending ? 'Sending...' : 'Send'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatDialog;