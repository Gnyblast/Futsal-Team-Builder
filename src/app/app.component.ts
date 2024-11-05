import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxCookieManagerService } from '@localia/ngx-cookie-consent';
import * as testPlayers from '../assets/test_players.json';
import { Positions } from './enums/positions.enum';
import { Player } from './interfaces/IPlayer';
import { Team, Teams } from './interfaces/ITeam';
import { TeamGenerateService } from './services/team-generate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  protected user: User | null = null;
  private mockPlayerList: Player[] = testPlayers.players;

  protected isFirst: boolean = true;
  protected isGenerated: boolean = false;
  protected positions: string[] = Object.values(Positions);
  protected ratings: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  protected numOfPlayers: number = 0;
  protected teams: Teams = {} as Teams;
  protected teamsAlternate: Teams = {} as Teams;
  protected hidePlayerRatings: boolean = false;
  protected forcedBalance: boolean = false;

  protected playerForms: FormGroup = new FormGroup({
    players: new FormArray<FormGroup>([]),
  });

  constructor(
    private teamGenereateService: TeamGenerateService,
    private cookieConsentService: NgxCookieManagerService,
  ) { }

  public ngOnInit(): void {

    if (this.cookieConsentService.getCookie("ga"))
      this.enableConsentGtags();

    if (!this.cookieConsentService.getCookie("ga"))
      this.disableConsentGtags();

    this.cookieConsentService.cookieUpdated$.subscribe(cookie => {
      if (cookie.name === "ga" && cookie.state) {
        this.enableConsentGtags();
        return;
      }

      if (cookie.name === "ga" && !cookie.state) {
        this.disableConsentGtags();
        return;
      }
    });

  }

  private enableConsentGtags(): void {
    this.gtag('consent', 'update', {
      "ad_user_data": 'granted',
      "ad_personalization": 'granted',
      "ad_storage": 'granted',
      "analytics_storage": 'granted'
    });
  }

  private disableConsentGtags(): void {
    this.gtag('consent', 'default', {
      "ad_user_data": 'denied',
      "ad_personalization": 'denied',
      "ad_storage": 'denied',
      "analytics_storage": 'denied',
      "wait_for_update": 500,
    });
  }

  private gtag(...args: any): void {
    let datLayer = (window as any).dataLayer || [];
    datLayer.push(...args);
  }

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

      if (this.forcedBalance)
        this.generateTeamsForceBalanced();

      if (!this.forcedBalance)
        this.generateTeamsNotForceBalanced();

      //? scroll to the same position always to display results but also keep generate button in display
      setTimeout(() => {
        let resultsHeight = document.querySelector<HTMLElement>(".results")?.offsetHeight;
        let generateButtonPosition = document.querySelector<HTMLElement>("#generate")?.offsetTop;
        window.scrollTo(0, ((generateButtonPosition ? generateButtonPosition : 0) - (resultsHeight ? resultsHeight : 0) / 5));
      }, 200);
    }
  }

  protected generateTeamsNotForceBalanced(): void {
    console.log("Not forced");
    this.teams = this.teamGenereateService.generate(
      this.playerForms.controls['players'] as FormArray
    );

    this.teamsAlternate = this.teamGenereateService.generate(
      this.playerForms.controls['players'] as FormArray
    );

    while (
      ([...this.teams.TeamA.squad].sort().join(",") === [...this.teamsAlternate.TeamA.squad].sort().join(",")) ||
      ([...this.teams.TeamA.squad].sort().join(",") === [...this.teamsAlternate.TeamB.squad].sort().join(","))
    ) {
      this.teamsAlternate = this.teamGenereateService.generate(
        this.playerForms.controls['players'] as FormArray
      );
    }
  }

  protected generateTeamsForceBalanced(): void {
    console.log("Forced");

    this.teams = this.teamGenereateService.generate(
      this.playerForms.controls['players'] as FormArray
    );

    this.teamsAlternate = this.teamGenereateService.generate(
      this.playerForms.controls['players'] as FormArray
    );

    for (let i = 0; i < 100; i++) {
      let diff = Math.abs(this.teams.TeamA.totalScore - this.teams.TeamB.totalScore);
      let avarage = (this.teams.TeamA.totalScore + this.teams.TeamB.totalScore) / 2;
      let percentageDiff = (diff / avarage) * 100;

      let diffAlternate = Math.abs(this.teamsAlternate.TeamA.totalScore - this.teamsAlternate.TeamB.totalScore);
      let avarageAlternate = (this.teamsAlternate.TeamA.totalScore + this.teamsAlternate.TeamB.totalScore) / 2;
      let percentageDiffAlternate = (diffAlternate / avarageAlternate) * 100;

      let teams = this.teamGenereateService.generate(
        this.playerForms.controls['players'] as FormArray
      );

      let diffNew = Math.abs(teams.TeamA.totalScore - teams.TeamB.totalScore);
      let avarageNew = (teams.TeamA.totalScore + teams.TeamB.totalScore) / 2;
      let percentageDiffNew = (diffNew / avarageNew) * 100;

      if (
        percentageDiffNew < percentageDiff &&
        (([...this.teams.TeamA.squad].sort().join(",") != [...teams.TeamA.squad].sort().join(",")) &&
          ([...this.teams.TeamA.squad].sort().join(",") != [...teams.TeamB.squad].sort().join(",")))
      )
        this.teams = teams;

      if (
        percentageDiffNew < percentageDiffAlternate + 5 &&
        (([...this.teams.TeamA.squad].sort().join(",") != [...teams.TeamA.squad].sort().join(",")) &&
          ([...this.teams.TeamA.squad].sort().join(",") != [...teams.TeamB.squad].sort().join(",")))
      ) {
        this.teamsAlternate = teams;
      }

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
