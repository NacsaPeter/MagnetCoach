import { Component, OnInit } from '@angular/core';
import * as jQuery from 'jquery';
import * as _ from 'lodash';
import * as joint from 'node_modules/jointjs/dist/joint.js';
import { IFrameViewModel, ITacticViewModel, ITeamViewModel, IPlayerViewModel, IPositionViewModel } from '../models/sport.enum';
import { TacticsService } from '../services/tactics.service';
import { ActivatedRoute } from '@angular/router';
import { finalize, map, concatMap, filter, tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { DeleteItemComponent } from 'src/app/shared/components/delete-item.component';

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

    isLoading: boolean;

    constructor(
        private route: ActivatedRoute,
        private service: TacticsService,
        private dialog: MatDialog,
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

        this.getTactic().subscribe();
    }

    private setUpFrame() {
        this.ball = new joint.shapes.basic.Circle({
            position: { ...this.currentFrame.ball.position },
            size: { width: this.currentFrame.ball.size, height: this.currentFrame.ball.size },
            attrs: { circle: { fill: this.currentFrame.ball.color.shirtColor, opacity: this.currentFrame.ball.visible ? 1 : 0 } }
        });
        this.ownTeam = this.createTeam(this.currentFrame.ownTeam);
        this.opponentTeam = this.createTeam(this.currentFrame.opponentTeam);

        this.graph.clear();
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
        newFrame.id = 0;
        newFrame.ball.id = 0;
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
                const firstFrame = this.tactic.frames[0];
                const ball = new joint.shapes.basic.Circle({
                    position: { ...lastFrame.ball.position },
                    size: { width: lastFrame.ball.size, height: lastFrame.ball.size },
                    attrs: { circle: { fill: firstFrame.ball.color.shirtColor, opacity: firstFrame.ball.visible ? 0.5 : 0 } }
                });
                this.graph.addCell(ball);
                const ballLink = new joint.shapes.standard.Link({
                    source: this.ball,
                    target: ball,
                    attrs: { line: { stroke: firstFrame.ball.color.shirtColor, strokeWidth: 3, strokeDasharray: '3 3' } },
                    vertices: ballLinkVertices,
                    connector: { name: 'rounded' },
                    smooth: true
                });
                this.graph.addCell(ballLink);
                const player = new joint.shapes.basic.Circle({
                    position: { x: 0, y: 0},
                    size: { width: this.tactic.playerSize, height: this.tactic.playerSize },
                    attrs: {
                        circle: { fill: firstFrame.ownTeam.color.shirtColor, opacity: 0.5 },
                        text: { text: '0', fill: firstFrame.ownTeam.color.numberColor }
                    }
                });
                for (let i = 1; i <= lastFrame.ownTeam.players.length; i++) {
                    const newPlayer = player.clone() as joint.shapes.basic.Circle;
                    const position = { ...lastFrame.ownTeam.players[i - 1].position };
                    newPlayer.translate(position.x, position.y);
                    newPlayer.attr('text/text', lastFrame.ownTeam.players[i - 1].number);
                    if (this.tactic.hasGoalkeeper && !lastFrame.ownTeam.emptyGoal && lastFrame.ownTeam.players[i - 1].number === 1) {
                        newPlayer.attr('circle/fill', firstFrame.ownTeam.goalKeeperColor.shirtColor);
                        newPlayer.attr('text/fill', firstFrame.ownTeam.goalKeeperColor.numberColor);
                    }
                    this.graph.addCell(newPlayer);
                    const oldPlayer = this.ownTeam[i - 1];
                    const link = new joint.shapes.standard.Link({
                        source: oldPlayer,
                        target: newPlayer,
                        attrs: { line: { stroke: firstFrame.ownTeam.color.shirtColor, strokeWidth: 3 } },
                        vertices: ownTeamLinkVertices[i - 1],
                        connector: { name: 'rounded' },
                        smooth: true
                    });
                    if (this.tactic.hasGoalkeeper && !lastFrame.ownTeam.emptyGoal && lastFrame.ownTeam.players[i - 1].number === 1) {
                        link.attr('line/stroke', firstFrame.ownTeam.goalKeeperColor.shirtColor);
                    }
                    this.graph.addCell(link);
                }
                player.attr('circle/fill', lastFrame.opponentTeam.color.shirtColor);
                for (let i = 1; i <= lastFrame.opponentTeam.players.length; i++) {
                    const newPlayer = player.clone() as joint.shapes.basic.Circle;
                    const position = { ...lastFrame.opponentTeam.players[i - 1].position };
                    newPlayer.translate(position.x, position.y);
                    newPlayer.attr('text/text', lastFrame.opponentTeam.players[i - 1].number);
                    if (this.tactic.hasGoalkeeper && !lastFrame.opponentTeam.emptyGoal
                            && lastFrame.opponentTeam.players[i - 1].number === 1) {
                        newPlayer.attr('circle/fill', firstFrame.opponentTeam.goalKeeperColor.shirtColor);
                        newPlayer.attr('text/fill', firstFrame.opponentTeam.goalKeeperColor.numberColor);
                    }
                    this.graph.addCell(newPlayer);
                    const oldPlayer = this.opponentTeam[i - 1];
                    const link = new joint.shapes.standard.Link({
                        source: oldPlayer,
                        target: newPlayer,
                        attrs: { line: { stroke: firstFrame.opponentTeam.color.shirtColor, strokeWidth: 3 } },
                        vertices: opponentTeamLinkVertices[i - 1],
                        connector: { name: 'rounded' },
                        smooth: true
                    });
                    if (this.tactic.hasGoalkeeper && !lastFrame.opponentTeam.emptyGoal
                            && lastFrame.opponentTeam.players[i - 1].number === 1) {
                        link.attr('line/stroke', firstFrame.opponentTeam.goalKeeperColor.shirtColor);
                    }
                    this.graph.addCell(link);
                }
            }
        } else {
            this.preservePositions();
            this.setUpFrame();
        }
    }

    saveTactic() {
        this.preservePositions();
        for (let i = 0; i < this.tactic.frames.length; i++) {
            this.tactic.frames[i].order = i + 1;
        }
        const userId = +localStorage.getItem('userId');
        this.isLoading = true;
        this.service.saveTactic(this.tactic, userId, this.tactic.id).pipe(
            concatMap(() => this.getTactic()),
            finalize(() => this.isLoading = false)
        ).subscribe();
    }

    getTactic(): Observable<void> {
        const userId = +localStorage.getItem('userId');
        const tacticId = +this.route.snapshot.paramMap.get('id');
        this.isLoading = true;
        return this.service.getTactic(userId, tacticId).pipe(
            map(res => {
                this.tactic = res;
                this.currentFrame = this.tactic.frames[0];
                this.setUpFrame();
            }),
            finalize(() => this.isLoading = false)
        );
    }

    deleteFrame() {
        const userId = +localStorage.getItem('userId');
        const dialogRef = this.dialog.open(DeleteItemComponent,
            {
                data:
                {
                    item: {...this.currentFrame},
                    itemName: `Frame ${this.currentFrame.id}`
                }
            }
        );
        dialogRef.afterClosed().pipe(
            tap(() => this.isLoading = true),
            filter(result => !!result),
            concatMap(result => this.service.deleteFrame(userId, this.tactic.id, this.currentFrame.id)),
            concatMap(() => this.getTactic()),
            catchError(err => of(console.log(err))),
            finalize(() => this.isLoading = false)
        ).subscribe();
    }

    play() {
        this.setUpFrame();
        const steps = [];
        for (let k = 0; k < this.tactic.frames[0].ownTeam.players.length; k++) {
            const inSteps = [];
            for (let i = 1; i < this.tactic.frames.length; i++) {
                const previousPosition = this.tactic.frames[i - 1].ownTeam.players[k].position;
                const currentPostion = this.tactic.frames[i].ownTeam.players[k].position;
                const div = 15;
                const vec = this.createVector(currentPostion, previousPosition, div);
                for (let j = 1; j < div; j++) {
                    inSteps.push({ x: previousPosition.x + vec.x * j, y: previousPosition.y + vec.y * j });
                }
                inSteps.push({ x: currentPostion.x, y: currentPostion.y });
            }
            steps.push(inSteps);
        }
        for (let k = 0; k < this.tactic.frames[0].opponentTeam.players.length; k++) {
            const inSteps = [];
            for (let i = 1; i < this.tactic.frames.length; i++) {
                const previousPosition = this.tactic.frames[i - 1].opponentTeam.players[k].position;
                const currentPostion = this.tactic.frames[i].opponentTeam.players[k].position;
                const div = 15;
                const vec = this.createVector(currentPostion, previousPosition, div);
                for (let j = 1; j < div; j++) {
                    inSteps.push({ x: previousPosition.x + vec.x * j, y: previousPosition.y + vec.y * j });
                }
                inSteps.push({ x: currentPostion.x, y: currentPostion.y });
            }
            steps.push(inSteps);
        }
        const iSteps = [];
        for (let i = 1; i < this.tactic.frames.length; i++) {
            const previousPosition = this.tactic.frames[i - 1].ball.position;
            const currentPostion = this.tactic.frames[i].ball.position;
            const div = 15;
            const vec = this.createVector(currentPostion, previousPosition, div);
            for (let j = 1; j < div; j++) {
                iSteps.push({ x: previousPosition.x + vec.x * j, y: previousPosition.y + vec.y * j });
            }
            iSteps.push({ x: currentPostion.x, y: currentPostion.y });
        }
        steps.push(iSteps);
        const items = [];
        for (const item of this.ownTeam) {
            items.push(item);
        }
        for (const item of this.opponentTeam) {
            items.push(item);
        }
        items.push(this.ball);

        const maxLoops = steps[0].length;
        let counter = 0;

        (function next() {
            if (counter++ >= maxLoops) { return; }

            setTimeout(() => {
                // player.position(0, 0);
                // player.translate(steps[counter - 1].x, steps[counter - 1].y);
                for (let i = 0; i < steps.length; i++) {
                    items[i].position(0, 0);
                    items[i].translate(steps[i][counter - 1].x, steps[i][counter - 1].y);
                }

                next();
            }, 50);

        })();
    }

    createVector(
        currentPostion: IPositionViewModel,
        previousPosition: IPositionViewModel,
        div: number
    ): IPositionViewModel {

        return {
            x: (currentPostion.x - previousPosition.x) / div,
            y: (currentPostion.y - previousPosition.y) / div,
        };

    }

}
