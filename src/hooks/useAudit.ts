
import { useQuery } from '@tanstack/react-query';
import { auditService, AuditLog } from '@/services/auditService';

export const useAuditLogs = (filters?: {
  userId?: string;
  resourceType?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => auditService.getAuditLogs(filters),
  });
};

export const useLogAuditAction = () => {
  return auditService.logAction.bind(auditService);
};
