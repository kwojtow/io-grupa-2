export class User{
  private _username: string;
  private _password: string;
  private _email: string;
  private _rankingPosition: number;
  private _rankingPoints: number;


  constructor(username: string, password: string, email: string, rankingPostition: number, rankingPoints: number) {
    this._username = username;
    this._password = password;
    this._email = email;
    this._rankingPosition = rankingPostition;
    this._rankingPoints = rankingPoints;
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

  get rankingPosition(): number {
    return this._rankingPosition;
  }

  set rankingPosition(value: number) {
    this._rankingPosition = value;
  }

  get rankingPoints(): number {
    return this._rankingPoints;
  }

  set rankingPoints(value: number) {
    this._rankingPoints = value;
  }
}
