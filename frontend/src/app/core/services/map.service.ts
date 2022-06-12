import { Injectable } from '@angular/core';
import {RaceMap} from "../../shared/models/RaceMap";
import {Vector} from "../../shared/models/Vector";
import {Player} from "../../shared/models/Player";
import {Game} from "../../shared/models/Game";
import {BehaviorSubject, catchError, map, throwError} from "rxjs";
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MapResponse } from 'src/app/payload/MapResponse';
import { MapRankEntry } from 'src/app/payload/MapRankEntry';
import {PlayerState} from "../../shared/models/PlayerState";

@Injectable({
  providedIn: 'root'
})
export class MapService {

  LINE_WIDTH = 1;
  FINISH_LINE_COLOR = 'black';
  START_LINE_COLOR = 'blue';
  OBSTACLE_COLOR = 'black';

  static game: Game;
  static map: BehaviorSubject<RaceMap>;
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': "Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token,
    })
  };
  constructor(private http : HttpClient) {
    MapService.map = new BehaviorSubject<RaceMap>(undefined);

  }

  getMap(id: number) : Observable<MapResponse> {

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token,
      })
    };
      return this.http.get<MapResponse>("http://localhost:8080/map/" + id, httpOptions)
        .pipe(map(mapResponse =>{
          let finishLine = new Array<Vector>();
          let startLine = new Array<Vector>();
          let obstacles = new Array<Vector>();
          mapResponse.mapStructure.finishLine.forEach(v => {
            finishLine.push(new Vector(v.x, v.y));
          })
          mapResponse.mapStructure.startLine.forEach(v => {
            startLine.push(new Vector(v.x, v.y));
          })
          mapResponse.mapStructure.obstacles.forEach(v => {
            obstacles.push(new Vector(v.x, v.y));
          })
          return new MapResponse(mapResponse.mapId,
            mapResponse.name,
            mapResponse.width,
            mapResponse.height,
            mapResponse.userId,
            {finishLine, startLine, obstacles},
            mapResponse.rating,
            mapResponse.gamesPlayed
            )
        }));
    }

    getMaps()  {
        return this.http.get<any>("http://localhost:8080/map/list", this.httpOptions);
    }

    httpOptions2 : Object = {
      headers: new HttpHeaders({
        'Content-Type' : 'text/plain; charset=utf-8',
        'Authorization': "Bearer " + JSON.parse(localStorage.getItem("jwtResponse")).token,
      }),
      responseType: 'text'
    };
    sendRate(mapId : number, rate : number){
      return this.http.post<any>("http://localhost:8080/map/rating/" + mapId + "?rating=" + rate,
       {},
       this.httpOptions2)
      .pipe(
        catchError(this.handleError)
      );

    }



  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  deleteMap(mapId: number) {
      this.http.delete("http://localhost:8080/map/" + mapId, this.httpOptions).subscribe(
        _ => _, error => {
          if (error.status == 400) {
            alert("Mapa należy do istniejącej rozgrywki - nie może zostać usunięta");
          }
        }
      );
  }

  getRank() {
    return this.http.get<MapRankEntry[]>("http://localhost:8080/map/ranking", this.httpOptions);
  }

  static getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent): Vector {
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect()
    const x = event.offsetX;
    const y = event.offsetY;
    // @ts-ignore
    const raceMap = MapService.map.getValue();
    if (ctx !== null) {
      const v = MapService.getIdxPosition(ctx,
        canvas,
        rect.width / raceMap.mapWidth, rect.height / raceMap.mapHeight,
        x, y);

      return v;
    }
    return new Vector(-1, -1);
  }

  static getIdxPosition(ctx: CanvasRenderingContext2D,
                        canvas: HTMLCanvasElement,
                        width: number,
                        height: number,
                        cursorx: number,
                        cursory: number): Vector{
    return new Vector(Math.floor(cursorx/width),
      Math.floor(cursory/height));
  }

  initMap(map: RaceMap, players: Array<Player>, isMyTurn: boolean, player?: Player,){
    if(this._ctx != null) {
      this.drawMapNet(this._canvas, this._ctx, map);
      this.drawStartAndFinishLines(this._canvas, this._ctx, map);
      this.drawObstaclesLines(this._canvas, this._ctx, map);
      if(players.length > 0){
        this.drawPlayers(this._canvas, this._ctx, map, players);
        this.canvas.style.cursor = 'default';
        this.canvas.removeAllListeners('mousemove');
        this.canvas.removeAllListeners('click');
        let currentPlayer = players.find(p => p.playerId === player.playerId);
        if(isMyTurn && currentPlayer !== null)
          this.drawPlayerVectors(this._canvas, this._ctx, map, currentPlayer);
      }
    }
  }

  private drawLine(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number){
    ctx.lineWidth = this.LINE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }

  private drawObstacle(ctx: CanvasRenderingContext2D, v: Vector, fieldWidth: number, color: string): void{

    ctx.fillStyle = color;

    ctx.fillRect(fieldWidth * v.x + this.LINE_WIDTH,
      fieldWidth * v.y + this.LINE_WIDTH,
      fieldWidth - 2 * this.LINE_WIDTH,
      fieldWidth - 2 * this.LINE_WIDTH);
  }

  private drawCheckerSquare(ctx: CanvasRenderingContext2D, v: Vector, fieldWidth: number, color: string){
    const miniFieldWidth = (fieldWidth - this.LINE_WIDTH * 2)/5;
    ctx.beginPath();
    ctx.fillStyle = color;
    for(let i = 0; i < 5; i ++){
      for(let j = 0; j < 5; j++){
        if((j % 2 == 0 && i % 2 == 0) || j% 2 == 1 && i % 2 == 1)
          ctx.fillRect(fieldWidth * v.x + this.LINE_WIDTH + miniFieldWidth*i,
            fieldWidth * v.y + this.LINE_WIDTH + miniFieldWidth*j,
            miniFieldWidth,
            miniFieldWidth);
      }
    }
    ctx.stroke();
  }

  drawStartAndFinishLines(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap): void{
    const fieldWidth = MapService.getFieldWidth(canvas, map);
    map.startLine.forEach(v => {
      this.drawCheckerSquare(ctx, v, fieldWidth, this.START_LINE_COLOR);
    });
    map.finishLine.forEach(v => {
      this.drawCheckerSquare(ctx, v, fieldWidth, this.FINISH_LINE_COLOR);
    });
  }

  drawObstaclesLines(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap){
    const fieldWidth = MapService.getFieldWidth(canvas, map);
    map.obstacles.forEach(v => {
      this.drawObstacle(ctx, v, fieldWidth, this.OBSTACLE_COLOR);
    });
  }

  private static getFieldWidth(canvas: HTMLCanvasElement, map: RaceMap): number{
    const width = canvas.width;
    return Math.round(width/map.mapWidth);
  }

  drawMapNet(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap){
    const width = canvas.width;
    const fieldWidth = MapService.getFieldWidth(canvas, map)
    const mapHeight = map.mapHeight * fieldWidth;
    canvas.height = mapHeight;

    for(let i = 1; i < map.mapWidth ; i++){
      this.drawLine(ctx, fieldWidth * i, 0, fieldWidth * i, mapHeight);
    }
    for(let i = 1; i < map.mapHeight ; i++){
      this.drawLine(ctx, 0, fieldWidth * i, width, fieldWidth * i);
    }

  }

  public drawPlayer(player: Player, ctx: CanvasRenderingContext2D, fieldWidth: number, lineWidth: number): void{
    const miniFieldWidth = (fieldWidth - lineWidth * 2)/5;
    console.log(miniFieldWidth)

    if(player.playerStatus == "PLAYING") {
      ctx.fillStyle = "#ffaa0088";
      ctx.fillRect(fieldWidth*player.position.x, fieldWidth*player.position.y, fieldWidth, fieldWidth);
    }

    let car = new Path2D();
    ctx.fillStyle = player.color;
    let leftUpperX: number =  fieldWidth * player.position.x + lineWidth;
    let leftUpperY: number = fieldWidth * player.position.y + lineWidth;

    car.rect(leftUpperX + miniFieldWidth/2, leftUpperY + miniFieldWidth,miniFieldWidth*4, miniFieldWidth*3 )

    ctx.fill(car);
    ctx.stroke(car);

    let window = new Path2D();
    ctx.fillStyle = '#8bc0fa'
    window.rect(leftUpperX + (miniFieldWidth*3.2), leftUpperY + (miniFieldWidth*1.7),miniFieldWidth*1, miniFieldWidth*1.7 );

    ctx.fill(window);
    ctx.stroke(window);

    ctx.fillStyle = 'yellow'
    let lights = Array<Path2D> (new Path2D(), new Path2D(), new Path2D(), new Path2D());
    lights[0].arc(leftUpperX + (miniFieldWidth*4.5), leftUpperY + (miniFieldWidth*1.7), miniFieldWidth/3, 0, 2*Math.PI);
    lights[1].arc(leftUpperX + (miniFieldWidth*4.5), leftUpperY + (miniFieldWidth*3.4), miniFieldWidth/3, 0, 2*Math.PI);
    lights.forEach(light => {
      ctx.fill(light);
      ctx.stroke(light)
    });

    
    ctx.fillStyle = 'black'
    let wheels = Array<Path2D> (new Path2D(), new Path2D(), new Path2D(), new Path2D());
    wheels[0].rect(leftUpperX + (miniFieldWidth*3), leftUpperY + (miniFieldWidth*0.7), miniFieldWidth , miniFieldWidth/2);
    wheels[1].rect(leftUpperX + (miniFieldWidth*1), leftUpperY + (miniFieldWidth*0.7), miniFieldWidth , miniFieldWidth/2);
    wheels[2].rect(leftUpperX + (miniFieldWidth*3), leftUpperY + (miniFieldWidth*3.8), miniFieldWidth , miniFieldWidth/2);
    wheels[3].rect(leftUpperX + (miniFieldWidth*1), leftUpperY + (miniFieldWidth*3.8), miniFieldWidth , miniFieldWidth/2);
    wheels.forEach(wheel => ctx.fill(wheel));
}

  drawPlayers(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap, players: Array<Player>){
    const fieldWidth = MapService.getFieldWidth(canvas, map);
    players.forEach(player => this.drawPlayer(player, ctx, fieldWidth, this.LINE_WIDTH));
  }

  /**
   * function that check if there is an obstacle or a player on the field with
   * given vector
   */
  private onObstacle(vector: Vector, map: RaceMap): boolean {
    const obstacles = map.obstacles;
    const players = MapService.game.players;
    if(vector.x < 0 || vector.y < 0
      || vector.x > map.mapWidth || vector.y > map.mapHeight) return true;
    for(let obstacle of obstacles) {
      if(obstacle.equals(vector)) return true;
    }
    for(let player of players) {
      if(player.position.equals(vector)) return true;
    }
    return false;
  }

  public isObstacleOnPathToPosition(playerPosition: Vector, vector: Vector, map: RaceMap, onObstacle: CallableFunction = this.onObstacle): boolean {
    const pos_x = (playerPosition.x - vector.x > 0) ? -1 : 1;
    const pos_y = (playerPosition.y - vector.y > 0) ? -1 : 1;
    const playerPos = new Vector(playerPosition.x + pos_x,playerPosition.y + pos_y);
    if(onObstacle(vector, map)) return true;
    if(playerPosition.x == vector.x) {
      for(let i = Math.min(playerPos.y, vector.y); i <= Math.max(playerPos.y, vector.y); ++i) {
        if(onObstacle(new Vector(vector.x, i), map)) {
          return true;
        }
      }
      return false;
    }

    else if(playerPosition.y == vector.y) {
      for(let i = Math.min(playerPos.x, vector.x); i <= Math.max(playerPos.x, vector.x); ++i) {
        if(onObstacle(new Vector(i, vector.y), map)) {
          return true;
        }
      }
      return false;
    }

    else {
      const diff_x = Math.abs(playerPosition.x - vector.x);
      const diff_y = Math.abs(playerPosition.y - vector.y);
      if (diff_x == diff_y) {
        for(let i = playerPosition.x, j  = playerPosition.y; i != vector.x +pos_x && j != vector.y+pos_y; i += pos_x, j += pos_y) {
          if(onObstacle(new Vector(i, j), map) || ( onObstacle(new Vector(i - pos_x, j), map) && 
          onObstacle(new Vector(i, j - pos_y), map))) {
            if(!(onObstacle(new Vector(i, j), map) && playerPosition.equals(new Vector(i, j)))) return true;
          }
        }
        return false;
      }
      else{
        const diff_div = Math.min(diff_x, diff_y) / Math.max(diff_x, diff_y);
        if(diff_x < diff_y){
          for(let i = 0; i < diff_y-1; ++i) {
            let vec = new Vector(playerPos.x + Math.ceil(diff_div * i * pos_x), playerPos.y + (i * pos_y))
            if(onObstacle(vec, map)
            || (onObstacle(new Vector(vec.x - pos_x, vec.y), map) 
               && onObstacle(new Vector(vec.x, vec.y - pos_y), map))) return true;
          }
          return false;
        }
        else{
          for(let i = 0; i < diff_x-1; ++i) {
            let vec = new Vector(playerPos.x + (i * pos_x), playerPos.y + Math.ceil(diff_div * i * pos_y));
            if(onObstacle(vec, map)
            || (onObstacle(new Vector(vec.x - pos_x, vec.y), map) 
               && onObstacle(new Vector(vec.x, vec.y - pos_y), map))) return true;
          }
          return false;
        }
      }
    }
  }

  private createArrow(fromx: number, fromy: number,
                      tox: number, toy: number, width: number, headlen: number): Path2D{


    let angle = Math.atan2(toy-fromy,tox-fromx);
    tox -= Math.cos(angle) * (width*1.15);
    toy -= Math.sin(angle) * (width*1.15);

    let p1 = new Path2D();

    p1.moveTo(fromx, fromy);
    p1.lineTo(tox, toy);

    let p2 = new Path2D()
    p2.moveTo(tox, toy);
    p2.lineTo(tox-headlen*Math.cos(angle-Math.PI/7), toy-headlen*Math.sin(angle-Math.PI/7));

    p2.lineTo(tox-headlen*Math.cos(angle+Math.PI/7), toy-headlen*Math.sin(angle+Math.PI/7));
    p2.lineTo(tox, toy);
    p2.lineTo(tox-headlen*Math.cos(angle-Math.PI/7), toy-headlen*Math.sin(angle-Math.PI/7));
    p1.addPath(p2);

    return p1;
  }

  private initArrow(fieldWidth: number, player: Player): Path2D{
    const currentVectorPositionPx = player.getCurrentVectorPositionPx(fieldWidth);
    const arrowWidth = (fieldWidth - this.LINE_WIDTH * 2)/10;
    const arrowHeadLen = (fieldWidth - this.LINE_WIDTH * 2)/10;

    if(player.position.equals(player.getCurrentVectorPosition())) return new Path2D();

    const xOffset = fieldWidth/2 + (fieldWidth/3 * Math.sign(player.getCurrentVectorPosition().x - player.position.x) );
    const yOffset = fieldWidth/2 + (fieldWidth/3 * Math.sign(player.getCurrentVectorPosition().y - player.position.y) );

    return this.createArrow( player.position.x*fieldWidth + xOffset,
                             player.position.y*fieldWidth + yOffset,
                             currentVectorPositionPx.x + fieldWidth/2,
                             currentVectorPositionPx.y + fieldWidth/2,
                             arrowWidth, arrowHeadLen);
  }

  private drawArrow(ctx: CanvasRenderingContext2D,arrow: Path2D, fieldWidth: number, lineWidth: number): void{
    ctx.lineWidth = (fieldWidth - lineWidth * 2)/3;
    ctx.fill(arrow);
    ctx.stroke(arrow);
  }

  private highlightAvaliableVectors(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap,
                                    player: Player, availableVectorsPaths: Array<Path2D>,
                                    arrow: Path2D): void {
    const lineWidth = this.LINE_WIDTH;
    const fieldWidth = MapService.getFieldWidth(canvas, map);
    const availableVectors = player.getAvailableVectors();
    const onObstacle = this.onObstacle;
    const drawArrow = this.drawArrow;

    canvas.onmousemove = function(event) {
      let v = MapService.getCursorPosition(canvas, event);
      let yellowArrow = false;
      for(let i = availableVectorsPaths.length-1; i >= 0; --i) {
          const path = availableVectorsPaths[i];
          const vector = availableVectors[i];
          const isCurrentVector = vector.equals(player.getCurrentVectorPosition());
          const isPointInPath = ctx.isPointInPath(path, v.x*fieldWidth + 2*lineWidth,
                                                  v.y*fieldWidth + 2*lineWidth);
          const isOnObstacle = onObstacle(vector, map);

          if(isPointInPath) ctx.fillStyle =  (isCurrentVector) ? "#0066ffff" : "#00ff66ff";
          else ctx.fillStyle =  (isCurrentVector) ? "#0066ff77" : "#00ff6677";

          if(!isOnObstacle){
            ctx.clearRect(fieldWidth * vector.x + lineWidth,
            fieldWidth * vector.y + lineWidth,
            fieldWidth - 2 * lineWidth,
            fieldWidth - 2 * lineWidth);
            ctx.fill(path);
          }
          if(isPointInPath && !isOnObstacle) yellowArrow = true;



      }
      if(yellowArrow){
        canvas.style.cursor = 'pointer';
        ctx.fillStyle = "#ff9900";
        ctx.strokeStyle = "#ff9900";

      }
      else {
        ctx.fillStyle = "#454545";
        ctx.strokeStyle = "#454545";
      }
      drawArrow(ctx, arrow, fieldWidth, lineWidth);
    }
  }


  private changePosition(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap,
                                    player: Player, availableVectorsPaths: Array<Path2D>,
                                    arrow: Path2D): void {
    const lineWidth = this.LINE_WIDTH;
    const fieldWidth = MapService.getFieldWidth(canvas, map);
    const availableVectors = player.getAvailableVectors();
    const onObstacle = this.onObstacle;
    const isObstacleOnPath = this.isObstacleOnPathToPosition;
    const drawArrow = this.drawArrow;

    canvas.onclick = function(event) {
      let v = MapService.getCursorPosition(canvas, event);

      for(let i = availableVectorsPaths.length-1; i >= 0; --i) {

          const path = availableVectorsPaths[i];
          const vector = availableVectors[i];
          const isCurrentVector = vector.equals(player.getCurrentVectorPosition());
          const isPointInPath = ctx.isPointInPath(path, v.x*fieldWidth + 2*lineWidth,
                                                  v.y*fieldWidth + 2*lineWidth);
          const isOnObstacle = onObstacle(vector, map);

          if(isPointInPath) ctx.fillStyle =  (isCurrentVector) ? "#001155ff" : "#005511ff";
          else ctx.fillStyle =  (isCurrentVector) ? "#0066ff77" : "#00ff6677";

          if(!isOnObstacle){
            ctx.clearRect(fieldWidth * vector.x + lineWidth,
            fieldWidth * vector.y + lineWidth,
            fieldWidth - 2 * lineWidth,
            fieldWidth - 2 * lineWidth);
            ctx.fill(path);
          }
          if(isPointInPath && !isOnObstacle){
            ctx.fillStyle = "#ff9900";
            ctx.strokeStyle = "#ff9900";
            canvas.style.cursor = 'grabbing';

            for(let finish of map.finishLine){
              if(finish.equals(new Vector(availableVectors[i].x - player.position.x + player.position.x,
                availableVectors[i].y - player.position.y + player.position.y))) {
                player.playerStatus = 'WON'; 
              }
            }
            let isAvailableVector = false;
            for(let vector of player.getAvailableVectorsFromVector(new Vector(availableVectors[i].x - player.position.x,
              availableVectors[i].y - player.position.y))) {
              if(!isObstacleOnPath(new Vector(availableVectors[i].x, availableVectors[i].y), vector, map, onObstacle) && vector.x >= 0 && vector.x < map.mapWidth &&
                vector.y >= 0 && vector.y < map.mapHeight ) isAvailableVector = true;
            }
            if(!isAvailableVector) {
              player.playerStatus = 'LOST';
              setTimeout(function() { alert('Przegrałeś'); }, 1);
            }
            player.setNewVector(new Vector(availableVectors[i].x - player.position.x,
                                           availableVectors[i].y - player.position.y));



          }
          else{
            ctx.fillStyle = "#454545";
            ctx.strokeStyle = "#454545";
          }
          drawArrow(ctx, arrow, fieldWidth, lineWidth);
      }
    }
  }


  drawPlayerVectors(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, map: RaceMap, player: Player) {
      const fieldWidth = MapService.getFieldWidth(canvas, map);
      const availableVectorsPaths = new Array<Path2D>();
      const availableVectors = player.getAvailableVectors();

      // vectors
      for(let vector of availableVectors) {
          let p = new Path2D();
          availableVectorsPaths.push(p);
          ctx.fillStyle = (vector.equals(player.getCurrentVectorPosition())) ? "#0066ff77" : "#00ff6677";
          if(!this.isObstacleOnPathToPosition(player.position, vector, map) ){
            if(this.isObstacleOnPathToPosition(player.position, vector, map)) ctx.fillStyle = "#0066ff77";
            p.rect(fieldWidth * vector.x + this.LINE_WIDTH,
                   fieldWidth * vector.y + this.LINE_WIDTH,
                   fieldWidth - 2 * this.LINE_WIDTH,
                   fieldWidth - 2 * this.LINE_WIDTH);
            ctx.fill(p);
          }

      }

      // arrows
      const arrow = this.initArrow(fieldWidth, player);
      ctx.fillStyle = '#454545';
      ctx.strokeStyle = '#454545';
      this.drawArrow(this.ctx, arrow, fieldWidth, this.LINE_WIDTH);

      this.highlightAvaliableVectors(canvas, ctx, map, player, availableVectorsPaths, arrow);
      this.changePosition(canvas, ctx, map, player, availableVectorsPaths, arrow);
  }

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value;
  }

  get ctx(): CanvasRenderingContext2D {
    return this._ctx;
  }

  set ctx(value: CanvasRenderingContext2D) {
    this._ctx = value;
  }
  clearMap(){
    MapService.map.next(undefined);
  }
}
