
import { toast } from "@/components/ui/use-toast";

export interface TravelFormData {
  source: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  travelers: number;
  interests: string[];
}

export interface TravelPlan {
  summary: string;
  days: TravelDay[];
  budgetBreakdown: BudgetItem[];
  travelTips: string[];
}

export interface TravelDay {
  day: number;
  activities: Activity[];
}

export interface Activity {
  time: string;
  description: string;
  location: string;
  cost: number;
}

export interface BudgetItem {
  category: string;
  amount: number;
  percentage: number;
}

// This would normally come from an environment variable
// In a production app, this should be handled securely on the backend
let apiKey = "";

export const setApiKey = (key: string) => {
  apiKey = key;
};

export const getApiKey = () => apiKey;

export const generateTravelPlan = async (
  formData: TravelFormData
): Promise<TravelPlan> => {
  try {
    if (!apiKey) {
      throw new Error("API key is not set");
    }

    const prompt = generatePrompt(formData);
    
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the text from the response
    const text = data.candidates[0].content.parts[0].text;
    
    // Parse the JSON response
    // Wrap in try-catch as the model might not always return perfect JSON
    try {
      // The model should return JSON, but it might include markdown code blocks
      // Extract JSON content from potential markdown code blocks
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                        text.match(/```\n([\s\S]*?)\n```/) || 
                        [null, text];
      
      const jsonContent = jsonMatch[1] || text;
      const parsedPlan = JSON.parse(jsonContent);
      
      return validateAndFormatPlan(parsedPlan);
    } catch (parseError) {
      console.error("Error parsing Gemini response:", parseError);
      console.log("Raw response:", text);
      throw new Error("Failed to parse AI-generated travel plan");
    }
  } catch (error) {
    console.error("Error generating travel plan:", error);
    toast({
      title: "Error",
      description: `Failed to generate travel plan: ${error instanceof Error ? error.message : "Unknown error"}`,
      variant: "destructive",
    });
    throw error;
  }
};

// Generate the prompt for the Gemini API
const generatePrompt = (formData: TravelFormData): string => {
  const { source, destination, startDate, endDate, budget, travelers, interests } = formData;
  
  // Calculate the number of days
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  return `
You are an expert travel planner AI. Create a detailed travel plan with the following information:

- Source: ${source}
- Destination: ${destination}
- Travel dates: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()} (${days} days)
- Budget: $${budget}
- Number of travelers: ${travelers}
- Interests: ${interests.join(', ')}

Response format: Provide your response in JSON format with the following structure:

{
  "summary": "Brief overview of the trip",
  "days": [
    {
      "day": 1,
      "activities": [
        {
          "time": "08:00-10:00",
          "description": "Activity description",
          "location": "Location name",
          "cost": 50
        }
        // more activities
      ]
    }
    // more days
  ],
  "budgetBreakdown": [
    {
      "category": "Accommodation",
      "amount": 600,
      "percentage": 30
    }
    // more categories (Transportation, Food, Activities, Miscellaneous)
  ],
  "travelTips": [
    "Useful tip 1",
    "Useful tip 2"
    // more tips
  ]
}

Make sure all activities are realistic and fit with the destination. Ensure costs are reasonable and total budget doesn't exceed the specified amount. Include local cuisine, attractions, and activities that match the listed interests.
`;
};

// Validate and format the travel plan
const validateAndFormatPlan = (plan: any): TravelPlan => {
  // Basic validation
  if (!plan.summary || !Array.isArray(plan.days) || !Array.isArray(plan.budgetBreakdown) || !Array.isArray(plan.travelTips)) {
    throw new Error("Invalid travel plan format");
  }
  
  // Format and return the plan
  return {
    summary: plan.summary,
    days: plan.days.map((day: any) => ({
      day: day.day,
      activities: day.activities.map((activity: any) => ({
        time: activity.time,
        description: activity.description,
        location: activity.location,
        cost: activity.cost,
      })),
    })),
    budgetBreakdown: plan.budgetBreakdown.map((item: any) => ({
      category: item.category,
      amount: item.amount,
      percentage: item.percentage,
    })),
    travelTips: plan.travelTips,
  };
};
