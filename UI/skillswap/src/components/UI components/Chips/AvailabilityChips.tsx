import Chip from "@mui/material/Chip";
import React from "react";

interface AvailabilityChipProps {
  availability: string
}

const AvailabilityChip: React.FC<AvailabilityChipProps> = ({ availability }) => {
  return (
    <Chip
      label={availability}
      size='small'
      variant="filled"
      sx={{
        borderRadius: 9999,
        fontWeight: 600,
        px: 0.5,
        backgroundColor: '#E1FFDB',
        backdropFilter: 'blur(6px)',
        border: '1px solid #B7FFA9',
      }}
    />
  );
};

export default AvailabilityChip;


