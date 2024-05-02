import { Component } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { ActivatedRoute } from '@angular/router';
import { Const } from '../../const/const';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent extends BaseComponent{
  public isLoading: boolean = true;
  public id: string = '';
  public email: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public role: string = '';
  public created: string = '';
  public isEditting: boolean = false;
  constructor(private activatedRoute: ActivatedRoute, private message: NzMessageService){
    super()
  }
  override ngOnInit(): void {
    this.id = this.activatedRoute?.snapshot?.params['id'];
    if(this.id) this.fetchData();
  }
  public fetchData(){
    this.isLoading = true;
    this.api.get(`${Const.API_USER}/${this.id}`).then(
      (res: any) => {
        this.isLoading = false;
        console.log(res)
        this.email = res.data.email;
        this.firstName = res.data?.firstname;
        this.lastName = res.data?.lastname;
        this.role = res.data.role
        this.created = res.data.created;
      }
    ).catch(err => console.log(err))
  }

  public onSave(){
    const body = {
      email: this.email,
      role: this.role,
      firstname: this.firstName,
      lastname: this.lastName
    };
    this.api.post(`${Const.API_USER}/${this.id}`, body).then(
      (res: any) => {
        this.message.success('Lưu thành công');
        this.isEditting = false;
      }
    ).catch(err => {
      this.message.error('Có lỗi xảy ra')
      }
    )
  }
}
