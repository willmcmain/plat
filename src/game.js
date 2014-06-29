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

        /*xhrObj = new XMLHttpRequest();
        xhrObj.open('GET', '/plat.tmx', false);
        xhrObj.send('');
        this.map = Map.from_xml(xhrObj.responseText);
        this.width = this.tile_width * this.map.width;
        this.height = this.tile_height * this.map.height;
        Crafty.viewport.bounds = {
            min:{x:0, y:0},
            max:{x:this.width, y:this.height}
        };*/

        Crafty.scene('Loading');
    },
}

$text_css = {
    'font-size': '48px',
    'font-family': 'Arial',
    'color': 'black',
    'text-align': 'center',
};
