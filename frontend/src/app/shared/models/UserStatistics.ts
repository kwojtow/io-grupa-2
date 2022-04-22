export class UserStatistics{
  private _rankingPosition: number;
  private _rankingPoints: number;
  private _winGamesNumber: number;
  private _gamesNumber: number;


  constructor(rankingPosition: number, rankingPoints: number, winGamesNumber: number, gamesNumber: number) {
    this._rankingPosition = rankingPosition;
    this._rankingPoints = rankingPoints;
    this._winGamesNumber = winGamesNumber;
    this._gamesNumber = gamesNumber;
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

  get winGamesNumber(): number {
    return this._winGamesNumber;
  }

  set winGamesNumber(value: number) {
    this._winGamesNumber = value;
  }

  get gamesNumber(): number {
    return this._gamesNumber;
  }

  set gamesNumber(value: number) {
    this._gamesNumber = value;
  }
}
