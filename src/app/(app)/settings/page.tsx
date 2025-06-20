
"use client";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { postTones } from "@/lib/types";
import { Settings, Save } from "lucide-react";
import React, { useState } from 'react';

export default function SettingsPage() {
  // Mock state for settings - in a real app, this would come from a context or API
  const [profileName, setProfileName] = useState("Axcess User");
  const [profileEmail, setProfileEmail] = useState("user@example.com");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [defaultTone, setDefaultTone] = useState(postTones[0]);

  const handleSaveChanges = () => {
    // Simulate saving changes
    console.log("Saving settings:", {
      profileName,
      profileEmail,
      emailNotifications,
      inAppNotifications,
      darkMode,
      defaultTone,
    });
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your application settings and preferences."
        icon={Settings}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="profileName">Full Name</Label>
              <Input id="profileName" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Your full name" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="profileEmail">Email Address</Label>
              <Input id="profileEmail" type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} placeholder="your@email.com" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how you receive notifications.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="emailNotifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Receive updates and alerts via email.
                </span>
              </Label>
              <Switch
                id="emailNotifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                aria-label="Toggle email notifications"
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="inAppNotifications" className="flex flex-col space-y-1">
                <span>In-App Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Show notifications within the application.
                </span>
              </Label>
              <Switch
                id="inAppNotifications"
                checked={inAppNotifications}
                onCheckedChange={setInAppNotifications}
                aria-label="Toggle in-app notifications"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="darkMode" className="flex flex-col space-y-1">
                <span>Dark Mode</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Enable the dark color scheme.
                </span>
              </Label>
              <Switch
                id="darkMode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
                aria-label="Toggle dark mode"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Default Post Settings</CardTitle>
            <CardDescription>Set default values for new posts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="defaultTone">Default Tone</Label>
              <Select value={defaultTone} onValueChange={(value) => setDefaultTone(value as typeof postTones[number])}>
                <SelectTrigger id="defaultTone">
                  <SelectValue placeholder="Select a default tone" />
                </SelectTrigger>
                <SelectContent>
                  {postTones.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveChanges} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
