import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Avatar from '@mui/material/Avatar';
import { Button, Menu, Tooltip } from '@mui/material'; 
import UserMenuItems from './UserMenuItems';
import { useProfile } from '../../../Data/ProfileContext';
import SearchBox from './SearchBox';
import AddIcon from '@mui/icons-material/Add';
import { useLocation } from 'react-router';
import AddListingDialog from '../addlistingdialog/AddListingDialog';
import NotificationBell from './NotificationBell';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router';


type DrawerItem = {
  text: string;
  icon: React.ReactElement;
  link: string;
};

const drawerData: DrawerItem[] = [
  {
    text: "Home",
    icon: <HomeIcon />,
    link: "/dashboard"
  },
  { text: "Upcoming sessions", 
    icon: <CalendarMonthIcon />,
    link: "/upcoming-sessions"
  }, {
    text: 'Leaderboard',
    icon: <LeaderboardIcon />,
    link: "/leaderboard"
  } ,{
    text: 'My Listings',
    icon: <ListAltIcon />,
    link: "/my-listings"
  }
];

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
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [isAddListingDialogOpen, setIsListingDialogOpen] = React.useState(false)
  const location = useLocation().pathname
  const navigate = useNavigate()
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

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
        <Toolbar>
          {/* Menu Icon */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
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
              mr: 3
            }}
          >
            Kizuno
          </Typography>

          {/* Search Box */}
          {location === "/dashboard" ? (
          <Box 
            className="flex-1 flex justify-center mx-1 md:mx-3" 
          >
            <Box 
            className="flex items-center w-full max-w-[90%] lg:max-w-[800px]" 
            >
              <Box className="flex-grow min-w-0">
                  <SearchBox />
              </Box>
              <Button
                startIcon={<AddIcon />}
                variant="outlined"
                color='inherit'
                onClick={() => setIsListingDialogOpen(true)}
                // KEY CHANGE: ml-3 for margin, hidden for xs, sm:inline-flex for small+
                className="ml-3 hidden sm:inline-flex" 
              >
                Add Listing
              </Button>

              <IconButton
                color="inherit"
                aria-label="Add Listing"
                onClick={() => setIsListingDialogOpen(true)}
                className="ml-1 sm:hidden" 
              >
                <AddIcon />
              </IconButton>

            </Box>
          </Box>
          ) : (
          <Box sx={{ flexGrow: 1 }} />
          )}


          {/* User Avatar (Right) */}
          <NotificationBell />
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ ml: 2 }}>
              <Avatar alt="User picture" src={apiUrl + profile?.profilePictureUrl || undefined} />
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
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <List>
          {drawerData.map((element) => (
            <ListItem key={element.text} disablePadding>
              <ListItemButton onClick={() => { navigate(element.link) 
                                               handleDrawerClose()} }>
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
        <DrawerHeader />
      </Main>
    </Box>
  );
}

export default NavBar;