import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    templateUrl: 'delete-item.component.html',
})
export class DeleteItemComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { item: any, itemName: string }
    ) { }

}
