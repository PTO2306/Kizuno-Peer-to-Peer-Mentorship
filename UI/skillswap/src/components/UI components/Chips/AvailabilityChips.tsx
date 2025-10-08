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
      sx={{ borderRadius: 9999, fontWeight: 600, px: 0.5 }}
    />
  );
};

export default AvailabilityChip;


