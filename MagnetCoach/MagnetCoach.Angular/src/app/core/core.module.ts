import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './header/header.component';
import { MainPageComponent } from './pages/main.page.component';

@NgModule({
  declarations: [
    HeaderComponent,
    MainPageComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    HeaderComponent,
    MainPageComponent,
  ],
  providers: [

  ],
  entryComponents: [

  ]
})
export class CoreModule { }
