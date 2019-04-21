import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TacticsListPageComponent } from './pages/tactics-list.page.component';
import { NewTacticPageComponent } from './pages/new-tactic.page.component';
import { EditTacticPageComponent } from './pages/edit-tactic.page.component';
import { AuthGuard } from '../core/guards/auth.guards';

const routes: Routes = [
  { path: '', component: TacticsListPageComponent, canActivate: [AuthGuard]  },
  { path: 'new', component: NewTacticPageComponent, canActivate: [AuthGuard]  },
  { path: 'edit/:id', component: EditTacticPageComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TacticsRoutingModule { }
