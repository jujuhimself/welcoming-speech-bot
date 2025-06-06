
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, MessageSquare, Check, X, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettings {
  orderUpdates: { email: boolean; sms: boolean; push: boolean; };
  inventoryAlerts: { email: boolean; sms: boolean; push: boolean; };
  appointments: { email: boolean; sms: boolean; push: boolean; };
  testResults: { email: boolean; sms: boolean; push: boolean; };
  payments: { email: boolean; sms: boolean; push: boolean; };
}

interface Notification {
  id: string;
  type: 'order' | 'inventory' | 'appointment' | 'test' | 'payment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    orderUpdates: { email: true, sms: true, push: true },
    inventoryAlerts: { email: true, sms: false, push: true },
    appointments: { email: true, sms: true, push: true },
    testResults: { email: true, sms: true, push: false },
    payments: { email: true, sms: false, push: true }
  });
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'order',
        title: 'Order Delivered',
        message: 'Order #DEL-001 has been delivered to Grace Pharmacy',
        timestamp: '2024-06-06T10:30:00',
        read: false,
        priority: 'medium'
      },
      {
        id: '2',
        type: 'inventory',
        title: 'Low Stock Alert',
        message: 'Paracetamol 500mg is running low (50 units remaining)',
        timestamp: '2024-06-06T09:15:00',
        read: false,
        priority: 'high'
      },
      {
        id: '3',
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: 'Appointment with Dr. Mwangi scheduled for 2:00 PM today',
        timestamp: '2024-06-06T08:00:00',
        read: true,
        priority: 'medium'
      },
      {
        id: '4',
        type: 'test',
        title: 'Test Results Ready',
        message: 'Blood test results for patient John Doe are now available',
        timestamp: '2024-06-05T16:45:00',
        read: false,
        priority: 'high'
      },
      {
        id: '5',
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of TZS 2,500,000 received from Central Hospital',
        timestamp: '2024-06-05T14:20:00',
        read: true,
        priority: 'low'
      }
    ];

    setNotifications(sampleNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "All notifications marked as read",
      description: "Your notification list has been updated.",
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const updateSettings = (category: keyof NotificationSettings, channel: 'email' | 'sms' | 'push', value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: value
      }
    }));
    
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return '📦';
      case 'inventory': return '📊';
      case 'appointment': return '📅';
      case 'test': return '🧪';
      case 'payment': return '💰';
      default: return '🔔';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const sortedNotifications = notifications.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount} new</Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Notification Settings */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(settings).map(([category, channels]) => (
                <div key={category}>
                  <h3 className="font-medium mb-3 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="grid grid-cols-3 gap-4 pl-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">Email</span>
                      </div>
                      <Switch
                        checked={channels.email}
                        onCheckedChange={(value) => 
                          updateSettings(category as keyof NotificationSettings, 'email', value)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="text-sm">SMS</span>
                      </div>
                      <Switch
                        checked={channels.sms}
                        onCheckedChange={(value) => 
                          updateSettings(category as keyof NotificationSettings, 'sms', value)
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="text-sm">Push</span>
                      </div>
                      <Switch
                        checked={channels.push}
                        onCheckedChange={(value) => 
                          updateSettings(category as keyof NotificationSettings, 'push', value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No notifications</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg ${
                    notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 flex-1">
                      <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h3>
                          <Badge className={`${getPriorityColor(notification.priority)} text-white text-xs`}>
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 ml-4">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSystem;
