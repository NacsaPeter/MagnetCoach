import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as joint from 'node_modules/jointjs/dist/joint.js';
import { Sport, PitchPart, IFormationViewModel, ITacticViewModel, IFrameViewModel, IPlayerViewModel } from '../models/sport.enum.js';

@Component({
    templateUrl: './new-tactic.page.component.html'
})
export class NewTacticPageComponent implements OnInit {

  sports = Sport;
  pitchParts = PitchPart;

  graph: any;
  paperWidth: number;
  paperHeight: number;

  formationTeam: any[];
  formation: IFormationViewModel;
  formations: IFormationViewModel[] = [
    {
      id: 1,
      name: '4-4-2',
      sport: Sport.football,
      lines: [1, 4, 4, 2]
    },
    {
      id: 2,
      name: '4-3-3',
      sport: Sport.football,
      lines: [1, 4, 3, 3]
    },
    {
      id: 3,
      name: '3-5-2',
      sport: Sport.football,
      lines: [1, 3, 5, 2]
    },
    {
      id: 4,
      name: '3-4-3',
      sport: Sport.football,
      lines: [1, 3, 4, 3]
    },
    {
      id: 5,
      name: '2-3',
      sport: Sport.iceHockey,
      lines: [1, 2, 3]
    },
    {
      id: 6,
      name: '3-2',
      sport: Sport.iceHockey,
      lines: [1, 3, 2]
    },
    {
      id: 7,
      name: '2-1-2',
      sport: Sport.iceHockey,
      lines: [1, 2, 1, 2]
    },
    {
      id: 8,
      name: '2-1-2',
      sport: Sport.basketball,
      lines: [2, 1, 2]
    },
    {
      id: 9,
      name: '5-1',
      sport: Sport.handball,
      lines: [1, 5, 1, 0]
    },
    {
      id: 9,
      name: '6',
      sport: Sport.handball,
      lines: [1, 6, 0, 0]
    },
  ];

  ownTeam: any[];
  opponentTeam: any[];
  ball: any;

  currentFrame: IFrameViewModel = {
    id: 0,
    ball: {
      size: 30,
      position: { x: 482, y: 332 },
      visible: true
    },
    ownTeam: {
      id: 0,
      color: null,
      numberOfPlayers: 0,
      players: []
    },
    opponentTeam: {
      id: 0,
      color: null,
      numberOfPlayers: 0,
      players: []
    }
  };

  model: ITacticViewModel = {
    id: 0,
    sport: null,
    pitchPart: null,
    playerSize: 50,
    frames: []
  };

  maxPlayers: number;

  ngOnInit() {
    this.graph = new joint.dia.Graph();

    this.paperWidth = 1000;
    this.paperHeight = 700;
    this.currentFrame.ownTeam.color = 'red';
    this.currentFrame.opponentTeam.color = 'blue';

    const paper = new joint.dia.Paper({
      el: jQuery('#paper'),
      width: this.paperWidth,
      height: this.paperHeight,
      model: this.graph,
      gridSize: 1
    });

    // const rect = new joint.shapes.basic.Rect({
    //   position: { x: 100, y: 30 },
    //   size: { width: 100, height: 30 },
    //   attrs: { rect: { fill: 'blue' }, text: { text: 'my box', fill: 'white' } }
    // });

    // const rect2 = rect.clone() as joint.shapes.basic.Rect;
    // rect2.translate(300);

    // const link = new joint.dia.Link({
    //   source: { id: rect.id },
    //   target: { id: rect2.id }
    // });

    // const player = new joint.shapes.basic.Circle({
    //   position: { x: 50, y: 50},
    //   size: { width: 50, height: 50 },
    //   attrs: { circle: { fill: 'red' }, text: { text: '10', fill: 'black' } }
    // });

    this.ball = new joint.shapes.basic.Circle({
      position: { x: 482, y: 332 },
      size: { width: 30, height: 30},
      attrs: { circle: { fill: 'black', opacity: this.currentFrame.ball.visible ? 1 : 0 } }
    });

    this.model.frames.push(this.currentFrame);

    // graph.addCells([rect, rect2, link]);
    // this.graph.addCells(this.createTeam(11, 'red', 'white'));
  }

  private createTeam(numberOfPlayers: number, shirtColor: string, numberColor: string): any[] {
    const team = [];
    const player = new joint.shapes.basic.Circle({
      position: { x: 50, y: 25},
      size: { width: this.model.playerSize, height: this.model.playerSize },
      attrs: { circle: { fill: shirtColor }, text: { text: '0', fill: numberColor } }
    });
    for (let i = 1; i <= numberOfPlayers; i++) {
      const newPlayer = player.clone() as joint.shapes.basic.Circle;
      newPlayer.translate(0, (i - 1) * 60);
      newPlayer.attr('text/text', i);
      if (i === 1 && this.model.sport !== Sport.basketball) {
        newPlayer.attr('circle/fill', 'yellow');
        newPlayer.attr('text/fill', 'black');
      }
      team.push(newPlayer);
    }
    return team;
  }

  changeSport() {
    this.graph.clear();
    switch (this.model.sport) {
      case Sport.football: this.maxPlayers = 11; break;
      case Sport.basketball: this.maxPlayers = 5; break;
      case Sport.handball: this.maxPlayers = 7; break;
      case Sport.iceHockey: this.maxPlayers = 6; break;
    }
    this.currentFrame.opponentTeam.numberOfPlayers = this.maxPlayers;
    this.currentFrame.ownTeam.numberOfPlayers = this.maxPlayers;
    this.ownTeam = this.createTeam(
      this.currentFrame.ownTeam.numberOfPlayers,
      this.currentFrame.ownTeam.color,
      'white'
    );
    this.opponentTeam = this.createTeam(
      this.currentFrame.opponentTeam.numberOfPlayers,
      this.currentFrame.opponentTeam.color,
      'white'
    );
    this.graph.addCells(this.ownTeam);
    this.graph.addCells(this.opponentTeam);
    this.graph.addCell(this.ball);
  }

  test() {
    // this.graph.getCell(this.opponentTeam[1]).translate(50);
    // this.graph.getCell(this.opponentTeam[1]).attr('circle/opacity', 0);
    // const link = new joint.shapes.standard.Link();
    // link.source(this.opponentTeam[10]);
    // link.target(this.ball);
    // link.addTo(this.graph);
    this.preservePositions();
  }

  changeOwnTeamColor() {
    this.changeColor(this.ownTeam, this.currentFrame.ownTeam.color);
  }

  changeOpponentTeamColor() {
    this.changeColor(this.opponentTeam, this.currentFrame.opponentTeam.color);
  }

  private changeColor(cells: any[], color: string) {
    for (const cell of cells) {
      this.graph.getCell(cell).attr('circle/fill', color);
    }
  }

  changeBallVisible() {
    const ball = this.graph.getCell(this.ball);
    if (this.currentFrame.ball.visible) {
      ball.attr('circle/opacity', 1);
    } else {
      ball.attr('circle/opacity', 0);
    }
  }

  changeOwnEmptyGoal() {
    const ownKeeper = this.graph.getCell(this.ownTeam[0]);
    if (!this.currentFrame.ownTeam.emptyGoal) {
      ownKeeper.attr('circle/fill', 'yellow');
      ownKeeper.attr('text/fill', 'black');
    } else {
      ownKeeper.attr('circle/fill', this.currentFrame.ownTeam.color);
      ownKeeper.attr('text/fill', 'white');
    }
  }

  changeOpponentEmptyGoal() {
    const opponentKeeper = this.graph.getCell(this.opponentTeam[0]);
    if (!this.currentFrame.opponentTeam.emptyGoal) {
      opponentKeeper.attr('circle/fill', 'yellow');
      opponentKeeper.attr('text/fill', 'black');
    } else {
      opponentKeeper.attr('circle/fill', this.currentFrame.opponentTeam.color);
      opponentKeeper.attr('text/fill', 'white');
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

  removeOwnPlayer() {
    if (this.currentFrame.ownTeam.numberOfPlayers > 0) {
      this.currentFrame.ownTeam.numberOfPlayers--;
      this.ownTeam[this.currentFrame.ownTeam.numberOfPlayers].attr('circle/opacity', 0);
      this.ownTeam[this.currentFrame.ownTeam.numberOfPlayers].attr('text/opacity', 0);
    }
  }

  addOwnPlayer() {
    if (this.currentFrame.ownTeam.numberOfPlayers < this.maxPlayers) {
      this.ownTeam[this.currentFrame.ownTeam.numberOfPlayers].attr('circle/opacity', 1);
      this.ownTeam[this.currentFrame.ownTeam.numberOfPlayers].attr('text/opacity', 1);
      this.currentFrame.ownTeam.numberOfPlayers++;
    }
  }

  removeOpponentPlayer() {
    if (this.currentFrame.opponentTeam.numberOfPlayers > 0) {
      this.currentFrame.opponentTeam.numberOfPlayers--;
      this.opponentTeam[this.currentFrame.opponentTeam.numberOfPlayers].attr('circle/opacity', 0);
      this.opponentTeam[this.currentFrame.opponentTeam.numberOfPlayers].attr('text/opacity', 0);
    }
  }

  addOpponentPlayer() {
    if (this.currentFrame.opponentTeam.numberOfPlayers < this.maxPlayers) {
      this.opponentTeam[this.currentFrame.opponentTeam.numberOfPlayers].attr('circle/opacity', 1);
      this.opponentTeam[this.currentFrame.opponentTeam.numberOfPlayers].attr('text/opacity', 1);
      this.currentFrame.opponentTeam.numberOfPlayers++;
    }
  }

  increasePlayerSize() {
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
    const ballCell = this.graph.getCell(this.ball);
    this.ball.resize(ballCell.size().width + 1, ballCell.size().height + 1);
  }

  decreaseBallSize() {
    const ballCell = this.graph.getCell(this.ball);
    this.ball.resize(ballCell.size().width - 1, ballCell.size().height - 1);
  }

  addFrame() {
    this.preservePositions();
    const newFrame = JSON.parse(JSON.stringify(this.model.frames[this.model.frames.length - 1]));
    const tempFrame = JSON.parse(JSON.stringify(newFrame));
    this.model.frames.push(newFrame);
    this.currentFrame = newFrame;
    this.model.frames[this.model.frames.length - 2] = tempFrame;
    this.setPositions();
  }

  changeFrameUp() {
    this.preservePositions();
    if (this.currentFrame !== this.model.frames[this.model.frames.length - 1]) {
      const tempFrame = JSON.parse(JSON.stringify(this.currentFrame));
      const tempFrameIndex = this.model.frames.indexOf(this.currentFrame);
      this.currentFrame = this.model.frames[tempFrameIndex + 1];
      this.model.frames[tempFrameIndex] = tempFrame;
    }
    this.setPositions();
  }

  changeFrameDown() {
    this.preservePositions();
    if (this.currentFrame !== this.model.frames[0]) {
      const tempFrame = JSON.parse(JSON.stringify(this.currentFrame));
      const tempFrameIndex = this.model.frames.indexOf(this.currentFrame);
      this.currentFrame = this.model.frames[tempFrameIndex - 1];
      this.model.frames[tempFrameIndex] = tempFrame;
    }
    this.setPositions();
  }

  private preservePositions() {
    for (let i = 0; i < this.ownTeam.length; i++) {
      const playerCell = this.graph.getCell(this.ownTeam[i]);
      if (this.currentFrame.ownTeam.players.length <= i) {
        const newPlayer: IPlayerViewModel = {
          id: 0,
          position: { x: 0, y: 0 }
        };
        this.currentFrame.ownTeam.players.push(newPlayer);
      }
      this.currentFrame.ownTeam.players[i].position = {...playerCell.get('position')};
    }
    for (let i = 0; i < this.opponentTeam.length; i++) {
      const playerCell = this.graph.getCell(this.opponentTeam[i]);
      if (this.currentFrame.opponentTeam.players.length <= i) {
        const newPlayer: IPlayerViewModel = {
          id: 0,
          position: { x: 0, y: 0 }
        };
        this.currentFrame.opponentTeam.players.push(newPlayer);
      }
      this.currentFrame.opponentTeam.players[i].position = {...playerCell.get('position')};
    }
    const ballCell = this.graph.getCell(this.ball);
    this.currentFrame.ball.position = {...ballCell.prop('position')};
  }

  private setPositions() {
    for (let i = 0; i < this.currentFrame.ownTeam.players.length; i++) {
      const playerCell = this.graph.getCell(this.ownTeam[i]);
      const position = this.currentFrame.ownTeam.players[i].position;
      playerCell.position(0, 0);
      playerCell.translate(position.x, position.y);
    }
    for (let i = 0; i < this.currentFrame.opponentTeam.players.length; i++) {
      const playerCell = this.graph.getCell(this.opponentTeam[i]);
      const position = {...this.currentFrame.opponentTeam.players[i].position};
      playerCell.position(0, 0);
      playerCell.translate(position.x, position.y);
    }
    const ballCell = this.graph.getCell(this.ball);
    ballCell.position(0, 0);
    ballCell.translate(this.currentFrame.ball.position.x, this.currentFrame.ball.position.y);
  }

}

