import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import * as testPlayers from '../assets/test_players.json';
import { Player } from './interfaces/IPlayer';
import { Positions } from './enums/positions.enum';
import { Team, Teams } from './interfaces/ITeam';
import { TeamGenerateService } from './services/team-generate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private mockPlayerList: Player[] = testPlayers.players;

  protected isFirst: boolean = true;
  protected isGenerated: boolean = false;
  protected positions: string[] = Object.values(Positions);
  protected ratings: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  protected numOfPlayers: number = 0;
  protected teams: Teams = {} as Teams;
  protected teamsAlternate: Teams = {} as Teams;
  protected hidePlayerRatings: boolean = false;

  constructor(
    private teamGenereateService: TeamGenerateService
  ) {}

  protected playerForms: FormGroup = new FormGroup({
    players: new FormArray<FormGroup>([]),
  });

  protected generateFormFields(): void {
    let formArr = new FormArray<FormGroup>([]);
    for (let i = 0; i < this.numOfPlayers; i++) {
      let form = new FormGroup({
        name: new FormControl<string | null>(null, [Validators.required]),
        position: new FormControl<string | null>(null, [Validators.required]),
        defenceRating: new FormControl<number | null>(null, [
          Validators.required,
        ]),
        attackRating: new FormControl<number | null>(null, [
          Validators.required,
        ]),
        conditionRating: new FormControl<number | null>(null, [
          Validators.required,
        ]),
      });
      formArr.push(form);
    }

    this.playerForms.controls['players'] = formArr;
    this.isFirst = false;
  }

  protected getAsFormArray(formArray: any): FormArray {
    return formArray as FormArray;
  }

  protected getAsFormGroup(fromGroup: any): FormGroup {
    return fromGroup as FormGroup;
  }

  protected generateTeams(): void {
    let isAllValid = true;
    for (let playerForm of (this.playerForms.controls['players'] as FormArray)
      .controls) {
      if (!playerForm.valid) {
        playerForm.markAllAsTouched();
        isAllValid = false;
      }
    }

    if (isAllValid) {
      this.isGenerated = true;
      //this.teams = this.teamGenerateService.generate(
      //  this.playerForms.controls['players'] as FormArray
      //);

      this.teams = this.teamGenereateService.generate(
        this.playerForms.controls['players'] as FormArray
      );

      this.teamsAlternate = this.teamGenereateService.generate(
        this.playerForms.controls['players'] as FormArray
      );

      while (
        JSON.stringify(this.teams) == JSON.stringify(this.teamsAlternate)
      ) {
        this.teamsAlternate = this.teamGenereateService.generate(
          this.playerForms.controls['players'] as FormArray
        );
      }

      //? scroll to the same position always to display results but also keep generate button in display
      setTimeout(() => {
        let resultsHeight = document.querySelector<HTMLElement>(".results")?.offsetHeight;
        let generateButtonPosition = document.querySelector<HTMLElement>("#generate")?.offsetTop;
        window.scrollTo(0, ((generateButtonPosition?generateButtonPosition:0)-(resultsHeight?resultsHeight:0)/5));
      }, 200);
    }
  }

  protected clean(): void {
    this.numOfPlayers = 0;
    this.playerForms = new FormGroup({
      players: new FormArray<FormGroup>([]),
    });

    this.isFirst = true;
    this.isGenerated = false;
  }

  protected addNewPlayer(): void {
    let form = new FormGroup({
      name: new FormControl<string | null>(null, [Validators.required]),
      position: new FormControl<string | null>(null, [Validators.required]),
      defenceRating: new FormControl<number | null>(null, [
        Validators.required,
      ]),
      attackRating: new FormControl<number | null>(null, [Validators.required]),
      conditionRating: new FormControl<number | null>(null, [
        Validators.required,
      ]),
    });
    (this.playerForms.controls['players'] as FormArray).push(form);
    this.numOfPlayers++;
  }

  protected deletePlayer(index: number): void {
    (this.playerForms.controls['players'] as FormArray).removeAt(index);
    this.numOfPlayers--;

    if (this.numOfPlayers < 1) this.isFirst = true;
  }

  protected test(): void {
    this.numOfPlayers = this.mockPlayerList.length;
    let formArr = new FormArray<FormGroup>([]);
    for (let player of this.mockPlayerList) {
      let form = new FormGroup({
        name: new FormControl<string | null>(player.name, [
          Validators.required,
        ]),
        position: new FormControl<string | null>(player.position, [
          Validators.required,
        ]),
        defenceRating: new FormControl<number | null>(player.defenceRating, [
          Validators.required,
        ]),
        attackRating: new FormControl<number | null>(player.attackRating, [
          Validators.required,
        ]),
        conditionRating: new FormControl<number | null>(
          player.conditionRating,
          [Validators.required]
        ),
      });
      formArr.push(form);
    }
    this.playerForms.controls['players'] = formArr;
    this.isFirst = false;
  }

  protected getTeams(): string[] {
    return Object.keys(this.teams);
  }

  protected getTeamsAlternate(): string[] {
    return Object.keys(this.teamsAlternate);
  }

  protected getTeam(teamName: string): Team {
    return this.teams[teamName as keyof Teams] as Team;
  }

  protected getTeamAlternate(teamName: string): Team {
    return this.teamsAlternate[teamName as keyof Teams] as Team;
  }

  protected getPlayerByName(playerName: string): Player {
    return this.playerForms.controls['players'].value.find((player: Player) => {
      return player.name == playerName;
    });
  }
}
