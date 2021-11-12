import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from '../../product/service/product.service';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user !: User[];
  private apiURL = 'http://localhost:3000';
  constructor(private http : HttpClient) { }

  getUsers():Observable<User[]>{
    return this.http.get<User[]>(`${this.apiURL}/user`);
  }

  postUser(user : User):Observable<User>{
    return this.http.post<User>(`${this.apiURL}/user`,user)
  }

  getUserId(id : number):Observable<User>{
    return this.http.get<User>(`${this.apiURL}/user/` + id);
  }

  putUser(user : User):Observable<User>{
    return this.http.put<User>(`${this.apiURL}/user/` + user.id, user);
  }

  deleteUser(user : User):Observable<User>{
    return this.http.put<User>(`${this.apiURL}/user/` + user.id, user);
  }
}
