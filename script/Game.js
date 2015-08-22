Engine.Game = {

  init: function(){
    console.log("Init Gameplay");
    this.createBoard();
    this.spawnRate = 1000;
    this.toKing = 10;

    this.currentSquad = [];
    this.nextSquad = [];
    this.squadTypes = ["warrior", "archer", "defender", "mount", "pikemen"];

    this.score = [];
    this.score[-1] = this.score[1] = 0;

    this.kingOnField = [];
    this.kingOnField[-1] = this.kingOnField[1] = false;

    this.enabledSpawn = [];
    this.enabledSpawn[-1] = this.enabledSpawn[1] = true;

    this.info = new createjs.Text(this.score[1], "32px Arial", "#fff");
    this.info.set({x: 350, y:  64+(this.mapH-1)*this.tileS - 16});
    this.info.text = " " + (this.toKing - this.score[-1]) + " vs " + (this.toKing - this.score[1]);
    Engine.stage.addChild(this.info);
  },

  addScore: function(dir){
    this.score[dir]++ ;
    this.score[dir] = Math.min(this.toKing, this.score[dir]);
    this.info.text = " " + (this.toKing - this.score[-1]) + " vs " + (this.toKing - this.score[1]);
  },

  createBoard: function(){
    console.log("Create board");

    this.mapW = 12;
    this.mapH = 7;
    this.tileS = 64;
    this.map = [];
    this.old = [];

    this.grounds = ["grass","corupted"];

    this.ground = new createjs.Container();
    this.ground.set({scaleX: 0.75, scaleY: 0.75, x:128, y: 64});
    Engine.stage.addChild(this.ground);

    this.board = new createjs.Container();
    this.board.set({scaleX: 0.75, scaleY: 0.75, x:128, y:64});
    Engine.stage.addChild(this.board);


    for(var y = 0; y < this.mapH; y++){
      this.map[y] = [];
      this.old[y] = [];
      for(var x = 0; x < this.mapW; x++){
        //var tile = new createjs.Shape();
        //tile.graphics.beginFill("#ddd").drawRect(0,0,64,64);
        var tile = new createjs.Sprite(Engine.loader.getResult("s_ground"),Engine.randomArr(this.grounds));
        tile.set({x: x * Engine.Game.tileS, y: y * Engine.Game.tileS, gridX: x, gridY: y});
        this.ground.addChild(tile);
      }
    }

  },

  getNextType: function(dir){
    if(this.score[-dir] >= this.toKing && this.kingOnField[-dir] === false){
      this.kingOnField[-dir] = true;
      return "king";
    }
    else return Engine.randomArr(this.squadTypes);
  },

  spawnSquad: function(dir, x, y){

    y = Engine.randomZ(1, this.mapH - 1);
    if(!this.nextSquad[dir]) this.nextSquad[dir] = new Engine.Squad(x,y, dir, this.getNextType(dir));
    var squad = this.nextSquad[dir];
    if(squad.canSetOnGrid(x,y) && !this.currentSquad[dir]){
      while(squad.canSetOnGrid(x-dir,y)) x-=dir;
      squad.setOnGrid(x,y);


    if(this.kingOnField[dir]) this.enabledSpawn[dir] = this.enabledSpawn[-dir] = false;
      this.nextSquad[dir] = new Engine.Squad(x,y,dir,this.getNextType(dir));
      this.currentSquad[dir] = squad;
    }
  },

  onKeyboard: function(event){
    var squad;
    if(this.currentSquad[1]){
      if(event.keyCode === 87) { // W
        squad = this.currentSquad[1];
        if(squad.canSetOnGrid(squad.x,squad.y-1)) squad.setOnGrid(squad.x,squad.y-1);
      }
      else if(event.keyCode === 83) { //S
        squad = this.currentSquad[1];
        if(squad.canSetOnGrid(squad.x,squad.y+1)) squad.setOnGrid(squad.x,squad.y+1);
      }
      else if(event.keyCode === 68){
        this.currentSquad[1].spawn();
        this.currentSquad[1] = null;
      }
    }
    else if(event.keyCode === 68 && this.enabledSpawn[1]){ //D
      this.spawnSquad(1,1,1);
    }
    if(this.currentSquad[-1]){
      if(event.keyCode === 38) { //Up
        squad = this.currentSquad[-1];
        if(squad.canSetOnGrid(squad.x,squad.y-1)) squad.setOnGrid(squad.x,squad.y-1);
      }
      else if(event.keyCode === 40) { //Down
        squad = this.currentSquad[-1];
        if(squad.canSetOnGrid(squad.x,squad.y+1)) squad.setOnGrid(squad.x,squad.y+1);
      }
      else if(event.keyCode === 37){
        this.currentSquad[-1].spawn();
        this.currentSquad[-1] = null;
      }
    }
    else if(event.keyCode === 37 && this.enabledSpawn[-1]){ // Left
      this.spawnSquad(-1,this.mapW-1,1);
    }
  },



};
