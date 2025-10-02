import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { TextField, Button, CircularProgress, Chip, Box, Typography, Stepper, Step, StepLabel, Card, CardContent, Avatar, IconButton } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfile } from '../auth/ProfileContext';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Delete from '@mui/icons-material/Delete';
import type { SkillModel } from '../models/userModels';
import { useNotification } from '../components/Notification';

const steps = ['Tell us about yourself', 'Skills and Interests'];

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

const OnboardingPage: React.FC = () => {
  const { showNotification } = useNotification();
  const { createProfile, profile } = useProfile();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [isTeaching, setIsTeaching] = useState(true);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, dirtyFields, isValid },
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

  useEffect(() => {
    if (profile) {
      navigate('/dashboard');
    }
  });

  useEffect(() => {
    if (profilePicture) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicPreview(e.target?.result as string);
      };
      reader.readAsDataURL(profilePicture);
    } else {
      setProfilePicPreview(null);
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
    } else {
      onChange(undefined)
    }
  };

  const handleRemoveProfilePicture = () => {
    setValue("profilePicture", undefined, { shouldDirty: true });
    setProfilePicPreview(null);
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
      }

      const response = await createProfile(formData);

      if (response.success) {
        navigate('/dashboard');
      }

    } catch (error: any) {
      showNotification(
        error.response?.data?.message || 'Failed to create profile. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  return (
    <Box className="flex flex-col items-center min-h-screen py-10 px-4">
      <Typography variant="h5" className="mb-6 font-bold">
        Complete Your Profile
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel className="w-full max-w-2xl mb-8">
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="w-full max-w-lg space-y-6 shadow-lg rounded-xl p-8">

        <form onSubmit={handleSubmit(onSubmit)} >
          {/* Step 1: Basic info */}
          {activeStep === 0 && (
            <Box className="space-y-6">

              <Box className="flex flex-col items-center ">
                <Typography variant="h6" className="text-center">
                  Profile Picture
                </Typography>

                <Card className="relative w-full">
                  <CardContent className="flex flex-col items-center p-4">
                    <Avatar
                      src={profilePicPreview || undefined}
                      sx={{ width: 120, height: 120, mb: 2 }}
                    >
                      {!profilePicPreview && getValues("displayName")?.charAt(0)?.toUpperCase()}
                    </Avatar>

                    <Box className="flex gap-2">
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

                    <Typography variant="caption" color="textSecondary" className="text-center mt-2">
                      Click the camera icon to upload a profile picture (max 5MB)
                    </Typography>
                  </CardContent>
                </Card>
              </Box>

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
                      errors.bio?.message || `${field.value?.length ?? 0}/200`
                    }
                  />
                )}
              />

              <Box className="grid grid-cols-2 gap-4">
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
          )}

          {/* Step 2: Skills */}
          {activeStep === 1 && (
            <Box>
              <Box className="flex gap-2 mb-2 items-center">
                <TextField
                  label={`Add ${isTeaching ? "Skills You're Offering To Teach" : "Skills You're Interested In Learning"}`}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  fullWidth
                />
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleAddSkill}
                  disabled={!skillInput.trim()}
                >
                  Add
                </Button>
              </Box>

              <Box className="flex gap-2 mb-4">
                <Button
                  variant={isTeaching ? "contained" : "outlined"}
                  onClick={() => setIsTeaching(true)}
                >
                  Teaching
                </Button>
                <Button
                  variant={!isTeaching ? "contained" : "outlined"}
                  onClick={() => setIsTeaching(false)}
                >
                  Learning
                </Button>
              </Box>

              <Box className="flex flex-wrap gap-2 mt-3">
                {getValues("skills")?.map((skill) => (
                  <Chip
                    key={`${skill.name}-${skill.isTeaching}`}
                    label={`${skill.name} (${skill.isTeaching ? "Teaching" : "Learning"})`}
                    onDelete={() => handleRemoveSkill(skill)}
                    color={skill.isTeaching ? "primary" : "secondary"}
                  />
                ))}
              </Box>
            </Box>
          )}


        </form>
        {/* Navigation buttons */}
        <Box className="flex justify-between pt-6">
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>

          {activeStep < steps.length - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              variant="contained"
              disabled={activeStep === 0 && !dirtyFields.displayName}
            >
              Next
            </Button>

          ) : (
            <Button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              disabled={!isValid || loading}
            >
              {loading ? <CircularProgress size={24} /> : "Finish"}
            </Button>
          )}
        </Box>
      </div>

    </Box>
  );
};

export default OnboardingPage;
