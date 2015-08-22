Engine.Menu = {
  init: function(){
    console.log("Init Menu");

    var units = ["s_n_king", "s_p_king", "s_n_warrior", "s_p_warrior", "s_n_archer", "s_p_archer",
      "s_n_defender", "s_p_defender", "s_n_mount", "s_p_mount", "s_n_pikemen", "s_p_pikemen"];
    var title = new createjs.Text("LD33: Monster Kings", "48px Arial", "#ff7700");
    title.set({x: 156, y: 64});
    var message = new createjs.Text(Engine.message, "20px Arial", "#ff7700");
    message.set({x: 156, y: 128});
    message.textBaseline = "alphabetic";

    Engine.stage.addChild(message);
    Engine.stage.addChild(title);

    for(var u = 0; u < 5; u++){
      var unit = new createjs.Sprite(Engine.loader.getResult(Engine.randomArr(units)), "idle");
      unit.set({x: 156 + Engine.randomR(0,400), y: 156+ Engine.randomR(0,20), regX: 32});

      Engine.stage.addChild(unit);
    }

    this.control = new createjs.Text("[W] and [S] - First player    [Up] and [Down] - Second player", "16px Arial", "#fff");
    this.control.set({x: 176, y: Engine.height - 20});
    Engine.stage.addChild(this.control);

    this.hint = new createjs.Text("Press key to continue...", "20px Arial", "#fff");
    this.hint.set({x: 276, y: 400});
    Engine.stage.addChild(this.hint);

    createjs.Tween.get(this.hint, {loop: true})
      .to({y: 395}, 500)
      .to({y: 405}, 1000)
      .to({y: 400}, 500);
  },

  onKeyboard: function(event){
    Engine.setState(Engine.Game);
  }
};
