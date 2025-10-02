import React from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../auth/AuthContext";
import { MenuItem, Typography } from "@mui/material";

const UserMenuItems: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  /** User menu item labels and click handlers */
  const settings = [
    {
      label: 'Profile',
      onClick: () => navigate('/profile')
    },
    {
      label: 'Account'
    },
    {
      label: 'Logout',
      onClick: () => logout()
    },
    {
      label: 'Chat',
      onClick: () => navigate('/chat')
    }
  ]

  return (
    <>
      {/* Maps over user menu items and creates each menu item and assigns them labels and click handlers */}
      {settings.map(({ label, onClick }) => (
        <MenuItem key={label} onClick={onClick}>
          <Typography sx={{ textAlign: 'center' }}>{label}</Typography>
        </MenuItem>
      ))}
    </>
  )
}

export default UserMenuItems;