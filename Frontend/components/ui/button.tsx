import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "font-body inline-flex items-center justify-center rounded-xl border text-sm tracking-[0.02em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-[var(--color-bg)]",
  {
    variants: {
      variant: {
        default:
          "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white hover:bg-[color:var(--color-primary-strong)] hover:border-[color:var(--color-primary-strong)]",
        outline:
          "border-[color:var(--color-border)] bg-[color:rgb(255_255_255_/_0.04)] text-[color:var(--color-text)] hover:bg-[color:rgb(255_255_255_/_0.08)]",
        ghost: "border-transparent bg-transparent text-[color:var(--color-text-secondary)] hover:bg-[color:rgb(255_255_255_/_0.04)] hover:text-[color:var(--color-text)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
