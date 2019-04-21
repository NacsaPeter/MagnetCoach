import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as joint from 'node_modules/jointjs/dist/joint.js';
import { IFrameViewModel, ITacticViewModel, ITeamViewModel, IPlayerViewModel } from '../models/sport.enum';
import { TacticsService } from '../services/tactics.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './edit-tactic.page.component.html'
})
export class EditTacticPageComponent implements OnInit {

    graph: any;
    paperWidth: number;
    paperHeight: number;

    ownTeam: any[];
    opponentTeam: any[];
    ball: any;

    tactic: ITacticViewModel;
    currentFrame: IFrameViewModel;

    showRoutes: boolean;

    constructor(
        private route: ActivatedRoute,
        private service: TacticsService
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

        this.service.getTactic(+localStorage.getItem('userId'), +this.route.snapshot.paramMap.get('id')).subscribe(res => {
            this.tactic = res;
            this.currentFrame = this.tactic.frames[0];
            this.setUpFrame();
        });
    }

    private setUpFrame() {
        this.ball = new joint.shapes.basic.Circle({
            position: { ...this.currentFrame.ball.position },
            size: { width: this.currentFrame.ball.size, height: this.currentFrame.ball.size },
            attrs: { circle: { fill: this.currentFrame.ball.color.shirtColor, opacity: this.currentFrame.ball.visible ? 1 : 0 } }
        });
        this.ownTeam = this.createTeam(this.currentFrame.ownTeam);
        this.opponentTeam = this.createTeam(this.currentFrame.opponentTeam);

        this.graph.addCells(this.ownTeam);
        this.graph.addCells(this.opponentTeam);
        this.graph.addCell(this.ball);
    }

    private createTeam(team: ITeamViewModel): any[] {
        const gteam = [];
        const player = new joint.shapes.basic.Circle({
          position: { x: 0, y: 0},
          size: { width: this.tactic.playerSize, height: this.tactic.playerSize },
          attrs: { circle: { fill: team.color.shirtColor }, text: { text: '0', fill: team.color.numberColor } }
        });
        for (let i = 1; i <= team.players.length; i++) {
          const newPlayer = player.clone() as joint.shapes.basic.Circle;
          newPlayer.translate(team.players[i - 1].position.x, team.players[i - 1].position.y);
          newPlayer.attr('text/text', team.players[i - 1].number);
          if (this.tactic.hasGoalkeeper && !team.emptyGoal && team.players[i - 1].number === 1) {
            newPlayer.attr('circle/fill', team.goalKeeperColor.shirtColor);
            newPlayer.attr('text/fill', team.goalKeeperColor.numberColor);
          }
          gteam.push(newPlayer);
        }
        return gteam;
    }

    addFrame() {
        this.preservePositions();
        const index = this.tactic.frames.indexOf(this.currentFrame);
        const newFrame = JSON.parse(JSON.stringify(this.tactic.frames[this.tactic.frames.length - 1]));
        if (index + 1 === this.tactic.frames.length) {
            this.tactic.frames.push(newFrame);
        } else {
            const nextFrame = this.tactic.frames[index + 1];
            newFrame.ball.position = {
                x: (this.currentFrame.ball.position.x + nextFrame.ball.position.x) / 2,
                y: (this.currentFrame.ball.position.y + nextFrame.ball.position.y) / 2
            };
            for (let i = 0; i < newFrame.ownTeam.players.length; i++) {
                const player = newFrame.ownTeam.players[i];
                player.position = {
                    x: (this.currentFrame.ownTeam.players[i].position.x + nextFrame.ownTeam.players[i].position.x) / 2,
                    y: (this.currentFrame.ownTeam.players[i].position.y + nextFrame.ownTeam.players[i].position.y) / 2
                };
            }
            for (let i = 0; i < newFrame.opponentTeam.players.length; i++) {
                const player = newFrame.opponentTeam.players[i];
                player.position = {
                    x: (this.currentFrame.opponentTeam.players[i].position.x + nextFrame.opponentTeam.players[i].position.x) / 2,
                    y: (this.currentFrame.opponentTeam.players[i].position.y + nextFrame.opponentTeam.players[i].position.y) / 2
                };
            }
            this.tactic.frames.splice(index + 1, 0, newFrame);
        }
        this.currentFrame = newFrame;
        this.setPositions();
    }

    changeFrameUp() {
        this.preservePositions();
        if (this.currentFrame !== this.tactic.frames[this.tactic.frames.length - 1]) {
            const tempFrame = JSON.parse(JSON.stringify(this.currentFrame));
            const tempFrameIndex = this.tactic.frames.indexOf(this.currentFrame);
            this.currentFrame = this.tactic.frames[tempFrameIndex + 1];
            this.tactic.frames[tempFrameIndex] = tempFrame;
            if (this.showRoutes) {
                this.graph.clear();
                this.setUpFrame();
                this.changeShowRoutes();
            }
        }
        this.setPositions();
    }

    changeFrameDown() {
        this.preservePositions();
        if (this.currentFrame !== this.tactic.frames[0]) {
            const tempFrame = JSON.parse(JSON.stringify(this.currentFrame));
            const tempFrameIndex = this.tactic.frames.indexOf(this.currentFrame);
            this.currentFrame = this.tactic.frames[tempFrameIndex - 1];
            this.tactic.frames[tempFrameIndex] = tempFrame;
            if (this.showRoutes) {
                this.graph.clear();
                this.setUpFrame();
                this.changeShowRoutes();
            }
        }
        this.setPositions();
    }

    private preservePositions() {
        for (let i = 0; i < this.ownTeam.length; i++) {
            const playerCell = this.graph.getCell(this.ownTeam[i]);
            if (this.currentFrame.ownTeam.players.length <= i) {
                const newPlayer: IPlayerViewModel = {
                    id: 0,
                    number: i + 1,
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
                    number: i + 1,
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

    changeShowRoutes() {
        if (this.showRoutes) {
            const index = this.tactic.frames.indexOf(this.currentFrame);
            if (index + 1 < this.tactic.frames.length) {
                const ballLinkVertices = [];
                const ownTeamLinkVertices = this.ownTeam.map(v => []);
                const opponentTeamLinkVertices = this.opponentTeam.map(v => []);
                for (let i = index + 1; i < this.tactic.frames.length - 1; i++) {
                    const ballRef = this.tactic.frames[i].ball;
                    const playerSize = this.tactic.playerSize;
                    ballLinkVertices.push(new joint.g.Point(
                        ballRef.position.x + ballRef.size / 2,
                        ballRef.position.y + ballRef.size / 2
                    ));
                    for (let p = 0; p < this.tactic.frames[i].ownTeam.players.length; p ++) {
                        const playerRef = this.tactic.frames[i].ownTeam.players[p];
                        ownTeamLinkVertices[p].push(new joint.g.Point(
                            playerRef.position.x + playerSize / 2,
                            playerRef.position.y + playerSize / 2
                        ));
                    }
                    for (let p = 0; p < this.tactic.frames[i].opponentTeam.players.length; p ++) {
                        const playerRef = this.tactic.frames[i].opponentTeam.players[p];
                        opponentTeamLinkVertices[p].push(new joint.g.Point(
                            playerRef.position.x + playerSize / 2,
                            playerRef.position.y + playerSize / 2
                        ));
                    }
                }
                const lastFrame = this.tactic.frames[this.tactic.frames.length - 1];
                const ball = new joint.shapes.basic.Circle({
                    position: { ...lastFrame.ball.position },
                    size: { width: lastFrame.ball.size, height: lastFrame.ball.size },
                    attrs: { circle: { fill: 'black', opacity: lastFrame.ball.visible ? 0.5 : 0 } }
                });
                this.graph.addCell(ball);
                const ballLink = new joint.shapes.standard.Link({
                    source: this.ball,
                    target: ball,
                    attrs: { line: { stroke: 'black', strokeWidth: 3, strokeDasharray: '3 3' } },
                    vertices: ballLinkVertices,
                    connector: { name: 'rounded' },
                    smooth: true
                });
                this.graph.addCell(ballLink);
                const player = new joint.shapes.basic.Circle({
                    position: { x: 0, y: 0},
                    size: { width: this.tactic.playerSize, height: this.tactic.playerSize },
                    attrs: { circle: { fill: lastFrame.ownTeam.color, opacity: 0.5 }, text: { text: '0', fill: 'white' } }
                });
                for (let i = 1; i <= lastFrame.ownTeam.players.length; i++) {
                    const newPlayer = player.clone() as joint.shapes.basic.Circle;
                    const position = { ...lastFrame.ownTeam.players[i - 1].position };
                    newPlayer.translate(position.x, position.y);
                    newPlayer.attr('text/text', i);
                    if (i === 1 && !lastFrame.ownTeam.emptyGoal) {
                        newPlayer.attr('circle/fill', 'yellow');
                        newPlayer.attr('text/fill', 'black');
                    }
                    this.graph.addCell(newPlayer);
                    const oldPlayer = this.ownTeam[i - 1];
                    const link = new joint.shapes.standard.Link({
                        source: oldPlayer,
                        target: newPlayer,
                        attrs: { line: { stroke: lastFrame.ownTeam.color, strokeWidth: 3 } },
                        vertices: ownTeamLinkVertices[i - 1],
                        connector: { name: 'rounded' },
                        smooth: true
                    });
                    this.graph.addCell(link);
                }
                player.attr('circle/fill', lastFrame.opponentTeam.color);
                for (let i = 1; i <= lastFrame.opponentTeam.players.length; i++) {
                    const newPlayer = player.clone() as joint.shapes.basic.Circle;
                    const position = { ...lastFrame.opponentTeam.players[i - 1].position };
                    newPlayer.translate(position.x, position.y);
                    newPlayer.attr('text/text', i);
                    if (i === 1 && !lastFrame.opponentTeam.emptyGoal) {
                        newPlayer.attr('circle/fill', 'yellow');
                        newPlayer.attr('text/fill', 'black');
                    }
                    this.graph.addCell(newPlayer);
                    const oldPlayer = this.opponentTeam[i - 1];
                    const link = new joint.shapes.standard.Link({
                        source: oldPlayer,
                        target: newPlayer,
                        attrs: { line: { stroke: lastFrame.opponentTeam.color, strokeWidth: 3 } },
                        vertices: opponentTeamLinkVertices[i - 1],
                        connector: { name: 'rounded' },
                        smooth: true
                    });
                    this.graph.addCell(link);
                }
            }
        } else {
            this.preservePositions();
            this.graph.clear();
            this.setUpFrame();
        }
    }

}
