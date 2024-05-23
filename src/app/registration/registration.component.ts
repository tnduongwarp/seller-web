import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { NonNullableFormBuilder, Validators, FormGroup, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})

export class RegistrationComponent extends BaseComponent {

  constructor(private router: Router, private fb: NonNullableFormBuilder,private notification: NzNotificationService){
    super();
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      agree: [false]
    });
  }
  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    checkPassword: FormControl<string>;
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    agree: FormControl<boolean>;
  }>;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      let bodySignUp = {
        firstname: this.validateForm.value.firstname,
        lastname: this.validateForm.value.lastname,
        email: this.validateForm.value.email,
        password: this.validateForm.value.password,
        role: this.validateForm.value.agree? 'seller' : 'user',
      }
      this.api.post(this.apiUrl(this.authApiUrl)+'signUp', bodySignUp)
      .then((res: any) => {
        if(!res.error){
          this.createNotification('success','Sign up successfully, Login now!')
          setTimeout(() => {
            this.router.navigateByUrl('/login')
          }, 2000)
        }
      })
      .catch((err: any) => {
        this.createNotification('error', err.message)
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

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  createNotification(type: string, message:string): void {
    this.notification.create(
      type,
      'Notification Title',
      message
    );
  }
}
// name = '';
  // email = '';
  // password = '';
  // password1 = '';
  // isSeller = false;

  // btnDisabled = false;

  // constructor(
  //   private router: Router,
  //   private data: DataService,
  //   private rest: RestApiService,
  // ) {}

  // ngOnInit() {}

  // validate() {
  //   if (this.name) {
  //     if (this.email) {
  //       if (this.password) {
  //         if (this.password1) {
  //           if (this.password === this.password1) {
  //             return true;
  //           } else {
  //             this.data.error('Passwords do not match.');
  //           }
  //         } else {
  //           this.data.error('Confirmation Password is not entered');
  //         }
  //       } else {
  //         this.data.error('Password is not entered');
  //       }
  //     } else {
  //       this.data.error('Email is not entered.');
  //     }
  //   } else {
  //     this.data.error('Name is not entered.');
  //   }
  // }

  // async register() {
  //   this.btnDisabled = true;
  //   try {
  //     if (this.validate()) {
  //       const data: any = await this.rest.post(
  //         'http://localhost:3030/api/accounts/signup',
  //         {
  //           name: this.name,
  //           email: this.email,
  //           password: this.password,
  //           isSeller: this.isSeller,
  //         },
  //       );
  //       if (data['success']) {
  //         localStorage.setItem('token', data['token']);
  //         await this.data.getProfile();
  //         this.data.success('Registration successful!');
  //       } else {
  //         this.data.error(data['message']);
  //       }
  //     }
  //   } catch (error: any) {
  //     this.data.error(error['message']);
  //   }
  //   this.btnDisabled = false;
  // }
