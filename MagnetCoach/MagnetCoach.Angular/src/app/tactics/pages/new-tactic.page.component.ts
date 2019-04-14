import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as joint from 'node_modules/jointjs/dist/joint.js';
import { ICreateTacticViewModel, IPlayerViewModel } from '../models/sport.enum';
import { ISportsViewModel, ISportDetailsViewModel, IColorViewModel, IFormationViewModel } from '../models/sports.model';
import { SportsService } from '../services/sports.service';
import { TacticsService } from '../services/tactics.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    templateUrl: './new-tactic.page.component.html'
})
export class NewTacticPageComponent implements OnInit {

  graph: any;
  paperWidth: number;
  paperHeight: number;

  formationTeam: any[];
  formation: IFormationViewModel;

  ownTeam: any[];
  opponentTeam: any[];
  ball: any;

  tactic: ICreateTacticViewModel = {
    id: 0,
    name: null,
    sportId: null,
    pitchPart: 'Full',
    playerSize: 50,
    frame: {
      id: 0,
      ball: {
        size: 30,
        position: { x: 482, y: 332 },
        visible: true,
        color: null
      },
      ownTeam: {
        id: 0,
        color: null,
        goalKeeperColor: null,
        numberOfPlayers: 0,
        players: []
      },
      opponentTeam: {
        id: 0,
        color: null,
        goalKeeperColor: null,
        numberOfPlayers: 0,
        players: []
      }
    }
  };

  vm: ISportsViewModel;
  currentSport: ISportDetailsViewModel;
  ownTeamPossibleColors: IColorViewModel[];
  opponentTeamPossibleColors: IColorViewModel[];
  ownGoalkeeperPossibleColors: IColorViewModel[];
  opponentGoalkeeperPossibleColors: IColorViewModel[];
  ballPossibleColors: IColorViewModel[];

  constructor(
    private sportsService: SportsService,
    private tacticsService: TacticsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.graph = new joint.dia.Graph();

    this.paperWidth = 1000;
    this.paperHeight = 700;

    const paper = new joint.dia.Paper({
      el: jQuery('#paper'),
      width: this.paperWidth,
      height: this.paperHeight,
      model: this.graph,
      gridSize: 1
    });

    this.sportsService.getSports().subscribe(res => {
      this.vm = res;
      this.ownTeamPossibleColors = [...res.colors];
      this.opponentTeamPossibleColors = [...res.colors];
      this.ownGoalkeeperPossibleColors = [...res.colors];
      this.opponentGoalkeeperPossibleColors = [...res.colors];
      this.ballPossibleColors = [...res.colors];
      this.tactic.frame.ownTeam.color = this.ownTeamPossibleColors[0];
      this.tactic.frame.opponentTeam.color = this.opponentTeamPossibleColors[1];
      this.tactic.frame.ownTeam.goalKeeperColor = this.ownGoalkeeperPossibleColors[3];
      this.tactic.frame.opponentTeam.goalKeeperColor = this.opponentGoalkeeperPossibleColors[3];
      this.tactic.frame.ball.color = this.ballPossibleColors[6];
    });

    this.ball = new joint.shapes.basic.Circle({
      position: { x: 482, y: 332 },
      size: { width: 30, height: 30},
      attrs: { circle: { fill: 'black', opacity: this.tactic.frame.ball.visible ? 1 : 0 } }
    });
  }

  private createTeam(numberOfPlayers: number, teamColor: IColorViewModel, goalKeeperColor?: IColorViewModel): any[] {
    const team = [];
    const player = new joint.shapes.basic.Circle({
      position: { x: 50, y: 25},
      size: { width: this.tactic.playerSize, height: this.tactic.playerSize },
      attrs: { circle: { fill: teamColor.shirtColor }, text: { text: '0', fill: teamColor.numberColor } }
    });
    for (let i = 1; i <= numberOfPlayers; i++) {
      const newPlayer = player.clone() as joint.shapes.basic.Circle;
      newPlayer.translate(0, (i - 1) * 60);
      newPlayer.attr('text/text', i);
      if (i === 1 && this.currentSport.hasGoalkeeper) {
        newPlayer.attr('circle/fill', goalKeeperColor.shirtColor);
        newPlayer.attr('text/fill', goalKeeperColor.numberColor);
      }
      team.push(newPlayer);
    }
    return team;
  }

  changeSport() {
    this.graph.clear();
    this.tactic.frame.opponentTeam.numberOfPlayers = this.currentSport.maxPlayers;
    this.tactic.frame.ownTeam.numberOfPlayers = this.currentSport.maxPlayers;
    this.ownTeam = this.createTeam(
      this.tactic.frame.ownTeam.numberOfPlayers,
      this.tactic.frame.ownTeam.color,
      this.tactic.frame.ownTeam.goalKeeperColor
    );
    this.opponentTeam = this.createTeam(
      this.tactic.frame.opponentTeam.numberOfPlayers,
      this.tactic.frame.opponentTeam.color,
      this.tactic.frame.opponentTeam.goalKeeperColor
    );
    this.graph.addCells(this.ownTeam);
    this.graph.addCells(this.opponentTeam);
    this.graph.addCell(this.ball);
  }

  changeTeamColor(isOwnTeam: boolean) {
    const team = isOwnTeam ? this.ownTeam : this.opponentTeam;
    const frameTeam = isOwnTeam ? this.tactic.frame.ownTeam : this.tactic.frame.opponentTeam;
    for (let i = frameTeam.emptyGoal ? 0 : 1; i < team.length; i++) {
      this.changeColor(team[i], frameTeam.color);
    }
  }

  changeGoalkeeperColor(isOwnTeam: boolean) {
    const frameTeam = isOwnTeam ? this.tactic.frame.ownTeam : this.tactic.frame.opponentTeam;
    if (!frameTeam.emptyGoal) {
      const team = isOwnTeam ? this.ownTeam : this.opponentTeam;
      this.changeColor(team[0], frameTeam.goalKeeperColor);
    }
  }

  changeBallColor() {
    this.ball.attr('circle/fill', this.tactic.frame.ball.color.shirtColor);
  }

  private changeColor(cell: any, color: IColorViewModel) {
    this.graph.getCell(cell).attr('circle/fill', color.shirtColor);
    this.graph.getCell(cell).attr('text/fill', color.numberColor);
  }

  changeBallVisible() {
    const ball = this.graph.getCell(this.ball);
    if (this.tactic.frame.ball.visible) {
      ball.attr('circle/opacity', 1);
    } else {
      ball.attr('circle/opacity', 0);
    }
  }

  changeOwnEmptyGoal() {
    const ownKeeper = this.graph.getCell(this.ownTeam[0]);
    if (!this.tactic.frame.ownTeam.emptyGoal) {
      ownKeeper.attr('circle/fill', this.tactic.frame.ownTeam.goalKeeperColor.shirtColor);
      ownKeeper.attr('text/fill', this.tactic.frame.ownTeam.goalKeeperColor.numberColor);
    } else {
      ownKeeper.attr('circle/fill', this.tactic.frame.ownTeam.color.shirtColor);
      ownKeeper.attr('text/fill', this.tactic.frame.ownTeam.color.numberColor);
    }
  }

  changeOpponentEmptyGoal() {
    const opponentKeeper = this.graph.getCell(this.opponentTeam[0]);
    if (!this.tactic.frame.opponentTeam.emptyGoal) {
      opponentKeeper.attr('circle/fill', 'yellow');
      opponentKeeper.attr('text/fill', 'black');
    } else {
      opponentKeeper.attr('circle/fill', this.tactic.frame.opponentTeam.color.shirtColor);
      opponentKeeper.attr('text/fill', this.tactic.frame.opponentTeam.color.numberColor);
    }
  }

  applyFormation() {
    const line  = this.paperWidth / (this.formation.lines.length * 2);
    let iNumber = 0.5;
    let iSign = 1;
    if (this.formationTeam !== this.ownTeam) {
      iNumber = (this.formation.lines.length * 2) - 0.5;
      iSign = -1;
    }
    for (let i = 0; i < this.formationTeam.length; i++) {
      const toLine = [...this.formation.lines].slice(0, i + 1).reduce((sum, a) => sum + a);
      const preLine = toLine - this.formation.lines[i];
      for (let j = preLine; j < toLine; j++) {
        this.formationTeam[j].position(
          line * (iNumber + iSign * i) - 25,
          (this.paperHeight / this.formation.lines[i]) * (j - preLine + 0.5) - 25
        );
      }
    }
  }

  removePlayer(isOwnTeam: boolean) {
    const team = isOwnTeam ? this.ownTeam : this.opponentTeam;
    const frameTeam = isOwnTeam ? this.tactic.frame.ownTeam : this.tactic.frame.opponentTeam;
    if (frameTeam.numberOfPlayers > 0) {
      frameTeam.numberOfPlayers--;
      team[frameTeam.numberOfPlayers].attr('circle/opacity', 0);
      team[frameTeam.numberOfPlayers].attr('text/opacity', 0);
    }
  }

  addPlayer(isOwnTeam: boolean) {
    const team = isOwnTeam ? this.ownTeam : this.opponentTeam;
    const frameTeam = isOwnTeam ? this.tactic.frame.ownTeam : this.tactic.frame.opponentTeam;
    if (frameTeam.numberOfPlayers < this.currentSport.maxPlayers) {
      team[frameTeam.numberOfPlayers].attr('circle/opacity', 1);
      team[frameTeam.numberOfPlayers].attr('text/opacity', 1);
      frameTeam.numberOfPlayers++;
    }
  }

  increasePlayerSize() {
    this.tactic.playerSize++;
    for (const player of this.ownTeam) {
      const playerCell = this.graph.getCell(player);
      player.resize(playerCell.size().width + 1, playerCell.size().height + 1);
    }
    for (const player of this.opponentTeam) {
      const playerCell = this.graph.getCell(player);
      player.resize(playerCell.size().width + 1, playerCell.size().height + 1);
    }
  }

  decreasePlayerSize() {
    this.tactic.playerSize--;
    for (const player of this.ownTeam) {
      const playerCell = this.graph.getCell(player);
      player.resize(playerCell.size().width - 1, playerCell.size().height - 1);
    }
    for (const player of this.opponentTeam) {
      const playerCell = this.graph.getCell(player);
      player.resize(playerCell.size().width - 1, playerCell.size().height - 1);
    }
  }

  increaseBallSize() {
    this.tactic.frame.ball.size++;
    const ballCell = this.graph.getCell(this.ball);
    this.ball.resize(ballCell.size().width + 1, ballCell.size().height + 1);
  }

  decreaseBallSize() {
    this.tactic.frame.ball.size--;
    const ballCell = this.graph.getCell(this.ball);
    this.ball.resize(ballCell.size().width - 1, ballCell.size().height - 1);
  }

  createTactic() {
    for (let i = 0; i < this.tactic.frame.ownTeam.numberOfPlayers; i++) {
      const playerCell = this.graph.getCell(this.ownTeam[i]);
      const newPlayer: IPlayerViewModel = {
          id: 0,
          number: i + 1,
          position: { x: 0, y: 0 }
      };
      this.tactic.frame.ownTeam.players.push(newPlayer);
      this.tactic.frame.ownTeam.players[i].position = {...playerCell.get('position')};
    }
    for (let i = 0; i < this.tactic.frame.opponentTeam.numberOfPlayers; i++) {
        const playerCell = this.graph.getCell(this.opponentTeam[i]);
        const newPlayer: IPlayerViewModel = {
            id: 0,
            number: i + 1,
            position: { x: 0, y: 0 }
        };
        this.tactic.frame.opponentTeam.players.push(newPlayer);
        this.tactic.frame.opponentTeam.players[i].position = {...playerCell.get('position')};
    }
    const ballCell = this.graph.getCell(this.ball);
    this.tactic.frame.ball.position = {...ballCell.prop('position')};
    this.tactic.sportId = this.currentSport.id;
    this.tacticsService.createTactic(this.tactic).pipe(
      map(res => this.router.navigateByUrl('/tactics')),
      catchError(err => of(console.log(err)))
    ).subscribe();
  }

}

