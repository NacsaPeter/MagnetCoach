import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  constructor(
    private router: Router
  ) {}

  navigateTactics() {
      this.router.navigateByUrl('/tactics');
  }

  navigateHome() {
    this.router.navigateByUrl('/');
  }

  logOut() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  loggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }
}
