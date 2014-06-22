Game = {
    tile_width: 32,
    tile_height: 32,
    start: function() {
        var xhrObj;

        Crafty.init(3200, 1024);
        Crafty.background('lightskyblue');

        xhrObj = new XMLHttpRequest();
        xhrObj.open('GET', '/plat.tmx', false);
        xhrObj.send('');
        this.map = Map.from_xml(xhrObj.responseText);

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
    },
}
