export class GameSettings{
  constructor(private _roundTime: number) {
    this._roundTime = _roundTime;
  }

  get roundTime(): number {
    return this._roundTime;
  }
}
