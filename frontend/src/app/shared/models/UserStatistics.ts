export class UserStatistics{

  private _userWins: number;
  private _userGames: number;


  constructor(winGamesNumber: number, gamesNumber: number) {
    this._userWins = winGamesNumber;
    this._userGames = gamesNumber;
  }

  get userWins(): number {
    return this._userWins;
  }

  set userWins(value: number) {
    this._userWins = value;
  }

  get userGames(): number {
    return this._userGames;
  }

  set userGames(value: number) {
    this._userGames = value;
  }
}
