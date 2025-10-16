import { useState, useMemo, useEffect } from 'react';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Badge,
  IconButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  CircularProgress,
  useTheme
} from '@mui/material';
import { useSignalR } from '../../../Data/SignalRContext';
import { initialConversations } from '../chat/MockChatServiceData';
import { useNavigate } from 'react-router';


function NotificationBell() {
  // const {
  //   notifications,
  //   getNotifications,
  //   markAllAsRead,
  //   deleteAllNotifications,
  //   isConnected,
  // } = useSignalR();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(false);
  const open = Boolean(anchorEl);
  const apiUrl = import.meta.env.VITE_API_URL;
  const [notifications, setNotifications] = useState(initialConversations)
  const navigate = useNavigate()
  const theme = useTheme()

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     await getNotifications();
  //     setLoading(false);
  //   };
  //   fetchData();
  // }, [getNotifications]);

  const unreadCount = notifications.reduce(
    (acc, value) => acc + (value.unreadCount ?? 0),
    0
  );
  //  useMemo(
  //   () => notifications.filter((n) => !n.isRead).length,
  //   [notifications]
  // );

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const timeSince = (dateString: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(dateString).getTime()) / 1000
    );
    const intervals = [
      { value: 31536000, unit: 'year' },
      { value: 2592000, unit: 'month' },
      { value: 86400, unit: 'day' },
      { value: 3600, unit: 'hour' },
      { value: 60, unit: 'minute' },
    ];
    for (const { value, unit } of intervals) {
      const interval = seconds / value;
      if (interval >= 1) {
        const floored = Math.floor(interval);
        return `${floored} ${unit}${floored > 1 ? 's' : ''} ago`;
      }
    }
    return `${Math.floor(seconds)} seconds ago`;
  };

  return (
    <Box>
      {/* Notification Bell Icon */}
      <IconButton
        color="primary"
        aria-label="show notifications"
        onClick={handleOpen}
        aria-controls={open ? 'notifications-menu' : undefined}
        aria-haspopup="true"
        size="medium"
        //disabled={!notifications.length}
      >
        <Badge badgeContent={unreadCount} color="secondary" max={10}>
          <NotificationsIcon className="text-white text-3xl md:text-4xl" />
        </Badge>
      </IconButton>

      {/* Dropdown */}
      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            className:
              'w-90 max-w-sm rounded-lg shadow-lg border border-gray-100',
          },
          list: {
            className: 'max-h-96 overflow-y-auto p-0',
          },
        }}
      >
        {loading ? (
          <Box className="flex justify-center items-center p-4">
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography className="text-gray-500">No notifications</Typography>
          </MenuItem>
        ) : (
          notifications
            .slice(0, 10)
            .map((notification, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  handleClose()
                  navigate("/connections", { state: { id: index } })}}
                className={
                  notification.unreadCount > 0
                    ? 'hover:bg-gray-100 p-3 border-b border-gray-50'
                    : 'bg-gray-50 hover:bg-gray-200 p-3 border-b border-gray-100'
                }
              >
                <ListItemAvatar>
                  <Avatar
                    src={notification.partnerPictureUrl || undefined}
                    alt={notification.partnerName}
                  >
                    {notification.partnerName?.[0]?.toUpperCase()}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box className="flex items-center space-x-1 min-w-0">
                      <Typography
                        component="strong"
                        className={
                          notification.unreadCount > 0
                            ? 'text-gray-700 font-bold'
                            : 'text-gray-900 font-bold'
                        }
                      >
                        {notification.partnerName}
                      </Typography>

                      <Typography
                        component="span"
                        className={`flex-shrink max-w-[12rem] ${notification.unreadCount > 0
                          ? 'text-gray-600'
                          : 'text-gray-700'
                          } truncate`}
                      >
                        {' ' + notification.lastMessageText}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="text-xs mt-0.5"
                    >
                      {notification.lastMessageTime}
                    </Typography>
                  }
                />
                {notification.unreadCount > 0 && (
                  <Box className="w-2 h-2 ml-2 rounded-full flex-shrink-0" sx={{ backgroundColor: theme.palette.secondary.main}} />
                )}
              </MenuItem>
            ))
        )}

        {/* Footer Buttons */}
        {/* {!loading && notifications.length > 0 && (
          <Box className="flex justify-between items-center px-3 py-2 border-t border-gray-100">
            <Typography
              variant="body2"
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={async () => {
                await markAllAsRead();
              }}
            >
              Mark all as read
            </Typography>
            <Typography
              variant="body2"
              className="text-red-600 cursor-pointer hover:underline"
              onClick={async () => {
                await deleteAllNotifications();
              }}
            >
              Clear all
            </Typography>
          </Box>
        )} */}
      </Menu>
    </Box>
  );
}

export default NotificationBell;
