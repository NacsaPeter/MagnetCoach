import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TacticsModule } from './tactics/tactics.module';
import { MainPageComponent } from './core/pages/main.page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'tactics', loadChildren: () => TacticsModule }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
