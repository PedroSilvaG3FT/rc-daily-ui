import { useEffect, useRef } from "react";
import { Button } from "@/_shad/components/ui/button";
import { Separator } from "@/_shad/components/ui/separator";
import Animate from "@/modules/@shared/components/utils/animate";
import trainingModeStore from "@/store/sport/training-mode.store";
import ActivityList from "../../components/sport/training-mode/activity-list";
import AppTimer, { AppTimerHandler } from "@/modules/@shared/components/timer";
import ActivityDetail from "../../components/sport/training-mode/activity-detail";
import ConfirmModal from "@/modules/@shared/components/utils/confirm-modal";
import { useNavigate } from "react-router-dom";
import { cn } from "@/_shad/lib/utils";
import Show from "@/modules/@shared/components/utils/show";
import { AnimationUtil } from "@/modules/@shared/util/animation.util";

export default function TrainingMode() {
  const navigate = useNavigate();
  const appTimerComponentRef = useRef<AppTimerHandler>(null);
  const _trainingModeStore = trainingModeStore((state) => state);

  const isStarted = !!_trainingModeStore.startDate;

  const handleTogglePlay = (isPlay: boolean) => {
    if (isStarted) return;
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
    navigate("/sport");
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
              showActionLabel
              ref={appTimerComponentRef}
              onPlayChange={handleTogglePlay}
              onSecondChange={handleSecondChange}
              initialSeconds={_trainingModeStore.duration}
              className={cn(
                !isStarted && AnimationUtil.getInfiniteAnimation("pulse")
              )}
            />
            <ConfirmModal
              title="Deseja finalizar o treino ?"
              onSelect={(data) => data && handleFinish()}
            >
              <Button variant={"destructive"}>Finalizar treino</Button>
            </ConfirmModal>
          </section>
        </nav>

        <Separator className="my-4" />

        <section
          className={cn(
            "grid gap-8 grid-cols-2 mobile:grid-cols-1",
            !isStarted && "pointer-events-none opacity-30"
          )}
        >
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
