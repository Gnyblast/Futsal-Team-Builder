import {Injectable, signal, WritableSignal} from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DrawerService {
  private drawerState: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {}

  public closeDrawer(): void {
    this.drawerState.set(false);
  }

  public openDrawer(): void {
    this.drawerState.set(true);
  }

  public toggleDrawer(): void {
    this.drawerState.set(!this.drawerState());
  }

  public getDrawerState(): boolean {
    return this.drawerState();
  }
}
