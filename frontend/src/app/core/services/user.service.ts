import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { User } from 'src/app/shared/models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl: string;
  
  constructor(private http: HttpClient) {}

   public addUser(user: User){
    const requestOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text'
    }
    
     return this.http.post<User>('http://localhost:8080/auth/signup', user, requestOptions);
   }

   public logUser(user: User){
     return this.http.post<User>('http://localhost:8080/auth/signin', user);
   }



}
