"use client";

import { useEffect, useMemo, useRef } from "react";
import { Palette } from "@/constants/theme";
import { cn } from "@/lib/utils";

type RollingDisplayProps = {
  values: string[];
  onValuesChange: (values: string[]) => void;
  options?: string[];
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  className?: string;
};

const ITEM_HEIGHT = 74;
const DISPLAY_HEIGHT = 124;
const SCROLL_PADDING = (DISPLAY_HEIGHT - ITEM_HEIGHT) / 2;
const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

type ColumnProps = {
  index: number;
  value: string;
  options: string[];
  isActive: boolean;
  onChange: (index: number, value: string) => void;
  onFocus: (index: number) => void;
  isFirst: boolean;
  isLast: boolean;
};

function RollingColumn({
  index,
  value,
  options,
  isActive,
  onChange,
  onFocus,
  isFirst,
  isLast,
}: ColumnProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeoutRef = useRef<number | null>(null);
  const isProgrammaticRef = useRef(false);
  const selectedIndex = Math.max(0, options.indexOf(value));

  useEffect(() => {
    const node = scrollRef.current;

    if (!node) {
      return;
    }

    const targetTop = selectedIndex * ITEM_HEIGHT;

    if (Math.abs(node.scrollTop - targetTop) < 1) {
      return;
    }

    isProgrammaticRef.current = true;
    node.scrollTo({ top: targetTop, behavior: "smooth" });

    const releaseTimeout = window.setTimeout(() => {
      isProgrammaticRef.current = false;
    }, 180);

    return () => window.clearTimeout(releaseTimeout);
  }, [selectedIndex]);

  function clampIndex(nextIndex: number) {
    return Math.max(0, Math.min(options.length - 1, nextIndex));
  }

  function commitIndex(nextIndex: number) {
    const node = scrollRef.current;
    const clampedIndex = clampIndex(nextIndex);
    const nextValue = options[clampedIndex];

    if (!node || !nextValue) {
      return;
    }

    isProgrammaticRef.current = true;
    node.scrollTo({
      top: clampedIndex * ITEM_HEIGHT,
      behavior: "smooth",
    });

    window.setTimeout(() => {
      isProgrammaticRef.current = false;
    }, 180);

    if (nextValue !== value) {
      onChange(index, nextValue);
    }
  }

  function commitFromScroll() {
    const node = scrollRef.current;

    if (!node) {
      return;
    }

    const nextIndex = Math.round(node.scrollTop / ITEM_HEIGHT);
    commitIndex(nextIndex);
  }

  function scheduleCommit() {
    if (isProgrammaticRef.current) {
      return;
    }

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(commitFromScroll, 80);
  }

  function step(direction: -1 | 1) {
    commitIndex(selectedIndex + direction);
    onFocus(index);
  }

  return (
    <div
      className={cn(
        "relative h-[124px] w-14 overflow-hidden border-r border-r-white/35",
        isFirst && "rounded-l-[18px]",
        isLast && "rounded-r-[18px] border-r-0",
        isActive && "bg-white/[0.03]",
      )}
      onClick={() => onFocus(index)}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          step(-1);
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          step(1);
        }
      }}
      tabIndex={0}
    >
      <button
        aria-label={`Increase digit ${index + 1}`}
        className="absolute inset-x-0 top-0 z-20 h-1/2 cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          step(-1);
        }}
        type="button"
      />
      <button
        aria-label={`Decrease digit ${index + 1}`}
        className="absolute inset-x-0 bottom-0 z-20 h-1/2 cursor-pointer"
        onClick={(event) => {
          event.stopPropagation();
          step(1);
        }}
        type="button"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[14px] bg-[rgba(21,62,80,0.74)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[14px] bg-[rgba(21,62,80,0.74)]" />
      <div className="pointer-events-none absolute inset-x-1 top-1/2 z-10 h-[74px] -translate-y-1/2 rounded-[16px] border border-white/6 bg-white/[0.02]" />

      <div
        ref={scrollRef}
        className="h-full snap-y snap-mandatory overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseDown={() => onFocus(index)}
        onScroll={scheduleCommit}
        onWheel={(event) => {
          event.preventDefault();
          step(event.deltaY > 0 ? 1 : -1);
        }}
        onTouchEnd={commitFromScroll}
        style={{ paddingTop: SCROLL_PADDING, paddingBottom: SCROLL_PADDING }}
      >
        {options.map((option) => (
          <div
            key={`${index}-${option}`}
            className="flex h-[74px] w-14 snap-center items-center justify-center"
          >
            <span
              className="font-accent text-[82px] leading-[0.92] tracking-[-0.08em]"
              style={{ color: Palette.mandarin[700] }}
            >
              {option}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RollingDisplay({
  values,
  onValuesChange,
  options = DIGITS,
  activeIndex = 0,
  onActiveIndexChange,
  className,
}: RollingDisplayProps) {
  const safeValues = useMemo(() => values.slice(0, 4), [values]);

  function handleChange(index: number, nextValue: string) {
    const nextValues = safeValues.map((current, currentIndex) =>
      currentIndex === index ? nextValue : current,
    );

    onValuesChange(nextValues);
  }

  return (
    <div
      className={cn(
        "relative mx-auto flex h-[124px] overflow-hidden rounded-[20px] bg-[#1f2027] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]",
        className,
      )}
    >
      {safeValues.map((value, index) => (
        <RollingColumn
          key={`${index}-${value}`}
          index={index}
          value={value}
          options={options}
          isActive={activeIndex === index}
          onChange={handleChange}
          onFocus={(nextIndex) => onActiveIndexChange?.(nextIndex)}
          isFirst={index === 0}
          isLast={index === safeValues.length - 1}
        />
      ))}
    </div>
  );
}
