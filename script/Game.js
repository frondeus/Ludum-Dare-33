Engine.Game = {

  init: function(){
    console.log("Init Gameplay");
    this.createBoard();

    this.currentSquad = [];
    this.nextSquad = [];
    this.squadTypes = ["warrior", "archer", "defender", "mount", "pikemen"];

    this.score = [];
    this.score[-1] = this.score[1] = 0;

    this.kingOnField = [];
    this.kingOnField[-1] = this.kingOnField[1] = false;

    createjs.Tween.get(this, {loop: true})
    .wait(1000)
    .call(Engine.Game.spawnSquad,[1,1,1],this)
    .wait(2000);
    createjs.Tween.get(this, {loop: true})
    .wait(1000)
    .call(Engine.Game.spawnSquad,[-1,this.mapW-1,1],this)
    .wait(2000);
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
    this.ground.set({scaleX: 0.5, scaleY: 0.5, x:64, y: 64});
    Engine.stage.addChild(this.ground);

    this.board = new createjs.Container();
    this.board.set({scaleX: 0.5, scaleY: 0.5, x:64, y:64});
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
    if(this.score[-dir] > 10 && this.kingOnField[-dir] === false){
      this.kingOnField[-dir] = true;
      return "king";
    }
    else return Engine.randomArr(this.squadTypes);
  },

  spawnSquad: function(dir, x, y){
    console.log("Spawn formation: " + dir);

    y = Engine.randomZ(1, this.mapH - 1);
    if(!this.nextSquad[dir]) this.nextSquad[dir] = new Engine.Squad(x,y, dir, this.getNextType(dir));
    var squad = this.nextSquad[dir];
    if(squad.canSetOnGrid(x,y) && !this.currentSquad[dir]){
      while(squad.canSetOnGrid(x-dir,y)) x-=dir;
      squad.setOnGrid(x,y);

      this.nextSquad[dir] = new Engine.Squad(x,y,dir,this.getNextType(dir));
      this.currentSquad[dir] = squad;
      createjs.Tween.get(this).wait(3000).call(function(){
        this.currentSquad[dir].spawn();
        this.currentSquad[dir] = null;
      },null,this);
    }
  },

  onKeyboard: function(){
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

    }
  },



};
