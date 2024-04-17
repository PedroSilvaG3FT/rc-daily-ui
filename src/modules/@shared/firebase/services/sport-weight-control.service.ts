import { FirebaseCollectionBase } from "../base/firebase-collection.base";
import { FIREBASE_COLLECTION } from "../constans/firebase-collection.contant";

export class SportWeightControlService extends FirebaseCollectionBase {
  constructor() {
    super(FIREBASE_COLLECTION.sportWeightControl);
  }
}
