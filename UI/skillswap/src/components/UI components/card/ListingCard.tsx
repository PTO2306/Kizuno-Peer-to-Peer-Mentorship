import React from "react";  
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  IconButton,
  DialogActions,
  Button,
  Stack,
  useMediaQuery,
  useTheme
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SkillLevelChip, { type SkillLevel } from "../chips/SkillLevelChips";
import AvailabilityChip from "../chips/AvailabilityChips";
import ModeChip from "../chips/ModeChips";

interface ListingCardProps {
  avatar: string; 
  title: string; 
  mentor: string; 
  subtitle: string;
  desc: string;
  skill: SkillLevel;
  availability: string;
  mode: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
  avatar,
  title,
  mentor,
  subtitle,
  desc,
  skill,
  availability,
  mode,
}) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          // Max 3 per row on large screens to prevent chip crowding
          width: {
            xs: "100%",
            sm: "calc(50% - 12px)",
            md: "calc(33.333% - 16px)",
            lg: "calc(33.333% - 16px)",
          },
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
        onClick={handleClick}
      >
        <CardActionArea
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: { xs: 1.5, sm: 2 },
            }}
          >
            <Avatar
              alt={title}
              src={avatar}
              sx={{
                width: { xs: 80, sm: 120, md: 140 },
                height: { xs: 80, sm: 120, md: 140 },
              }}
              imgProps={{ style: { objectFit: "cover" } }}
            />
          </Box>

          <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    fontWeight: 600,
                  }}
                >
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  by {mentor}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
            >
              {subtitle}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              justifyContent="center"
              alignItems="center"
              sx={{
                flexWrap: "wrap",
                mt: "auto",
                pt: 1,
              }}
            >
              <SkillLevelChip skill={skill} />
              <ModeChip mode={mode} />
              <AvailabilityChip availability={availability} />
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>

      {/* Responsive Dialog */}
      <Dialog
  open={open}
  onClose={handleClose}
  fullWidth
  maxWidth="sm"
  disableScrollLock
  sx={{
    "& .MuiDialog-container": {
      width: "100vw",
      maxWidth: "100vw",
      m: 0,
    },
  }}
  PaperProps={{
    sx: {
      width: "100%",
      maxWidth: {
        xs: "calc(100vw - 32px)", // safe 16px padding on each side
        sm: "90vw",
        md: "600px",
      },
      mx: "auto",
      borderRadius: { xs: 2, sm: 3 },
      overflowX: "hidden", // prevents horizontal scrollbars
    },
  }}
>
<DialogTitle
  sx={{
    position: "relative",
    px: { xs: 2, sm: 3 }, // symmetric padding
    pt: { xs: 2.5, sm: 3 },
    pb: { xs: 1.5, sm: 2 },
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: { xs: "center", sm: "flex-start" },
      textAlign: { xs: "center", sm: "left" },
      flexDirection: { xs: "column", sm: "row" },
      gap: { xs: 1.5, sm: 2 },
      width: "100%", // ensures proper centering context
    }}
  >
    <Avatar
      alt={title}
      src={avatar}
      sx={{
        width: { xs: 64, sm: 56 },
        height: { xs: 64, sm: 56 },
      }}
      imgProps={{ style: { objectFit: "cover" } }}
    />
    <Typography
      variant="h6"
      sx={{
        fontSize: { xs: "1rem", sm: "1.1rem" },
        mt: { xs: 0.5, sm: 0 },
      }}
    >
      {title}
    </Typography>
  </Box>

  <IconButton
    color="primary"
    aria-label="close"
    onClick={handleClose}
    sx={{
      position: "absolute",
      right: 8,
      top: 8,
    }}
  >
    <CloseIcon />
  </IconButton>
</DialogTitle>


        <DialogContent
          dividers
          sx={{
            p: { xs: 2, sm: 3 },
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 1 }}>
            Mentor: {mentor}
          </Typography>
          <Typography variant="body1">{desc}</Typography>
        </DialogContent>

        <DialogActions
          sx={{
            display: "flex",
            flexDirection: isSmallScreen ? "column" : "row",
            gap: 1,
            justifyContent: "space-between",
            alignItems: isSmallScreen ? "stretch" : "center",
            flexWrap: "wrap",
            px: 2,
            pb: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <SkillLevelChip skill={skill} />
            <ModeChip mode={mode} />
            <AvailabilityChip availability={availability} />
          </Stack>
          <Button
            variant="contained"
            fullWidth={isSmallScreen}
            sx={{ mt: isSmallScreen ? 1 : 0 }}
          >
            Message {mentor}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListingCard;
