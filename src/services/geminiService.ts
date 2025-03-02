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

export interface Activity {
  time: string;
  description: string;
  location: string;
  cost: number;
}

export interface Day {
  day: number;
  activities: Activity[];
}

export interface BudgetItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface TravelPlan {
  summary: string;
  days: Day[];
  budgetBreakdown: BudgetItem[];
  travelTips: string[];
}

const API_KEY_LOCAL_STORAGE_KEY = "geminiApiKey";

/**
 * Get the Gemini API key from local storage
 */
export const getApiKey = (): string | null => {
  return localStorage.getItem(API_KEY_LOCAL_STORAGE_KEY);
};

/**
 * Set the Gemini API key in local storage
 * @param apiKey - The Gemini API key to set
 */
export const setApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_LOCAL_STORAGE_KEY, apiKey);
};

/**
 * Generate a travel plan based on user input
 */
export const generateTravelPlan = async (data: TravelFormData): Promise<TravelPlan> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key not found. Please set your Gemini API key.");
  }

  const startDateStr = data.startDate.toLocaleDateString();
  const endDateStr = data.endDate.toLocaleDateString();

  const prompt = `
You are an expert travel assistant. A user wants to plan a trip from ${data.source} to ${data.destination}.
The trip will be from ${startDateStr} to ${endDateStr}. The user has a budget of ${data.budget} and is traveling with ${data.travelers} people.
The user is interested in ${data.interests.join(', ')}.

Create a detailed travel plan with a summary, a day-by-day itinerary, a budget breakdown, and travel tips.

- Summary: A brief overview of the trip.
- Day-by-day itinerary: A detailed plan for each day of the trip. Include the time, location, and description of each activity.
- Budget breakdown: An itemized list of expenses, including transportation, accommodation, food, and activities.
- Travel tips: Advice on how to make the most of the trip.

The travel plan should be well-formatted and easy to read. Be creative and make the travel plan sound exciting.

Here's an example of the desired JSON output format:
{
  "summary": "A brief overview of the trip.",
  "days": [
    {
      "day": 1,
      "activities": [
        {
          "time": "8:00 AM",
          "description": "Visit the Eiffel Tower.",
          "location": "Eiffel Tower",
          "cost": 30
        }
      ]
    }
  ],
  "budgetBreakdown": [
    {
      "category": "Transportation",
      "amount": 100,
      "percentage": 20
    }
  ],
  "travelTips": [
    "Book your flights and accommodations in advance."
  ]
}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(
        errorData.error?.message ||
          "Failed to communicate with Gemini API. Please try again."
      );
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Received an empty response from Gemini API.");
    }

    try {
      const travelPlan = JSON.parse(textResponse) as TravelPlan;
      return travelPlan;
    } catch (error) {
      console.error("Failed to parse travel plan:", error);
      console.log("Gemini API response:", textResponse);
      throw new Error("Failed to parse travel plan. Please try again.");
    }
  } catch (error) {
    console.error("Failed to generate travel plan:", error);
    if (error instanceof Error) {
      toast({
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
    throw error;
  }
};

/**
 * Ask follow-up questions about the travel plan
 */
export const askFollowUpQuestion = async (
  source: string,
  destination: string,
  dates: string,
  question: string
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key not found. Please set your Gemini API key.");
  }

  const daysMatch = dates.match(/\d+\/\d+\/\d+\s+to\s+\d+\/\d+\/\d+\s+\((\d+)\s+days\)/);
  const numDays = daysMatch ? parseInt(daysMatch[1]) : 1;

  const prompt = `
You are a helpful travel assistant who previously created a travel plan from ${source} to ${destination} for ${dates}.
The traveler is asking the following question: "${question}"

When answering:
1. Be conversational and friendly
2. Provide specific advice relevant to ${destination}
3. Consider the trip duration (${numDays} days)
4. If asked about attractions, costs, food, transportation, or activities, provide specific recommendations
5. Keep your response concise (under 150 words) but informative
6. Be honest if you don't know something specific about the destination

Respond directly to the user's question without referring to these instructions.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API error:", errorData);
      throw new Error(
        errorData.error?.message ||
          "Failed to communicate with Gemini API. Please try again."
      );
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("Received an empty response from Gemini API.");
    }

    return textResponse;
  } catch (error) {
    console.error("Error asking follow-up question:", error);
    if (error instanceof Error) {
      toast({
        title: "Error",
        description: error.message,
      });
    } else {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
    throw error;
  }
};
