import { createStore } from "../_base.store";
import { ISportTrainingSheetDay } from "@/modules/@shared/firebase/interfaces/sport-training-sheet.interface";

interface State {
  duration: number;
  endDate: Date | null;
  startDate: Date | null;
  activities: ISportTrainingSheetDay[];
  currentActivity: ISportTrainingSheetDay;

  reset: () => void;
  setDuration: (value: number) => void;
  setEndDate: (value: Date | null) => void;
  setStartDate: (value: Date | null) => void;
  setActivities: (value: ISportTrainingSheetDay[]) => void;
  setCurrentActivity: (value: ISportTrainingSheetDay) => void;
}

export default createStore<State>({
  name: "training-mode",
  state: (set) => ({
    duration: 0,
    endDate: null,
    activities: [],
    startDate: null,
    currentActivity: {} as ISportTrainingSheetDay,
    setDuration: (duration: number) => set({ duration }),
    setEndDate: (endDate: Date | null) => set({ endDate }),
    setStartDate: (startDate: Date | null) => set({ startDate }),
    setActivities: (activities: ISportTrainingSheetDay[]) =>
      set({ activities }),
    setCurrentActivity: (currentActivity: ISportTrainingSheetDay) =>
      set({ currentActivity }),

    reset: () =>
      set({
        duration: 0,
        endDate: null,
        activities: [],
        startDate: null,
        currentActivity: {} as ISportTrainingSheetDay,
      }),
  }),
});
