import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-[color:rgb(255_255_255_/_0.08)] bg-[linear-gradient(180deg,rgba(69,66,69,0.78),rgba(36,33,36,0.92))] shadow-[0_30px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-6", className)} {...props} />;
}
