import {Component, Inject, OnDestroy} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {Player} from "../../interfaces/IPlayer";
import {ConfirmationDialogService} from "../../services/confirmation-dialog.service";

@Component({
  selector: "app-confirmation",
  templateUrl: "./confirmation.component.html",
  styleUrl: "./confirmation.component.css",
})
export class ConfirmationComponent implements OnDestroy {
  private selected: boolean = false;

  constructor(
    private dialog: MatDialog,
    private confirmationDialogService: ConfirmationDialogService,
    @Inject(MAT_DIALOG_DATA) public data: {player: Player; text: string},
  ) {}

  public ngOnDestroy(): void {
    if (!this.selected) this.response(false);
  }

  protected response(state: boolean): void {
    this.selected = true;
    this.confirmationDialogService.setConfirmState(state);
    this.dialog.closeAll();
  }
}
