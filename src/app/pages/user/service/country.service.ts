import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../model/country';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  users !: User[];
  countries !: Country[];
  private apiURL = 'http://localhost:3000';
  constructor(private http :  HttpClient) { }
  
  getCountries() : Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiURL}/country`);
  }

}
