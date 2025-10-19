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
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const MAX_CHARACTERS = 500;

type ChatDialogProps = {
  open: boolean;
  onClose: () => void;
  listingId: string; 
  mentorId: string;
  mentorName: string;
  listingTitle: string; 
  type: 'Mentor' | 'Mentee'; 
  onConversationStarted: (
    targetUserId: string,
    initialMessage: string,
    listingId: string,
    listingTitle: string
  ) => Promise<void>;
};

const ChatDialog: React.FC<ChatDialogProps> = ({
  open,
  onClose,
  mentorId,
  mentorName,
  listingId,
  listingTitle,
  type,
  onConversationStarted,
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const characterCount = message.length;
  const isMessageValid = message.trim().length > 0;

  const handleSendMessage = async () => {
    if (!isMessageValid || isSending) return;
    
    setIsSending(true);

    try {
        await onConversationStarted(
            mentorId,
            message.trim(),
            listingId,
            listingTitle
        );
        
        setMessage(""); 
        onClose(); 
    } catch (error) {
        console.error("Error starting new conversation:", error);
    } finally {
        setIsSending(false);
    }
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

  const placeholderText =
    type === "Mentor"
      ? `Hi ${mentorName}, I'm interested in learning more about your ${listingTitle} listing...`
      : `Hi ${mentorName}, I'd like to offer to teach you more about the ${listingTitle} listing...`;


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
        <Typography className="text-lg font-semibold">
          Start Conversation
        </Typography>
        <IconButton 
          onClick={onClose} 
          aria-label="close"
          color="primary"
          className="absolute right-2 top-2"
          disabled={isSending} 
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
              Introduce yourself and what you'd like to discuss regarding{" "}
              <span className="font-semibold">{listingTitle}</span>.
            </Typography>
        </Box>
        
        <Box className="relative w-full">
            <TextField
              autoFocus
              multiline
              fullWidth
              variant="outlined"
              placeholder={placeholderText}
              value={message} 
              onChange={handleMessageChange as any} 
              onKeyDown={handleKeyDown as any}
              rows={5}
              disabled={isSending}
              className="bg-gray-50 rounded-lg"
              
            />
            <Typography 
              variant="caption" 
              className="absolute right-3 bottom-2 text-xs text-gray-400" 
            >
              {characterCount}/{MAX_CHARACTERS}
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
            disabled={!isMessageValid || isSending}
            className="normal-case min-w-[100px]"
            endIcon={isSending ? <CircularProgress size={20} color="inherit" /> : null}
        >
            {isSending ? 'Sending' : 'Send'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatDialog;