import { Component } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { Const } from '../const/const';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.scss']
})
export class RevenueComponent extends BaseComponent{
  public isLoading: boolean = false;
  public month: number = 0;
  constructor(){
    super();
    this.month = new Date().getMonth() + 1;
  }
  override ngOnInit(): void {
    const userId = JSON.parse(localStorage.getItem('user')!)?._id;
    this.api.get(`${Const.API_SELLER}/analytic/${userId}`).then(
      (res: any) => {
        console.log(res)
      }
    )
  }

}
