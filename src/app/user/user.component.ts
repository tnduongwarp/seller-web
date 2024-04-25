import { Component } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Const } from '../const/const';
import { NzModalService } from 'ng-zorro-antd/modal';
import { CreateUserComponent } from '../modals/create-user/create-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends BaseComponent{
  public pageSize = 10;
  public pageIndex = 1;
  public role!: string;
  public limit = 10;
  public skip = 0;
  public listData: any;
  public total = 0;
  searchValue: string = '';
  listOfDisplayData: any = [];
  isLoading: boolean = false;
  constructor(private modal: NzModalService){
    super();
  }
  override ngOnInit(): void {
    this.getData()
  }

  public getData(){
    let condition: any = {
      role: this.role || '',
      skip: (this.pageIndex - 1)*this.pageSize,
      limit: this.limit
    }
    const qs = new URLSearchParams(condition).toString();
    this.isLoading = true;
    this.api.get(`${Const.API_USER}/list_for_admin?${qs}`).then(
      (res:any) => {
        console.log(res);
        this.listData = res.list_data;
        this.total = res.total;
        this.isLoading = false;
        this.listOfDisplayData = res.list_data;
      }
    ).catch(err => console.log(err))
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.listOfDisplayData = this.listData.filter((item: any) => item.email.indexOf(this.searchValue) !== -1);
  }

  getRouterLink(item: any){
    return `/user/${item._id}`;
  }
  deleteUser(user: any){
    this.api.post(`${Const.API_USER}/${user._id}`,{isDelete: true}).then(
      res => {
        this.getData();
      }
    )
  }

  openCreateUserDialog(){
    this.modal.create({
      nzContent: CreateUserComponent,
      nzTitle: 'Tạo tài khoản',
      nzData:{
        refreshData:() => this.getData()
      }
    })
  }
}
