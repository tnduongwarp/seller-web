import { Component } from '@angular/core';
import { BaseComponent } from 'src/app/base/base.component';
import { Const } from 'src/app/const/const';
interface TableData {
  id: string,
  shopName: string,
  price: number,
  expand: false,
  products: any,
  created: string
}
@Component({
  selector: 'app-register-adv',
  templateUrl: './register-adv.component.html',
  styleUrls: ['./register-adv.component.scss']
})
export class RegisterAdvComponent extends BaseComponent{
  expandSet = new Set<number>();
  isLoading: boolean = true;;
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }
  public listData: TableData[] = [];
  listOfData = [
    {
      id: 1,
      name: 'John Brown',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: 2,
      name: 'Jim Green',
      age: 42,
      expand: false,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      id: 3,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    },
    {
      id: 1,
      name: 'John Brown',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: 2,
      name: 'Jim Green',
      age: 42,
      expand: false,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      id: 3,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    }
  ];

  getData(){
    this.isLoading = true;
    this.api.get(`${Const.API_SELLER}/bids`).then(
      (res: any) => {
        this.isLoading = false;
        this.buildData(res.data);
      }
    ).catch(err => {
      this.isLoading = false;
      console.log(err)
    })
  }

  buildData(data: any){
    data.forEach((element: any) => {
      let obj: TableData = {
        id: element.id,
        shopName: element?.owner?.shopName || '',
        price: element.price,
        expand: false,
        products: element.products.map((it: any) => it.product.title),
        created: this.formatDate(element.created)
      }
      this.listData.push(obj)
    });
  }
}
