
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, OrderItem, OrderStatusHistory } from '@/services/orderService';
import { useToast } from '@/hooks/use-toast';

export const useOrderItems = (orderId: string) => {
  return useQuery({
    queryKey: ['order-items', orderId],
    queryFn: () => orderService.getOrderItems(orderId),
    enabled: !!orderId,
  });
};

export const useCreateOrderItem = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: orderService.createOrderItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order-items', data.order_id] });
      toast({
        title: "Order item added",
        description: "Order item has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add order item. Please try again.",
        variant: "destructive",
      });
      console.error('Error creating order item:', error);
    },
  });
};

export const useOrderStatusHistory = (orderId: string) => {
  return useQuery({
    queryKey: ['order-status-history', orderId],
    queryFn: () => orderService.getOrderStatusHistory(orderId),
    enabled: !!orderId,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ orderId, status, notes }: { orderId: string; status: string; notes?: string }) =>
      orderService.updateOrderStatus(orderId, status, notes),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['order-status-history', variables.orderId] });
      toast({
        title: "Order status updated",
        description: "Order status has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
      console.error('Error updating order status:', error);
    },
  });
};
