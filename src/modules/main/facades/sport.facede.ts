import {
  ISportWeightControlDB,
  ISportWeightControlItem,
} from "@/modules/@shared/firebase/interfaces/sport-weight-control.interface";
import {
  ISportTrainingSheetDB,
  ISportTrainingSheetItem,
} from "@/modules/@shared/firebase/interfaces/sport-training-sheet.interface";

import authStore from "@/store/auth.store";
import loadingStore from "@/store/loading.store";
import trainingSheetStore from "@/store/sport/training-sheet.store";
import weightControlStore from "@/store/sport/weight-control.store";

import { SportTrainingSheetModel } from "@/modules/@shared/firebase/models/sport-training-sheet.model";
import { SportWeightControlModel } from "@/modules/@shared/firebase/models/sport-weight-control.model";
import { SportTrainingSheetService } from "@/modules/@shared/firebase/services/sport-training-sheet.service";
import { SportWeightControlService } from "@/modules/@shared/firebase/services/sport-weight-control.service";

const _sportWeightControlModel = new SportWeightControlModel();
const _sportTrainingSheetModel = new SportTrainingSheetModel();
const _sportWeightControlService = new SportWeightControlService();
const _sportTrainingSheetService = new SportTrainingSheetService();

export class SportFacede {
  #setLoadingShow = loadingStore.getState().setShow;
  #userId: string = String(authStore.getState().user.id);

  #setWeightControlData = weightControlStore.getState().setData;

  #setTrainingSheetList = trainingSheetStore.getState().setList;
  #setTrainingSheetCurrent = trainingSheetStore.getState().setCurrent;

  public async getTrainingSheetListStore(isSetCurrent = false) {
    try {
      this.#setLoadingShow(true);

      const response =
        await _sportTrainingSheetService.getByUserId<ISportTrainingSheetDB>(
          this.#userId
        );

      if (response.length) {
        const data = _sportTrainingSheetModel.buildList(response);
        const current = data.find((item) => item.active);
        this.#setTrainingSheetList(data);

        if (isSetCurrent)
          this.#setTrainingSheetCurrent(
            current || ({} as ISportTrainingSheetItem)
          );
      }

      this.#setLoadingShow(false);
      return response;
    } catch (error) {
      this.#setLoadingShow(false);
      throw error;
    }
  }

  public async getWeightControlStore() {
    try {
      this.#setLoadingShow(true);

      const response =
        await _sportWeightControlService.getByUserId<ISportWeightControlDB>(
          this.#userId
        );

      let result = {} as ISportWeightControlItem;

      if (response.length) {
        const [data] = response;
        result = _sportWeightControlModel.buildItem(data);
        this.#setWeightControlData(result);
      }

      this.#setLoadingShow(false);
      return result;
    } catch (error) {
      this.#setLoadingShow(false);
      throw error;
    }
  }

  public async updateFullStore(isSetFirstSheetToCurrent = true) {
    try {
      await this.getWeightControlStore();
      await this.getTrainingSheetListStore(isSetFirstSheetToCurrent);
    } catch (error) {
      throw error;
    }
  }

  public async updateCurrentSheet(id: string) {
    try {
      const currentId = trainingSheetStore.getState().current.id;
      const isEqual = currentId === id;
      if (isEqual) return true;

      const $request = (itemId: string, active: boolean) => {
        return _sportTrainingSheetService.update<ISportTrainingSheetDB>(
          itemId,
          { active } as ISportTrainingSheetDB
        );
      };

      console.log("currentId : ", currentId);
      if (!!currentId) await $request(currentId, false);
      await $request(id, true);

      return true;
    } catch (error) {
      throw error;
    }
  }
}
