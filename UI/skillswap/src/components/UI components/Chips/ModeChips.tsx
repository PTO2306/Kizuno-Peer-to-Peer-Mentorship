import React from "react";
import { Chip } from '@mui/material';

export type Mode = 'Online' | 'In Person' | 'Hybrid';

interface ModeChipProps {
  mode: string,
}
const ModeChip: React.FC<ModeChipProps> = ({ mode }) => {
  return (
    <Chip
      label={mode}
      size='small'
      variant="filled"
      sx={{ borderRadius: 9999, fontWeight: 600, px: 0.5 }}
    />
  );
};

export default ModeChip;


