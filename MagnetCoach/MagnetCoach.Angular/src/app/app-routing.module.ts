import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TacticsModule } from './tactics/tactics.module';

const routes: Routes = [
  { path: 'tactics', loadChildren: () => TacticsModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
