import { Component, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { UserAvatars } from 'src/app/core/user-avatars';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterFormComponent {
  // tslint:disable-next-line: no-output-native
  @Output() submit = new EventEmitter();

  avatarList = Object.keys(UserAvatars);

  form = this.fb.group({
    account: '',
    password: '',
    avatar: this.avatarList[0],
  });

  get avatarControl(): FormControl {
    return this.form.get('avatar') as FormControl;
  }

  constructor(private fb: FormBuilder) {}

  _submit(): void {
    console.log(this.form.getRawValue());
    this.submit.emit(this.form.getRawValue());
  }
}
