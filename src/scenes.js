foo = null;
Crafty.scene('Game', function() {
    for(var j = 0; j < Game.map.height; j++) {
        for(var i = 0; i < Game.map.width; i++) {
            var t = Game.map.layers[0].data[i][j];
            if(t !== 0) {
                var ent = Crafty.e('Tile').grid(i, j);
                ent.requires('tile_'+t);
            }
        }
    }

    Crafty.bind('EnterFrame', function() {
        var spd = 10;

        if(Crafty.keydown[Crafty.keys.NUMPAD_8]) {
            Crafty.viewport.y += spd;
        }
        else if(Crafty.keydown[Crafty.keys.NUMPAD_2]) {
            Crafty.viewport.y -= spd;
        }
        else if(Crafty.keydown[Crafty.keys.NUMPAD_4]) {
            Crafty.viewport.x += spd;
        }
        else if(Crafty.keydown[Crafty.keys.NUMPAD_6]) {
            Crafty.viewport.x -= spd;
        }
    });

    start = null;
    for(var i=0; i < Game.map.objects.length; i++) {
        var obj = Game.map.objects[i];
        if(obj.name === 'Start') {
            start = obj;
            break;
        }
    }
    if(start === null) {
        throw "No Start Location Defined!";
    }

    var player = Game.player = Crafty.e('Player').start(Number(start.x), Number(start.y));

    // Set up viewport
    Crafty.viewport.init(Game.screen_width, Game.screen_height);
    Crafty.viewport.bounds = {
        min:{x:0, y:0},
        max:{x:Game.width, y:Game.height}
    };
    Crafty.viewport.follow(player);
});


Crafty.scene('Loading', function() {
    Crafty.e('2D, Canvas, Text')
        .text('Loading...')
        .attr({ x: 0, y:0, w: Game.width});

    $.get(Game.MAP, function(data) {
        Game.map = Map.from_xml(data);
        Game.width = Game.tile_width * Game.map.width;
        Game.height = Game.tile_height * Game.map.height;

        var assets = [Player.sprite];
        $.each(Game.map.tilesets, function(i, val) {
            assets.push(val.source);
        });

        Crafty.load(assets, function() {
            // Player Sprite
            Crafty.sprite(32, 64, Player.sprite, {
                spr_player: [2,0],
            });

            $.each(Game.map.tilesets, function(index, val) {
                var gid = val.firstgid;
                var w = Crafty.asset(val.source).width / val.tilewidth;
                var h = Crafty.asset(val.source).height / val.tileheight;
                var spr_map = {};
                for(var j = 0; j < h; j++) {
                    for(var i = 0; i < w; i++) {
                        spr_map["tile_"+gid] = [i, j];
                        gid += 1;
                    }
                }

                Crafty.sprite(val.tilewidth, val.tileheight, val.source,
                              spr_map);
            });

            Crafty.scene('Game');
        });
    });
});
