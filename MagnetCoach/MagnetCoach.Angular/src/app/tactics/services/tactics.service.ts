import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { ITacticsListViewModel, ITacticsListItemViewModel } from '../models/tactics-list.model';
import { ITacticViewModel, ICreateTacticViewModel, IPlayerViewModel, IFrameViewModel } from '../models/sport.enum';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUserTacticListDto, IUserTacticListItemDto } from '../dtos/tactics-list-dtos.model';
import { ICreateTacticDto, ICreatePlayerDto } from '../dtos/create-tactic-dto.model';
import { ITacticDto, IFrameDto, IPlayerDto } from '../dtos/tactic-dto.model';

@Injectable()
export class TacticsService {

    constructor(
        private http: HttpClient,
    ) { }

    getTactics = (userId: number): Observable<ITacticsListViewModel> =>
        this.http.get<IUserTacticListDto>(`https://localhost:5001/api/tactic/${userId}`).pipe(
            map((dto: IUserTacticListDto): ITacticsListViewModel => ({
                userId: dto.userId,
                items: dto.userTactics.map((item: IUserTacticListItemDto): ITacticsListItemViewModel => ({
                    id: item.tacticId,
                    name: item.tacticName,
                    sport: item.sport,
                    arenaPart: item.arenaPart,
                    ownPlayers: item.ownPlayers,
                    opponentPlayers: item.opponentPlayers,
                    emptyGoal: item.isEmptyGoal
                }))
            }))
        )

    createTactic = (tactic: ICreateTacticViewModel): Observable<any> => {
        const dto: ICreateTacticDto = {
            userId: 1,
            name: tactic.name,
            sportId: tactic.sportId,
            arenaPart: tactic.pitchPart,
            playerSize: tactic.playerSize,
            ball: {
                isVisible: tactic.frame.ball.visible,
                size: tactic.frame.ball.size,
                position: {
                    x: tactic.frame.ball.position.x,
                    y: tactic.frame.ball.position.y
                }
            },
            ownTeam: {
                colorId: tactic.frame.ownTeam.color.id,
                goalkeeperColorId: tactic.frame.ownTeam.goalKeeperColor.id,
                emptyGoal: tactic.frame.ownTeam.emptyGoal,
                players: tactic.frame.ownTeam.players.map((player: IPlayerViewModel): ICreatePlayerDto => ({
                    number: player.number,
                    position: {
                        x: player.position.x,
                        y: player.position.y
                    }
                }))
            },
            opponentTeam: {
                colorId: tactic.frame.opponentTeam.color.id,
                goalkeeperColorId: tactic.frame.opponentTeam.goalKeeperColor.id,
                emptyGoal: tactic.frame.opponentTeam.emptyGoal,
                players: tactic.frame.opponentTeam.players.map((player: IPlayerViewModel): ICreatePlayerDto => ({
                    number: player.number,
                    position: {
                        x: player.position.x,
                        y: player.position.y
                    }
                }))
            }
        };
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.post<any>(`https://localhost:5001/api/tactic`, dto, httpOptions);
    }

    getTactic = (userId: number, tacticId: number): Observable<ITacticViewModel> =>
        this.http.get<ITacticDto>(`https://localhost:5001/api/tactic/${userId}/${tacticId}`).pipe(
            tap(x => console.log(x)),
            map((dto: ITacticDto): ITacticViewModel => ({
                id: dto.id,
                sportName: dto.sportName,
                hasGoalkeeper: dto.hasGoalkeeper,
                pitchPart: dto.arenaPart,
                playerSize: dto.playerSize,
                frames: dto.frames.map((frame: IFrameDto): IFrameViewModel => ({
                    id: frame.id,
                    ball: {
                        size: frame.ball.size,
                        position: {
                            x: frame.ball.position.x,
                            y: frame.ball.position.y
                        },
                        visible: frame.ball.isVisible,
                        color: {
                            id: frame.ball.color.id,
                            numberColor: frame.ball.color.numberColor,
                            shirtColor: frame.ball.color.shirtColor
                        }
                    },
                    ownTeam: {
                        id: frame.ownTeam.id,
                        color: {
                            id: frame.ownTeam.color.id,
                            shirtColor: frame.ownTeam.color.shirtColor,
                            numberColor: frame.ownTeam.color.numberColor
                        },
                        goalKeeperColor: {
                            id: frame.ownTeam.goalkeeperColor.id,
                            shirtColor: frame.ownTeam.goalkeeperColor.shirtColor,
                            numberColor: frame.ownTeam.goalkeeperColor.numberColor
                        },
                        numberOfPlayers: frame.ownTeam.players.length,
                        emptyGoal: frame.ownTeam.emptyGoal,
                        players: frame.ownTeam.players.map((player: IPlayerDto): IPlayerViewModel => ({
                            id: player.id,
                            number: player.number,
                            position: {
                                x: player.position.x,
                                y: player.position.y
                            }
                        }))
                    },
                    opponentTeam: {
                        id: frame.opponentTeam.id,
                        color: {
                            id: frame.opponentTeam.color.id,
                            shirtColor: frame.opponentTeam.color.shirtColor,
                            numberColor: frame.opponentTeam.color.numberColor
                        },
                        goalKeeperColor: {
                            id: frame.opponentTeam.goalkeeperColor.id,
                            shirtColor: frame.opponentTeam.goalkeeperColor.shirtColor,
                            numberColor: frame.opponentTeam.goalkeeperColor.numberColor
                        },
                        numberOfPlayers: frame.opponentTeam.players.length,
                        emptyGoal: frame.opponentTeam.emptyGoal,
                        players: frame.opponentTeam.players.map((player: IPlayerDto): IPlayerViewModel => ({
                            id: player.id,
                            number: player.number,
                            position: {
                                x: player.position.x,
                                y: player.position.y
                            }
                        }))
                    },
                }))
            }))
        )

}
