import Chip from "@mui/material/Chip";
import React from "react";

interface SkillLevelChipProps {
  skill: string;
}

const SkillLevelChip: React.FC<SkillLevelChipProps> = ({ skill }) => {
  return (
    <Chip
      label={skill}
      variant="filled"
      size="small"
      sx={{ borderRadius: 9999, fontWeight: 600, px: 0.5 }}
    />
  );
};

export default SkillLevelChip;


