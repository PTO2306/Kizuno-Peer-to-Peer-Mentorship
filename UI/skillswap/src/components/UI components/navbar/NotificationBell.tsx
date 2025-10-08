import { useState, useMemo } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications'; 
import { Box, Typography, Menu, MenuItem, Badge, IconButton, ListItemAvatar, ListItemText, Avatar } from '@mui/material';

type data = {
  id: number;
  senderName: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  avatarUrl: string;
}

const data: data[] = [
  { 
    id: 1, 
    senderName: "Alice", 
    message: "Whatsup",
    isRead: false,
    timestamp: new Date(Date.now() - 60000 * 5).toISOString(), // 5 minutes ago
    avatarUrl: "https://i.pravatar.cc/150?img=1",
  },
  { 
    id: 2, 
    senderName: "Bob", 
    message: "When are you available to chat?",
    isRead: false,
    timestamp: new Date(Date.now() - 60000 * 30).toISOString(), // 30 minutes ago
    avatarUrl: "https://i.pravatar.cc/150?img=2",
  },
  { 
    id: 3, 
    senderName: "Charlie", 
    message: "That sounds good",
    isRead: true,
    timestamp: new Date(Date.now() - 60000 * 60 * 2).toISOString(), // 2 hours ago
    avatarUrl: "https://i.pravatar.cc/150?img=3",
  },
  { 
    id: 4, 
    senderName: "Dana", 
    message: "Yep understood ",
    isRead: false,
    timestamp: new Date(Date.now() - 60000 * 60 * 4).toISOString(), // 4 hours ago
    avatarUrl: "https://i.pravatar.cc/150?img=4",
  },
  { 
    id: 5, 
    senderName: "Eve", 
    message: "Share your github profile",
    isRead: true,
    timestamp: new Date(Date.now() - 60000 * 60 * 24).toISOString(), // 1 day ago
    avatarUrl: "https://i.pravatar.cc/150?img=5",
  },
  { 
    id: 6, 
    senderName: "Frank", 
    message: "We can definitely meet then",
    isRead: false,
    timestamp: new Date(Date.now() - 60000 * 60 * 25).toISOString(),
    avatarUrl: "https://i.pravatar.cc/150?img=6",
  },
  { 
    id: 7, 
    senderName: "Grace", 
    message: "What experience do you have?",
    isRead: true,
    timestamp: new Date(Date.now() - 60000 * 60 * 48).toISOString(),
    avatarUrl: "https://i.pravatar.cc/150?img=7",
  },
  { 
    id: 8, 
    senderName: "Heidi", 
    message: "Can we schedule for next wednesday?",
    isRead: false,
    timestamp: new Date(Date.now() - 60000 * 60 * 72).toISOString(),
    avatarUrl: "https://i.pravatar.cc/150?img=8",
  },
  { 
    id: 9, 
    senderName: "Ivan", 
    message: "Do you teach piano as well?",
    isRead: false,
    timestamp: new Date(Date.now() - 60000 * 60 * 96).toISOString(),
    avatarUrl: "https://i.pravatar.cc/150?img=9",
  },
  { 
    id: 10, 
    senderName: "Judy", 
    message: "Thank you",
    isRead: true,
    timestamp: new Date(Date.now() - 60000 * 60 * 120).toISOString(),
    avatarUrl: "https://i.pravatar.cc/150?img=10",
  },
];

/* Still to implement: 
1. Empty State
2. Sorting Messages newest -> oldest
*/



function NotificationBell() {
  const [notifications, setNotifications] = useState(data);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);


  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  
  
  const timeSince = (dateString: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  
  const intervals = [
    { value: 31536000, unit: "year" },
    { value: 2592000, unit: "month" },
    { value: 86400, unit: "day" },
    { value: 3600, unit: "hour" },
    { value: 60, unit: "minute" },
  ];

  for (const { value, unit } of intervals) {
    const interval = seconds / value;
    if (interval >= 1) {
      const flooredValue = Math.floor(interval);
      const plural = flooredValue > 1 ? 's' : '';
      return `${flooredValue} ${unit}${plural} ago`;
    }
  }
  
  return Math.floor(seconds) + " seconds ago";
};


  return (
    <Box>
      {/* Icon and Counter */}
    <IconButton 
        color="primary" 
        aria-label="show notifications" 
        onClick={handleOpen}
        aria-controls={open ? 'notifications-menu' : undefined}
        aria-haspopup="true"
        size='medium'
    >
        <Badge 
          badgeContent={unreadCount} 
          color="secondary"
          max={10}
        >
          <NotificationsIcon className='text-white text-3xl md:text-4xl' />
        </Badge>
      </IconButton>

      {/* Notifications Dropdown Menu */}
      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            className: 'w-90 max-w-sm rounded-lg shadow-lg border border-gray-100',
          },
          list: {
            className: 'max-h-96 overflow-y-auto p-0',
          },
        }}
      >
        {notifications.slice(0, 10).map((notification) => ( 
          <MenuItem 
            key={notification.id} 
            onClick={() => {
                handleClose();
            }}
            className={
                notification.isRead 
                    ? 'hover:bg-gray-100 p-3 border-b border-gray-50' 
                    : 'bg-gray-50 hover:bg-gray-200 p-3 border-b border-gray-100' 
            }
          >
            <ListItemAvatar>
              <Avatar src={notification.avatarUrl} alt={notification.senderName} />
            </ListItemAvatar>
            <ListItemText
              primary={
              <Box className="flex items-center space-x-1 min-w-0">
                <Typography 
                  component="strong"
                  className={notification.isRead ? 'text-gray-700 font-bold' : 'text-gray-900 font-bold'}
                >
                  {notification.senderName}
                </Typography>

                <Typography 
                  component="span" 
                  className={`flex-shrink max-w-[12rem] ${notification.isRead ? 'text-gray-600' : 'text-gray-700'} truncate`} 
                >
                  {" " + notification.message}
                </Typography>
              </Box>
              }
              secondary={
                <Typography variant="body2" color="text.secondary" className="text-xs mt-0.5">
                  {timeSince(notification.timestamp)}
                </Typography>
              }
            />
            {!notification.isRead && (
                <Box className="w-2 h-2 ml-2 rounded-full bg-blue-400 flex-shrink-0" />
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default NotificationBell;