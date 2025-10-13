import { useState } from "react";
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
  useTheme,
  Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SkillLevelChip from "../Chips/SkillLevelChips";
import ModeChip from "../Chips/ModeChips";
import AvailabilityChip from "../Chips/AvailabilityChips";
import type { ListingModel } from "../../../models/userModels";
import { useListing } from "../../../Data/ListingContext";
import AddListingDialog from "../addlistingdialog/AddListingDialog";

const ListingCard: React.FC<ListingModel> = (listing) => {
  const { deleteListing, loading } = useListing();
  const [open, setOpen] = useState(false);
  const [isEditListingDialogOpen, setIsEditListingDialogOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const apiURL = import.meta.env.VITE_API_URL;

  const {
    id,
    displayName,
    profilePictureUrl,
    type,
    title,
    subtitle,
    description,
    skillLevel,
    availability,
    mode,
    isOwner
  } = listing;

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditListingDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (id) {
      deleteListing(id).then((res) => {
        if (res.success) {
          setConfirmDeleteOpen(false);
        }
      });
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          width: {
            xs: "100%",
          },
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          border: `1px solid ${type === "Mentor" ? theme.palette.primary.main : theme.palette.secondary.main}`,
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
          {isOwner && (
            <Box
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                display: "flex",
                gap: 0.5,
                zIndex: 2,
              }}
            >
              <Tooltip title="Edit Listing">
                <IconButton
                  component="span"
                  size="small"
                  color="primary"
                  onClick={handleEditClick}
                  sx={{
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: "primary.light", color: "white" },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Listing">
                <IconButton
                  component="span"
                  size="small"
                  color="error"
                  onClick={handleDeleteClick}
                  sx={{
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: "error.main", color: "white" },
                  }}
                >
                  <DeleteIcon fontSize="small" color="disabled" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
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
              src={profilePictureUrl ? `${apiURL + profilePictureUrl}` : undefined}
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
                  by {displayName}
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
              {skillLevel && <SkillLevelChip skill={skillLevel} />}
              {mode && <ModeChip mode={mode} />}
              {availability && <AvailabilityChip availability={availability} />}
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
              src={profilePictureUrl ? `${apiURL + profilePictureUrl}` : undefined}
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
            by {displayName}
          </Typography>
          <Typography variant="body1">{description}</Typography>
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
            {skillLevel && <SkillLevelChip skill={skillLevel} />}
            {mode && <ModeChip mode={mode} />}
            {availability && <AvailabilityChip availability={availability} />}
          </Stack>
          {!isOwner && <Button
            variant="contained"
            fullWidth={isSmallScreen}
            sx={{ mt: isSmallScreen ? 1 : 0 }}
          >
            {type === "Mentor" ? "Request" : "Offer"} Mentorship
          </Button>
          }
        </DialogActions>
      </Dialog>

      <AddListingDialog listing={listing} open={isEditListingDialogOpen} onClose={() => setIsEditListingDialogOpen(false)} />

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="confirm-delete-dialog"
      >
        <DialogTitle id="confirm-delete-dialog">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContent>
            Are you sure you want to delete this listing? This action cannot be undone.
          </DialogContent>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" loading={loading} onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListingCard;
