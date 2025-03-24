
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  showValue?: boolean;
  value?: number;
  max?: number;
  format?: (value: number, max: number) => string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value = 0, indicatorClassName, showValue = false, max = 100, format, ...props }, ref) => {
  const percentage = Math.round(((value || 0) / max) * 100);
  
  const defaultFormat = (value: number, max: number) => `${value}/${max}`;
  const formatter = format || defaultFormat;
  
  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-primary/10",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 bg-primary transition-all duration-300 ease-in-out",
            indicatorClassName
          )}
          style={{ transform: `translateX(-${100 - (percentage || 0)}%)` }}
        />
      </ProgressPrimitive.Root>
      
      {showValue && (
        <div className="absolute right-0 top-0 -translate-y-full mb-1 text-xs font-medium">
          {formatter(value || 0, max)}
        </div>
      )}
    </div>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
