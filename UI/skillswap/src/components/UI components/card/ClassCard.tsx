import React from "react";  
import { Card, CardActionArea, CardContent, Typography, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button, Avatar } from '@mui/material';

// External props needed to render a single class card
interface ClassCardProps {
  avatar: string; 
  title: string; 
  mentor: string; 
  subtitle: string;
  desc: string;
}

const ClassCard: React.FC<ClassCardProps> = ({ avatar, title, mentor, subtitle, desc }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Render the card and the popper (as a sibling) so scrolling stays enabled
  return (
    <>
    <Card 
      variant="outlined"
      sx={{
        width: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.333% - 16px)' }, // 3 per row on md+
        minWidth: 0,
      }}
      onClick={handleClick}
    >
      <CardActionArea sx={{ display: 'flex', flexDirection: 'column', height: '100%'}}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
          <Avatar
            alt={title}
            src={avatar}
            sx={{ width: 140, height: 140 }}
            imgProps={{ style: { objectFit: 'cover' } }}
          />
        </Box>
        <CardContent className="flex flex-col gap-2 flex-1">
          {/* Top row: title + mentor left, chip right */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <Typography variant="h5">{title}</Typography> {/* class title */}
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                by {mentor}
              </Typography> {/* mentor name */}
            </div>
          </div>

          {/* Bottom row: full-width subtitleription */}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>

    {/* Dialog opens on click/tap and shows detailed info */}
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            alt={title}
            src={avatar}
            imgProps={{ style: { objectFit: 'cover' } }}
          />
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
              Mentor: {mentor}
            </Typography>
          </Box>
          <Typography variant="body1">{desc}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default ClassCard;
