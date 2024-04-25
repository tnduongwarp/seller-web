import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { BaseComponent } from 'src/app/base/base.component';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent extends BaseComponent{
  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    firstname: FormControl<string>;
    lastname: FormControl<string>;
    role: FormControl<string>;
  }>;
  constructor(private fb: NonNullableFormBuilder, private modelService : NzModalService, private messageService: NzMessageService, @Inject(NZ_MODAL_DATA) public  dataInput: any){
    super();
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });
  }
  handleCancel(){
    this.modelService.closeAll()
  }
  handleOk(){
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
      let bodySignUp = {
        firstname: this.validateForm.value.firstname,
        lastname: this.validateForm.value.lastname,
        email: this.validateForm.value.email,
        password: this.validateForm.value.password,
        role: this.validateForm.value.role,
      }
      this.api.post(this.apiUrl(this.authApiUrl)+'signUp', bodySignUp)
      .then((res: any) => {
        if(!res.error){
          this.messageService.success('Tạo tài khoản thành công');
          this.dataInput.refreshData();
          this.modelService.closeAll()
        }
      })
      .catch((err: any) => {
        console.log(err);
        this.messageService.error(err.error.message)
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
}
