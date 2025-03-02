import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, PlusIcon, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { TravelFormData } from "@/services/geminiService";
import { cn } from "@/lib/utils";

const interestsList = [
  "Nature",
  "History",
  "Culture",
  "Cuisine",
  "Adventure",
  "Shopping",
  "Relaxation",
  "Architecture",
  "Art",
  "Nightlife",
  "Wildlife",
  "Photography",
  "Beaches",
  "Mountains",
  "Local Experiences",
];

// Validation schema with error messages
const FormSchema = z.object({
  source: z.string().min(2, "Please enter a valid source location"),
  destination: z.string().min(2, "Please enter a valid destination"),
  startDate: z.date({
    required_error: "Please select a start date",
  }),
  endDate: z.date({
    required_error: "Please select an end date",
  }),
  budget: z.coerce
    .number()
    .min(100, "Budget must be at least $100")
    .max(1000000, "Budget is too high"),
  travelers: z.coerce
    .number()
    .min(1, "At least 1 traveler is required")
    .max(20, "Maximum 20 travelers"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
});

interface TravelFormProps {
  onSubmit: (data: TravelFormData) => void;
  className?: string;
}

// Define the form values type to make it explicit
type FormValues = z.infer<typeof FormSchema>;

export const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, className }) => {
  const [customInterest, setCustomInterest] = useState("");

  // Initialize the form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      source: "",
      destination: "",
      budget: 1000,
      travelers: 1,
      interests: [],
    },
  });

  const { control, handleSubmit, formState, setValue, watch } = form;
  
  const startDate = watch("startDate");
  const interests = watch("interests");

  // Add custom interest
  const handleAddCustomInterest = () => {
    if (customInterest.trim() && !interests.includes(customInterest.trim())) {
      setValue("interests", [...interests, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  // Remove interest
  const handleRemoveInterest = (interest: string) => {
    setValue(
      "interests",
      interests.filter((i) => i !== interest)
    );
  };

  // Toggle predefined interest
  const handleToggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      handleRemoveInterest(interest);
    } else {
      setValue("interests", [...interests, interest]);
    }
  };

  // Handle form submission and pass data to parent component
  const handleFormSubmit = (data: FormValues) => {
    // The data from the form matches the TravelFormData interface after form validation
    onSubmit(data as TravelFormData);
  };

  return (
    <Card className={cn("w-full max-w-lg mx-auto border border-border/50 shadow-md", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-medium">Plan Your Journey</CardTitle>
        <CardDescription>
          Enter your travel details and let AI create your perfect itinerary
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="source"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departing From</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Departure Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Return Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => !startDate || date < startDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (USD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="text-sm text-muted-foreground">$</span>
                        </div>
                        <Input className="pl-7" type="number" min="100" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>Total budget for your trip</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="travelers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travelers</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="20" {...field} />
                    </FormControl>
                    <FormDescription>Number of people traveling</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="interests"
              render={() => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <Badge
                            key={interest}
                            variant="secondary"
                            className="py-1 px-2 flex items-center gap-1 bg-muted"
                          >
                            {interest}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 hover:bg-accent rounded-full p-0"
                              onClick={() => handleRemoveInterest(interest)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {interest}</span>
                            </Button>
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          value={customInterest}
                          onChange={(e) => setCustomInterest(e.target.value)}
                          placeholder="Add custom interest"
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddCustomInterest();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={handleAddCustomInterest}
                          disabled={!customInterest.trim()}
                        >
                          <PlusIcon className="h-4 w-4" />
                          <span className="sr-only">Add interest</span>
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {interestsList.map((interest) => (
                          <Badge
                            key={interest}
                            variant={interests.includes(interest) ? "default" : "outline"}
                            className="cursor-pointer transition-all hover:shadow-sm"
                            onClick={() => handleToggleInterest(interest)}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={formState.isSubmitting}
            >
              {formState.isSubmitting ? "Planning..." : "Create Travel Plan"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TravelForm;
