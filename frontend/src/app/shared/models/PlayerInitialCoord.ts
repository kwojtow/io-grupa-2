export class PlayerInitialCoord{
  userId: number;
  xcoord: number;
  ycoord: number;
  color: string;

  constructor(userId: number, xCoord: number, yCoord: number, color: string) {
    this.userId = userId;
    this.xcoord = xCoord;
    this.ycoord = yCoord;
    this.color = color;
  }
}
