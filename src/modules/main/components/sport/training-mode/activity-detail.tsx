import { cn } from "@/_shad/lib/utils";
import { Card } from "@/_shad/components/ui/card";
import Show from "@/modules/@shared/components/utils/show";
import trainingModeStore from "@/store/sport/training-mode.store";
import AppTimer, { AppTimerHandler } from "@/modules/@shared/components/timer";
import { useEffect, useRef, useState } from "react";

interface IActivityDetailProps {
  className?: string;
}

export default function ActivityDetail(props: IActivityDetailProps) {
  const { className } = props;
  const appTimerComponentRef = useRef<AppTimerHandler>(null);

  const _trainingModeStore = trainingModeStore((state) => state);
  const { currentActivity } = _trainingModeStore;

  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (currentActivity.durationMinutes) {
      setDuration(currentActivity.durationMinutes * 60);
      appTimerComponentRef.current?.setTotalSeconds(
        currentActivity.durationMinutes * 60
      );
    }
  }, [currentActivity]);

  if (!Object.keys(currentActivity).length) return <></>;

  return (
    <Card
      className={cn("p-4 flex flex-col items-center justify-center", className)}
    >
      <h1 className="font-semibold text-xl mb-8">{currentActivity.title}</h1>

      <Show>
        <Show.When
          isTrue={!!currentActivity.series && !currentActivity.durationMinutes}
        >
          <section className="w-full grid gap-4 grid-cols-2">
            <Card className="p-4 flex flex-col items-center justify-center">
              <h2 className="text-5xl mb-2">{currentActivity.series}</h2>
              <h5 className="text-green-400">Séries</h5>
            </Card>

            <Card className="p-4 flex flex-col items-center justify-center">
              <h2 className="text-5xl mb-2">{currentActivity.repetitions}</h2>
              <h5 className="text-orange-400">Repetições</h5>
            </Card>
          </section>
        </Show.When>
        <Show.Else>
          <Card className="w-full p-4 flex flex-col items-center justify-center">
            <h2 className="text-5xl mb-2">{currentActivity.durationMinutes}</h2>
            <h5 className="text-green-400 mb-4">Minutos</h5>

            <AppTimer
              mode="countdown"
              initialSeconds={duration}
              ref={appTimerComponentRef}
            />
          </Card>
        </Show.Else>
      </Show>
    </Card>
  );
}
