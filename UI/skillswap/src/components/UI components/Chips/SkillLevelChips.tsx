import Chip from "@mui/material/Chip";
import React from "react";

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

interface SkillLevelChipProps {
  skill: SkillLevel;
}

const bgByLevel: Record<SkillLevel, string> = {
  Beginner: '#22C55E1A',
  Intermediate: '#F59E0B1A',
  Advanced: '#3B82F61A',
  Expert: '#8B5CF61A',
};

const borderByLevel: Record<SkillLevel, string> = {
  Beginner: '#22C55E33',
  Intermediate: '#F59E0B33',
  Advanced: '#3B82F633',
  Expert: '#8B5CF633',
};

const shadowByLevel: Record<SkillLevel, string> = {
  Beginner: '#22C55E33',
  Intermediate: '#F59E0B33',
  Advanced: '#3B82F633',
  Expert: '#8B5CF633',
}

const SkillLevelChip: React.FC<SkillLevelChipProps> = ({ skill }) => {

  return (
    <Chip
      label={skill}
      variant="filled"
      size='small'
      sx={{
        borderRadius: 9999,
        fontWeight: 600,
        px: 0.75,
        color: '#0F172A',
        backgroundColor: bgByLevel[skill],
        backdropFilter: 'blur(6px)',
        border: `1px solid ${borderByLevel[skill]}`,
        boxShadow: `0px 2px 4px ${shadowByLevel[skill]}`
      }}
    />
  );
};

export default SkillLevelChip;


