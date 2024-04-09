import { Component } from "@angular/core";
import { NzModalService } from "ng-zorro-antd/modal";
import { RestApiService } from "src/app/service/rest-api.service";
import isEmail from 'validator/lib/isEmail';
import { Const } from "src/app/const/const";
import { NzNotificationService } from "ng-zorro-antd/notification";
@Component({
  selector: 'enter-email',
  templateUrl: './index.html',
  styleUrls: ['./index.scss'],
})

export class ForgotPWForm{
  inputCode: string = '';
  resetPwCodeLen: any;
  otp: any;
  constructor(private modalService: NzModalService, private api : RestApiService, private notification: NzNotificationService){}
  get txtForgotPwdGuide(){
    return this.phase === 1 ? "Please enter your email." : "We have send a Code to your email, please enter that code and change password."
  }
  public phase = 1;
  public isLoading : boolean = false;
  public inputEmail = '';
  public inputPwConfirm = '';
  public inputPw = ''
  pwConfirmHidden: boolean = true;
  pwHidden: boolean = true;
  private userId: any;
  public closeDialog(){
    this.modalService.closeAll()
  }

  get canSubmit() {
    if (this.isLoading) return false;
    switch (this.phase) {
      case 1: return isEmail(this.inputEmail.trim());
      case 2: return this.isPhase2Valid();
    }
  }
  private isPhase2Valid() {
    if (this.inputCode.length != this.resetPwCodeLen) {
      return false;
    }
    return this.inputPwNewValid && this.inputPwConfirmValid;
  }

  get inputPwNewValid() {
    return this.inputPw.length > 0;
  }

  get inputPwConfirmValid() {
    return this.inputPwConfirm && this.inputPwConfirm === this.inputPw;
  }
  onBtnSubmit(){
    switch (this.phase) {
      case 1: {
        this.isLoading = true;
        let recipient_email = this.inputEmail.trim();
        this.api.post(Const.API_SEND_OTP, {recipient_email})
        .then((res: any) => {
          this.isLoading = false;
            console.log(res);
            this.otp = res.otp;
            this.resetPwCodeLen = res?.length;
            this.userId = res?.userId
            this.phase = 2;
        })
        .catch((error: any) => {
          this.isLoading = false;
          console.log(error)
          this.notification.error(
            'Error',
            error?.error?.message,
            {
              nzDuration: 2000
            }
          )
        });
        break;
      }
      case 2: {
        if(this.inputCode !== this.otp){
          this.notification.error(
            'Error',
            'OTP is incorrect!',
            { nzDuration: 2000}
          );
          this.modalService.closeAll()
        }else{
          this.isLoading = true;
          this.api.post(Const.API_CHANGE_PW, { id: this.userId, newPassword: this.inputPw})
          .then((res: any) => {
            this.isLoading = false;
            this.notification.success(
              'Success',
              'Change Password Successfully!',
              { nzDuration: 2000}
            );
            this.modalService.closeAll();
          })
          .catch((err: any) => {
            this.notification.error(
              'Error',
              'Server Error.',
              { nzDuration: 2000}
            );
          })
        }
        break;
      }
    }
  }

}
