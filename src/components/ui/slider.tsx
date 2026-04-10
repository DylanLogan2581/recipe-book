import { Slider } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

function RangeSlider({
  className,
  ...props
}: React.ComponentProps<typeof Slider.Root>): React.JSX.Element {
  return (
    <Slider.Root
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[orientation=horizontal]:h-5",
        className,
      )}
      data-slot="slider"
      {...props}
    >
      <Slider.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
        <Slider.Range className="absolute h-full bg-primary" />
      </Slider.Track>
      {props.value?.map((value, index) => (
        <Slider.Thumb
          aria-label={index === 0 ? "Minimum value" : "Maximum value"}
          className="block size-4 rounded-full border border-primary/30 bg-background shadow-sm outline-none transition hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
          data-slot="slider-thumb"
          key={`${index}-${value}`}
        />
      ))}
    </Slider.Root>
  );
}

export { RangeSlider };
