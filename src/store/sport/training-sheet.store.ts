import { createStore } from "../_base.store";
import { ISportTrainingSheetItem } from "@/modules/@shared/firebase/interfaces/sport-training-sheet.interface";

interface State {
  list: ISportTrainingSheetItem[];
  current: ISportTrainingSheetItem;
  registerData: ISportTrainingSheetItem;

  setList: (value: ISportTrainingSheetItem[]) => void;
  setCurrent: (value: ISportTrainingSheetItem) => void;
  setRegisterData: (value: ISportTrainingSheetItem) => void;
}

export default createStore<State>({
  name: "training-sheet",
  state: (set) => ({
    list: [],
    current: {} as ISportTrainingSheetItem,
    registerData: {} as ISportTrainingSheetItem,

    setList: (list: ISportTrainingSheetItem[]) => set({ list }),
    setCurrent: (current: ISportTrainingSheetItem) => set({ current }),
    setRegisterData: (registerData: ISportTrainingSheetItem) =>
      set({ registerData }),
  }),
});
