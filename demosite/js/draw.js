paper.install(window);

var lineTool, cloudTool, selected = 'lineTool', User = {}, userId = '', toolActions, pathStyle, pathOpacity;

$(function(){

    var width = $(window).width();
    var height = $(window).height();

    var canvas_obj = $('<canvas id="clearboard" resize></canvas>');
    canvas_obj.text('unsupported browser').width(width).height(height).appendTo('body').hide();

    // Get a reference to the canvas object
    var canvas = canvas_obj.get(0);
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);

    var group = new Group(); // path group

    pathStyle = {
  		strokeColor: '#010101',
  		strokeWidth: 5
  	};

    pathOpacity = 1.0;

    toolActions = {

    	lineTool: function() {
    		selected = 'lineTool';
    		User[userId] = null;
    		lineTool.activate();
    	},
		
        cloudTool: function(){
    		selected = 'cloudTool';
    		User[userId] = null;
    		cloudTool.activate();
    	},

        eraserTool: function () {
            selected = 'lineTool';
            User[userId] = null;
          	lineTool.activate();
        },

        setStrokeColor: function ( color ) {
            pathStyle.strokeColor = color;
        },

        setStrokeWidth: function ( width ) {
            pathStyle.strokeWidth = width;
        },

        clearCanvas: function(){
    		now.clearCanvas();
    	}
    };

  	now.resetCanvas = function(){
  		group.removeChildren();
  		paper.view.draw();
  	};

  	now.receiveUserCount = function(num){
          connected_users.text(num);
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

  	now.drawPoints = function(user, tool, p, color){

  			switch(tool){
  				case 'lineTool': {
  					User[user] = {'path': new Path() };
  					User[user].path.style = pathStyle;
  					User[user].path.strokeColor = color;

  					group.addChild(User[user].path);
  					for(var i=0, len=p.length; i<len; i++){
  						var _s = p[i].split('|');
  						User[user].path.add({"x": parseInt(_s[0]), "y": parseInt(_s[1])});
  					}
  					User[user].path.simplify(10);
  					paper.view.draw();
  					points.length = 0;

  				}; break;
  				case 'cloudTool': {
  					User[user] = {'path': new Path() };
  					User[user].path.style = pathStyle;
  					User[user].path.strokeColor = color;

  					group.addChild(User[user].path);
  					var _s = p[0].split('|');
  					User[user].path.add({"x": parseInt(_s[0]), "y": parseInt(_s[1])});
  					for(var i=1, len=p.length-1; i<len; i++){
  						var _p = p[i].split('|');
  						User[user].path.arcTo({"x": parseInt(_p[0]), "y": parseInt(_p[1])});
  					}
  					paper.view.draw();
  					points.length = 0;
  					// User[user] = {'path': new Path() };

  				}; break;
  		}
  	};

    now.receiveMessage = function(name, message){
        chat_messages_area.append("<br/>" + name + ": " + message);
   	}

    now.ready(function(){
        now.setLocation(document.location.toString());
    });
	
  	// Create two drawing tools.
  	// lineTool will draw straight lines,
  	// cloudTool will draw clouds.

  	var points = [];

  	var onMouseDown = function(event) {
  		User[userId] = { path: new Path() };
  		User[userId].path.style = pathStyle;
        User[userId].path.opacity = pathOpacity;
  		User[userId].path.add(event.point);
  		group.addChild(User[userId].path);
  		points.push(event.point.x +'|'+ event.point.y);
  	};

  	var onMouseUp = function(event) {
  		if(selected == 'lineTool'){
  			User[userId].path.simplify(10);
  		}
  		points.push(event.point.x +'|'+ event.point.y);
  		var color = User[userId].path.strokeColor.toCssString();
  		// broadcast to NowJS
  		now.sendEvent(selected, points, color);
  		points.length = 0;
  	};


  	lineTool = new Tool();
  	lineTool.onMouseDown = onMouseDown;
  	lineTool.onMouseUp = onMouseUp;

  	lineTool.onMouseDrag = function(event) {
  		if(typeof User[userId].path == 'undefined'){
  			User[userId] = { path: new Path() };
  		}
  		User[userId].path.add(event.point);
  		points.push(event.point.x +'|'+ event.point.y);
  	};

  	cloudTool = new Tool();
  	cloudTool.minDistance = 20;
  	cloudTool.onMouseDown = onMouseDown;
  	cloudTool.onMouseUp = onMouseUp;

  	cloudTool.onMouseDrag = function(event) {
  		if(typeof User[userId].path == 'undefined'){
  			User[userId] = { path: new Path() };
  		}
  		// Use the arcTo command to draw cloudy lines
  		User[userId].path.arcTo(event.point);
  		// save points
  		points.push(event.point.x +'|'+ event.point.y);
  	};



    var connected_users = $('<span class="off" id="connected-users">0</span>');
    var toolbar = $('<div id="toolbar"></div>');
    toolbar.append(connected_users);
    toolbar.on('mouseenter',function(){
        if ( button_power.hasClass('on') ) {
            toolbar.filter(':not(:animated)').animate({
                width: '197'
                },400,function(){
                // when complete
            });
        }
    });

    toolbar.on('mouseleave',function(){
        toolbar.filter(':not(:animated)').animate({
            width: '59'
        },200,function(){
            // when complete

        });
    });

    var button_power = $('<div id="button_power" class="off" title="activate"></div>');
    button_power.on('click',function(){
        if ( button_power.hasClass('on') ) {
            button_power.attr('title','activate');
            canvas_obj.hide();

        } else {
            button_power.attr('title','deactivate');
            canvas_obj.show();
        }
        toolbar.toggleClass('on');
        connected_users.toggleClass('on');
        button_power.toggleClass('on');
    });

    var chat_messages_area = $('<div id="chat-messages-area"></div>');
    var chat_message_input = $('<textarea id="chat-message-input" rows="2" cols="35"></textarea>');
    chat_message_input.on('keypress',function(e){
        var code = (e.keyCode ? e.keyCode : e.which);
         if ( code == 13 ) {
			if(trim(chat_message_input.val()) != "") {
			 now.distributeMessage(clearInput(trim(chat_message_input.val())));
             chat_message_input.val("");
			}
         }
    });

    var chat_button_send = $('<button id="chat-button-send" type="button" class="btn">Send</button>');
	// Send message to people in the same group
    chat_button_send.on('click',function(){
		if(trim(chat_message_input.val()) != "") {
			now.distributeMessage(clearInput(trim(chat_message_input.val())));
			chat_message_input.val("");
		}
	});



    var chat_window = $('<div id="chat-window" title="Chat"></div>');
    chat_window.dialog({
        position: [550,300],
        width: 350,
        height:330,
        autoOpen: false,
        stack: false,
        resizable: false,
        zIndex: 9999999,
        close: function(event, ui) {
            button_chat.removeClass('on');
        }
    });

    chat_window.append(chat_messages_area,chat_message_input,chat_button_send);

    var tools_tools_container = $('<div class="btn-group"></div>');

    // Tool Selector Buttons
    var tools_button_line = $('<button id="tools_button_line" type="button" class="btn">Line</button>');
	tools_button_line.addClass('btn-danger');
	tools_button_line.on('click',function(){
        toolActions.lineTool();
		tools_button_line.addClass('btn-danger');
		tools_button_cloud.removeClass('btn-danger');
		//tools_button_eraser.removeClass('btn-danger');
    });

    var tools_button_cloud = $('<button id="tools_button_cloud" type="button" class="btn">Clouds</button>');
    tools_button_cloud.on('click',function(){
        toolActions.cloudTool();
		tools_button_line.removeClass('btn-danger');
		tools_button_cloud.addClass('btn-danger');
		//tools_button_eraser.removeClass('btn-danger');
    });

    tools_tools_container.append(tools_button_line,tools_button_cloud);

    var tools_button_clean = $('<button id="tools_button_clean" type="button" class="btn">WIPE IT CLEAN</button>');
    tools_button_clean.on('click',function(){
        toolActions.clearCanvas();
    });

    // Color Selector Buttons
    var brush_colors = [
        {name:'Black',hex:'#010101'},
        {name:'Purple',hex:'#7a289c'},
        {name:'Blue',hex:'#3754ba'},
        {name:'Aqua',hex:'#2cb4bc'},
        {name:'Green',hex:'#1c9b22'},
        {name:'Orange',hex:'#f08116'},
        {name:'Red',hex:'#e61414'}
    ];

    var tools_color_container = $('<div class="btn-group"></div>');
    var tools_botton_colors = {};
    for ( var i = 0, colorCount = brush_colors.length; i < colorCount; i++ ) {
        tools_botton_colors[brush_colors[i].name] = $('<button id="tools_button_color_'+brush_colors[i].name+'" type="button" class="btn">'+brush_colors[i].name+'</button>');
        if ( i == 0 ) {
            tools_botton_colors[brush_colors[i].name].addClass('btn-danger');
        }
        tools_botton_colors[brush_colors[i].name].on('click',(function(value) {
            return function() {
                tools_color_container.find('button').removeClass('btn-danger');
                tools_botton_colors[brush_colors[value].name].addClass('btn-danger');
                toolActions.setStrokeColor(brush_colors[value].hex);
            }
        })(i));

        tools_color_container.append(tools_botton_colors[brush_colors[i].name]);
    }

    var tools_brushsize_container = $('<div class="brushsizes"></div>');
    var tools_brushsize_small = $('<img src="img/icon-brush-sm.png" alt="small"/>');
    var tools_brushsize_large = $('<img src="img/icon-brush-lg.png" alt="large"/>');
    var tools_brushsize = $('<div id="tools-brushsize" style="width:260px; margin:15px;"></div>');
    tools_brushsize.slider({
        value: 5,
  		min: 1,
  		max: 10,
        animate: true,
  		slide: function( event, ui ) {
            toolActions.setStrokeWidth(ui.value);
  	    }
    });

    tools_brushsize_container.append(tools_brushsize_small,tools_brushsize_large,tools_brushsize);

    var tools_window = $('<div id="tools-window" title="Toolbox"></div>');
	tools_window.append(tools_button_line,tools_button_cloud,tools_brushsize_container,tools_color_container,tools_button_clean);
    tools_window.dialog({
        autoOpen: false,
        position: [100,300],
        width: 370,
        height:310,
        resizable: false,
        stack: false,
        zIndex: 9999999,
        close: function(event, ui) {
            button_tools.removeClass('on');
        }
    });

    var send_message_email_label = $('<label for="send-message-input">Email</label>');
    var send_message_email = $('<input id="send-message-email" type="text" />');
    var send_message_input_label = $('<label for="send-message-input">Message</label>');
    var send_message_input = $('<textarea id="send-message-input" rows="5" cols="35"></textarea>');
    var send_button_send = $('<button id="send-button-send" type="button" class="btn">Send</button>');
    send_button_send.on('click',function(){

        var email_address = send_message_email.val();
        var email_message = send_message_input.val();

        if ( !email_message ) {
            email_message = 'Screenshot 4 U!';
        }

        send_message_email.val('');
        send_message_input.val('');

        send_window.dialog('close');

        // hide dialogs and toolbar
        var hidden = [];

        toolbar.hide();
        if ( tools_window.dialog('isOpen') ) {
            hidden.push(tools_window);
            tools_window.dialog('close')
        }
        if ( chat_window.dialog('isOpen') ) {
            hidden.push(chat_window);
            chat_window.dialog('close')
        }

        // fire off the image
        html2canvas( [ document.body ], {
            onrendered: function( canvas ) {

                // could use this to show a preview...
                //document.body.appendChild(canvas);

                // reshow previous dialogs and toolbar
                toolbar.show();
                $.each(hidden,function(key,value){
                    value.dialog('open');
                });

                var data = canvas.toDataURL('image/png');
                var output = data.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

                $.ajax({
                  type: 'POST',
                  url: 'http://api.zerocool.reisys.com/upload',
                  data: {
                      img: output,
                      email: email_address,
                      message: email_message
                      //overlay: shape_data
                  },
                  success: function() {
                    // successful transfer

                  }
                });

            }
        });
	});

    var send_window = $('<div id="send-window" title="Email"><p>Who would you like to send this to?</p></div>');
    send_window.dialog({
        position: [1000,300],
        width: 350,
        height:310,
        autoOpen: false,
        stack: false,
        resizable: false,
        zIndex: 9999999,
        close: function(event, ui) {
            button_send.removeClass('on');
        }
    });

    send_window.append(send_message_email_label,send_message_email,send_message_input_label,send_message_input,send_button_send);


    var button_tools = $('<div id="button_tools" class="off" title="drawing tools" rel="tooltip"></div>');
    button_tools.on('click',function(){
        if ( button_tools.hasClass('on') ) {
            button_tools.attr('title','open tools');
            button_tools.removeClass('on');
            tools_window.dialog('close');
        } else  {
            button_tools.attr('title','close tools');
            button_tools.addClass('on');
            tools_window.dialog('open');
        }
    });

    var button_chat = $('<div id="button_chat" class="off" title="chat" rel="tooltip"></div>');
    button_chat.on('click',function(){
        if ( button_chat.hasClass('on') ) {
            button_chat.attr('title','open chat');
            button_chat.removeClass('on');
            chat_window.dialog('close');
        } else  {
            button_chat.addClass('on');
            button_chat.attr('title','close chat');
            chat_window.dialog('open');
            if ( !now.name) {
                now.name = prompt("What's your name?", "Guest");
                if ( !now.name ) {
                    now.name = 'Guest';
                }
            }
        }
    });

    var button_send = $('<div id="button_send" class="off" title="email snapshot" rel="tooltip"></div>');
    button_send.on('click',function(){
        if ( button_send.hasClass('on') ) {
            button_send.attr('title','open mailer');
            button_send.removeClass('on');
            send_window.dialog('close');
        } else  {
            button_send.attr('title','close mailer');
            button_send.addClass('on');
            send_window.dialog('open');
        }
    });

    toolbar.append(button_power,button_tools,button_chat,button_send);
    toolbar.appendTo('body');

    /* Trim the input string */
    function trim(stringToTrim) {
    	return stringToTrim.replace(/^\s+|\s+$/g,"");
    }

    /* Clears desired special characters */
    function clearInput(stringtoClear){
    	var specialChars = "!$^&%\/{}|<>";
    		for (var i = 0; i < specialChars.length; i++) {
    		stringtoClear = stringtoClear.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
    	}
    	var clearedString = stringtoClear;
    	return clearedString;
    }

});



