export class PlayerInitialCoord{
  userId: number;
  xCoord: number;
  yCoord: number;

  constructor(userId: number, xCoord: number, yCoord: number) {
    this.userId = userId;
    this.xCoord = xCoord;
    this.yCoord = yCoord;
  }
}
