
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService, UserSettings } from '@/services/settingsService';
import { useToast } from '@/hooks/use-toast';

export const useUserSettings = () => {
  return useQuery({
    queryKey: ['user-settings'],
    queryFn: settingsService.getUserSettings,
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: settingsService.updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast({
        title: "Settings updated",
        description: "Your settings have been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating settings:', error);
    },
  });
};

export const useResetSettingsToDefaults = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: settingsService.resetToDefaults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast({
        title: "Settings reset",
        description: "Your settings have been reset to defaults.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to reset settings. Please try again.",
        variant: "destructive",
      });
      console.error('Error resetting settings:', error);
    },
  });
};
