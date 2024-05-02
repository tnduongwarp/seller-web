import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { BaseComponent } from '../../base/base.component';
import { Const } from '../../const/const';
import { ActivatedRoute } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { FormControl, FormRecord, NonNullableFormBuilder } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileUploadService } from '../../service/upload-file.service';
import { FileUpload } from '../../models/file-upload.model';
import { forkJoin, last, merge } from 'rxjs';

export const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent extends BaseComponent{
  fileList: NzUploadFile[] = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  isLoading: boolean = false;
  product: any;
  public replyModel: any = {};
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  controlArray: Array<{ label: string; index: number, field: string, disable: boolean }> = [
    {
      label: 'Tên sản phẩm',
      index: 0,
      field: 'title',
      disable: false,
    },
    {
      label: 'Giá',
      index: 3,
      field: 'price',
      disable: false,
    },
    {
      label: 'Số lượng',
      index: 2,
      field: 'amount',
      disable: false
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
    private uploadService: FileUploadService
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
          this.validateForm.addControl(`description`, this.fb.control(res.data['description']));

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
  handlePreview = async (file: NzUploadFile): Promise<void> => {
    if (!file.url && !file['preview']) {
      file['preview'] = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file['preview'];
    this.previewVisible = true;
  };

  async reply(id: string){
    console.log(this.replyModel[id]);
    this.api.post(`${Const.API_SELLER}/review/${id}`, {reply: this.replyModel[id]}).then(
      (res: any) =>{
        let review = this.product.reviews.find((it: any) => it._id.toString() === id);
        if(!review) return;
        review.reply = res.data.reply
      }
    ).catch((err: any) => {
      this.message.error(err.message)
    })
  }

  async save(){
    let fileUrlList = this.fileList.map(it => it.url);
    let formValue: any = {...this.validateForm.value, deleteImages: [], addImage:[]};
    const fileUploads: FileUpload[] = [];
    const fileDelete: string[] = [];
    const promises: any = [];
    for(let file of this.fileList){
      if(file?.originFileObj){
        // formData.append('files',file.originFileObj, file.originFileObj?.name);
        // formValue.addImage.push(file.originFileObj?.name)
        const fileUpload = new FileUpload(file?.originFileObj);
        fileUploads.push(fileUpload);
      }
    }
    for(let file of this.originalFileList){
      if(!fileUrlList.includes(file.url)) {
        let fileName = this.getFileNameFromFileUrl(file.name);
        if(fileName) this.uploadService.deleteFileStorage(fileName)
        fileDelete.push(file.name)
      }
    }
    formValue.deleteImages = fileDelete;
    this.isLoading = true;
    if(fileUploads.length){
      this.uploadService.pushFilesToStorage(fileUploads).subscribe(res => {
        formValue.addImage = fileUploads.map(it => it.url);
        this.api.post(`${Const.API_GET_LIST_PRODUCT}/update/${this.product._id}`, formValue)
        .then(res=> {
          this.isLoading = false;
          this.correctStatusFileList();
          this.message.success('Lưu thành công')
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false
          this.message.error('Có lỗi xảy ra')
        })
      })
    }else{
      this.api.post(`${Const.API_GET_LIST_PRODUCT}/update/${this.product._id}`, formValue)
      .then(res=> {
        this.isLoading = false;
        this.correctStatusFileList();
        this.message.success('Lưu thành công')
      })
      .catch(err => {
        console.log(err);
        this.isLoading = false
        this.message.error('Có lỗi xảy ra')
      })
    }


  }

  correctStatusFileList(){
    for(let file of this.fileList){
      file.status = 'done'
    }
    this.originalFileList = this.fileList;
  }
}
