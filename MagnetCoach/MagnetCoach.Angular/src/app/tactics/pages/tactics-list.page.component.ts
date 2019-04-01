import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './tactics-list.page.component.html'
})
export class TacticsListPageComponent {

    constructor(
        private router: Router
    ) {}

    newTactic() {
        this.router.navigateByUrl('tactics/new');
    }

}
