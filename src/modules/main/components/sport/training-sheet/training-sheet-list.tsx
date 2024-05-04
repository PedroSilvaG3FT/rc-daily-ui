import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/_shad/components/ui/button";
import { DataTable } from "@/_shad/components/ui/datatable";
import { ISportTrainingSheetItem } from "@/modules/@shared/firebase/interfaces/sport-training-sheet.interface";
import {
  Pen,
  Plus,
  CircleCheck,
  CircleMinus,
  CircleSlash,
  ClipboardList,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/_shad/components/ui/dropdown-menu";
import TrainingSheetRegister from "./training-sheet-register";
import { SportFacede } from "@/modules/main/facades/sport.facede";
import trainingSheetStore from "@/store/sport/training-sheet.store";
import { SportTrainingSheetService } from "@/modules/@shared/firebase/services/sport-training-sheet.service";
import ConfirmModal from "@/modules/@shared/components/utils/confirm-modal";

export default function TrainingSheetList() {
  const _sportFacede = new SportFacede();
  const _sportTrainingSheetService = new SportTrainingSheetService();

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const [itemIdDelete, setItemIdDelete] = useState("");
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const _trainingSheetStore = trainingSheetStore((state) => state);
  const { list } = _trainingSheetStore;

  const _getItemById = (id: string) => list.find((item) => item.id === id);

  const handleUpdateActive = (id: string) => {
    _sportFacede
      .updateCurrentSheet(id)
      .then(() => _sportFacede.getTrainingSheetListStore(true))
      .catch((error) => {
        console.log("handleUpdateActive : ", error);
      });
  };

  const handleOpenEdit = (id: string) => {
    const item = _getItemById(id);

    if (item) {
      _trainingSheetStore.setRegisterData(item);
      setIsRegisterOpen(true);
    }
  };

  const handleDelete = (isConfimed: boolean) => {
    setIsConfirmDeleteOpen(false);

    if (!isConfimed) return;
    _sportTrainingSheetService
      .delete(itemIdDelete)
      .then(() => _sportFacede.getTrainingSheetListStore(true))
      .catch((error) => {
        console.log("handleDelete : ", error);
      });
  };

  const onOpenSheetDrawerChange = (data: boolean) => {
    setIsRegisterOpen(data);

    if (!data) {
      _trainingSheetStore.setRegisterData({} as ISportTrainingSheetItem);
    }
  };

  const handleRegisterFinish = () => {
    _sportFacede
      .getTrainingSheetListStore(true)
      .then(() => {
        setIsRegisterOpen(false);
        _trainingSheetStore.setRegisterData({} as ISportTrainingSheetItem);
      })
      .catch((error) => {
        console.log("handleRegisterFinish ", error);
      });
  };

  const handleSelectDeleteItemId = (id: string) => {
    setItemIdDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const columns: ColumnDef<ISportTrainingSheetItem>[] = [
    {
      header: "Ativo",
      accessorKey: "active",
      cell: ({ row }) => {
        return row.getValue("active") ? (
          <CircleCheck className="text-green-400" />
        ) : (
          <CircleSlash />
        );
      },
    },
    { header: "Titulo", accessorKey: "title" },
    { header: "Descrição", accessorKey: "description" },
    {
      id: "actions",
      cell: ({ row }) => {
        const itemId = String(row.original.id);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleUpdateActive(itemId)}>
                <ClipboardList className="w-4 mr-2" />
                Usar ficha
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleOpenEdit(itemId)}>
                <Pen className="w-4 mr-2" />
                Editar
              </DropdownMenuItem>

              <DropdownMenuItem
                className="text-red-400"
                onClick={() => handleSelectDeleteItemId(itemId)}
              >
                <CircleMinus className="w-4 mr-2" />
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <section>
        <nav className="mb-4 flex items-center justify-between">
          <h2 className="font-xl font-semibold">Minhas fichas de treino </h2>

          <TrainingSheetRegister
            isOpen={isRegisterOpen}
            onFinish={handleRegisterFinish}
            onOpenChange={onOpenSheetDrawerChange}
          >
            <Button>
              Nova Ficha
              <Plus className="ml-4" />
            </Button>
          </TrainingSheetRegister>
        </nav>

        <DataTable
          data={list}
          columns={columns}
          pagination={{ pageSize: 5, pageIndex: 0 }}
        />
      </section>

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title="Remover Ficha ?"
        onSelect={(data) => handleDelete(data)}
      ></ConfirmModal>
    </>
  );
}
