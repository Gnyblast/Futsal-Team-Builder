import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ConfirmationDialogService {
  private confirmed: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);

  constructor() {}

  public willConfirmed(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      let subs = this.confirmed.subscribe((val) => {
        console.log(val);
        if (val != null) {
          subs.unsubscribe();
          return resolve(val);
        }
      });
    });
  }

  public setConfirmState(state: boolean): void {
    this.confirmed.next(state);
    this.confirmed.next(null);
  }
}
