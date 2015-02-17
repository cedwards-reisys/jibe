

$(function(){

function addCSS ( path, domain ) {
    var url = path;
    if ( domain ) {
        url = domain + path;
    }

    if (document.createStyleSheet){ // for IE
        document.createStyleSheet(url);
    } else {
        $("head").append('<link rel="stylesheet" type="text/css" href="'+url+'" media="all" />');
    }
}

addCSS('/client.css','http://api.zerocool.reisys.com');


});