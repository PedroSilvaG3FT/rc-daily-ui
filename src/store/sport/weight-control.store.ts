import { createStore } from "../_base.store";
import { ISportWeightControlItem } from "@/modules/@shared/firebase/interfaces/sport-weight-control.interface";

interface State {
  data: ISportWeightControlItem;
  setData: (value: ISportWeightControlItem) => void;
}

export default createStore<State>({
  name: "weight-control",
  state: (set) => ({
    data: {} as ISportWeightControlItem,
    setData: (data: ISportWeightControlItem) => set({ data }),
  }),
});
