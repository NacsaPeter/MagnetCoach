import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TacticsRoutingModule } from './tactics-routing.module';
import { TacticsListPageComponent } from './pages/tactics-list.page.component';
import { NewTacticPageComponent } from './pages/new-tactic.page.component';
import { TacticsService } from './services/tactics.service';
import { EditTacticPageComponent } from './pages/edit-tactic.page.component';

@NgModule({
  declarations: [
    TacticsListPageComponent,
    NewTacticPageComponent,
    EditTacticPageComponent,
  ],
  imports: [
    SharedModule,
    TacticsRoutingModule,
  ],
  providers: [
    TacticsService,
  ]
})
export class TacticsModule { }
