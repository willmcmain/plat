(function () {
Map = {};

Map.from_xml = function (xml) {
    xmap = $(jQuery.parseXML(xml)).find('map');
    var map = {
        width: Number(xmap.attr('width')),
        height: Number(xmap.attr('height')),
        tilesets: [],
        layers: [],
        objects: [],
    };

    xmap.find('tileset').each(function() {
        var ts = {
            name: $(this).attr('name'),
            firstgid: Number($(this).attr('firstgid')),
            tilewidth: Number($(this).attr('tilewidth')),
            tileheight: Number($(this).attr('tileheight')),
        };
        var img = $(this).find('image');
        ts.source = img.attr('source');
        map.tilesets.push(ts);
    });

    xmap.find('layer').each(function() {
        var layer = {
            name: $(this).attr('name'),
            data: [],
        }

        var data = $(this).find('data').text().split(',').map(Number);
        for (var x = 0; x < map.width; x++) {
            layer.data.push([]);
            for (var y = 0; y < map.height; y++) {
                layer.data[x].push(data[y * map.width + x]);
            }
        }

        map.layers.push(layer);
    });

    xmap.find('object').each(function() {
        map.objects.push(Utils.attributes(this));
    });

    return map;
};

})();
