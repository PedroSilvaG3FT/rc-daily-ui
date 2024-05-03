import {
  Drawer,
  DrawerClose,
  DrawerTitle,
  DrawerFooter,
  IDrawerProps,
  DrawerContent,
  DrawerTrigger,
} from "@/_shad/components/ui/drawer";
import ActivityDetail from "./activity-detail";
import { Button } from "@/_shad/components/ui/button";

interface IActivityDetailModalProps extends IDrawerProps {}

export default function ActivityDetailModal(props: IActivityDetailModalProps) {
  const { isOpen, children, onOpenChange } = props;

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <section className="mx-auto w-full px-4 max-w-2xl">
          <ActivityDetail className="border-none" />

          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="w-full">Fechar</Button>
            </DrawerClose>
          </DrawerFooter>
        </section>
      </DrawerContent>
    </Drawer>
  );
}
