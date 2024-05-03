import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/_shad/components/ui/card";
import { ISportTrainingSheetDay } from "@/modules/@shared/firebase/interfaces/sport-training-sheet.interface";

import { useEffect, useRef, useState } from "react";
import Show from "@/modules/@shared/components/utils/show";
import { Separator } from "@/_shad/components/ui/separator";
import TrainingSheetDayView from "./training-sheet-day-view";
import trainingSheetStore from "@/store/sport/training-sheet.store";
import { WeekDayNumber } from "@/modules/@shared/components/_types/week.type";
import { IWeekDayItem } from "@/modules/@shared/components/_interfaces/week.interface";
import WeekDaySelection, {
  WeekDaySelectionHandler,
} from "@/modules/@shared/components/week-day-selection";
import { Button } from "@/_shad/components/ui/button";
import { Rocket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import trainingModeStore from "@/store/sport/training-mode.store";

export default function TrainingSheetWeek() {
  const navigate = useNavigate();
  const [dayView, setDayView] = useState<ISportTrainingSheetDay[]>([]);
  const weekDaySelectionComponentRef = useRef<WeekDaySelectionHandler>(null);

  const _trainingModeStore = trainingModeStore((state) => state);
  const _trainingSheetStore = trainingSheetStore((state) => state);
  const { current } = _trainingSheetStore;
  const hasCurrent = !!current.id;

  const onSelectDay = (item: IWeekDayItem) => {
    const dayKeyMap = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };

    const key = dayKeyMap[item.day] as keyof typeof current;
    setDayView(current[key] as ISportTrainingSheetDay[]);
  };

  const handleSelectTraining = () => {
    navigate("/sport/training-mode");
    _trainingModeStore.reset();
    _trainingModeStore.setActivities(dayView);
  };

  useEffect(() => {
    const date = new Date();
    const day = date.getDay() as WeekDayNumber;

    onSelectDay({ date, day });

    weekDaySelectionComponentRef.current?.selectByDayNumber(day);
  }, [current]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="w-full flex items-center justify-between">
            Semana
            <Button onClick={handleSelectTraining}>
              Iniciar Treino
              <Rocket className="ml-2" />
            </Button>
          </CardTitle>

          <WeekDaySelection
            onSelect={onSelectDay}
            ref={weekDaySelectionComponentRef}
          />
          <Separator />
        </CardHeader>

        <CardContent>
          <Show>
            <Show.When isTrue={hasCurrent}>
              <TrainingSheetDayView data={dayView} />
            </Show.When>
            <Show.Else>
              <p className="w-full text-center">
                - Selecione uma ficha de treino -
              </p>
            </Show.Else>
          </Show>
        </CardContent>
      </Card>
    </>
  );
}
