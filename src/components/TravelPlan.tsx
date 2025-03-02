import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { TravelPlan as TravelPlanType } from "@/services/geminiService";
import { formatCurrency } from "@/lib/utils";
import ChatBox from "./ChatBox";
interface TravelPlanProps {
  plan: TravelPlanType;
  sourceDestination: {
    source: string;
    destination: string;
    dates: string;
  };
}
const TravelPlan: React.FC<TravelPlanProps> = ({
  plan,
  sourceDestination
}) => {
  // Function to calculate the color based on the budget percentage
  const getBudgetColor = (percentage: number) => {
    if (percentage <= 20) return "bg-green-500";
    if (percentage <= 40) return "bg-teal-500";
    if (percentage <= 60) return "bg-yellow-500";
    if (percentage <= 80) return "bg-orange-500";
    return "bg-red-500";
  };
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Travel Plan - Takes 2/3 of the space on large screens */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-semibold text-lg">{plan.summary}</CardTitle>
            <CardDescription className="text-base">
              Trip to {sourceDestination.destination} from {sourceDestination.source} · {sourceDestination.dates}
            </CardDescription>
          </CardHeader>
        </Card>
        
        {plan.days.map(day => <Card key={day.day} className="overflow-hidden">
            <CardHeader className="pb-3 bg-muted/50">
              <CardTitle className="text-lg">Day {day.day}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {day.activities.map((activity, index) => <div key={index} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {activity.time}
                      </Badge>
                      <div className="text-right text-sm font-medium">
                        {formatCurrency(activity.cost)}
                      </div>
                    </div>
                    <h3 className="font-medium mb-1">{activity.location}</h3>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>)}
              </div>
            </CardContent>
          </Card>)}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Budget Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {plan.budgetBreakdown.map((item, index) => <div key={index} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">{item.category}</span>
                      <span className="text-sm font-medium">
                        {formatCurrency(item.amount)} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full ${getBudgetColor(item.percentage)}`} style={{
                    width: `${item.percentage}%`
                  }}></div>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Travel Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {plan.travelTips.map((tip, index) => <li key={index} className="text-sm">{tip}</li>)}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Chat with AI - Takes 1/3 of the space on large screens */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Chat With Travel Assistant</CardTitle>
            <CardDescription>
              Ask any questions about your trip to {sourceDestination.destination}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ChatBox destinationInfo={sourceDestination} />
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default TravelPlan;