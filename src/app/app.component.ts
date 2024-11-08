import {Component, effect, EffectRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MatSidenav} from "@angular/material/sidenav";
import {AuthService} from "./services/auth.service";
import {DrawerService} from "./services/drawer.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  private effectsList: EffectRef[] = [];

  @ViewChild("drawer") public drawer!: MatSidenav;

  protected drawerState: boolean = false;
  constructor(private drawerService: DrawerService, protected authService: AuthService) {
    this.effectsList.push(
      effect(() => {
        if (this.authService.isAuthenticated()) {
          this.drawer.toggle(this.drawerService.getDrawerState());
        }
      }),
    );
  }

  public ngOnInit(): void {}

  public ngOnDestroy(): void {
    if (this.effectsList.length > 0) {
      for (let effect of this.effectsList) {
        effect.destroy();
      }
    }
  }
}
