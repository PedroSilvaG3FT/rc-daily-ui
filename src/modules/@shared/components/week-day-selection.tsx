import {
  Card,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/_shad/components/ui/card";
import {
  formatDateLoacale,
  getWeekDaysFromDate,
} from "../functions/date.function";
import Show from "./utils/show";
import Each from "./utils/each";
import { cn } from "@/_shad/lib/utils";
import { WeekDayNumber } from "./_types/week.type";
import { Separator } from "@radix-ui/react-separator";
import { IWeekDayItem } from "./_interfaces/week.interface";
import React, { useEffect, useState, useImperativeHandle } from "react";

interface IWeekDaySelectionProps {
  initial?: WeekDayNumber;
  baseDate?: Date;
  className?: string;
  hideDayNumber?: boolean;
  onSelect: (data: IWeekDayItem) => void;
}

export type WeekDaySelectionHandler = {
  selectByDayNumber: (data: WeekDayNumber) => void;
};

const WeekDaySelection: React.ForwardRefRenderFunction<
  WeekDaySelectionHandler,
  IWeekDaySelectionProps
> = (props, ref) => {
  const currentDate = new Date();
  const initialDay = currentDate.getDay() as WeekDayNumber;
  const {
    onSelect,
    className = "",
    initial = initialDay,
    baseDate = currentDate,
    hideDayNumber = false,
  } = props;

  const [selected, setSelected] = useState<WeekDayNumber>(initial);
  const [days, setDays] = useState<IWeekDayItem[]>([]);

  const initDays = () => {
    const daysOfWeek = getWeekDaysFromDate(baseDate);
    const formatedDays: IWeekDayItem[] = daysOfWeek.map((date, index) => ({
      date,
      day: index as WeekDayNumber,
    }));

    setDays(formatedDays);
  };

  const handleSelect = (item: IWeekDayItem) => {
    onSelect(item);
    setSelected(item.day);
  };

  const selectByDayNumber = (day: WeekDayNumber) => {
    const item = days.find((item) => item.day === day);
    if (item) handleSelect(item);
  };

  useEffect(() => {
    initDays();
  }, []);

  useImperativeHandle(ref, () => ({
    selectByDayNumber,
  }));

  return (
    <article className="grid">
      <section
        className={cn(
          "py-4 flex gap-4 whitespace-nowrap overflow-x-auto",
          className
        )}
      >
        <Each
          data={days}
          render={(item) => (
            <Card
              onClick={() => handleSelect(item)}
              className={cn(
                "bg-accent p-4 cursor-pointer transition-all duration-300 hover:scale-95",
                item.day === selected && "bg-foreground text-secondary"
              )}
            >
              <CardContent className="p-0 w-12 flex gap-2 flex-col items-center justify-center">
                <CardTitle className="capitalize font-semibold">
                  {formatDateLoacale(item.date, "EEE").substring(0, 3)}
                </CardTitle>

                <Show>
                  <Show.When isTrue={!hideDayNumber}>
                    <Separator
                      className={cn(
                        "w-full border-solid border border-primary",
                        item.day === selected && "border-secondary"
                      )}
                    />

                    <CardDescription>
                      {formatDateLoacale(item.date, "dd")}
                    </CardDescription>
                  </Show.When>
                </Show>
              </CardContent>
            </Card>
          )}
        />
      </section>
    </article>
  );
};

export default React.forwardRef(WeekDaySelection);
