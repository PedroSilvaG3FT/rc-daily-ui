import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardDescription,
} from "@/_shad/components/ui/card";
import {
  Typewriter,
  typewriterBuildWords,
} from "@/modules/@shared/components/aceternity/typewriter";
import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/_shad/components/ui/button";
import Show from "@/modules/@shared/components/utils/show";
import Each from "@/modules/@shared/components/utils/each";
import WeightControlProgressModal from "./weight-control-progress";
import WeightControlRegisterModal from "./weight-control-register";
import weightControlStore from "@/store/sport/weight-control.store";
import WeightControlAddProgress from "./weight-control-add-progress";
import { ISportWeightControlItem } from "@/modules/@shared/firebase/interfaces/sport-weight-control.interface";

export default function WeightControlSummary() {
  const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
  const [isModalProgressOpen, setIsModalProgressOpen] = useState(false);
  const [isModalAddWeightOpen, setIsModalAddWeightOpen] = useState(false);

  const _weightControlStore = weightControlStore((state) => state);
  const { data } = _weightControlStore;

  const hasControl = !!data.id;
  const emptyText = typewriterBuildWords(
    "Cadastre as suas metas para iniciar",
    "text-4xl"
  );

  const openModalRegister = () => setIsModalRegisterOpen(true);
  const openModalProgress = () => setIsModalProgressOpen(true);
  const openModalAddWeight = () => setIsModalAddWeightOpen(true);

  const handleDataUpdated = (data: ISportWeightControlItem) => {
    setIsModalRegisterOpen(false);
    setIsModalAddWeightOpen(false);
    _weightControlStore.setData(data);
  };

  return (
    <article className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Controle de metas</CardTitle>

          <CardDescription className="text-balance leading-relaxed">
            Monitore seu peso atual, defina metas de peso e acompanhe seu
            progresso ao longo do tempo, tudo isso enquanto gerencia sua ficha
            de treino personalizada.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex items-center gap-4">
          <WeightControlRegisterModal
            data={data}
            onFinish={handleDataUpdated}
            isOpen={isModalRegisterOpen}
            onOpenChange={(data) => setIsModalRegisterOpen(data)}
          >
            <Button onClick={openModalRegister}>
              {hasControl ? "Editar meus dados" : "Criar metas"}
            </Button>
          </WeightControlRegisterModal>

          <WeightControlAddProgress
            data={data}
            onFinish={handleDataUpdated}
            isOpen={isModalAddWeightOpen}
            onOpenChange={(data) => setIsModalAddWeightOpen(data)}
          >
            <Button variant={"secondary"} onClick={openModalAddWeight}>
              Atualizar peso
            </Button>
          </WeightControlAddProgress>
        </CardFooter>
      </Card>

      <Show>
        <Show.When isTrue={hasControl}>
          <section className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
            <Card className="p-4 flex flex-col justify-center transition-transform duration-500 hover:scale-105">
              <CardDescription>Peso Atual</CardDescription>
              <CardTitle className="text-5xl text-orange-400">
                {data.currentWeight}kg
              </CardTitle>
            </Card>

            <Card className="p-4 flex flex-col justify-center transition-transform duration-500 hover:scale-105">
              <CardDescription>Meta de peso</CardDescription>
              <CardTitle className="text-5xl text-green-400">
                {data.goalWeight}kg
              </CardTitle>
            </Card>

            <Card className="p-4 flex flex-col justify-center transition-transform duration-500 hover:scale-105">
              <CardDescription>Histórico</CardDescription>

              <ul className="mt-2 mb-4">
                <Each
                  data={data?.progress?.reverse().slice(0, 3)}
                  empty={
                    <h5 className="text-center text-sm">- Sem registros -</h5>
                  }
                  render={(item) => (
                    <li className="flex gap-2 items-center justify-between">
                      <span>{item.weight}kg</span>
                      <hr className="w-full border-dotted border-gray-500 self-end relative bottom-1" />
                      <span>{format(item.creationDate, "dd/MM")}</span>
                    </li>
                  )}
                />
              </ul>

              <CardFooter className="mt-auto p-0 ">
                <WeightControlProgressModal
                  data={data}
                  isOpen={isModalProgressOpen}
                  onOpenChange={(data) => setIsModalProgressOpen(data)}
                >
                  <a
                    onClick={openModalProgress}
                    className="w-full text-center cursor-pointer underline"
                  >
                    Ver mais
                  </a>
                </WeightControlProgressModal>
              </CardFooter>
            </Card>
          </section>
        </Show.When>

        <Show.Else>
          <Typewriter words={emptyText} />
        </Show.Else>
      </Show>
    </article>
  );
}
