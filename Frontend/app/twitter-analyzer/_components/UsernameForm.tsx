import { FormEvent } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  username: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  error: string | null;
};

export function UsernameForm({ username, onChange, onSubmit, isLoading, error }: Props) {
  const canSubmit = username.trim().length > 0 && !isLoading;

  return (
    <div className="rounded-[28px] border border-white/10 bg-[rgba(255,255,255,0.04)] p-5 shadow-[0_24px_80px_-48px_rgba(0,0,0,0.85)] sm:p-6">
      <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-body text-sm text-[color:var(--color-text-tertiary)]">
            @
          </span>
          <Input
            className="h-13 rounded-[18px] pl-8"
            onChange={(e) => onChange(e.target.value.replace(/^@/, ""))}
            placeholder="username"
            type="text"
            value={username}
            disabled={isLoading}
          />
        </div>
        <Button className="h-13 rounded-[18px] px-5" disabled={!canSubmit} type="submit">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          {isLoading ? "Analyzing…" : "Analyze"}
        </Button>
      </form>

      {error && (
        <div className="font-body mt-4 rounded-2xl border border-[rgba(255,119,119,0.28)] bg-[rgba(255,79,79,0.08)] px-4 py-3 text-sm leading-6 text-[#ffb1b1]">
          {error}
        </div>
      )}
    </div>
  );
}
