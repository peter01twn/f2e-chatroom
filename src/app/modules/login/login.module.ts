import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterFormComponent } from './register-form/register-form.component';

@NgModule({
  declarations: [LoginComponent, RegisterFormComponent],
  imports: [CommonModule, SharedModule],
})
export class LoginModule {}
