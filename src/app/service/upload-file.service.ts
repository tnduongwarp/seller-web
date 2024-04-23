import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Observable, forkJoin } from 'rxjs';
import { finalize, mergeMap } from 'rxjs/operators';
import { FileUpload } from '../models/file-upload.model';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private basePath = '/uploads';

  constructor(private db: AngularFireDatabase, private storage: AngularFireStorage) { }

  pushFileToStorage(fileUpload: FileUpload): Observable<any> {
    const n = Date.now()
    const filePath = `${this.basePath}/${n}-${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    return new Observable<string>((observer) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe(downloadURL => {
            fileUpload.url = downloadURL;
            fileUpload.name = fileUpload.file.name;
            observer.next(downloadURL); // Gửi URL của file đã upload
            observer.complete(); // Hoàn thành observable
          });
        })
      ).subscribe();
    });
  }

  pushFilesToStorage(fileUploads: FileUpload[]): Observable<any> {
    const observables: Observable<any>[] = [];

    // Tạo một observable cho mỗi fileUpload
    fileUploads.forEach(fileUpload => {
      const n = Date.now();
      const filePath = `${this.basePath}/${n}-${fileUpload.file.name}`;
      const storageRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, fileUpload.file);

      // Tạo observable để gán url và name khi upload hoàn tất
      const uploadObservable = new Observable<void>((observer) => {
        uploadTask.snapshotChanges().pipe(
          finalize(() => {
            storageRef.getDownloadURL().subscribe(downloadURL => {
              fileUpload.url = downloadURL;
              fileUpload.name = fileUpload.file.name;
              observer.next(); // Gửi thông báo khi gán thành công
              observer.complete(); // Hoàn thành observable
            });
          })
        ).subscribe();
      });

      observables.push(uploadObservable);
    });

    // Sử dụng forkJoin để kết hợp tất cả các observable và lấy kết quả khi tất cả đã hoàn thành
    return forkJoin(observables);
  }

  private saveFileData(fileUpload: FileUpload): void {
    this.db.list(this.basePath).push(fileUpload);
  }

  // getFiles(numberItems: number): AngularFireList<FileUpload> {
  //   return this.db.list(this.basePath, ref =>
  //     ref.limitToLast(numberItems));
  // }

  // deleteFile(fileUpload: FileUpload): void {
  //   this.deleteFileDatabase(fileUpload.key)
  //     .then(() => {
  //       this.deleteFileStorage(fileUpload.name);
  //     })
  //     .catch(error => console.log(error));
  // }

  // private deleteFileDatabase(key: string): Promise<void> {
  //   return this.db.list(this.basePath).remove(key);
  // }

  public deleteFileStorage(name: string): void {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }
}
