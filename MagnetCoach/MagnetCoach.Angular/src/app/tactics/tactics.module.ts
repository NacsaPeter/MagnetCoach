import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TacticsRoutingModule } from './tactics-routing.module';
import { TacticsListPageComponent } from './pages/tactics-list.page.component';
import { NewTacticPageComponent } from './pages/new-tactic.page.component';

@NgModule({
  declarations: [
    TacticsListPageComponent,
    NewTacticPageComponent,
  ],
  imports: [
    SharedModule,
    TacticsRoutingModule,
  ],
  providers: [
  ]
})
export class TacticsModule { }
