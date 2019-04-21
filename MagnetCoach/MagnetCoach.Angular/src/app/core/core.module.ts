import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { MainPageComponent } from './pages/main.page.component';
import { AuthGuard } from './guards/auth.guards';
import { LoginPageComponent } from './pages/login.page.component';
import { UserService } from './services/user.service';
import { RegisterPageComponent } from './pages/register.page.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MainPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    HeaderComponent,
    MainPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
  ],
  providers: [
    AuthGuard,
    UserService,
  ]
})
export class CoreModule { }
