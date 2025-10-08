import React from "react";  
import { Card, CardActionArea, CardContent, Typography, Box, Dialog, DialogTitle, DialogContent, Avatar, IconButton, DialogActions, Button, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SkillLevelChip from "../Chips/SkillLevelChips";
import AvailabilityChip from "../Chips/AvailabilityChips";
import ModeChip from "../Chips/ModeChips";

// External props needed to render a single class card
interface ListingCardProps {
  avatar: string; 
  title: string; 
  mentor: string; 
  subtitle: string;
  desc: string;
  skill: string;
  availability: string;
  mode: string;
}

const ListingCard: React.FC<ListingCardProps> = ({ avatar, title, mentor, subtitle, desc, skill, availability, mode }) => {
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
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <Typography variant="h5">{title}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                by {mentor}
              </Typography>
            </div>
          </div>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ px: 2, pb: 1, flexWrap: 'wrap', mt: 2 }}>
            <SkillLevelChip skill={skill} />
            <AvailabilityChip availability={availability} />
            <ModeChip mode={mode} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>

    {/* Dialog opens on click/tap and shows detailed info */}
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ position: 'relative', pr: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            alt={title}
            src={avatar}
            imgProps={{ style: { objectFit: 'cover' } }}
          />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <IconButton color='primary'  aria-label="close" onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
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
        <Button variant='contained'>Get in touch</Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

export default ListingCard;
