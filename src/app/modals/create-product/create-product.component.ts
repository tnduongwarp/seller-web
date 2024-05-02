import { Component, Inject } from '@angular/core';
import { FormControl, FormRecord, NonNullableFormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BaseComponent } from 'src/app/base/base.component';
import { Const } from 'src/app/const/const';
import { FileUpload } from 'src/app/models/file-upload.model';
import { getBase64 } from 'src/app/seller/product-detail/product-detail.component';
import { FileUploadService } from 'src/app/service/upload-file.service';

export interface ModalData{
  refreshData: () => void;
}

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductModal extends BaseComponent{
  categories:any = [];
  options: any = [];
  selected = 0;
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  controlArray: Array<{ label: string; index: number, field: string, placeHolder: string}> = [
    {
      label: 'Tên sản phẩm',
      index: 0,
      field: 'title',
      placeHolder: 'Nhập tên sản phẩm...'
    },
    {
      label: 'Giá',
      index: 3,
      field: 'price',
      placeHolder: 'Nhập giá của sản phẩm...'
    },
    {
      label: 'Số lượng',
      index: 2,
      field: 'amount',
      placeHolder: 'Nhập số lượng bạn có...'
    }
  ];

  constructor(@Inject(NZ_MODAL_DATA) public  dataInput: ModalData, private fb: NonNullableFormBuilder, private message: NzMessageService, private uploadService: FileUploadService){
    super();
    for(let control of this.controlArray){
      this.validateForm.addControl(`${control.field}`, this.fb.control(''));
    }
    this.validateForm.addControl(`description`, this.fb.control(''));

  }

  override ngOnInit(): void {
    this.api.get(`${Const.API_GET_LIST_CATEGORY}`).then(
      (res: any) => {
        this.categories = res.data;
        this.options = res.data.map((it: any) => it.name);
      }
    )
  }

  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };
  save(){
    if(this.fileList.length < 1) return this.message.error('Bạn cần upload ít nhất 1 ảnh')
    const id = JSON.parse(localStorage.getItem('user')!)._id
    const body = {
      owner: id,
      category: this.categories[this.selected]._id,
      amount: this.validateForm.value['amount'],
      description: this.validateForm.value['description'],
      price: this.validateForm.value['price'],
      title: this.validateForm.value['title'],
      image: ''
    };
    const fileUploads: FileUpload[] = [];
    for(let file of this.fileList){
      if(file?.originFileObj){
        const fileUpload = new FileUpload(file?.originFileObj);
        fileUploads.push(fileUpload);
      }
    };
    this.uploadService.pushFilesToStorage(fileUploads).subscribe({
      next: (res) => {
        let imageArr = fileUploads.map(it => it.url)
        body['image'] = imageArr.join(',');
        this.api.post(`${Const.API_GET_LIST_PRODUCT}`, body).then(
          (res: any) => {
            this.message.success('thêm thành công');
            this.dataInput.refreshData()
          }
        ).catch((err: any) => {
          console.log(err)
          this.message.error(err.error.message)
        })
      },
      error: (err: any) => {this.message.error('Có lỗi xảy ra, vui lòng thử lại')}
    })
  }
}
