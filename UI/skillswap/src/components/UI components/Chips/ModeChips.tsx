import React from "react";
import { Chip } from '@mui/material';
import type { Mode } from "../../../models/userModels";

interface ModeChipProps {
  mode: Mode;
}

const bgByMode: Record<Mode, string> = {
  Online: '#E3FAFF',
  InPerson: '#FEFFBA',
  Hybrid: '#FBEBFF'
}

const borderByMode: Record<Mode, string> = {
  Online: '#B0F1FF',
  InPerson: '#E6E85F',
  Hybrid: '#F6D2FF'
};

const ModeChip: React.FC<ModeChipProps> = ({ mode }) => {
  return (
    <Chip
      label={mode === 'InPerson' ? 'In Person' : mode}
      size='small'
      variant="filled"
      sx={{
        borderRadius: 9999,
        fontWeight: 600,
        px: 0.5,
        backgroundColor: bgByMode[mode],
        backdropFilter: 'blur(6px)',
        border: `1px solid ${borderByMode[mode]}`,
      }}
    />
  );
};

export default ModeChip;


