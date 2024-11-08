import {inject, Injectable} from "@angular/core";
import {doc, docData, DocumentSnapshot, Firestore, getDoc, setDoc} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {PlayerContainer} from "../interfaces/IPlayer";

@Injectable({
  providedIn: "root",
})
export class FirestoreService {
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  public getPlayersListSubs(uid: string): Observable<PlayerContainer> {
    let docRef = doc(this.firestore, "players/" + uid);
    return docData(docRef) as Observable<PlayerContainer>;
  }

  public getPlayersList(uid: string): Promise<DocumentSnapshot<PlayerContainer, PlayerContainer>> {
    let docRef = doc(this.firestore, "players/" + uid);
    return getDoc(docRef);
  }

  public async setPlayersList(playerContainer: PlayerContainer, uid: string): Promise<void> {
    let docRef = doc(this.firestore, "players/" + uid);
    return await setDoc(docRef, playerContainer);
  }
}
