import { useCallback, useEffect } from "react";

import { SportFacede } from "../../facades/sport.facede";
import { Separator } from "@/_shad/components/ui/separator";
import TrainingSheetWeek from "../../components/sport/training-sheet/training-sheet-week";
import TrainingSheetList from "../../components/sport/training-sheet/training-sheet-list";
import WeightControlSummary from "../../components/sport/weight-control/weight-control-summary";

export default function Sport() {
  const _sportFacede = new SportFacede();

  const init = useCallback(() => {
    _sportFacede.updateFullStore().catch((error) => {
      console.log("error :", error.message);
    });
  }, []);

  useEffect(() => {
    init();
  }, []);

  return (
    <section>
      <h3 className="font-semibold mb-4">Atividade física </h3>

      <WeightControlSummary />

      <Separator className="my-6" />

      <section className="grid gap-4 lg:grid-cols-[40%_1fr]">
        <TrainingSheetWeek />
        <TrainingSheetList />
      </section>
    </section>
  );
}
