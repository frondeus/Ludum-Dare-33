Engine.Unit = function(x,y,sprite ){
  this._super.constructor.call(this);

  this.squad = null;
  this.body = new createjs.Sprite(Engine.loader.getResult(sprite), "idle");
  this.addChild(this.body);
  this.addChild(this.gfx);

  this.set({regX: 32, regY: 128-32, formX: x, formY: y});

  this.hp = 5;
  this.wounded = false;
}

Engine.Unit.prototype.remove = function(){
    Engine.map[this.gridY-1][this.gridX-1] = null;
    Engine.old[this.gridY-1][this.gridX-1] = null;
    this.squad.removeUnit(this);
    if(this.king){
      if(this.formX === 0 && this.formY === 0){
          console.log("Game over");
          Engine.resetGame(this.squad.dir);
        }
      //console.log("King dead: " + this.formX + " " + this.formY);
    }
};

Engine.Unit.prototype.addDamage = function(dmg){
  if(this.hp > 0){
    if(this.hp - dmg <= 0){
      this.wounded = true;
      createjs.Tween.get(this).wait(5000).call(this.remove,null,this);
    }

    this.hp -= dmg;
  }
};

Engine.Unit.prototype.move = function(nextX, nextY){
  //StartMove
  
  if(Engine.map[this.gridY-1][this.gridX-1] === this)
    Engine.map[this.gridY-1][this.gridX-1] = null;
  Engine.map[nextY-1][nextX-1] = this;

  createjs.Tween.get(this)
    .call(this.setAnim, ["walk"], this)
    .to({x: (nextX-1) * 66 + 32}, 1000)
    .call(this.setAnim, ["idle"], this)
    .call(function(x){
      if(Engine.old[this.gridY-1][this.gridX-1] === this)
        Engine.old[this.gridY-1][this.gridX-1] = null;
      Engine.old[nextY-1][nextX-1] = this;
      this.gridX = nextX;
      this.gridY = nextY;
      //EndMove
          if(this.gridX <= 0) {
        this.remove();        
        Engine.score[-1]++;
      }
      else if(this.gridX > Engine.mapW) {
        this.remove();
        Engine.score[1] ++;
      }

    },[nextX],this);
};

Engine.Unit.prototype.setPos = function(x,y){
  if(Engine.map[this.gridY-1][this.gridX-1] === this)
    Engine.map[this.gridY-1][this.gridX-1] = null;
  if(Engine.old[this.gridY-1][this.gridX-1] === this)
    Engine.old[this.gridY-1][this.gridX-1] = null;
  Engine.map[y-1][x-1] = this;
  Engine.old[y-1][x-1] = this;
  this.gridX = x;
  this.gridY = y;
};

Engine.Unit.prototype.setAnim = function(anim){
  this.body.gotoAndPlay(anim);
};

Engine._extends(Engine.Unit, createjs.Container);
