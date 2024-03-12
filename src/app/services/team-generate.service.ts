import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Player } from '../interfaces/IPlayer';
import { Positions } from '../enums/positions.enum';
import { Team, Teams } from '../interfaces/ITeam';

@Injectable({
  providedIn: 'root',
})
export class TeamGenerateService {
  private players: Player[] = [];
  private strikersSorted: Player[] = [];
  private midfieldersSorted: Player[] = [];
  private defendersSorted: Player[] = [];

  private goalKeepers: Player[] = [];

  constructor() {}

  public generate(playerForms: FormArray): Teams {
    this.resetValuesToInitial();
    this.setPlayersList(playerForms);
    this.calculateTotalPointsAndSortPositions();
    //console.log([...this.defendersSorted].reverse());
    //console.log([...this.midfieldersSorted].reverse());
    //console.log([...this.strikersSorted].reverse());
    return this.generateTeams();
  }

  private resetValuesToInitial() {
    this.players = [];
    this.goalKeepers = [];
    this.defendersSorted = [];
    this.midfieldersSorted = [];
    this.strikersSorted = [];
  }

  private setPlayersList(playerForms: FormArray) {
    this.players = [];
    for (let playerForm of playerForms.controls) {
      if (playerForm.value['position'] === Positions.GOAL_KEEPER)
        this.goalKeepers.push(playerForm.value);
      else this.players.push(playerForm.value);
    }
  }

  private calculateTotalPointsAndSortPositions() {
    for (let player of this.players) {
      if (player.position === Positions.DEFENDER)
        this.addPlayerToPositionList(
          this.defendersSorted,
          player,
          ['defenceRating' as keyof Player],
          'attackRating' as keyof Player
        );

      if (player.position === Positions.MIDFIELDER)
        this.addPlayerToPositionList(
          this.midfieldersSorted,
          player,
          ['attackRating' as keyof Player, 'defenceRating' as keyof Player],
          null
        );

      if (player.position === Positions.STRIKER)
        this.addPlayerToPositionList(
          this.strikersSorted,
          player,
          ['attackRating' as keyof Player],
          'defenceRating' as keyof Player
        );
    }
  }

  private addPlayerToPositionList(
    playersByPosition: Player[],
    newPlayer: Player,
    primaryRatings: (keyof Player)[],
    secondaryRatring: keyof Player | null
  ): void {
    let isAdded = false;
    if (playersByPosition.length > 0) {
      for (let player of playersByPosition) {
        let ratingNewPlater = 0;
        let ratingExistingPlayer = 0;
        for (let ratings of primaryRatings) {
          ratingNewPlater += newPlayer[ratings] as number;
          ratingExistingPlayer += player[ratings] as number;
        }

        ratingNewPlater += newPlayer.conditionRating / 2;
        ratingExistingPlayer += player.conditionRating / 2;

        if (ratingNewPlater > ratingExistingPlayer) {
          playersByPosition.splice(
            playersByPosition.indexOf(player),
            0,
            newPlayer
          );
          isAdded = true;
          return;
        }

        if (ratingNewPlater == ratingExistingPlayer) {
          if (newPlayer.conditionRating > player.conditionRating) {
            playersByPosition.splice(
              playersByPosition.indexOf(player),
              0,
              newPlayer
            );
            isAdded = true;
            return;
          }

          if (secondaryRatring) {
            if (newPlayer[secondaryRatring] > player[secondaryRatring]) {
              playersByPosition.splice(
                playersByPosition.indexOf(player),
                0,
                newPlayer
              );
              isAdded = true;
              return;
            }
          }
        }
      }

      if (!isAdded) playersByPosition.push(newPlayer);
      return;
    }

    playersByPosition.push(newPlayer);
  }

  private generateTeams(): Teams {
    let teams: Teams = {
      TeamA: { squad: [], attack: 0, defense: 0, condition: 0, totalScore: 0 },
      TeamB: { squad: [], attack: 0, defense: 0, condition: 0, totalScore: 0 },
    };

    let team = ['TeamA' as keyof Teams, 'TeamB' as keyof Teams];
    let chosenTeam = 'TeamA' as keyof Teams;

    for (let gk of this.goalKeepers) {
      teams[chosenTeam].squad.push(gk.name);
      teams[chosenTeam].attack += gk.attackRating;
      teams[chosenTeam].defense += gk.defenceRating;
      teams[chosenTeam].condition += gk.conditionRating;
      chosenTeam = this.switchTeam(chosenTeam);
    }

    chosenTeam = team[this.randomInt(0, 1)];

    chosenTeam = this.ditributePlayers(
      teams,
      chosenTeam,
      [...this.defendersSorted].reverse(),
      Positions.DEFENDER
    );
    chosenTeam = this.ditributePlayers(
      teams,
      chosenTeam,
      [...this.midfieldersSorted].reverse(),
      Positions.MIDFIELDER
    );
    this.ditributePlayers(
      teams,
      chosenTeam,
      [...this.strikersSorted].reverse(),
      Positions.STRIKER
    );

    return teams;
  }

  private ditributePlayers(
    teams: Teams,
    chosenTeam: keyof Teams,
    players: Player[],
    position: Positions
  ): keyof Teams {
    let randomPlayerIndex = this.randomInt(0, players.length - 1);
    let randomPlayer = players.splice(randomPlayerIndex, 1);
    //console.log('random pick');
    //console.log({ ...players });

    this.addPlayerToTeam(teams, chosenTeam, randomPlayer[0]);

    while (players.length > 0) {
      chosenTeam = this.switchTeam(chosenTeam);
      this.equalizeTeams(players, teams, chosenTeam, position);
    }

    return chosenTeam;
  }

  private equalizeTeams(
    players: Player[],
    teams: Teams,
    team: keyof Teams,
    position: Positions
  ): void {
    let otherTeam = this.switchTeam(team);
    let attackRateDiff = teams[otherTeam].attack / teams[team].attack;
    let defenseRateDiff = teams[otherTeam].defense / teams[team].defense;
    let conditionRateDiff = teams[otherTeam].condition / teams[team].condition;
    let selectedPlayerIndex = players.length - 1;
    let systemSelected = false;

    //console.log('*******' + team + '********');
    //console.log(teams[team].squad);
    //console.log(teams[otherTeam].squad);
    //console.log('attack: ' + attackRateDiff);
    //console.log('defense: ' + defenseRateDiff);
    //console.log('condition: ' + conditionRateDiff);
    //console.log([...players]);
    //console.log('');
    for (let player of players) {
      //console.log('evaluvating ' + player.name + ' for ' + position);
      let attackRateDiffWithPlayer =
        teams[otherTeam].attack / (teams[team].attack + player.attackRating);
      let defenseRateDiffWithPlayer =
        teams[otherTeam].defense / (teams[team].defense + player.defenceRating);
      let conditionRateDiffWithPlayer =
        teams[otherTeam].condition /
        (teams[team].condition + player.conditionRating);

      let minimumDiffAchived = position == Positions.MIDFIELDER ? 0 : 1;
      if (
        attackRateDiffWithPlayer < attackRateDiff &&
        attackRateDiffWithPlayer > 1 &&
        position != Positions.DEFENDER
      ) {
        minimumDiffAchived += 1;
      }

      if (
        defenseRateDiffWithPlayer < defenseRateDiff &&
        defenseRateDiffWithPlayer > 1 &&
        position != Positions.STRIKER
      ) {
        minimumDiffAchived += 1;
      }

      if (
        conditionRateDiffWithPlayer < conditionRateDiff &&
        conditionRateDiff > 1
      ) {
        minimumDiffAchived += 1;
      }

      if (minimumDiffAchived > 2) {
        //console.log('passed');
        systemSelected = true;
        selectedPlayerIndex = players.indexOf(player);
      }
    }

    if (!systemSelected) {
      //console.log("system couldn't determine");
      if (position == Positions.DEFENDER) {
        if (defenseRateDiff < 2) {
          selectedPlayerIndex = 0;
        } else selectedPlayerIndex = players.length - 1;
      }

      if (position == Positions.STRIKER) {
        if (attackRateDiff < 2) {
          selectedPlayerIndex = 0;
        } else selectedPlayerIndex = players.length - 1;
      }

      if (position == Positions.MIDFIELDER) {
        if (attackRateDiff < 2 || defenseRateDiff < 2) {
          selectedPlayerIndex = 0;
        } else selectedPlayerIndex = players.length - 1;
      }
    }

    let selectedPlayer = players.splice(selectedPlayerIndex, 1)[0];
    //console.log('selected: ' + selectedPlayer.name + ' For ' + position);
    this.addPlayerToTeam(teams, team, selectedPlayer);
  }

  private addPlayerToTeam(
    teams: Teams,
    team: keyof Teams,
    player: Player
  ): void {
    teams[team].squad.push(player.name);
    teams[team].attack += player.attackRating;
    teams[team].defense += player.defenceRating;
    teams[team].condition += player.conditionRating;
  }

  private randomInt(min: number, max: number) {
    //? min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private switchTeam(team: keyof Teams): keyof Teams {
    return team === 'TeamA'
      ? ('TeamB' as keyof Teams)
      : ('TeamA' as keyof Teams);
  }
}
