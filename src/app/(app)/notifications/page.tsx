
"use client";

import { PageHeader } from "@/components/PageHeader";
import { Bell, CheckCircle, Info } from "lucide-react";
import { sampleNotifications } from "@/lib/sample-data.tsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type NotificationFilterStatus = 'all' | 'unread' | 'read';

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [filterStatus, setFilterStatus] = useState<NotificationFilterStatus>('all');

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

  const filteredNotifications = notifications.filter(n => {
    if (filterStatus === 'unread') return !n.read;
    if (filterStatus === 'read') return n.read;
    return true; // 'all'
  });

  return (
    <div className="space-y-8 flex flex-col flex-1">
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

      <Card className="flex flex-col flex-1">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Your Notifications ({filteredNotifications.length})</CardTitle>
              {unreadCount > 0 && <CardDescription>You have {unreadCount} unread notifications in total.</CardDescription>}
            </div>
            <RadioGroup
              value={filterStatus}
              onValueChange={(value: string) => setFilterStatus(value as NotificationFilterStatus)}
              className="flex items-center space-x-2 sm:space-x-4"
            >
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="all" id="filter-all" />
                <Label htmlFor="filter-all" className="cursor-pointer">All</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="unread" id="filter-unread" />
                <Label htmlFor="filter-unread" className="cursor-pointer">Unread</Label>
              </div>
              <div className="flex items-center space-x-1">
                <RadioGroupItem value="read" id="filter-read" />
                <Label htmlFor="filter-read" className="cursor-pointer">Read</Label>
              </div>
            </RadioGroup>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <Bell className="mx-auto h-12 w-12 mb-4" />
              <p className="text-lg">No notifications {filterStatus !== 'all' ? `matching "${filterStatus}" filter` : 'yet'}.</p>
              {filterStatus !== 'all' && <p className="text-sm">Try a different filter or check back later.</p>}
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredNotifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 border rounded-lg transition-shadow hover:shadow-md ${
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
