import Each from "@/modules/@shared/components/utils/each";
import Show from "@/modules/@shared/components/utils/show";
import { Separator } from "@/_shad/components/ui/separator";
import { Circle, CircleCheck, CircleMinus, Copy, Pen } from "lucide-react";
import { ISportTrainingSheetDay } from "@/modules/@shared/firebase/interfaces/sport-training-sheet.interface";
import { useState } from "react";
import TrainingSheetDayCopy from "./training-sheet-day-copy";
import { IWeekDayItem } from "@/modules/@shared/components/_interfaces/week.interface";
interface ITrainingSheetDayViewProps {
  data: ISportTrainingSheetDay[];
  isEditMode?: boolean;

  onEdit?: (item: ISportTrainingSheetDay) => void;
  onRemove?: (item: ISportTrainingSheetDay) => void;
  onCopy?: (data: IWeekDayItem[], item: ISportTrainingSheetDay) => void;
}
export default function TrainingSheetDayView(
  props: ITrainingSheetDayViewProps
) {
  const { data, onCopy, onEdit, onRemove, isEditMode = false } = props;
  const [isModalCopyOpen, setIsModalCopyOpen] = useState(false);

  const handleCopySelectionClose = (
    data: IWeekDayItem[],
    item: ISportTrainingSheetDay
  ) => {
    onCopy?.(data, item);
    setIsModalCopyOpen(false);
  };

  return (
    <Each
      data={data}
      empty={
        <p className="text-center opacity-50">
          - Sem atividades para esse dia -
        </p>
      }
      render={(item, index) => (
        <article className="bg-accent rounded-sm p-2 px-4 mb-4 flex gap-4 items-center justify-end transition-transform hover:scale-95">
          <span>{index + 1}.</span>

          <p className="mr-auto">{item.title}</p>

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

          <Show>
            <Show.When isTrue={isEditMode}>
              <Separator orientation="vertical" className="h-12" />

              <TrainingSheetDayCopy
                data={item}
                baseDate={new Date()}
                isOpen={isModalCopyOpen}
                onClose={(data) => handleCopySelectionClose(data, item)}
                onOpenChange={(data) => setIsModalCopyOpen(data)}
              >
                <Copy className="w-5 cursor-pointer" />
              </TrainingSheetDayCopy>

              <Pen
                className="w-5 cursor-pointer"
                onClick={() => onEdit?.(item)}
              />

              <CircleMinus
                className="w-5 cursor-pointer text-red-400"
                onClick={() => onRemove?.(item)}
              />
            </Show.When>
          </Show>
        </article>
      )}
    />
  );
}
