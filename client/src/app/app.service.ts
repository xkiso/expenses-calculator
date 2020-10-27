import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  rootURL = '/api';

  calculate( students: any ) {
    return this.http.post<any>(this.rootURL + '/calculate', students);
  }

}
