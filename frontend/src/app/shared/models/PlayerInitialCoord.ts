export class PlayerInitialCoord{
  userId: number;
  xcoord: number;
  ycoord: number;

  constructor(userId: number, xCoord: number, yCoord: number) {
    this.userId = userId;
    this.xcoord = xCoord;
    this.ycoord = yCoord;
  }
}
