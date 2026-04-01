import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "font-body flex h-12 w-full rounded-2xl border border-[color:var(--color-border)] bg-[color:rgb(255_255_255_/_0.04)] px-4 py-3 text-sm tracking-[0.01em] text-[color:var(--color-text)] shadow-sm outline-none transition placeholder:text-[color:var(--color-text-tertiary)] focus:border-[color:var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
