import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TacticsService } from '../services/tactics.service';
import { ITacticsListViewModel, ITacticsListItemViewModel } from '../models/tactics-list.model';
import { mergeMap, finalize, map, filter, concatMap, tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteItemComponent } from 'src/app/shared/components/delete-item.component';

@Component({
  templateUrl: './tactics-list.page.component.html'
})
export class TacticsListPageComponent implements OnInit {

    list: ITacticsListViewModel = {
        userId: null,
        items: []
    };

    isLoading: boolean;
    userId: number;

    constructor(
        private router: Router,
        private service: TacticsService,
        private dialog: MatDialog,
    ) {}

    ngOnInit() {
        this.userId = +localStorage.getItem('userId');
        this.isLoading = true;
        this.fetchData().subscribe();
    }

    fetchData(): Observable<ITacticsListViewModel> {
        return this.service.getTactics(this.userId).pipe(
            map(res => this.list = res),
            finalize(() => of(this.isLoading = false))
        );
    }

    newTactic() {
        this.router.navigateByUrl('tactics/new');
    }

    navigateEdit(id: number) {
        this.router.navigate(['tactics/edit', id]);
    }

    deleteTactic(item: ITacticsListItemViewModel) {
        const dialogRef = this.dialog.open(DeleteItemComponent,
            {
                data:
                {
                    item: {...item},
                    itemName: item.name
                }
            }
        );
        dialogRef.afterClosed().pipe(
            tap(() => this.isLoading = true),
            filter(result => !!result),
            concatMap(result => this.service.deleteTactic(this.userId, result.id)),
            concatMap(() => this.fetchData()),
            catchError(err => of(console.log(err))),
            finalize(() => this.isLoading = false)
        ).subscribe();
    }

}
