
import { useQuery } from '@tanstack/react-query';
import { auditService, AuditLog } from '@/services/auditService';

export const useAuditLogs = (resourceType?: string, resourceId?: string, limit: number = 50) => {
  return useQuery({
    queryKey: ['audit-logs', resourceType, resourceId, limit],
    queryFn: () => auditService.getAuditLogs(resourceType, resourceId, limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useUserActivity = (userId: string, limit: number = 50) => {
  return useQuery({
    queryKey: ['user-activity', userId, limit],
    queryFn: () => auditService.getUserActivity(userId, limit),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!userId,
  });
};
