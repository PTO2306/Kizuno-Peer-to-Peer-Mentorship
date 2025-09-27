import React from "react";  
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import SkillLevelChip from "./SkillLevelChip";

interface ClassCardProps {
  media: string;
  title: string;
  mentor: string;
  desc: string;
  level: "beginner" | "intermediate" | "advanced";
}

const ClassCard: React.FC<ClassCardProps> = ({ media, title, mentor, desc, level }) => {
  return (
    <Card 
      variant="outlined"
      sx={{
        width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)' }, // 3 per row on md+
        minWidth: 0,
      }}
    >
      <CardActionArea sx={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
        <CardMedia 
          sx={{ height: 140 }}
          component='img'
          image={media}
          title={title}
        />
        <CardContent className="flex flex-col gap-2 flex-1">
          {/* Top row: title + mentor left, chip right */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <Typography variant="h5">{title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {mentor}
              </Typography>
            </div>
            <div className="flex-shrink-0">
              <SkillLevelChip level={level} />
            </div>
          </div>

          {/* Bottom row: full-width description */}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {desc}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ClassCard;
