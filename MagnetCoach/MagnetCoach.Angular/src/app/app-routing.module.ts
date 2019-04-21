import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TacticsModule } from './tactics/tactics.module';
import { MainPageComponent } from './core/pages/main.page.component';
import { AuthGuard } from './core/guards/auth.guards';
import { LoginPageComponent } from './core/pages/login.page.component';
import { RegisterPageComponent } from './core/pages/register.page.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'registration', component: RegisterPageComponent },
  { path: '', component: MainPageComponent, canActivate: [AuthGuard]  },
  { path: 'tactics', loadChildren: () => TacticsModule, canActivate: [AuthGuard]  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
