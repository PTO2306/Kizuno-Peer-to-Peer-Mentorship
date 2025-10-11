import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Chip,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  MenuItem
} from '@mui/material';
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotification } from '../../Notification';
import type { Availability, ListingModel, ListingType, Mode, SkillLevel, TagsModel } from '../../../models/userModels';
import { useListing } from '../../../Data/ListingContext';

export interface ListingForm {
  title: string;
  subtitle?: string;
  description: string;
  type: ListingType;
  skillLevel?: SkillLevel;
  availability?: Availability;
  mode?: 'Online' | 'InPerson' | 'Hybrid';
  tags: TagsModel[];
}

const options = {
  skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillLevel[],
  availabilities: ['Anytime', 'Weekdays', 'Weekends', 'Evenings', 'Mornings', 'Afternoons'] as Availability[],
  modes: ['Online', 'InPerson', 'Hybrid'] as Mode[],
  listingTypes: ['Mentor', 'Mentee'] as ListingType[],
}

const tagsSchema = z.object({
  name: z.string().min(1, 'Tag name is required'),
});

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(80),
  subtitle: z.string().max(100).optional(),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  type: z.enum(options.listingTypes),
  skillLevel: z.enum(options.skillLevels).optional(),
  availability: z.enum(options.availabilities).optional(),
  mode: z.enum(options.modes).optional(),
  tags: z.array(tagsSchema).max(20, 'Maximum of 20 tags allowed').min(1, 'At least one tag is required'),
});

type ListingFormType = z.infer<typeof listingSchema>;

interface AddListingDialogProps {
  open: boolean;
  onClose: () => void;
  listing?: ListingModel;
}

const AddListingDialog: React.FC<AddListingDialogProps> = ({ open, onClose, listing }) => {
  const { showNotification } = useNotification();
  const { createListing, updateListing } = useListing();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const { control, handleSubmit, reset, setValue, getValues, watch, formState: { errors, isValid } } =
    useForm<ListingFormType>({
      resolver: zodResolver(listingSchema),
      mode: 'onChange',
      defaultValues: {
        title: '',
        subtitle: undefined,
        description: '',
        type: 'Mentor',
        skillLevel: undefined,
        availability: undefined,
        mode: undefined,
        tags: [],
      },
    });

  const typeValue = watch('type');
  const tags = useWatch({ control, name: 'tags' }) ?? [];

  useEffect(() => {
    if (open) {
      if (listing) {
        reset({
          title: listing.title,
          subtitle: listing.subtitle ?? "",
          description: listing.description,
          type: listing.type,
          skillLevel: listing.skillLevel,
          availability: listing.availability,
          mode: listing.mode,
          tags: listing.tags || [],
        });
      } else {
        reset();
      }
    }
  }, [open, listing, reset]);

  const onSubmit = async (data: ListingFormType) => {
    setLoading(true);
    try {
      const listingData = data as ListingModel;

      const response = listing
        ? await updateListing(listing.id!, listingData)
        : await createListing(listingData);

      if (response.success) {
        showNotification(
          listing ? "Listing updated successfully!" : "Listing created successfully!",
          "success"
        );
        onClose();
      }
    } catch (error: any) {
      showNotification(
        error.response?.data?.message || "Operation failed. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const tagName = tagInput.trim();
    if (!tagName) return;

    const currentTags = getValues("tags") ?? [];
    if (currentTags.some(t => t.name === tagName)) return;

    setValue("tags", [...currentTags, { name: tagName }], {
      shouldValidate: true,
      shouldDirty: true,
    });
    setTagInput("");
  };

  const handleRemoveTag = (tag: TagsModel) => {
    const currentTags = getValues("tags") ?? [];
    setValue(
      "tags",
      currentTags.filter(t => t.name !== tag.name),
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create a New Listing</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers className="space-y-6">

          {/* Listing Type Buttons */}
          <Box className="flex gap-4 mb-4">
            {['Mentor', 'Mentee'].map(t => (
              <Button
                key={t}
                variant={typeValue === t ? 'contained' : 'outlined'}
                color={typeValue === t ? 'primary' : 'inherit'}
                onClick={() => setValue('type', t as ListingType, { shouldValidate: true })}
              >
                {t === 'Mentor' ? 'Mentor (I can teach)' : 'Mentee (I want to learn)'}
              </Button>
            ))}
          </Box>

          {/* Title Field */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Listing Title"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message || `${field.value.length}/80`}
              />
            )}
          />

          {/* Subtitle Field */}
          <Controller
            name="subtitle"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Listing Subtitle"
                fullWidth
                error={!!errors.subtitle}
                helperText={errors.subtitle?.message || `${field?.value?.length || 0}/100`}
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
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message || `${field.value.length}/1000`}
              />
            )}
          />

          <Divider />

          {/* Optional Selects */}
          <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="skillLevel"
              control={control}
              render={({ field }) => (
                <TextField select label="Skill Level" fullWidth {...field} value={field.value || ''} error={!!errors.skillLevel}>
                  {options.skillLevels.map(level => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="availability"
              control={control}
              render={({ field }) => (
                <TextField select label="Availability" fullWidth {...field} value={field.value || ''} error={!!errors.availability}>
                  {options.availabilities.map(a => (
                    <MenuItem key={a} value={a}>{a}</MenuItem>
                  ))}
                </TextField>
              )}
            />

            <Controller
              name="mode"
              control={control}
              render={({ field }) => (
                <TextField select label="Mode" fullWidth {...field} value={field.value || ''} error={!!errors.mode}>
                  {options.modes.map(m => (
                    <MenuItem key={m} value={m}>{m === 'InPerson' ? "In Person" : m}</MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          {/* Tags Section */}
          <Box className="space-y-2">
            <Typography variant="h6">Skills & Interests</Typography>
            <Box className="flex gap-2 mb-2 items-center">
              <TextField
                label={`Add ${typeValue === 'Mentor' ? "Skills You're Offering To Teach" : "Skills You're Interested In Learning"}`}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                fullWidth
                size="small"
              />
              <Button
                type="button"
                variant="contained"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
                size="small"
              >
                Add
              </Button>
            </Box>
            <Box className="flex flex-wrap gap-2 min-h-[40px]">
              {tags.length === 0 ? (
                <Typography variant="body2" color="textPrimary" className="italic py-2">
                  No tags added yet
                </Typography>
              ) : (
                tags.map((tag) => (
                  <Chip
                    key={tag.name}
                    label={tag.name}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                  />
                ))
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions className="p-4">
          <Button variant="outlined" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={!isValid || loading}>
            {loading ? (
              <CircularProgress size={24} />
            ) : listing ? (
              "Update Listing"
            ) : (
              "Create Listing"
            )}
          </Button>
        </DialogActions>

      </form>
    </Dialog>
  );
};

export default AddListingDialog;
