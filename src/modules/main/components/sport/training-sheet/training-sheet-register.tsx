import {
  Drawer,
  DrawerClose,
  DrawerTitle,
  DrawerFooter,
  IDrawerProps,
  DrawerHeader,
  DrawerContent,
  DrawerTrigger,
  DrawerDescription,
} from "@/_shad/components/ui/drawer";
import { Button } from "@/_shad/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormContainer } from "@/_shad/components/ui/form";
import AppFormInput from "@/modules/@shared/components/form/form-input";
import { Separator } from "@/_shad/components/ui/separator";
import AppFormTextarea from "@/modules/@shared/components/form/form-textarea";
import AppFormSwitch from "@/modules/@shared/components/form/form-switch";
import WeekDaySelection, {
  WeekDaySelectionHandler,
} from "@/modules/@shared/components/week-day-selection";
import { useEffect, useRef, useState } from "react";
import {
  ISportTrainingSheetDay,
  ISportTrainingSheetItem,
} from "@/modules/@shared/firebase/interfaces/sport-training-sheet.interface";
import { IWeekDayItem } from "@/modules/@shared/components/_interfaces/week.interface";
import TrainingSheetDayView from "./training-sheet-day-view";
import TrainingSheetRegisterActivity from "./training-sheet-register-activity";
import { WeekDayNumber } from "@/modules/@shared/components/_types/week.type";
import { SportTrainingSheetModel } from "@/modules/@shared/firebase/models/sport-training-sheet.model";
import { SportTrainingSheetService } from "@/modules/@shared/firebase/services/sport-training-sheet.service";
import loadingStore from "@/store/loading.store";
import _ from "lodash";
import trainingSheetStore from "@/store/sport/training-sheet.store";
import { SportFacede } from "@/modules/main/facades/sport.facede";

const formId = "training-sheet-form";
const formSchema = z.object({
  active: z.boolean(),
  title: z.string().min(1, "Campo obrigatório"),
  description: z.string().min(1, "Campo obrigatório"),
});

interface ITrainingSheetRegisterProps extends IDrawerProps {
  onFinish: (data: ISportTrainingSheetItem) => void;
}

const _sportFacede = new SportFacede();

export default function TrainingSheetRegister(
  props: ITrainingSheetRegisterProps
) {
  const { isOpen, children, onFinish, onOpenChange } = props;

  const weekDaySelectionComponentRef = useRef<WeekDaySelectionHandler>(null);
  const _trainingSheetStore = trainingSheetStore((state) => state);
  const { registerData } = _trainingSheetStore;

  const isEdit = !!registerData?.id;

  const _loadingStore = loadingStore((state) => state);
  const _sportTrainingSheetModel = new SportTrainingSheetModel();
  const _sportTrainingSheetService = new SportTrainingSheetService();

  const [dayView, setDayView] = useState<ISportTrainingSheetDay[]>([]);
  const [isModalActivityOpen, setIsModalActivityOpen] = useState(false);

  const [currentDayKey, setCurrentDayKey] =
    useState<keyof typeof trainingSheet>();

  const [dayActivityEdit, setDayActivityEdit] =
    useState<ISportTrainingSheetDay>({} as ISportTrainingSheetDay);

  const [trainingSheet, setTrainingSheet] = useState<ISportTrainingSheetItem>(
    {} as ISportTrainingSheetItem
  );

  const getDayKey = (item: IWeekDayItem) => {
    const dayKeyMap = {
      0: "sunday",
      1: "monday",
      2: "tuesday",
      3: "wednesday",
      4: "thursday",
      5: "friday",
      6: "saturday",
    };

    return dayKeyMap[item.day] as keyof typeof trainingSheet;
  };

  const onSelectDay = (item: IWeekDayItem) => {
    const key = getDayKey(item);

    setCurrentDayKey(key);
    setDayView(trainingSheet[key] as ISportTrainingSheetDay[]);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      active: false,
      title: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const modelDTO = _sportTrainingSheetModel.buildRegisterDTO({
      ...registerData,
      ...trainingSheet,
      title: values.title,
      active: values.active,
      description: values.description,
    });

    const $request = !isEdit
      ? _sportTrainingSheetService.create(modelDTO)
      : _sportTrainingSheetService.update(String(registerData.id), modelDTO);

    $request
      .then(async (response) => {
        const id = response?.id || String(registerData.id);

        const result = _sportTrainingSheetModel.buildItem(modelDTO);
        if (modelDTO.active) await _sportFacede.updateCurrentSheet(id);

        onFinish({ ...registerData, ...result, id });
        form.reset();

        _loadingStore.setShow(false);
      })
      .catch(() => {
        _loadingStore.setShow(false);
      });
  }

  const onActivitySubmit = (value: ISportTrainingSheetDay) => {
    if (currentDayKey) {
      const isNew = !Object.keys(dayActivityEdit).length;
      const items = trainingSheet[currentDayKey] as ISportTrainingSheetDay[];

      const handleCreate = () => {
        console.log("CREATE ACTIVITY :", value);
        console.log("ITEMS :", items);
        if (!!items) items.push(value);
        else
          (trainingSheet[currentDayKey] as ISportTrainingSheetDay[]) = [value];
      };

      const handleEdit = () => {
        const editedData = items.map((item) => {
          if (_.isEqual(item, dayActivityEdit)) item = value;
          return item;
        });

        (trainingSheet[currentDayKey] as ISportTrainingSheetDay[]) = editedData;
      };

      if (isNew) handleCreate();
      else handleEdit();

      setDayView(trainingSheet[currentDayKey] as ISportTrainingSheetDay[]);
    }

    setIsModalActivityOpen(false);
  };

  const handleEditActivity = (data: ISportTrainingSheetDay) => {
    setDayActivityEdit(data);
    setIsModalActivityOpen(true);
  };

  const handleRemoveActivity = (data: ISportTrainingSheetDay) => {
    if (currentDayKey) {
      const items = trainingSheet[currentDayKey] as ISportTrainingSheetDay[];

      (trainingSheet[currentDayKey] as ISportTrainingSheetDay[]) = [
        ...items.filter((item) => item !== data),
      ];

      setDayView(trainingSheet[currentDayKey] as ISportTrainingSheetDay[]);
    }
  };

  const handleCopyActivity = (
    data: IWeekDayItem[],
    activity: ISportTrainingSheetDay
  ) => {
    data.forEach((item) => {
      const key = getDayKey(item);
      const items = trainingSheet[key] as ISportTrainingSheetDay[];

      if (!!items) items.push(activity);
      else (trainingSheet[key] as ISportTrainingSheetDay[]) = [activity];
    });
  };

  useEffect(() => {
    if (isOpen && isEdit) {
      form.setValue("title", registerData.title);
      form.setValue("active", !!registerData.active);
      form.setValue("description", registerData.description);

      setTrainingSheet(registerData);
    } else form.reset();

    setTimeout(() => {
      weekDaySelectionComponentRef.current?.selectByDayNumber(0);
    }, 150);
  }, [isOpen]);

  useEffect(() => {
    setTrainingSheet(registerData);
  }, [registerData]);

  useEffect(() => {
    if (!dayView?.length) {
      const date = new Date();
      onSelectDay({ date, day: date.getDay() as WeekDayNumber });
    }
  }, [trainingSheet]);

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <FormContainer {...form}>
        <DrawerContent>
          <section className="mx-auto w-full max-w-2xl">
            <DrawerHeader>
              <DrawerTitle>Ficha de treino</DrawerTitle>
              <DrawerDescription>
                Registre sua ficha de treino
              </DrawerDescription>

              <Separator className="my-4" />
            </DrawerHeader>

            <article className="px-4 h-[60vh] overflow-y-auto">
              <form
                id={formId}
                className="space-y-8"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <AppFormInput
                  label="Titulo"
                  name="title"
                  control={form.control}
                  placeholder="Insira um titulo para a sua ficha."
                />

                <AppFormTextarea
                  label="Descrição"
                  name="description"
                  control={form.control}
                  placeholder="Quais são os objetivos a serem alcançados"
                />

                <AppFormSwitch
                  name="active"
                  control={form.control}
                  label="Definir como ficha em uso"
                />
              </form>

              <WeekDaySelection
                hideDayNumber
                className="my-4"
                onSelect={onSelectDay}
                ref={weekDaySelectionComponentRef}
              />

              <TrainingSheetDayView
                isEditMode
                data={dayView}
                onCopy={handleCopyActivity}
                onEdit={handleEditActivity}
                onRemove={handleRemoveActivity}
              />

              <TrainingSheetRegisterActivity
                data={dayActivityEdit}
                onSubmit={onActivitySubmit}
                isOpen={isModalActivityOpen}
                onOpenChange={(data) => {
                  setIsModalActivityOpen(data);
                  if (!data) setDayActivityEdit({} as ISportTrainingSheetDay);
                }}
              >
                <div className="mt-4 flex justify-center">
                  <Button variant={"outline"} type="button">
                    Adicionar atividade
                  </Button>
                </div>
              </TrainingSheetRegisterActivity>
            </article>

            <Separator className="my-4" />
            <DrawerFooter className="py-4 flex flex-row gap-2 items-center justify-end">
              <Button type="submit" form={formId}>
                Salvar
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">Voltar</Button>
              </DrawerClose>
            </DrawerFooter>
          </section>
        </DrawerContent>
      </FormContainer>
    </Drawer>
  );
}
