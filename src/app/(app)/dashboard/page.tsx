
"use client";

import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, PlusSquare, FileText, BarChart3, TrendingUp, CalendarCheck, Send, LineChart as LineChartIcon } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


// Sample analytics data
const analyticsData = [
  { title: "Total Posts Created", value: "128", icon: FileText, change: "+12 this month", changeType: "positive" as "positive" | "negative" | "neutral" },
  { title: "Avg. Engagement Rate", value: "5.7%", icon: TrendingUp, change: "+0.5% vs last month", changeType: "positive" as "positive" | "negative" | "neutral" },
  { title: "Posts This Month", value: "15", icon: CalendarCheck, change: "3 scheduled", changeType: "neutral" as "positive" | "negative" | "neutral" },
  { title: "Active Campaigns", value: "3", icon: Send, change: "1 ending soon", changeType: "neutral" as "positive" | "negative" | "neutral" },
];

const postActivityData = [
  { month: "Jan", posts: 12, engagement: 2.5 },
  { month: "Feb", posts: 18, engagement: 3.1 },
  { month: "Mar", posts: 15, engagement: 2.8 },
  { month: "Apr", posts: 22, engagement: 3.5 },
  { month: "May", posts: 19, engagement: 3.2 },
  { month: "Jun", posts: 25, engagement: 4.0 },
];

const chartConfig = {
  posts: {
    label: "Posts",
    color: "hsl(var(--chart-1))",
  },
  engagement: {
    label: "Engagement (%)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;


export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Creator Dashboard"
        description="Oversee your content strategy and performance at a glance."
        icon={LayoutDashboard}
        actions={
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/create-post">
              <PlusSquare className="mr-2 h-4 w-4" />
              Create New Post
            </Link>
          </Button>
        }
      />

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-primary" />
          Analytics Overview
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {analyticsData.map((item) => (
            <Card key={item.title} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{item.value}</div>
                <p className={`text-xs ${item.changeType === 'positive' ? 'text-green-600' : item.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'}`}>
                  {item.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="mt-6 col-span-1 md:col-span-2 lg:col-span-4 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChartIcon className="mr-2 h-5 w-5 text-primary" />
              Monthly Performance
            </CardTitle>
            <CardDescription>
              Overview of posts and engagement for the last 6 months.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <BarChart accessibilityLayer data={postActivityData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis yAxisId="left" orientation="left" stroke="hsl(var(--chart-1))"  tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--chart-2))" tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar yAxisId="left" dataKey="posts" fill="var(--color-posts)" radius={4} />
                <Bar yAxisId="right" dataKey="engagement" fill="var(--color-engagement)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Add other dashboard-specific components here, like recent activity, quick links, etc. */}
      {/* For example:
      <Card>
        <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
        <CardContent><p>Details about recent post submissions or approvals...</p></CardContent>
      </Card> 
      */}

    </div>
  );
}
