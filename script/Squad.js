var genId = 0;
Engine.Squad = function(x,y,dir, type){
  //this._super.constructor.call(this);
  this.dir = dir;
  this.id = genId++;
  this.delay = 0;
  this.units = [];
  this.x = x;
  this.y = y;

  var side = dir===1?"positive":"negative";

  var data = Engine.loader.getResult("u_" + type);
  //console.log(data.type);
  this.type = data.type;
  this.dmg = data.dmg;
  this.formation = Engine.randomArr(data.formations);
  this.sprite = Engine.randomArr(data.sprite[side]);
  this.isRange = data.range;
  if(data.projectile)
    this.projectile = Engine.randomArr(data.projectile[side]);

  for(var f in this.formation){
    var unit;
    if(this.dir < 0){
      unit = new Engine.Unit(-this.formation[f][1],this.formation[f][0],this.sprite);
    }
    else{
    
      unit = new Engine.Unit(this.formation[f][1]+1,this.formation[f][0],this.sprite);
    }
    this.addUnit(unit);
    unit.king = this.type === "king";
    unit.set({x: Engine.Game.tileS* (x + unit.formX - 1) + 32, y: Engine.Game.tileS * (y + unit.formY - 1), scaleX: dir});
  }

  //this.setMouseInput();
};

Engine.Squad.prototype = {

  addUnit: function(unit){
    this.units.push(unit);
    unit.squad = this;
  },

  removeUnit: function(unit){
    Engine.Game.board.removeChild(unit);
    var i = this.units.indexOf(unit);
    if(i > -1) this.units.splice(i,1);
  },

  canSetOnGrid: function(x,y){
    for(var u in this.units){
      var unit = this.units[u];
      var gX = unit.formX + x;
      var gY = unit.formY + y;
      if(gX < 1 || gX > Engine.Game.mapW
         || gY < 1 || gY > Engine.Game.mapH)
       return false;

      var other = Engine.Game.map[gY-1][gX-1];
      if(other) return false;
      other = Engine.Game.old[gY-1][gX-1];
      if(other) return false;
    }
    return true;
  },

  setOnGrid: function(x,y){
    this.x= x;
    this.y = y;
      for(var u in this.units){
        var unit = this.units[u];
        Engine.Game.board.removeChild(unit);
        Engine.Game.board.addChild(unit);
        unit.set({ gridX: x + unit.formX , gridY: y + unit.formY ,
                 x: Engine.Game.tileS* (x + unit.formX -1) + 32, y: Engine.Game.tileS * (y + unit.formY -1)});
      }
      //SORT!:
      Engine.Game.board.sortChildren(function(a,b){
        return a.y - b.y;
      });
  },

  spawn: function(){
    for(var u in this.units){
      var unit = this.units[u];
      unit.setPos(unit.gridX,unit.gridY);
    }
    this.step();
  },

  step: function(){
    this.delay = 200;
    if(this.canGoForward()) this.goForward();
    else this.doAction();
    createjs.Tween.get(this).wait(this.delay).call(this.step,null,this);
  },

  doAction: function(){
    for(var c in this.units){
      var unit = this.units[c];
      var enemy = Engine.Game.map[unit.gridY-1][unit.gridX+this.dir-1];
      if(enemy && enemy.squad.dir !== this.dir)
        this.attack(unit,enemy);
      else if(this.isRange){
        enemy = Engine.Game.map[unit.gridY-1][unit.gridX+this.dir+this.dir-1];
        if(enemy && enemy.squad.dir !== this.dir)
          this.attack(unit,enemy);
      }
    }

    this.delay += 1000;
  },

  addDamage: function(unit, enemy){
    if(!this.dmg) return;
    if(enemy && enemy.squad && this.dmg[enemy.squad.type]){
      enemy.addDamage(this.dmg[enemy.squad.type]/ unit.wounded?2:1);
    }

  },

  attack: function(unit, enemy){
    if(!this.dmg) {
      unit.setAnim(unit.wounded?"w_idle":"idle");
      return;
    }
    if(unit.wounded && Engine.randomB()) {
      unit.setAnim("w_idle");
      return;
    }
    if(this.isRange){
      createjs.Tween.get(unit)
      .call(unit.setAnim,[unit.wounded?"w_dmg":"dmg"],unit)
      .wait(1000)
      .call(unit.setAnim,[unit.wounded?"w_idle":"idle"],unit)
      .call(function(x,y,ex,ey,dir){
        var projectile = new createjs.Sprite(Engine.loader.getResult("s_projectiles"),this.projectile);
        //projectile.set({regX: 32, regY: 32, scaleX: this.scaleX,x: x, y: y - 32});
        Engine.Game.board.addChild(projectile);
        projectile.set({x: (x-1) * Engine.Game.tileS + 32, y: (y-1) * Engine.Game.tileS - 32, scaleX: dir, regX: 32, regY: 64});

        createjs.Tween.get(projectile)
        .to({x: (ex-1) * Engine.Game.tileS + 32, y: (ey-1) * Engine.Game.tileS - 32}, 200)
        .call(this.addDamage,[unit,enemy],this)
        .call(function(){
          Engine.Game.board.removeChild(this);
        },null,projectile);
      },[unit.gridX,unit.gridY,enemy.gridX,enemy.gridY,this.dir],this);
    }
    else{
      createjs.Tween.get(unit)
      .call(unit.setAnim,[unit.wounded?"w_dmg":"dmg"],unit)
      .wait(1000)
      .call(unit.setAnim,[unit.wounded?"w_idle":"idle"],unit)
      .call(this.addDamage,[unit,enemy],this);
    }
  },


  goForward: function(){
    for(var c in this.units){
      var unit = this.units[c];
      var gX = unit.gridX + this.dir;
      unit.scaleX = this.dir;

      unit.move(gX,unit.gridY);
    }
    this.delay += 1000;
  },

  canGoForward: function(){
    for(var c in this.units){
      var unit = this.units[c];
      if(unit.wounded) return false;
      var enemy = Engine.Game.map[unit.gridY-1][unit.gridX+this.dir-1];
      if(enemy && enemy.squad && enemy.squad.id !== this.id) return false;
      enemy = Engine.Game.old[unit.gridY-1][unit.gridX+this.dir-1];
      if(enemy && enemy.squad && enemy.squad.id !== this.id) return false;
    }
    return true;
  }

};

//Engine._extends(Engine.Squad, createjs.Container);
