import { Injectable } from '@angular/core';
import { Player } from '../interfaces/IPlayer';
import { FormArray } from '@angular/forms';
import { Positions } from '../enums/positions.enum';
import { Team, Teams } from '../interfaces/ITeam';

@Injectable({
  providedIn: 'root',
})
export class NewTeamGenerateService {
  private players: Player[] = [];
  private goalKeepers: Player[] = [] as Player[];
  private defenders: Player[] = [] as Player[];
  private midfielders: Player[] = [] as Player[];
  private strikers: Player[] = [] as Player[];
  private teams: Teams = {
    TeamA: { squad: [], attack: 0, defense: 0, condition: 0, totalScore: 0 },
    TeamB: { squad: [], attack: 0, defense: 0, condition: 0, totalScore: 0 },
  };

  constructor() { }

  public generate(playerForms: FormArray): Teams {
    this.players = [];
    this.teams = {
      TeamA: { squad: [], attack: 0, defense: 0, condition: 0, totalScore: 0 },
      TeamB: { squad: [], attack: 0, defense: 0, condition: 0, totalScore: 0 },
    };

    for (let playerForm of playerForms.controls) {
      let player = this.calculatePlayerScore(playerForm.value as Player);
      this.players.push(player);
    }

    this.sortByPositions(this.players);

    if (this.goalKeepers.length > 0)
      this.distributePlayersToTeams(this.goalKeepers);
    if (this.defenders.length > 0)
      this.distributePlayersToTeams(this.defenders);
    if (this.midfielders.length > 0)
      this.distributePlayersToTeams(this.midfielders);
    if (this.strikers.length > 0)
      this.distributePlayersToTeams(this.strikers);

    return this.teams;
  }

  private calculatePlayerScore(player: Player): Player {
    switch (player.position) {
      case Positions.GOAL_KEEPER:
        player.totalScore =
          player.defenceRating * 1 +
          player.conditionRating * 0.1 +
          player.attackRating * 0.1;
        break;
      case Positions.DEFENDER:
        player.totalScore =
          player.defenceRating * 1 +
          player.conditionRating * 0.7 +
          player.attackRating * 0.5;
        break;
      case Positions.STRIKER:
        player.totalScore =
          player.defenceRating * 0.3 +
          player.conditionRating * 0.6 +
          player.attackRating * 1;
        break;
      case Positions.MIDFIELDER:
        player.totalScore =
          player.defenceRating * 0.6 +
          player.conditionRating * 0.9 +
          player.attackRating * 0.6;
        break;
    }
    return player;
  }

  private sortByPositions(players: Player[]): void {
    players.forEach((player) => {
      switch (player.position) {
        case Positions.GOAL_KEEPER:
          this.goalKeepers.push(player);
          break;
        case Positions.DEFENDER:
          this.defenders.push(player);
          break;
        case Positions.MIDFIELDER:
          this.midfielders.push(player);
          break;
        case Positions.STRIKER:
          this.strikers.push(player);
          break;
      }
    });
  }

  private distributePlayersToTeams(players: Player[]): void {
    let team = ['TeamA' as keyof Teams, 'TeamB' as keyof Teams];
    let chosenTeam = team[this.randomInt(0, 1)];
    let oppositeTeam = this.switchTeam(chosenTeam);

    if (
      this.teams[chosenTeam].squad.length >=
      this.teams[oppositeTeam].squad.length
    )
      chosenTeam = oppositeTeam;

    let randomPlayerIndex = this.randomInt(0, players.length - 1);
    players = this.addPlayerToTeam(chosenTeam, randomPlayerIndex, players);

    let playersNotMutated = [...players];
    for (let i = 0; i < playersNotMutated.length; i++) {
      let counterPlayerIndex = this.getCounterPlayerIndex(chosenTeam, players);
      chosenTeam = this.switchTeam(chosenTeam);
      this.addPlayerToTeam(chosenTeam, counterPlayerIndex, players);
    }
  }

  private randomInt(min: number, max: number): number {
    //? min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private addPlayerToTeam(
    team: keyof Teams,
    playerIndex: number,
    players: Player[]
  ): Player[] {
    this.teams[team].squad.push(players[playerIndex].name);
    this.teams[team].attack += players[playerIndex].attackRating;
    this.teams[team].defense += players[playerIndex].defenceRating;
    this.teams[team].condition += players[playerIndex].conditionRating;
    this.teams[team].totalScore += players[playerIndex].totalScore;
    players.splice(playerIndex, 1);
    return players;
  }

  private switchTeam(team: keyof Teams): keyof Teams {
    return team === 'TeamA'
      ? ('TeamB' as keyof Teams)
      : ('TeamA' as keyof Teams);
  }

  private getCounterPlayerIndex(team: keyof Teams, players: Player[]): number {
    let currentTeamScore = this.teams[team].totalScore;
    let counterTeamScore = this.teams[this.switchTeam(team)].totalScore;

    if (counterTeamScore >= currentTeamScore)
      return this.pickWorstPlayer(players);

    let counterPlayerIndex = players.findIndex((player) => {
      return currentTeamScore <= counterTeamScore + player.totalScore;
    });

    if (counterPlayerIndex == -1) return this.pickBestPlayer(players);

    return counterPlayerIndex;
  }

  private pickWorstPlayer(players: Player[]): number {
    let worstScore = 0;
    let worstPlayerIndex = 0;

    players.forEach((player, index) => {
      if (worstScore >= player.totalScore) {
        worstScore = player.totalScore;
        worstPlayerIndex = index;
      }
    });

    return worstPlayerIndex;
  }

  private pickBestPlayer(players: Player[]): number {
    let bestScore = 0;
    let bestPlayerIndex = 0;

    players.forEach((player, index) => {
      if (bestScore <= player.totalScore) {
        bestScore = player.totalScore;
        bestPlayerIndex = index;
      }
    });

    return bestPlayerIndex;
  }
}
