import {Component, OnDestroy, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {Subscription} from "rxjs";
import {Player, PlayerContainer} from "../../interfaces/IPlayer";
import {AuthService} from "../../services/auth.service";
import {DrawerService} from "../../services/drawer.service";
import {FirestoreService} from "../../services/firestore.service";
import {PlayersService} from "../../services/players.service";

@Component({
  selector: "app-drawer",
  templateUrl: "./drawer.component.html",
  styleUrl: "./drawer.component.css",
})
export class DrawerComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  private playersSubs: Subscription = new Subscription();
  protected playerList: PlayerContainer = {} as PlayerContainer;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private firestoreService: FirestoreService,
    private drawerService: DrawerService,
    protected playersService: PlayersService,
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
                if (val) {
                  this.playerList = val;

                  this.playersService.setDBPlayers(
                    this.playerList["players"].map((player) => {
                      return player.name;
                    }),
                  );

                  this.playersService.setPlayersDBList(val);
                }
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

  protected closeDrawer(): void {
    this.drawerService.closeDrawer();
  }

  protected AddPlayerToPlayers(player: Player): void {
    this.playersService.moveDBPlayerToPlayers(player);
  }
}
