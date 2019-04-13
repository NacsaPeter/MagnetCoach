import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { ITacticsListViewModel, ITacticsListItemViewModel } from '../models/tactics-list.model';
import { ITacticViewModel, Sport, PitchPart } from '../models/sport.enum';
import { HttpClient } from '@angular/common/http';
import { IUserTacticListDto, IUserTacticListItemDto } from '../dtos/tactics-list-dtos.model';

const listMock: ITacticsListViewModel = {
    userId: 1,
    items: [
        {
            id: 1,
            name: 'Test Tactic 1',
            sport: 'Football',
            arenaPart: 'Full',
            ownPlayers: 11,
            opponentPlayers: 11,
            emptyGoal: false
        },
        {
            id: 2,
            name: 'Test Tactic 2',
            sport: 'Football',
            arenaPart: 'Endzone',
            ownPlayers: 8,
            opponentPlayers: 7,
            emptyGoal: false
        },
        {
            id: 3,
            name: 'Test Tactic 3',
            sport: 'Handball',
            arenaPart: 'Endzone',
            ownPlayers: 7,
            opponentPlayers: 7,
            emptyGoal: true
        },
        {
            id: 4,
            name: 'Test Tactic 4',
            sport: 'Ice Hockey',
            arenaPart: 'Full',
            ownPlayers: 6,
            opponentPlayers: 6,
            emptyGoal: false
        },
        {
            id: 5,
            name: 'Test Tactic 5',
            sport: 'Football',
            arenaPart: 'Full',
            ownPlayers: 11,
            opponentPlayers: 11,
            emptyGoal: false
        },
        {
            id: 6,
            name: 'Test Tactic 6',
            sport: 'Basketball',
            arenaPart: 'Endzone',
            ownPlayers: 5,
            opponentPlayers: 5,
            emptyGoal: false
        },
        {
            id: 7,
            name: 'Test Tactic 7',
            sport: 'American Football',
            arenaPart: 'Full',
            ownPlayers: 11,
            opponentPlayers: 11,
            emptyGoal: false
        },
    ]
};

const tacticMock: ITacticViewModel = {
    id: 1,
    sport: Sport.football,
    pitchPart: PitchPart.full,
    playerSize: 50,
    frames: [
        {
            id: 1,
            ball: {
                size: 30,
                position: { x: 482, y: 332 },
                visible: true
            },
            ownTeam: {
                id: 1,
                color: 'red',
                numberOfPlayers: 0,
                players: [
                    {
                        id: 1,
                        position: { x: 50, y: 325 }
                    },
                    {
                        id: 2,
                        position: { x: 150, y: 62 }
                    },
                    {
                        id: 3,
                        position: { x: 150, y: 237 }
                    },
                    {
                        id: 4,
                        position: { x: 150, y: 412 }
                    },
                    {
                        id: 5,
                        position: { x: 150, y: 587 }
                    },
                    {
                        id: 6,
                        position: { x: 275, y: 62 }
                    },
                    {
                        id: 7,
                        position: { x: 275, y: 237 }
                    },
                    {
                        id: 8,
                        position: { x: 275, y: 412 }
                    },
                    {
                        id: 9,
                        position: { x: 275, y: 587 }
                    },
                    {
                        id: 10,
                        position: { x: 375, y: 237 }
                    },
                    {
                        id: 11,
                        position: { x: 375, y: 412 }
                    },
                ]
            },
            opponentTeam: {
                id: 2,
                color: 'blue',
                numberOfPlayers: 0,
                players: [
                    {
                        id: 12,
                        position: { x: 1000 - 75, y: 325 }
                    },
                    {
                        id: 13,
                        position: { x: 1000 - 200, y: 62 }
                    },
                    {
                        id: 14,
                        position: { x: 1000 - 200, y: 237 }
                    },
                    {
                        id: 15,
                        position: { x: 1000 - 200, y: 412 }
                    },
                    {
                        id: 16,
                        position: { x: 1000 - 200, y: 587 }
                    },
                    {
                        id: 17,
                        position: { x: 1000 - 325, y: 62 }
                    },
                    {
                        id: 18,
                        position: { x: 1000 - 325, y: 237 }
                    },
                    {
                        id: 19,
                        position: { x: 1000 - 325, y: 412 }
                    },
                    {
                        id: 20,
                        position: { x: 1000 - 325, y: 587 }
                    },
                    {
                        id: 21,
                        position: { x: 1000 - 425, y: 237 }
                    },
                    {
                        id: 22,
                        position: { x: 1000 - 425, y: 412 }
                    },
                ]
            }
        }
    ]
};

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

    getTactic = (id: number): Observable<ITacticViewModel> =>
        of(tacticMock)

}
