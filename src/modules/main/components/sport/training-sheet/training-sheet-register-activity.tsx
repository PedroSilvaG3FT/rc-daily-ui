import {
  Dialog,
  DialogTitle,
  DialogHeader,
  IDialogProps,
  DialogContent,
  DialogTrigger,
} from "@/_shad/components/ui/dialog";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/_shad/components/ui/button";
import { FormContainer } from "@/_shad/components/ui/form";
import AppFormInput from "@/modules/@shared/components/form/form-input";
import { ISportTrainingSheetDay } from "@/modules/@shared/firebase/interfaces/sport-training-sheet.interface";
import { useEffect } from "react";

const formId = "training-sheet-activity-form";
const formSchema = z.object({
  series: z.string(),
  videoURL: z.string(),
  repetitions: z.string(),
  durationMinutes: z.string(),
  title: z.string().min(1, "Campo obrigatório"),
});

interface ITrainingSheetRegisterActivityProps extends IDialogProps {
  data: ISportTrainingSheetDay;
  onSubmit: (data: ISportTrainingSheetDay) => void;
}

export default function TrainingSheetRegisterActivity(
  props: ITrainingSheetRegisterActivityProps
) {
  const { data, children, onSubmit, isOpen, onOpenChange } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      series: "",
      videoURL: "",
      repetitions: "",
      durationMinutes: "",
    },
  });

  function handleSubmitForm(values: z.infer<typeof formSchema>) {
    onSubmit({
      title: values.title,
      checked: !!data.checked,
      videoURL: values.videoURL,
      series: Number(values.series),
      repetitions: Number(values.repetitions),
      durationMinutes: Number(values.durationMinutes),
    });

    form.reset();
  }

  useEffect(() => {
    if (!!Object.keys(data).length) {
      form.setValue("title", data.title || "");
      form.setValue("videoURL", data.videoURL || "");
      form.setValue("series", String(data.series || ""));
      form.setValue("repetitions", String(data.repetitions || ""));
      form.setValue("durationMinutes", String(data.durationMinutes || ""));
    } else form.reset();
  }, [data]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <FormContainer {...form}>
        <DialogContent className="w-[425px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registro de atividade</DialogTitle>
          </DialogHeader>

          <section className="grid gap-4 py-4">
            <form
              id={formId}
              className="space-y-8"
              onSubmit={form.handleSubmit(handleSubmitForm)}
            >
              <AppFormInput
                name="title"
                label="Titulo"
                control={form.control}
                placeholder="Insira o nome da atividade"
              />

              <article className="grid gap-4 grid-cols-2">
                <AppFormInput
                  min={0}
                  type="number"
                  name="series"
                  label="Séries"
                  placeholder="0"
                  control={form.control}
                />

                <AppFormInput
                  min={0}
                  type="number"
                  placeholder="0"
                  label="Repetições"
                  name="repetitions"
                  control={form.control}
                />
              </article>

              <p className="w-full text-center">ou</p>

              <AppFormInput
                min={0}
                type="number"
                label="Duração"
                name="durationMinutes"
                control={form.control}
                placeholder="Tempo estimado para conclusão"
              />

              <Button type="submit" className="w-full" form={formId}>
                Salvar
              </Button>
            </form>
          </section>
        </DialogContent>
      </FormContainer>
    </Dialog>
  );
}
