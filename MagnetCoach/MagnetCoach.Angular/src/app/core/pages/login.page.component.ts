import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import * as jwt_decode from 'jwt-decode';
import { ILoginUserDto } from '../dtos/user-dto.model';
import { concatMap, catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.component.html'
})
export class LoginPageComponent {

    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    user: ILoginUserDto = {
        userName: '',
        password: ''
    };
    isLoginError = false;
    isLoading: boolean;

    LoginUser() {
        this.isLoading = true;
        this.userService.loginUser(this.user).pipe(
            concatMap(response => of(this.successLogin(response))),
            catchError(e => of(this.isLoginError = true)),
            finalize(() => this.isLoading = false)
        ).subscribe();
    }

    successLogin(response: any) {
        localStorage.setItem('userToken', response.token);
        localStorage.setItem('userName', jwt_decode(response.token).userName);
        localStorage.setItem('userId', jwt_decode(response.token).userId);
        this.router.navigate(['/']);
    }

    navigateToRegistration() {
        this.router.navigateByUrl('/registration');
    }
}
