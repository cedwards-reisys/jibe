paper.install(window);
var tool1, tool2, tool3;
var group;
var tool4 = {
    clear: function () {
        group.removeChildren();
        paper.view.draw();
    }
};


$(function(){

    var width = $(window).width();
    var height = $(window).height();

    var tool1_button = $('<a href="javascript:tool1.activate();">Red Line</a>');
    var tool2_button = $('<a href="javascript:tool2.activate();">Blue Line</a>');
    var tool3_button = $('<a href="javascript:tool3.activate();">Purple Line</a>');
    var tool4_button = $('<a href="javascript:tool4.clear();">Clear</a>');

    var toolbar = $('<div id="super-tools"></div>');
    tool1_button.appendTo(toolbar);
    tool2_button.appendTo(toolbar);
    tool3_button.appendTo(toolbar);
    tool4_button.appendTo(toolbar);

    toolbar.appendTo('body');

    var canvas_obj = $('<canvas id="clearboard" resize></canvas>');
    canvas_obj.text('unsupported browser').width(width).height(height).appendTo('body');

    // Get a reference to the canvas object
    var canvas = canvas_obj.get(0);
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    group = new Group();

    var path;

    tool1 = new Tool();
    tool1.onMouseDown = function ( event ) {
        path = new Path();
        path.strokeWidth = 5;
        path.strokeColor = 'red';
        path.add(event.point);
        group.addChild(path);
    }

    tool1.onMouseUp = function () {
        path.simplify(10);
        //path.smooth();
    }

    tool1.onMouseDrag = function(event) {
        path.add(event.point);
    }

    //////////////////////////////////////////////

    tool2 = new Tool();
    tool2.onMouseDown = function ( event ) {

        path = new Path();
        path.strokeWidth = 5;
        path.strokeColor = 'blue';
        path.add(event.point);
        group.addChild(path);
    }

    tool2.onMouseDrag = function(event) {
        path.add(event.point);
    }


    tool2.onMouseUp = function () {
        path.simplify(10);
    }

    //////////////////////////////////////////////

    tool3 = new Tool();
    tool3.onMouseDown = function ( event ) {
        path = new Path();
        path.strokeWidth = 5;
        path.strokeColor = 'purple';
        path.add(event.point);
        group.addChild(path);
    }

    tool3.onMouseDrag = function(event) {
        path.add(event.point);
    }


    tool3.onMouseUp = function () {
        path.simplify(10);
    }

});

now.ready(function(){
  // "Hello World!" will print on server
  now.logStuff("Hello World!");
});

now.resetCanvas = function(){
	group.removeChildren();
	paper.view.draw();
};

now.receiveUserCount = function(num){
  $('#appTitle b').text(num);
};

now.connected = function(id, data){
  userId = id;
  now.distributeUserCount();
   // draw everything for this user from the `data` passed in
   $.each(data, function(i, d){
     now.drawPoints(d[0], d[1], d[2], d[3]);
   });
};

now.disconnected = function(userId){
  now.distributeUserCount();
};

