import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {BehaviorSubject} from "rxjs";
import {ConfirmationComponent} from "../components/confirmation/confirmation.component";
import {Player, PlayerContainer} from "../interfaces/IPlayer";
import {AuthService} from "./auth.service";
import {ConfirmationDialogService} from "./confirmation-dialog.service";
import {FirestoreService} from "./firestore.service";

@Injectable({
  providedIn: "root",
})
export class PlayersService {
  public movePlayer: BehaviorSubject<Player> = new BehaviorSubject<Player>({} as Player);
  private players: string[] = [];
  private DBPlayers: string[] = [];
  private playersDBList: PlayerContainer = {"players": []} as PlayerContainer;

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
  ) {}

  public setPlayersDBList(playersList: PlayerContainer): void {
    this.playersDBList = playersList;
  }

  public setDBPlayers(drawerPlayers: string[]): void {
    this.DBPlayers = drawerPlayers;
  }

  public isDBPlayerExist(playerName: string): boolean {
    return this.DBPlayers.includes(playerName);
  }

  public isDPPlayerExistByIndex(index: number): boolean {
    return this.DBPlayers.includes(this.players[index]);
  }

  public getDBPlayerByPlayerIndex(index: number): Player | undefined {
    return this.playersDBList["players"].find((player) => {
      return player.name == this.players[index];
    });
  }

  public addDBPlayer(playerName: string): void {
    this.DBPlayers.push(playerName);
  }

  public removeDBPlayerByIndex(index: number): void {
    if (index > -1) this.DBPlayers.splice(index, 1);
  }

  public resetDBPlayers(): void {
    this.DBPlayers = [];
  }

  public setPlayers(calculatorPlayers: string[]): void {
    this.players = calculatorPlayers;
  }

  public isPlayerExist(playerName: string): boolean {
    return this.players.includes(playerName);
  }

  public isPlayerDuplicate(playerName: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        let count = 0;
        this.players.forEach((player) => {
          if (player === playerName) count++;
        });

        resolve(count > 1);
      }, 500);
    });
  }

  public addPlayer(playerName: string): void {
    this.players.push(playerName);
  }

  public updatePlayerOnIndex(index: number, playerName: string): void {
    this.players[index] = playerName;
  }

  public removePlayerByIndex(index: number): void {
    if (index > -1) this.players.splice(index, 1);
  }

  public resetPlayers(): void {
    this.players = [];
  }

  public moveDBPlayerToPlayers(player: Player): void {
    this.movePlayer.next(player);
    this.players.push(player.name);
  }

  public addNewPlayerToDB(player: Player): void {
    if (this.authService.user) {
      this.playersDBList["players"].push(player);
      this.firestoreService.setPlayersList(this.playersDBList, this.authService.user.uid);
    }
  }

  public updateExistingPlayerOnDB(player: Player): void {
    if (this.authService.user) {
      let index = this.playersDBList["players"].findIndex((DBplayer) => {
        return DBplayer.name === player.name;
      });
      this.playersDBList["players"][index] = player;
      this.firestoreService.setPlayersList(this.playersDBList, this.authService.user.uid);
    }
  }

  public deletePlayerFromDB(player: Player): void {
    this.dialog.open(ConfirmationComponent, {data: {"playerName": player.name}});
    this.confirmationDialogService.willConfirmed().then((val) => {
      if (this.authService.user && val) {
        let index = this.playersDBList["players"].findIndex((DBplayer) => {
          return DBplayer.name === player.name;
        });
        this.playersDBList["players"].splice(index, 1);
        this.firestoreService.setPlayersList(this.playersDBList, this.authService.user.uid);
      }
    });
  }
}
