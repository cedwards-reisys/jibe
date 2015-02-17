var httpServer = require('http').createServer(function(req, response){ /* Serve your static files */ });
httpServer.listen(4000);

var nowjs = require("now");
var everyone = nowjs.initialize(httpServer);


var paper = [];

// What to do when a user connects / disconnects from the app
nowjs.on('connect', function(){
	this.now.userId = this.user.clientId;
    if ( typeof this.now.location == "undefined" ) {
        this.now.location = 'default';
    }
    if ( typeof paper[this.now.location] == "undefined" ) {
        paper[this.now.location] = [];
    }
	this.now.connected(this.user.clientId,paper[this.now.location]);
    console.log('User Connected: '+ this.now.userId);
})
.on('disconnect', function(){
    // Update user count
    everyone.now.disconnected(this.user.clientId);
    console.log('DISCONNECTED: '+ this.now.userId);
});

everyone.now.logStuff = function(msg){
    console.log(msg);
};

everyone.now.setLocation = function ( newLocation ) {
    var oldLocation = this.now.location;
    console.log('Changed user '+this.now.name + ' from '+oldLocation + ' to '+newLocation);
    //if old room is not null; then leave the old room
    if ( oldLocation ) {
        var oldGroup = nowjs.getGroup(oldLocation);
        oldGroup.removeUser(this.user.clientId);
    }
    var newGroup = nowjs.getGroup(newLocation);
    newGroup.addUser(this.user.clientId);
    // Tell everyone he joined
    //newGroup.now.receiveMessage('SERVER@'+newRoom, this.now.name + ' has joined the room');
    this.now.location = newLocation;
};

// Send message to everyone on the users group
everyone.now.distributeMessage = function(message) {
    //console.log('Received message from '+this.now.name +' in serverroom '+this.now.serverRoom);
    var group = nowjs.getGroup(this.now.location);
    //group.now.receiveMessage(this.now.name+'@'+this.now.serverRoom, message);
    group.now.receiveMessage(this.now.name, message);
};

/**
 *  sendEvent - Share line data with all users
 *
 *  This is called on the client when a user is done drawing a line
 *  Point data and the tool used are transmitted to the `drawPoints` clientside function
 */
everyone.now.sendEvent = function(tool, points, color){
    var user = this.now.userId;
    console.log('pushing paper points for: '+this.now.location);
    if (typeof paper[this.now.location] == "undefined") {
        paper[this.now.location] = [];
    }
    paper[this.now.location].push([user, tool, points, color]);
    var group = nowjs.getGroup(this.now.location);
    group.exclude([this.user.clientId]).now.drawPoints(user, tool, points, color);

};

/**
 *  clearCanvas - Clears the canvas for everyone.
 */
everyone.now.clearCanvas = function(){
    paper[this.now.location] = [];
    var group = nowjs.getGroup(this.now.location);
	group.now.resetCanvas();
};

/**
 *  Update the user count for all connected users
 *
 */
everyone.now.distributeUserCount = function(){
    var group = nowjs.getGroup(this.now.location);
    group.count(function (ct) {
        group.now.receiveUserCount(ct);
    });

};