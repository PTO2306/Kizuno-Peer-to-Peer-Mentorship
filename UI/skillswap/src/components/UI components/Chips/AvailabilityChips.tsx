import Chip from "@mui/material/Chip";
import React from "react";

export type Availability = 'Anytime' | 'Weekdays' | 'Weekends' | 'Evenings' | 'Mornings' | 'Afternoons'

interface AvailabilityChipProps {
  availability: string
}

const bgByAvailability: Record<Availability, string> = {
  Anytime: '',
  Weekdays: '',
  Weekends: '',
  Evenings: '',
  Mornings: '',
  Afternoons: '',
}

const borderByAvailability: Record<Availability, string> = {
  Anytime: '',
  Weekdays: '',
  Weekends: '',
  Evenings: '',
  Mornings: '',
  Afternoons: '',
};

const shadowByAvailability: Record<Availability, string> = {
  Anytime: '',
  Weekdays: '',
  Weekends: '',
  Evenings: '',
  Mornings: '',
  Afternoons: '',
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
        backgroundColor: bgByAvailability[Availability],
        backdropFilter: 'blur(6px)',
        border: `1px solid ${borderByAvailability[Availability]}`,
        boxShadow: `0px 2px 4px ${shadowByAvailability[Availability]}`
      }}
    />
  );
};

export default AvailabilityChip;


