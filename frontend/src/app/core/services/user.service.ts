import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { User } from 'src/app/shared/models/User';
import { JwtResponse } from 'src/app/shared/models/JwtResponse';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userUrl: string;

  constructor(private http: HttpClient) {}

  public addUser(user: User) {
    const requestOptions: Object = {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      responseType: 'text',
    };

    return this.http.post<User>(
      'http://localhost:8080/auth/signup',
      user,
      requestOptions
    );
  }

  public logUser(user: User) {
    return this.http.post<JwtResponse>('http://localhost:8080/auth/signin', user);
  }

  public getUserData(userId: number){

  let httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token,
    })
  };
    return this.http.get<User>("http://localhost:8080/user/" + userId, httpOptions);
  }

  getCurrentLoggedUserId() : number{
    return JSON.parse(localStorage.getItem("jwtResponse")).id;
  }
}
