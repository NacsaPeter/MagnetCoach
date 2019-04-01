import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TacticsListPageComponent } from './pages/tactics-list.page.component';
import { NewTacticPageComponent } from './pages/new-tactic.page.component';

const routes: Routes = [
  { path: '', component: TacticsListPageComponent },
  { path: 'new', component: NewTacticPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TacticsRoutingModule { }
