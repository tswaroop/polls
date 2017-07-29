var fs = require('fs');
var server = require('webserver');

var page = require('webpage').create();


function requst_handler(request, response){
    var page = require('webpage').create();
    //var q = parseUri(request.postRaw || request.url).queryKey;
    var q = request.post ||  parseUri(request.url).queryKey;
    var url = decodeURIComponent(decodeURIComponent(q.url));
    console.log(url)
    console.log('********************')
    var delay = decodeURIComponent(q.delay || 0);

    var file = q.file || 'screenshot.png';
    if (fs.exists(file)) {
        fs.removeTree(file);
    }
    if (!url) {
        return response.close();
    }

    var width = parseFloat(q.width || '1366', 10);
    var height = parseFloat(q.height || '643', 10);
    page.zoomFactor = parseFloat('1',10);


    if(file.split('.')[1].toLowerCase() == 'pdf'){
      page.viewportSize = { width: width, height: height-100 };
    }else{
      var papersize = 'A4'
      page.paperSize = {
          format: papersize,
          orientation: decodeURIComponent('landscape'),
      };
      page.viewportSize = { width: width, height: height };
    }





    page.customHeaders = {
        'Cookie': request.headers.Cookie
    };


    page.open(url, function(status) {
        setTimeout(function() {
            //console.log(url, file, page.paperSize.orientation, delay);
            page.render(file);
            var pdf = fs.read(file, 'b');
            response.statusCode = 200;
            response.headers = {
                'Content-Type': mime(file),
                'Content-Disposition': 'attachment; filename=' + file
            };
            response.setEncoding('binary');
            response.write(pdf);
            console.log('worked');
            response.close();
        }, delay);
    });
}

var app_ports = [8000];
app_ports.forEach( function(app_port) {
    var bound = server.create().listen(app_port, requst_handler);
    console.log('Capture.js instance listeing on port: ', app_port, ' Status :', bound);
});


function mime(file) {
    return (file.match(/\.pdf$/i) ? 'application/pdf' :
            file.match(/\.png$/i) ? 'image/png' :
            file.match(/\.gif$/i) ? 'image/gif' :
            file.match(/\.jpg$/i) ? 'image/jpeg' :
            'application/octet-stream'
           );
}

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

function parseUri(str) {
    var o   = parseUri.options,
        m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i   = 14;

    while (i--) uri[o.key[i]] = m[i] || "";

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
    });

    return uri;
}

parseUri.options = {
    strictMode: false,
    key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
    q:   {
        name:   "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
    }
};
