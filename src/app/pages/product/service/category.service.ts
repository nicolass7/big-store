import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  
  category !: Category[];
  private apiURL = 'http://localhost:3000';
  constructor(private http : HttpClient) { }
  
  getCategories():Observable<Category[]>{
    return this.http.get<Category[]>(`${this.apiURL}/category`);
  }

}
