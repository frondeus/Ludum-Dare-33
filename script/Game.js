Engine.ready= function(){
  this.createBoard();
  this.currentSquad = [];
  this.nextSquad = [];
  this.squadTypes = ["warrior", "archer", "defender", "mount", "pikemen"];
  this.score = [];
  this.kingOnField = [];
  this.score[-1] = 0;
  this.score[1] = 0;
  this.kingOnField[-1] = false;
  this.kingOnField[1] = false;

  createjs.Ticker.addEventListener("tick", this.tick);

  createjs.Tween.get(this, {loop: true})
  .wait(1000)
  .call(Engine.spawnSquad,[1,1,1],Engine)
  .wait(2000);

  createjs.Tween.get(this, {loop: true})
  .wait(1000)
  .call(function(){
    Engine.spawnSquad(-1,Engine.mapW-1,1);
  },null,this)
  .wait(2000);

};

Engine.resetGame = function(dir){
  createjs.Tween.removeAllTweens();
  Engine.init();

};

Engine.createBoard = function(){
  this.mapW = 20;
  this.mapH = 10;
  this.map = [];
  this.old = [];

  this.ground = new createjs.Container();
  this.ground.set({scaleX: 0.5, scaleY: 0.5, x: 64, y: 64});
  this.stage.addChild(this.ground);

  this.board = new createjs.Container();
  this.board.set({scaleX: 0.5, scaleY: 0.5, x: 64, y: 64});
  this.stage.addChild(this.board);

  this.queue = new createjs.Container();
  this.queue.set({scaleX: 0.5, scaleY: 0.5, x: 64, y: this.mapH * 67});
  this.stage.addChild(this.queue);


  for(var y = 0; y < this.mapH; y++){
    this.map[y] = [];
    this.old[y] = [];
    for(var x = 0; x < this.mapW; x++){
      var tile = new createjs.Shape();
      tile.graphics.beginFill("#ddd").drawRect(0,0,64,64);
      tile.set({x: x * 66, y: y * 66, gridX: x, gridY: y});
      this.ground.addChild(tile);

    }
  }

};

Engine.getNextType = function(dir){
  if(Engine.score[-dir] > 10 && Engine.kingOnField[-dir] === false) 
  {
    console.log("King on field! " + dir);
    Engine.kingOnField[-dir] = true;
    return "king";
  }
 return Engine.randomArr(Engine.squadTypes); 
};

Engine.spawnSquad = function(dir, x, y){
  y = Engine.randomZ (1,this.mapH-1);
  if(!this.nextSquad[dir]) this.nextSquad[dir] = new Engine.Squad(x,y,dir,this.getNextType(dir));
  var squad = this.nextSquad[dir];
  //Engine.queue.addChild(squad);
  if(squad.canSetOnGrid(x,y) && !Engine.currentSquad[dir]){
    while(squad.canSetOnGrid(x-dir,y))
      x-=dir;
    squad.setOnGrid(x,y);
    //Engine.queue.removeChild(squad);
    this.nextSquad[dir] = new Engine.Squad(x,y,dir,this.getNextType(dir));
    Engine.currentSquad[dir] = squad;
    createjs.Tween.get(this).wait(3000).call(function(){ 
      Engine.currentSquad[dir].spawn(); 
      Engine.currentSquad[dir] = null;
    }, null, this);
  }
};

Engine.onKeyboard = function(event){
  if(!Engine.currentSquad[1]) return;
  var squad, y;
    if(event.keyCode === 87 || event.keyCode === 38){
      squad = Engine.currentSquad[1];
      y = squad.y-1;
      if(squad.canSetOnGrid(squad.x,y))
        squad.setOnGrid(squad.x,y);    
    }
  else if(event.keyCode === 83 || event.keyCode === 40){
    squad = Engine.currentSquad[1];
    y = squad.y+1;
    if(squad.canSetOnGrid(squad.x,y))
      squad.setOnGrid(squad.x,y);    
  }
  else {
    Engine.resetGame(0);
  }
};

Engine.tick= function(event){
};

