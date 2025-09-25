import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router';
import httpClient from '../auth/httpClient';
import { TextField, Button, CircularProgress, Chip, Box, Typography, Stepper, Step, StepLabel } from '@mui/material';
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfile } from '../auth/ProfileContext';

const steps = ['Tell us about yourself', 'Skills and Interests'];

const profileSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(50),
  bio: z.string().max(200).optional(),
  city: z.string().max(50).optional(),
  country: z.string().max(50).optional(),
  skills: z.array(z.string()).optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const OnboardingPage: React.FC = () => {
  const { createProfile, showNotification } = useProfile();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
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
    },
  });

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      const currentSkills = getValues("skills") ?? [];
      if (!currentSkills.includes(skillInput.trim())) {
        setValue("skills", [...currentSkills, skillInput.trim()], { shouldDirty: true });
      }
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const currentSkills = getValues("skills") ?? [];
    setValue(
      "skills",
      currentSkills.filter((s) => s !== skill),
      { shouldDirty: true }
    );
  };

  const onSubmit = async (data: ProfileForm) => {

    setLoading(true);

    try {
      const response = await createProfile(data);

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
              <Box className="flex gap-2">
                <TextField
                  label="Add Skill"
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

              <Box className="flex flex-wrap gap-2 mt-3">
                {getValues("skills")?.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    color="secondary"
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
