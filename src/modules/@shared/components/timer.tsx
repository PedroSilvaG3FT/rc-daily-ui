import { cn } from "@/_shad/lib/utils";
import React, { useState, useEffect, useImperativeHandle } from "react";
import { Button } from "@/_shad/components/ui/button";
import { Pause, Play, RotateCcw } from "lucide-react";
import Show from "./utils/show";

interface AppTimerProps {
  className?: string;
  hideReset?: boolean;
  initialSeconds?: number;
  showActionLabel?: boolean;
  mode: "timer" | "countdown";
  onPlayChange?: (value: boolean) => void;
  onSecondChange?: (value: number) => void;
}

export type AppTimerHandler = {
  setIsActive: (value: React.SetStateAction<boolean>) => void;
  setTotalSeconds: (value: React.SetStateAction<number>) => void;
};

const AppTimer: React.ForwardRefRenderFunction<
  AppTimerHandler,
  AppTimerProps
> = (props, ref) => {
  const {
    mode,
    className,
    onPlayChange,
    onSecondChange,
    hideReset = false,
    initialSeconds = 0,
    showActionLabel = false,
  } = props;
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isActive) {
      interval = setInterval(() => {
        if (mode === "timer") {
          const value = totalSeconds + 1;
          setTotalSeconds(value);
          onSecondChange?.(value);
        } else if (mode === "countdown") {
          if (totalSeconds === 0) {
            clearInterval(interval!);
            setIsActive(false);
          } else {
            const value = totalSeconds - 1;
            setTotalSeconds(value);
            onSecondChange?.(value);
          }
        }
      }, 1000);
    } else clearInterval(interval!);

    return () => clearInterval(interval!);
  }, [isActive, totalSeconds, mode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
    onPlayChange?.(!isActive);
  };

  const resetTimer = () => {
    setTotalSeconds(initialSeconds);
    setIsActive(false);
  };

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  useImperativeHandle(ref, () => ({
    setIsActive,
    setTotalSeconds,
  }));

  return (
    <section className={cn("flex gap-4 items-center", className)}>
      <div className="text-xl">
        <span>{String(hours).padStart(2, "0")}:</span>
        <span>{String(minutes).padStart(2, "0")}:</span>
        <span>{String(seconds).padStart(2, "0")}</span>
      </div>

      <article className="flex items-center pl-4 border-l-2">
        <Button
          variant="ghost"
          className=" text-green-400"
          onClick={toggleTimer}
        >
          {isActive ? <Pause className="h-5" /> : <Play className="h-5" />}

          <Show>
            <Show.When isTrue={showActionLabel}>
              <span className="ml-2">{isActive ? "Pausar" : "Iniciar"}</span>
            </Show.When>
          </Show>
        </Button>

        <Show>
          <Show.When isTrue={!hideReset}>
            <Button
              variant="ghost"
              className="w-12 text-red-400"
              onClick={resetTimer}
            >
              <RotateCcw className="h-5" />
            </Button>
          </Show.When>
        </Show>
      </article>
    </section>
  );
};

export default React.forwardRef(AppTimer);
