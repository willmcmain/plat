Game = {
    width: 0,
    height: 0,
    screen_width: 1024,
    screen_height: 768,
    tile_width: 32,
    tile_height: 32,
    start: function() {
        var xhrObj;

        Crafty.init(this.screen_width, this.screen_height);
        Crafty.background('lightskyblue');
        Crafty.viewport.init(this.screen_width, this.screen_height);

        xhrObj = new XMLHttpRequest();
        xhrObj.open('GET', '/plat.tmx', false);
        xhrObj.send('');
        this.map = Map.from_xml(xhrObj.responseText);
        this.width = this.tile_width * this.map.width;
        this.height = this.tile_height * this.map.height;
        Crafty.viewport.bounds = {
            min:{x:0, y:0},
            max:{x:this.width, y:this.height}
        };

        for(var j = 0; j < this.map.height; j++) {
            for(var i = 0; i < this.map.width; i++) {
                var t = this.map.layers[0].data[i][j];
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

        Crafty.viewport.y = -(this.height - Crafty.viewport.height);

        Crafty.bind('EnterFrame', function() {
            var down = 98,
                left = 100,
                right = 102,
                up = 104;
            var spd = 10;

            if(Crafty.keydown[up]) {
                Crafty.viewport.y += spd;
            }
            else if(Crafty.keydown[down]) {
                Crafty.viewport.y -= spd;
            }
            else if(Crafty.keydown[left]) {
                Crafty.viewport.x += spd;
            }
            else if(Crafty.keydown[right]) {
                Crafty.viewport.x -= spd;
            }
        });
        var player = Crafty.e('Player');
        Crafty.viewport.follow(player);
    },
}
