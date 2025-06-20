
"use client";

import { PageHeader } from "@/components/PageHeader";
import { Bell, CheckCircle, Info } from "lucide-react";
import { sampleNotifications } from "@/lib/sample-data"; // Assuming sampleNotifications moved
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const { toast } = useToast();
  // In a real app, you might fetch notifications and allow marking as read
  const [notifications, setNotifications] = useState(sampleNotifications);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "All Read",
      description: "All notifications have been marked as read.",
    });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been removed.",
    });
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="All Notifications"
        description="Here's a list of all your recent notifications."
        icon={Bell}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <CheckCircle className="mr-2 h-4 w-4" /> Mark all as read
            </Button>
            <Button variant="destructive" onClick={clearAllNotifications} disabled={notifications.length === 0}>
              Clear All
            </Button>
          </div>
        }
      />

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-10">
              <Bell className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg">No notifications yet.</p>
              <p className="text-sm">Check back later for updates.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Notifications ({notifications.length})</CardTitle>
            {unreadCount > 0 && <CardDescription>You have {unreadCount} unread notifications.</CardDescription>}
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg ${
                    !notification.read ? 'bg-muted/50 border-primary/30' : 'border-border'
                  }`}
                >
                  <div className="mt-1 shrink-0 text-muted-foreground">{notification.icon}</div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <h3 className={`text-md font-semibold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <Badge variant="destructive" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className={`text-sm ${!notification.read ? 'text-foreground/90' : 'text-muted-foreground/90'}`}>
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {notification.time}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
