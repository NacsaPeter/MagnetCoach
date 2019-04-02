import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TacticsService } from '../services/tactics.service';
import { ITacticsListViewModel } from '../models/tactics-list.model';

@Component({
  templateUrl: './tactics-list.page.component.html'
})
export class TacticsListPageComponent implements OnInit {

    list: ITacticsListViewModel = {
        userId: null,
        items: []
    };

    constructor(
        private router: Router,
        private service: TacticsService
    ) {}

    ngOnInit() {
        this.service.getTactics(1).subscribe(res => this.list = res);
    }

    newTactic() {
        this.router.navigateByUrl('tactics/new');
    }

    navigateEdit(id: number) {
        this.router.navigate(['tactics/edit', id]);
    }

}
