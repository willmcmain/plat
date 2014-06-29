Crafty.scene('Game', function() {
    for(var j = 0; j < Game.map.height; j++) {
        for(var i = 0; i < Game.map.width; i++) {
            var t = Game.map.layers[0].data[i][j];
            if(t !== 0) {
                var ent = Crafty.e('Tile').grid(i, j);
                switch(t) {
                    case 1:
                        ent.color('rgb(0, 127, 0)');
                        break;
                    case 2:
                        ent.color('rgb(135, 82, 24)');
                        break;
                    case 4:
                        ent.color('rgb(127, 127, 127)');
                        break;
                }
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
    var player = Crafty.e('Player');
    Crafty.viewport.follow(player);
});


Crafty.scene('Loading', function() {
    Crafty.e('2D, Canvas, Text')
        .text('Loading...')
        .attr({ x: 0, y:0, w: Game.width});
        //.css($text_css);
    var player = 'assets/luigi.png';

    jQuery.get('/plat.tmx', function(data) {
        Game.map = Map.from_xml(data);
        Game.width = Game.tile_width * Game.map.width;
        Game.height = Game.tile_height * Game.map.height;
        Crafty.viewport.bounds = {
            min:{x:0, y:0},
            max:{x:Game.width, y:Game.height}
        };

        Crafty.load([player], function() {
            Crafty.sprite(32, 64, player, {
                spr_player: [2,0],
            });

            Crafty.scene('Game');
        });
    });
});
