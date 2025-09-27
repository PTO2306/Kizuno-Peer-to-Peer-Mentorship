import { Chip } from "@mui/material";
import React from "react";

type Level = 'beginner' | 'intermediate' | 'advanced';

interface LevelChipProps {
    level: Level;
}

// Styles for different skill levels
const levelStyles: Record<Level, { borderColor: string; backgroundColor: string }> = {
    beginner: { borderColor: '#a9ffa9', backgroundColor: '#daffda' },
    intermediate: { borderColor: '#a9cbff', backgroundColor: '#dae9ff' },
    advanced: { borderColor: '#b9a9ff', backgroundColor: '#e1daff' }
}

/** Requires level='' prop: beginner, intermediate, or advanced and renders a skill level chip */
const SkillLevelChip: React.FC<LevelChipProps> = ({ level }) => {
    const styles = levelStyles[level]

    return (
        <Chip 
            label={level.charAt(0).toUpperCase() + level.slice(1)}
            variant='outlined'
            size='small'
            sx={{ 
                borderColor: styles.borderColor,
                backgroundColor: styles.backgroundColor
            }}
        />
    )
}

export default SkillLevelChip;