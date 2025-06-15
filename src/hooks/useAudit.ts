
import { useQuery } from '@tanstack/react-query';
import { auditService, AuditLog } from '@/services/auditService';

export const useAuditLogs = (resourceType?: string, resourceId?: string) => {
  return useQuery({
    queryKey: ['audit-logs', resourceType, resourceId],
    queryFn: () => auditService.getAuditLogs(resourceType, resourceId),
  });
};

export const useUserActivity = (userId?: string) => {
  return useQuery({
    queryKey: ['user-activity', userId],
    queryFn: () => auditService.getUserActivity(userId),
  });
};
