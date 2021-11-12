import { Injectable } from '@angular/core';
import { Product } from '../model/product';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  products !: Product[];
  private apiURL = 'http://localhost:3000';

  constructor(private http : HttpClient) { }

  getProducts():Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiURL}/product`);
  }

  postProduct(product : Product): Observable<Product>{
    return this.http.post<Product>(`${this.apiURL}/product`,product);
  }
 
  getProductId(id : number):Observable<Product>{ 
     return this.http.get<Product>(`${this.apiURL}/product/` + id);    
  }

  putProduct(product : Product):Observable<Product>{
    return this.http.put<Product>(`${this.apiURL}/product/` + product.id,product);
  }

  deletePersona(product : Product):Observable<Product>{
    return this.http.delete<Product>(`${this.apiURL}/product/` + product.id);
  }

}
