import {UserStatistics} from "./UserStatistics";
import {UserRanks} from "./UserRanks";

export class User{
  private _userId: number;
  private _login: string;
  private _password: string;
  private _email: string;
  private _statistics: UserStatistics;
   avatar: string;
  private _ranks: UserRanks;

  constructor( username: string, password: string, email: string, id?: number, statistics?: UserStatistics, ranks?: UserRanks) {
    this._userId = id;
    this._login = username;
    this._password = password;
    this._email = email;
    this._statistics = statistics;
    this._ranks = ranks;
  }

  get login(): string {
    return this._login;
  }

  set login(value: string) {
    this._login = value;
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

  get ranks(): UserRanks {
    return this._ranks;
  }

  set ranks(value: UserRanks) {
    this._ranks = value;
  }

  get userId(): number {
    return this._userId;
  }

  set userId(value: number) {
    this._userId = value;
  }
}
