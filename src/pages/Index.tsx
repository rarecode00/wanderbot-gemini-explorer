
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import TravelForm from "@/components/TravelForm";
import LoadingIndicator from "@/components/LoadingIndicator";
import TravelPlan from "@/components/TravelPlan";
import { TravelFormData, TravelPlan as TravelPlanType, generateTravelPlan, setApiKey, getApiKey } from "@/services/geminiService";
import { cn } from "@/lib/utils";

const Index = () => {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(!getApiKey());
  const [isLoading, setIsLoading] = useState(false);
  const [travelPlan, setTravelPlan] = useState<TravelPlanType | null>(null);
  const [formData, setFormData] = useState<TravelFormData | null>(null);

  const handleSetApiKey = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const key = formData.get("apiKey") as string;
    
    if (key.trim()) {
      setApiKey(key.trim());
      setApiKeyDialogOpen(false);
      toast("API Key Set", {
        description: "Your Gemini API key has been set successfully.",
      });
    }
  };

  const handleSubmitTravelForm = async (data: TravelFormData) => {
    if (!getApiKey()) {
      setApiKeyDialogOpen(true);
      return;
    }

    setIsLoading(true);
    setTravelPlan(null);
    setFormData(data);

    try {
      const plan = await generateTravelPlan(data);
      setTravelPlan(plan);
      toast("Travel Plan Generated", {
        description: "Your customized travel itinerary is ready!",
      });
    } catch (error) {
      console.error("Failed to generate travel plan:", error);
      // Error is already displayed via toast in the generateTravelPlan function
    } finally {
      setIsLoading(false);
    }
  };

  // Format dates for display
  const formatDateRange = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return '';
    return `${startDate} to ${endDate}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Gemini API Key</DialogTitle>
            <DialogDescription>
              To generate travel plans, you need to provide a Gemini API key.
              You can get one from the{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Google AI Studio
              </a>
              .
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSetApiKey} className="space-y-4">
            <Input
              id="apiKey"
              name="apiKey"
              placeholder="Paste your Gemini API key here"
              autoComplete="off"
              className="w-full"
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setApiKeyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save API Key</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="w-full bg-background py-6 border-b border-border/50">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-primary"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
              </div>
              <h1 className="text-xl font-medium tracking-tight">WanderBot</h1>
            </div>
            
            {getApiKey() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setApiKeyDialogOpen(true)}
                className="text-sm"
              >
                Update API Key
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container max-w-5xl mx-auto py-8 px-4 relative">
        {!travelPlan && !isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">
                  Discover Your Perfect Journey
                </h1>
                <p className="text-muted-foreground text-lg">
                  Intelligent travel planning powered by Google's Gemini AI. 
                  Just share your preferences, and let us craft your ideal itinerary.
                </p>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-primary"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Personalized Recommendations</h3>
                    <p className="text-sm text-muted-foreground">
                      Tailored experiences based on your interests
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-primary"
                    >
                      <path d="M12 2H2v10h10V2z"></path>
                      <path d="M12 12H2v10h10V12z"></path>
                      <path d="M22 2h-10v20h10V2z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Complete Itinerary</h3>
                    <p className="text-sm text-muted-foreground">
                      Day-by-day plans with activities and costs
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 text-primary"
                    >
                      <path d="M12 1v22"></path>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Budget Optimization</h3>
                    <p className="text-sm text-muted-foreground">
                      Make the most of your travel funds
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 lg:pl-8 animate-fade-in">
              <TravelForm onSubmit={handleSubmitTravelForm} />
            </div>
          </div>
        ) : (
          <div className="w-full">
            {isLoading ? (
              <div className="my-12">
                <LoadingIndicator />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold tracking-tight">Your Travel Plan</h2>
                  <Button 
                    variant="outline"
                    onClick={() => setTravelPlan(null)}
                  >
                    Create New Plan
                  </Button>
                </div>
                {travelPlan && formData && (
                  <TravelPlan 
                    plan={travelPlan} 
                    sourceDestination={{
                      source: formData.source,
                      destination: formData.destination,
                      dates: formatDateRange(formData.startDate, formData.endDate)
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-border/50 bg-background">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              WanderBot — AI-powered travel planning with Google Gemini
            </p>
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm text-muted-foreground"
                onClick={() => setApiKeyDialogOpen(true)}
              >
                API Key
              </Button>
              <a
                href="https://ai.google.dev/gemini-api"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Gemini API
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
