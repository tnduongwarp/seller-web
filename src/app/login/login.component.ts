import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { FormGroup, FormControl, Validators, NonNullableFormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ForgotPWForm } from '../modals/forgot-pw';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent extends BaseComponent {
  constructor(public router: Router,private fb: NonNullableFormBuilder, private modalService: NzModalService, private message: NzMessageService) {
    super();
  }
  public isLoading: boolean = false;

  override ngOnInit() {
  }
  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    remember: FormControl<boolean>;
  }> = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [true]
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      let loginBody = {
        email: this.validateForm.value.email,
        password: this.validateForm.value.password
      }
      this.api.post(this.apiUrl(this.authApiUrl)+'login',loginBody)
      .then((res: any) => {
        console.log(res);
        if(!res.error){
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/']);
        }
      })
      .catch(err => {
        console.log(err);
        this.message.error(err.error.message)
      })

    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  openEnterEmailDialog(){
    this.modalService.create({
      nzContent: ForgotPWForm,
      nzFooter: null,
      nzClosable: false,
      nzStyle: { top: '200px' },
      nzMaskClosable: false
    })
  }

}
