
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TravelPlan as TravelPlanType } from "@/services/geminiService";
import { cn } from "@/lib/utils";

interface TravelPlanProps {
  plan: TravelPlanType;
  className?: string;
}

export const TravelPlan: React.FC<TravelPlanProps> = ({ plan, className }) => {
  // Calculate total budget
  const totalBudget = plan.budgetBreakdown.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className={cn("w-full max-w-4xl mx-auto space-y-8 animate-fade-in", className)}>
      {/* Summary Card */}
      <Card className="overflow-hidden border border-border/50 shadow-md">
        <CardHeader className="pb-4 bg-secondary/30">
          <CardTitle className="text-2xl font-medium tracking-tight">Your Travel Experience</CardTitle>
          <CardDescription className="text-base font-light">
            Expertly crafted itinerary based on your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed">{plan.summary}</p>
        </CardContent>
      </Card>

      {/* Daily Itinerary */}
      <div className="space-y-6">
        <h2 className="text-xl font-medium tracking-tight">Daily Itinerary</h2>
        
        {plan.days.map((day) => (
          <Card key={day.day} className="overflow-hidden border border-border/50 shadow-sm">
            <CardHeader className="py-3 bg-muted/50">
              <CardTitle className="text-lg flex items-center">
                <div className="flex items-center justify-center rounded-full bg-primary w-8 h-8 text-primary-foreground text-sm font-medium mr-3">
                  {day.day}
                </div>
                <span>Day {day.day}</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <ul className="divide-y divide-border/50">
                {day.activities.map((activity, index) => (
                  <li key={index} className="p-4 transition-colors hover:bg-muted/30">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="font-medium text-sm text-muted-foreground mb-1">
                          {activity.time}
                        </div>
                        <h3 className="font-medium mb-1">{activity.description}</h3>
                        <p className="text-sm text-muted-foreground">{activity.location}</p>
                      </div>
                      <div className="flex items-center shrink-0">
                        <Badge variant="outline" className="text-xs px-2 py-1 border-primary/20 bg-primary/5 text-primary">
                          ${activity.cost}
                        </Badge>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget Breakdown */}
      <Card className="overflow-hidden border border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-medium tracking-tight">Budget Breakdown</CardTitle>
          <CardDescription>
            Total budget: ${totalBudget}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plan.budgetBreakdown.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm">${item.amount} ({item.percentage}%)</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Travel Tips */}
      <Card className="overflow-hidden border border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-medium tracking-tight">Travel Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {plan.travelTips.map((tip, index) => (
              <li key={index} className="flex gap-2">
                <div className="shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                </div>
                <p className="text-sm">{tip}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelPlan;
