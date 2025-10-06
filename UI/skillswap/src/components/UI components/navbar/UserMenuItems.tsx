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
      label: 'Edit Profile',
      onClick: () => navigate('/profile')
    },
    {
      label: 'Logout',
      onClick: () => logout()
    },
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