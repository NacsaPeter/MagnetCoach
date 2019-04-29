import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ISportsDto, IColorDto, ISportDetailsDto, IFormationDto } from '../dtos/sports-dto.model';
import { ISportsViewModel, IColorViewModel, ISportDetailsViewModel, IFormationViewModel } from '../models/sports.model';

// export const baseUrl = 'https://localhost:5001';
export const baseUrl = 'https://magnetcoachapi.azurewebsites.net';

@Injectable()
export class SportsService {

    constructor(
        private http: HttpClient,
    ) { }

    getSports = (): Observable<ISportsViewModel> =>
        this.http.get<ISportsDto>(`${baseUrl}/api/sport`,
        { headers: new HttpHeaders({ Authorization: 'Bearer ' + localStorage.getItem('userToken')}) }
        ).pipe(
            map((dto: ISportsDto): ISportsViewModel => ({
                colors: dto.colors.map((color: IColorDto): IColorViewModel => ({
                    id: color.id,
                    shirtColor: color.shirtColor,
                    numberColor: color.numberColor
                })),
                sports: dto.sports.map((sport: ISportDetailsDto): ISportDetailsViewModel => ({
                    id: sport.id,
                    name: sport.name,
                    maxPlayers: sport.maxPlayers,
                    hasGoalkeeper: sport.hasGoalkeeper,
                    hasEmptyGoal: sport.hasEmptyGoal,
                    formations: sport.formations.map((formation: IFormationDto): IFormationViewModel => ({
                        id: formation.id,
                        name: formation.name,
                        lines: formation.lines
                    }))
                }))
            }))
        )

}
