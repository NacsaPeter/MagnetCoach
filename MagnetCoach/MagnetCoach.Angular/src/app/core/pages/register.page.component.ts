import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { IRegisterUserDto } from '../dtos/user-dto.model';

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

    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    registerUser() {
        this.userService.registerUser(this.user).subscribe(() => {
            this.router.navigate(['/login']);
        }, (e) => {
            if (e.status === 400) {
                this.errorMessage = e.error;
            }
        });
    }
}
