import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IRegisterUserDto, ILoginUserDto } from '../dtos/user-dto.model';


@Injectable()
export class UserService {

    constructor(
        private http: HttpClient
    ) { }

    public registerUser(user: IRegisterUserDto): Observable<any> {
        return this.http.post<any>('https://localhost:5001/api/user/signup', user)
            .pipe(catchError((error) => {
                return throwError(error);
            }));
    }

    public loginUser(user: ILoginUserDto): Observable<any> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        };
        return this.http.post<any>('https://localhost:5001/api/user/login', user, httpOptions)
            .pipe(catchError((error) => {
                return throwError(error);
            }));
    }

}
