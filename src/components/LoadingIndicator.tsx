
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  className?: string;
  text?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  className,
  text = "Crafting your perfect journey..."
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 w-full", 
      className
    )}>
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-t-2 border-b-2 border-primary/70 animate-spin" 
               style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
      
      <div className="space-y-3 w-full max-w-md">
        <p className="text-center text-lg font-light tracking-wider text-muted-foreground animate-pulse-subtle">
          {text}
        </p>
        
        <div className="w-full h-1 bg-accent overflow-hidden rounded-full">
          <div className="h-full bg-primary shimmer-effect origin-left scale-x-[0.3] animate-pulse-subtle"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
