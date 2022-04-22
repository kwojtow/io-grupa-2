import {UserStatistics} from "./UserStatistics";

export class User{
  private _username: string;
  private _password: string;
  private _email: string;
  private _statistics: UserStatistics;

  constructor(username: string, password: string, email: string, statistics?: UserStatistics) {
    this._username = username;
    this._password = password;
    this._email = email;
    this._statistics = statistics;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }

  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get statistics(): UserStatistics {
    return this._statistics;
  }

  set statistics(value: UserStatistics) {
    this._statistics = value;
  }
}
