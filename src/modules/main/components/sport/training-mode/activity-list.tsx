import _ from "lodash";
import { useState } from "react";
import { cn } from "@/_shad/lib/utils";
import { Card } from "@/_shad/components/ui/card";
import { Circle, CircleCheck } from "lucide-react";
import useScreenSize from "@/hooks/screen-size.hook";
import { Button } from "@/_shad/components/ui/button";
import ActivityDetailModal from "./activity-detail-modal";
import Each from "@/modules/@shared/components/utils/each";
import Show from "@/modules/@shared/components/utils/show";
import trainingModeStore from "@/store/sport/training-mode.store";
import { ISportTrainingSheetDay } from "@/modules/@shared/firebase/interfaces/sport-training-sheet.interface";

export default function ActivityList() {
  const { isMobile } = useScreenSize();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const _trainingModeStore = trainingModeStore((state) => state);

  const handleToggleItemCheck = (item: ISportTrainingSheetDay) => {
    const items = [..._trainingModeStore.activities].map((i) => {
      const isItem = _.isEqual(item, i);

      return {
        ...i,
        checked: isItem ? !item.checked : i.checked,
      };
    });

    _trainingModeStore.setActivities(items);
  };

  const handleSelectItem = (item: ISportTrainingSheetDay) => {
    _trainingModeStore.setCurrentActivity(item);
  };

  return (
    <Each
      data={_trainingModeStore.activities}
      render={(item) => (
        <Card className="p-4 mb-2 flex gap-4 items-center justify-end">
          <ActivityDetailModal
            isOpen={isDetailOpen}
            onOpenChange={(data) => {
              if (isMobile) setIsDetailOpen(data);
            }}
          >
            <div
              onClick={() => handleSelectItem(item)}
              className={cn(
                "mr-auto w-full cursor-pointer flex items-center justify-between",
                item.checked && "line-through opacity-60"
              )}
            >
              <span>{item.title}</span>

              <Show>
                <Show.When isTrue={!!item.series && !item.durationMinutes}>
                  <span>
                    {item.series}/{item.repetitions}
                  </span>
                </Show.When>
                <Show.Else>
                  <span>{item.durationMinutes}min</span>
                </Show.Else>
              </Show>
            </div>
          </ActivityDetailModal>

          <Button variant={"ghost"} onClick={() => handleToggleItemCheck(item)}>
            {item.checked ? (
              <CircleCheck className="text-green-400" />
            ) : (
              <Circle />
            )}
          </Button>
        </Card>
      )}
    />
  );
}
