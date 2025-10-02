import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { TextField, Button, CircularProgress, Chip, Box, Typography, Card, CardContent, Avatar, IconButton, Divider } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfile } from '../auth/ProfileContext';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Delete from '@mui/icons-material/Delete';
import ArrowBack from '@mui/icons-material/ArrowBack';
import type { SkillModel } from '../models/userModels';
import { useNotification } from '../components/Notification';

const skillSchema = z.object({
  name: z.string().min(1),
  isTeaching: z.boolean(),
});

const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(50),
  bio: z.string().max(200).optional(),
  city: z.string().max(50).optional(),
  country: z.string().max(50).optional(),
  skills: z.array(skillSchema).optional(),
  profilePicture: z.instanceof(File).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const ProfileEditPage: React.FC = () => {
  const { showNotification } = useNotification();
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [isTeaching, setIsTeaching] = useState(true);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [removeProfilePicture, setRemoveProfilePicture] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      displayName: "",
      bio: "",
      city: "",
      country: "",
      skills: [],
      profilePicture: undefined
    },
  });

  const profilePicture = watch("profilePicture");

  // Load existing profile data
  useEffect(() => {
    if (profile) {
      reset({
        displayName: profile.displayName || "",
        bio: profile.bio || "",
        city: profile.city || "",
        country: profile.country || "",
        skills: profile.skills || [],
        profilePicture: undefined
      });

      // Set existing profile picture preview if available
      if (profile.profilePictureUrl) {
        setProfilePicPreview(apiUrl + profile.profilePictureUrl);
      }
      setRemoveProfilePicture(false);
    }
  }, [profile, reset, apiUrl]);

  useEffect(() => {
    if (profilePicture) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicPreview(e.target?.result as string);
      };
      reader.readAsDataURL(profilePicture);
      setRemoveProfilePicture(true);
    }
  }, [profilePicture]);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>, onChange: (value: File | undefined) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('Please select a valid image file', 'error');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showNotification('Image size should be less than 5MB', 'error');
        return;
      }

      onChange(file);
      setRemoveProfilePicture(false);
    } else {
      onChange(undefined);
    }
  };

  const handleRemoveProfilePicture = () => {
    setValue("profilePicture", undefined, { shouldValidate: true });
    setProfilePicPreview(null);
    setRemoveProfilePicture(true);
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = getValues("skills") ?? [];
      const skillName = skillInput.trim();
      if (!currentSkills.some(s => s.name === skillName && s.isTeaching === isTeaching)) {
        setValue(
          "skills",
          [...currentSkills, { name: skillName, isTeaching }],
          { shouldDirty: true }
        );
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: SkillModel) => {
    const currentSkills = getValues("skills") ?? [];
    setValue(
      "skills",
      currentSkills.filter(
        (s) => !(s.name === skill.name && s.isTeaching === skill.isTeaching)
      ),
      { shouldDirty: true }
    );
  };

  const onSubmit = async (data: ProfileForm) => {
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append('displayName', data.displayName);
      if (data.bio) formData.append('bio', data.bio);
      if (data.city) formData.append('city', data.city);
      if (data.country) formData.append('country', data.country);
      if (data.skills) formData.append('skillsJson', JSON.stringify(data.skills));

      if (data.profilePicture) {
        formData.append('profilePicture', data.profilePicture);
      } else if (removeProfilePicture) {
        formData.append('removeProfilePicture', 'true');
      }

      const response = await updateProfile(formData);

      if (response.success) {
        showNotification('Profile updated successfully!', 'success');
      }

    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Failed to update profile. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setRemoveProfilePicture(false);
    if (profile?.profilePictureUrl) {
      setProfilePicPreview(apiUrl + profile.profilePictureUrl);
    } else {
      setProfilePicPreview(null);
    }
  };

  if (!profile) {
    return (
      <Box className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  const teachingSkills = getValues("skills")?.filter(s => s.isTeaching) ?? [];
  const learningSkills = getValues("skills")?.filter(s => !s.isTeaching) ?? [];

  return (
    <Box className="flex flex-col items-center min-h-screen py-10 px-4">
      {/* Header */}
      <Box className="w-full max-w-2xl mb-6">
        <Box className="flex items-center gap-4 mb-4">
          <IconButton onClick={() => navigate('/dashboard')} color="primary">
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" className="font-bold">
            Edit Profile
          </Typography>
        </Box>
      </Box>

      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Profile Picture Section */}
            <Box className="flex flex-col items-center">
              <Typography variant="h6" className="mb-4">
                Profile Picture
              </Typography>

              <Avatar
                src={profilePicPreview ? profilePicPreview : undefined}
                sx={{ width: 120, height: 120, mb: 3 }}
              >
                {!profilePicPreview && getValues("displayName")?.charAt(0)?.toUpperCase()}
              </Avatar>

              <Box className="flex gap-2 mb-2">
                <Controller
                  name="profilePicture"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="profile-picture-upload"
                        type="file"
                        onChange={(e) => handleProfilePictureChange(e, onChange)}
                      />
                      <label htmlFor="profile-picture-upload">
                        <IconButton
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          size="large"
                        >
                          <PhotoCamera />
                        </IconButton>
                      </label>
                    </>
                  )}
                />

                {profilePicPreview && (
                  <IconButton
                    color="error"
                    aria-label="remove picture"
                    onClick={handleRemoveProfilePicture}
                    size="large"
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>

              <Typography variant="caption" color="textSecondary" className="text-center">
                Click the camera icon to upload a new profile picture (max 5MB)
              </Typography>
            </Box>

            <Divider />

            {/* Basic Information */}
            <Box className="space-y-4">
              <Typography variant="h6" className="mb-4">
                Basic Information
              </Typography>

              <Controller
                name="displayName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Display Name"
                    fullWidth
                    required
                    error={!!errors.displayName}
                    helperText={errors.displayName?.message}
                  />
                )}
              />

              <Controller
                name="bio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Bio"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.bio}
                    helperText={
                      errors.bio?.message || `${field.value?.length ?? 0}/200 characters`
                    }
                  />
                )}
              />

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="City" fullWidth />
                  )}
                />
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Country" fullWidth />
                  )}
                />
              </Box>
            </Box>

            <Divider />

            {/* Skills Section */}
            <Box className="space-y-4">
              <Typography variant="h6" className="mb-4">
                Skills & Interests
              </Typography>

              <Box className="flex gap-2 mb-2 items-center">
                <TextField
                  label={`Add ${isTeaching ? "Skills You're Offering To Teach" : "Skills You're Interested In Learning"}`}
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
                />
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleAddSkill}
                  disabled={!skillInput.trim()}
                  size="small"
                >
                  Add
                </Button>
              </Box>

              <Box className="flex gap-2 mb-4">
                <Button
                  variant={isTeaching ? "contained" : "outlined"}
                  onClick={() => setIsTeaching(true)}
                  size="small"
                >
                  Teaching
                </Button>
                <Button
                  variant={!isTeaching ? "contained" : "outlined"}
                  onClick={() => setIsTeaching(false)}
                  size="small"
                >
                  Learning
                </Button>
              </Box>

              {/* Teaching Skills */}
              <Box className="mb-4">
                <Typography variant="subtitle2" className="mb-2 font-semibold text-primary">
                  Skills You're Teaching
                </Typography>
                <Box className="flex flex-wrap gap-2 min-h-[40px]">
                  {teachingSkills.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" className="italic py-2">
                      No teaching skills added yet
                    </Typography>
                  ) : (
                    teachingSkills.map((skill) => (
                      <Chip
                        key={`${skill.name}-${skill.isTeaching}`}
                        label={skill.name}
                        onDelete={() => handleRemoveSkill(skill)}
                        color="primary"
                      />
                    ))
                  )}
                </Box>
              </Box>

              {/* Learning Skills */}
              <Box>
                <Typography variant="subtitle2" className="mb-2 font-semibold text-secondary">
                  Skills You're Learning
                </Typography>
                <Box className="flex flex-wrap gap-2 min-h-[40px]">
                  {learningSkills.length === 0 ? (
                    <Typography variant="body2" color="textSecondary" className="italic py-2">
                      No learning interests added yet
                    </Typography>
                  ) : (
                    learningSkills.map((skill) => (
                      <Chip
                        key={`${skill.name}-${skill.isTeaching}`}
                        label={skill.name}
                        onDelete={() => handleRemoveSkill(skill)}
                        color="secondary"
                      />
                    ))
                  )}
                </Box>
              </Box>
            </Box>

            <Divider />

            {/* Action Buttons */}
            <Box className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || loading || (!isDirty && !removeProfilePicture)}
              >
                {loading ? <CircularProgress size={24} /> : "Save Changes"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileEditPage;