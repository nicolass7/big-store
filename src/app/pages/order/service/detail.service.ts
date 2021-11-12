import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Detail } from '../model/detail';

@Injectable({
  providedIn: 'root'
})
export class DetailService {
  detail !:Detail;
  private apiURL = 'http://localhost:3000';
  constructor(private http:HttpClient) { }
  postDetail(detail:Detail){
    return this.http.post<Detail[]>(`${this.apiURL}/detail`,detail);
  }
  getDetailByorderId(orderId:any):Observable<Detail[]>{
    return this.http.get<Detail[]>(`${this.apiURL}/detail/?orderId=`+ orderId);
  }
}
