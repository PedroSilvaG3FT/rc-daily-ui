import { Button } from "@/_shad/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  IDialogProps,
} from "@/_shad/components/ui/dialog";
import { Separator } from "@/_shad/components/ui/separator";
import { cn } from "@/_shad/lib/utils";
import { IWeekDayItem } from "@/modules/@shared/components/_interfaces/week.interface";
import { WeekDayNumber } from "@/modules/@shared/components/_types/week.type";
import Each from "@/modules/@shared/components/utils/each";
import { ISportTrainingSheetDay } from "@/modules/@shared/firebase/interfaces/sport-training-sheet.interface";
import {
  formatDateLoacale,
  getWeekDaysFromDate,
} from "@/modules/@shared/functions/date.function";
import { useEffect, useState } from "react";

interface ITrainingSheetDayCopyProps extends IDialogProps {
  baseDate: Date;
  data: ISportTrainingSheetDay;
  onClose: (data: IWeekDayItem[]) => void;
}
export default function TrainingSheetDayCopy(
  props: ITrainingSheetDayCopyProps
) {
  const { data, isOpen, baseDate, onOpenChange, onClose, children } = props;

  const [days, setDays] = useState<IWeekDayItem[]>([]);
  const [selectedDays, setSelectedDays] = useState<IWeekDayItem[]>([]);

  const checkIsItemSelected = ({ date }: IWeekDayItem) =>
    selectedDays.some((item) => item.date === date);

  const handleSelect = (value: IWeekDayItem) => {
    const hasItem = checkIsItemSelected(value);

    if (!hasItem) setSelectedDays([...selectedDays, value]);
    else
      setSelectedDays([
        ...selectedDays.filter((item) => item.date !== value.date),
      ]);
  };

  const handleClose = () => {
    onClose(selectedDays);
    setSelectedDays([]);
  };

  const initDays = () => {
    const daysOfWeek = getWeekDaysFromDate(baseDate);
    const formatedDays: IWeekDayItem[] = daysOfWeek.map((date, index) => ({
      date,
      day: index as WeekDayNumber,
    }));

    setDays(formatedDays);
  };

  useEffect(() => {
    initDays();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="w-[425px]">
        <DialogHeader>
          <DialogTitle>Duplicar atividade</DialogTitle>
        </DialogHeader>

        <section>
          <h2 className="font-semibold">{data.title}</h2>
          <Separator className="my-4" />

          <article className="grid gap-2 grid-cols-3">
            <Each
              data={days}
              render={(item) => (
                <div
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "p-4 flex items-center justify-center rounded-md bg-muted capitalize cursor-pointer",
                    checkIsItemSelected(item) && "bg-foreground text-secondary"
                  )}
                >
                  {formatDateLoacale(item.date, "EEE").substring(0, 3)}
                </div>
              )}
            />
          </article>
        </section>

        <DialogFooter>
          <Button onClick={handleClose}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
