var Engine = {};
Engine._extends = function(ChildClass, ParentClass)
{
    var F = function() { };
    //F.prototype = ParentClass.prototype;
    for(var n in ParentClass.prototype)
      F.prototype[n] = ParentClass.prototype[n];
    for(var m in ChildClass.prototype)
        F.prototype[m] = ChildClass.prototype[m];
    ChildClass.prototype = new F();
    ChildClass.prototype.constructor = ChildClass;
    ChildClass.prototype._super = ParentClass.prototype;        
};

Engine.init= function(){
  console.log("init");
  this.loader = new createjs.LoadQueue();
  this.stage = new createjs.Stage("canvas");

  this.loader.on("complete", this.ready, this);
  this.loader.on("error", function(evt){
   console.log("Could not load files: ");
   console.log(evt.data.id);
  });
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", this.stage);

  this.loader.loadManifest("resources.json");
  document.onkeydown = Engine.onKeyboard;
};

function resize(){
  Engine.stage.canvas.width = window.innerWidth;
  Engine.stage.canvas.height = window.innerHeight;
}

function init(){
  Engine.init();
  window.addEventListener("resize",resize,false);
  resize();
}

Engine.randomB = function(){
  return Math.random() < 0.5;
};

Engine.randomR = function(min, max){
  return Math.random() * (max - min) + min;
};

Engine.randomZ = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

Engine.randomArr = function(arr){
  if(arr.length < 1) return undefined;
  return arr[this.randomZ(0,arr.length-1)];
};
