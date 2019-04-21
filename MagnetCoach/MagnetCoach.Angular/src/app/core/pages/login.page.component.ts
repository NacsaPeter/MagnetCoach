import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import * as jwt_decode from 'jwt-decode';
import { ILoginUserDto } from '../dtos/user-dto.model';

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

    LoginUser() {
        this.userService.loginUser(this.user).subscribe(
            (response: any) => {
                this.successLogin(response);
                localStorage.setItem('loginType', 'register');
            },
            (err: HttpErrorResponse) => {
                if (err.status === 400) {
                    this.isLoginError = true;
                } else {
                    throw err;
                }
            }
        );
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
