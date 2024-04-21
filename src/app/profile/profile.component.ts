import { Component } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Const } from '../const/const';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent extends BaseComponent{
  public btnDisabled = false;
  public user: any;
  public isEditting = false;
  public formControl: any;
  public currentAvatar: any;
  public selecetdFile!: File;
  constructor(private message: NzMessageService) {
    super();
    this.user = JSON.parse(localStorage.getItem('user')!);
    this.currentAvatar = this.user.picture;
    this.formControl = {
      firstname: this.user.firstname,
      lastname: this.user.lastname,
      email: this.user.email,
      isSeller: this.user.isSeller,
      metadata: {
        phone: this.user?.metadata?.phone,
        gender: this.user?.metadata?.gender,
        dateOfBirth: this.user?.metadata?.dateOfBirth
      },
      shopName: this.user?.shopName,
      shopAddress: this.user?.shopAddress
    }
  }

   override ngOnInit() {

  }
  onBtnSave(){
    if(!this.user._id) return;
    if(this.selecetdFile){
      const formData = new FormData();
      formData.append('file', this.selecetdFile, this.selecetdFile.name);
      this.api.post(`${Const.API_USER}/${this.user._id}/upload-avatar`, formData)
      .then((res: any) => {
        this.api.post(`${Const.API_USER}/${this.user._id}`, this.formControl).then(
          (res: any) => {
            localStorage.setItem('user', JSON.stringify(res.data));
            this.isEditting = false;
            this.message.success('Chỉnh sửa thông tin thành công')
          }
        ).catch((err: any) => {
          console.log(err)
          this.message.error(err.error.message)
        })
      })
      .catch((err: any) => {
        console.log(err)
        this.message.error(err.error.message)
      })
    }else{
      this.api.post(`${Const.API_USER}/${this.user._id}`, this.formControl).then(
        (res: any) => {
          localStorage.setItem('user', JSON.stringify(res.data));
          this.isEditting = false;
          this.message.success('Chỉnh sửa thông tin thành công')
        }
      ).catch((err: any) => {
        console.log(err)
        this.message.error(err.error.message)
      })
    }
  }

  onFileUpload(event: any){
    if( event.target.files[0].size/1024/1024 > 1) {
      this.message.error('Ảnh kích thước lớn hơn 1MB');
      return;
    }
    this.selecetdFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
    this.currentAvatar = reader.result;
    };
    reader.readAsDataURL(this.selecetdFile);
  }
}
