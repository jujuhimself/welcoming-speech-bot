
import { useQuery } from '@tanstack/react-query';
import { auditService } from '@/services/auditService';

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => auditService.getUserActivity(),
    staleTime: 30000, // 30 seconds
  });
};
