import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { IRegisterUserDto } from '../dtos/user-dto.model';
import { concatMap, catchError, finalize } from 'rxjs/operators';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.component.html'
})
export class RegisterPageComponent {

    user: IRegisterUserDto = {
        userName: null,
        firstName: null,
        lastName: null,
        prefix: null,
        email: null,
        password: null,
        birthDay: new Date()
    };

    errorMessage: string;
    isLoading: boolean;

    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    registerUser() {
        this.isLoading = true;
        this.userService.registerUser(this.user).pipe(
            concatMap(() => this.router.navigate(['/login'])),
            catchError(err => this.errorMessage = err.error),
            finalize(() => this.isLoading = false)
        )
        .subscribe();
    }
}
