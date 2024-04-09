//rest-api.service.ts - Type script file to provide REST(GET,POST) Services in the elearning application


//including required files and services
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//exporting the RestAPi Service
@Injectable({
  providedIn: 'root',
})
export class RestApiService {

  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('accessToken');
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;
  }

  get(url: string) {
    return this.http.get(url, { headers: this.getHeaders() }).toPromise();
  }

  post(url: string, body: any) {
    return this.http.post(url, body, { headers: this.getHeaders() }).toPromise();
  }
}
