import { useEffect, useRef } from "react";
import { Button } from "@/_shad/components/ui/button";
import { Separator } from "@/_shad/components/ui/separator";
import Animate from "@/modules/@shared/components/utils/animate";
import trainingModeStore from "@/store/sport/training-mode.store";
import ActivityList from "../../components/sport/training-mode/activity-list";
import AppTimer, { AppTimerHandler } from "@/modules/@shared/components/timer";
import ActivityDetail from "../../components/sport/training-mode/activity-detail";

export default function TrainingMode() {
  const appTimerComponentRef = useRef<AppTimerHandler>(null);
  const _trainingModeStore = trainingModeStore((state) => state);

  const handleTogglePlay = (isPlay: boolean) => {
    if (!!_trainingModeStore.startDate) return;
    if (isPlay) _trainingModeStore.setStartDate(new Date());
  };

  const handleSecondChange = (value: number) => {
    _trainingModeStore.setDuration(value);
  };

  const clearState = () => {
    _trainingModeStore.setDuration(0);
    _trainingModeStore.setEndDate(new Date());

    appTimerComponentRef.current?.setIsActive(false);
    appTimerComponentRef.current?.setTotalSeconds(0);
  };

  const handleFinish = () => {
    clearState();
  };

  useEffect(() => {
    return () => {
      // _trainingModeStore.reset();
    };
  }, []);

  return (
    <Animate animation="fadeIn">
      <section>
        <nav className="mb-4 flex items-center justify-between mobile:flex-col mobile:items-start">
          <h1 className="font-semibold text-lg mobile:mb-4">Modo de treino</h1>

          <section className="flex gap-4 items-center justify-between mobile:w-full">
            <AppTimer
              hideReset
              mode="timer"
              ref={appTimerComponentRef}
              onPlayChange={handleTogglePlay}
              onSecondChange={handleSecondChange}
              initialSeconds={_trainingModeStore.duration}
            />
            <Button onClick={handleFinish} variant={"destructive"}>
              Finalizar treino
            </Button>
          </section>
        </nav>

        <Separator className="my-4" />

        <section className="grid gap-8 grid-cols-2 mobile:grid-cols-1">
          <article>
            <h3 className="mb-4 font-semibold">Atividades</h3>
            <ActivityList />
          </article>

          <article className="pt-10 mobile:hidden">
            <ActivityDetail />
          </article>
        </section>
      </section>
    </Animate>
  );
}
