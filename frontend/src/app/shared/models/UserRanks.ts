export class UserRanks{
  private _rankingPosition: number;
  private _points: number;


  constructor(rankingPosition: number, rankingPoints: number) {
    this._rankingPosition = rankingPosition;
    this._points = rankingPoints;
  }

  get rankingPosition(): number {
    return this._rankingPosition;
  }

  get points(): number {
    return this._points;
  }
}
