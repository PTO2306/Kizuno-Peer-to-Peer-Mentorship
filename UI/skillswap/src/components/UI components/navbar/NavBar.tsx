import { useEffect, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { Button, Menu, Tooltip } from '@mui/material';
import UserMenuItems from './UserMenuItems';
import { useProfile } from '../../../Data/ProfileContext';
import AddIcon from '@mui/icons-material/Add';
import AddListingDialog from '../addlistingdialog/AddListingDialog';
import NotificationBell from './NotificationBell';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';
import ForumIcon from '@mui/icons-material/Forum';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate } from 'react-router';
import { useSignalR } from '../../../Data/SignalRContext';
import { useAuth } from '../../../Data/AuthContext';



type DrawerItem = {
  text: string;
  icon: React.ReactElement;
  link?: string;
  callback?: () => void;
};


// PRE-PACKAGED MUI STYLING

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

// COMPONENT

const NavBar: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { profile } = useProfile();
  const { logout } = useAuth();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isAddListingDialogOpen, setIsListingDialogOpen] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { getNotifications } = useSignalR();

  const drawerData: DrawerItem[] = [
    {
      text: "Home",
      icon: <HomeIcon />,
      link: "/dashboard"
    },
    {
      text: "Profile",
      icon: <AccountBoxIcon />,
      link: "/profile"
    },
    {
      text: "Connections",
      icon: <ForumIcon />,
      link: "/connections"
    },
    {
      text: 'My Listings',
      icon: <ListAltIcon />,
      link: "/my-listings"
    },
    {
      text: 'Logout',
      icon: <LogoutIcon />,
      callback: () => { logout() }
    }

  ];

  useEffect(() => {
    getNotifications();
  }, []);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AddListingDialog open={isAddListingDialogOpen} onClose={() => setIsListingDialogOpen(false)} />
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* LEFT SIDE */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={[
                { mr: 2 },
                open && { display: 'none' },
              ]}
            >
              <MenuIcon />
            </IconButton>

            {/* App Title */}
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                display: { xs: 'none', sm: 'block' },
                mr: 3,
              }}
            >
              Kizuno
            </Typography>
          </Box>

          {/* RIGHT SIDE */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Create Listing Button (desktop) */}
            <Button
              startIcon={<AddIcon />}
              variant="outlined"
              color="inherit"
              onClick={() => setIsListingDialogOpen(true)}
              sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
            >
              Create Listing
            </Button>

            {/* Create Listing Icon (mobile) */}
            <IconButton
              color="inherit"
              aria-label="Create Listing"
              onClick={() => setIsListingDialogOpen(true)}
              sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
            >
              <AddIcon />
            </IconButton>

            {/* Notifications & User Menu */}
            <NotificationBell />
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ ml: 1 }}>
                <Avatar
                  alt="User picture"
                  src={profile?.profilePictureUrl ? apiUrl + profile.profilePictureUrl : undefined}
                />
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClick={handleCloseUserMenu}
              onClose={handleCloseUserMenu}
            >
              <UserMenuItems />
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <List>
          {drawerData.map((element) => (
            <ListItem key={element.text} disablePadding>
              <ListItemButton onClick={() => {
                if (element.callback)
                  element.callback()

                if (element.link)
                  navigate(element.link)

                handleDrawerClose()
              }}>
                <ListItemIcon>
                  {element.icon}
                </ListItemIcon>
                <ListItemText primary={element.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
      </Main>
    </Box>
  );
}

export default NavBar;