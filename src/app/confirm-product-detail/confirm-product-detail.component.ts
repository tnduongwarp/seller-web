import { Component } from '@angular/core';
import { FormControl, FormRecord, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BaseComponent } from '../base/base.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Const } from '../const/const';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-confirm-product-detail',
  templateUrl: './confirm-product-detail.component.html',
  styleUrls: ['./confirm-product-detail.component.scss']
})
export class ConfirmProductDetailComponent extends BaseComponent{
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  isLoading: boolean = false;
  product: any;
  public replyModel: any = {};
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  public isAccepting: boolean = false;
  controlArray: Array<{ label: string; index: number, field: string, disable: boolean }> = [
    {
      label: 'Tên sản phẩm',
      index: 0,
      field: 'title',
      disable: true,
    },
    {
      label: 'Giá',
      index: 3,
      field: 'price',
      disable: true,
    },
    {
      label: 'Số lượng',
      index: 2,
      field: 'amount',
      disable: true
    },
    {
      label: 'Ngày tạo',
      index: 1,
      field: 'created',
      disable: true
    },
    {
      label: 'Đã bán',
      index: 3,
      field: 'sold',
      disable: true
    }
  ];
  originalFileList: NzUploadFile[] = [];
  constructor(
    public activatedRoute: ActivatedRoute,
    private fb: NonNullableFormBuilder,
    public message: NzMessageService,
  ){
    super();
  }
  override ngOnInit(): void {
    this.getData();
  }

  private getData(){
    let id = this.activatedRoute.snapshot.params['id'];
    if(id){
      this.isLoading = true;
      this.api.get(`${Const.API_GET_LIST_PRODUCT}/${id}`).then(
        (res: any) => {
          this.product = res.data;
          for(let rv of res.data.reviews){
            this.replyModel[rv._id] = rv.reply;
          }
          for(let control of this.controlArray){
            this.validateForm.addControl(`${control.field}`, this.fb.control(control.index == 1 ?this.formatDate(res.data[control.field]) : res.data[control.field]));
            if (control.disable) {
              const fc = this.validateForm.get(control.field);
              fc?.disable();
            }
          }
          this.validateForm.addControl(`description`, this.fb.control({value: res.data['description'], disabled: true}));

          for(let item of res.data?.image){
            let uploadFile : NzUploadFile = {
              uid: uuidv4(),
              name: item,
              url: item,
              status: 'done'
            };
            this.fileList.push(uploadFile)
          }
          this.originalFileList = [...this.fileList]
          this.isLoading = false;
        }
      )
      .catch(err => {
        this.isLoading = false;
        console.log(err)
      })
    }
  }




  async accept(){
    let id = this.activatedRoute.snapshot.params['id'];
    this.isAccepting = true;
    this.api.get(`${Const.API_GET_LIST_PRODUCT}/accept/${id}`).then(
      res => {
        this.isAccepting = false;
        this.message.success('Sản phẩm đã được phê duyệt')
      }
    ).catch(err => {
      this.isAccepting = false;
      this.message.error('Đã có lỗi xảy ra, hãy thử lại sau')
    })
  }

}
