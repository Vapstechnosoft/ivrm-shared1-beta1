"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<any, any>(({ className, ...props }, ref) => {
    const SliderRoot = SliderPrimitive.Root as any;
    const SliderTrack = SliderPrimitive.Track as any;
    const SliderRange = SliderPrimitive.Range as any;
    const SliderThumb = SliderPrimitive.Thumb as any;

    return (
        <SliderRoot
            ref={ref}
            className={cn(
                "relative flex w-full touch-none select-none items-center",
                className
            )}
            {...props}
        >
            <SliderTrack className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                <SliderRange className="absolute h-full bg-primary" />
            </SliderTrack>
            <SliderThumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
        </SliderRoot>
    )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
