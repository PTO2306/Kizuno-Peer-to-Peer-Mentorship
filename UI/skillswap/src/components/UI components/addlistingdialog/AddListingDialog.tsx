import React, { useState, useEffect } from 'react';
import { TextField, Button, CircularProgress, Chip, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotification } from '../../Notification';

export interface TagsModel {
  name: string;
  isTeaching: boolean; 
}


export interface ListingModel {
  title: string;
  description: string;
  tags: TagsModel[]; 
}

const tagsSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
  isTeaching: z.boolean(),
});

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  tags: z.array(tagsSchema).max(20, "A maximum of 20 combined tags are allowed").optional(), 
});

type ListingForm = z.infer<typeof listingSchema>;

interface AddListingDialogProps {
  open: boolean;
  onClose: () => void;
}


const AddListingDialog: React.FC<AddListingDialogProps> = ({ open, onClose}) => {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [isTeaching, setIsTeaching] = useState(true); 

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<ListingForm>({
    resolver: zodResolver(listingSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      tags: [],
    },
  });

  useEffect(() => {
    if (open) {
      reset();
      setSkillInput("");
      setIsTeaching(true);
    }
  }, [open, reset]);


  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = getValues("tags") ?? [];
      const skillName = skillInput.trim();
      
      if (!currentSkills.some(s => s.name.toLowerCase() === skillName.toLowerCase() && s.isTeaching === isTeaching)) {
        setValue(
          "tags",
          [...currentSkills, { name: skillName, isTeaching }],
          { shouldDirty: true, shouldValidate: true }
        );
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: TagsModel) => {
    const currentSkills = getValues("tags") ?? [];
    setValue(
      "tags",
      currentSkills.filter(
        (s) => !(s.name === skillToRemove.name && s.isTeaching === skillToRemove.isTeaching)
      ),
      { shouldDirty: true, shouldValidate: true }
    );
  };

  const onSubmit = async (data: ListingForm) => {
    setLoading(true);

    try {
      console.log(data); 

      showNotification('Listing created successfully!', 'success');
      onClose();

    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Failed to create listing. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const allTags = getValues("tags") ?? [];
  const teachingTags = allTags.filter(s => s.isTeaching) ?? [];
  const learningTags = allTags.filter(s => !s.isTeaching) ?? [];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Fill in the content for your Listing Below</DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box className="space-y-6">

            {/* Title Field */}
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Listing Title"
                  fullWidth
                  required
                  error={!!errors.title}
                  helperText={errors.title?.message || `${field.value.length}/100 characters`}
                />
              )}
            />

            {/* Description Field */}
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Detailed Description"
                  fullWidth
                  required
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message || `${field.value.length}/1000 characters`}
                />
              )}
            />

            <Divider />

            {/* Skills/Tags Section */}
            <Box className="space-y-4">
              <Typography variant="h6">Skills & Interests</Typography>
              
              {/* Teaching/Learning Toggle */}
              <Box className="flex gap-2 mb-4">
                <Button
                  variant={isTeaching ? "contained" : "outlined"}
                  onClick={() => setIsTeaching(true)}
                  size="small"
                  color="primary"
                >
                  Teaching Skills
                </Button>
                <Button
                  variant={!isTeaching ? "contained" : "outlined"}
                  onClick={() => setIsTeaching(false)}
                  size="small"
                  color="primary"
                >
                  Learning Interests
                </Button>
              </Box>

              {/* Skill Input */}
              <Box className="flex gap-2 mb-2 items-start">
                <TextField
                  label={`Add ${isTeaching ? "Skills You're Offering To Teach" : "Skills You're Looking To Learn"}`}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  fullWidth
                  size="small"
                  error={!!errors.tags}
                  helperText={errors.tags?.message || `Press Enter or Click Add`}
                />
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleAddSkill}
                  disabled={!skillInput.trim()}
                  size="medium"
                >
                  Add
                </Button>
              </Box>

              {/* Display Teaching Skills */}
              <Box className="mb-4">
                <Typography variant="subtitle2" className="mb-2 font-semibold text-primary">
                  Offering to Teach ({teachingTags.length})
                </Typography>
                <Box className="flex flex-wrap gap-2 min-h-[40px] p-2">
                  {teachingTags.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" className="italic py-1">
                      No teaching skills added yet.
                    </Typography>
                  ) : (
                    teachingTags.map((skill) => (
                      <Chip
                        key={`${skill.name}-T`}
                        label={skill.name}
                        onDelete={() => handleRemoveSkill(skill)}
                        color="primary"
                        variant="filled"
                      />
                    ))
                  )}
                </Box>
              </Box>

              {/* Display Learning Skills */}
              <Box>
                <Typography variant="subtitle2" className="mb-2 font-semibold text-secondary">
                  Interested in Learning ({learningTags.length})
                </Typography>
                <Box className="flex flex-wrap gap-2 min-h-[40px] p-2">
                  {learningTags.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" className="italic py-1">
                      No learning interests added yet.
                    </Typography>
                  ) : (
                    learningTags.map((skill) => (
                      <Chip
                        key={`${skill.name}-L`}
                        label={skill.name}
                        onDelete={() => handleRemoveSkill(skill)}
                        color="secondary"
                        variant="filled"
                      />
                    ))
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions className="p-4">
          <Button
            type="button"
            variant="outlined"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!isValid || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Create Listing"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddListingDialog;