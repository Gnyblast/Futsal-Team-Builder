import {ComponentType} from "@angular/cdk/portal";
import {Component, EventEmitter, OnDestroy, OnInit, Output} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {PlayerContainer} from "../../interfaces/IPlayer";
import {AuthService} from "../../services/auth.service";
import {FirestoreService} from "../../services/firestore.service";
import {LoginComponent} from "../login/login.component";
import {RegisterComponent} from "../register/register.component";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrl: "./navbar.component.css",
})
export class NavbarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private playersSubs: Subscription = new Subscription();
  protected loginComponent: ComponentType<any> = LoginComponent;
  protected registerComponent: ComponentType<any> = RegisterComponent;
  protected playerList: PlayerContainer = {} as PlayerContainer;
  @Output() public menuClicked: EventEmitter<boolean> = new EventEmitter(false);

  constructor(
    protected authService: AuthService,
    private dialog: MatDialog,
    private firestoreService: FirestoreService,
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.authService.authTrigger().subscribe(() => {
        if (this.authService.isAuthenticated()) {
          this.dialog.closeAll();

          if (this.authService.user) {
            this.playersSubs = this.firestoreService
              .getPlayersListSubs(this.authService.user.uid)
              .subscribe((val) => {
                if (val) this.playerList = val;
              });
          }
          return;
        }

        this.playersSubs.unsubscribe();
        return;
      }),
    );
  }

  public ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((subs) => {
        subs.unsubscribe();
      });
    }

    this.playersSubs.unsubscribe();
  }

  protected openDialog(component: ComponentType<any>): void {
    this.dialog.open(component);
  }

  protected logOut(): void {
    this.authService.signOut();
  }

  protected toggleDrawer(): void {
    this.menuClicked.emit(true);
  }
}
