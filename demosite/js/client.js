

$(function(){

    var toolbar = $('<div id="toolbar"></div>');
    toolbar.on('mouseenter',function(){
        toolbar.filter(':not(:animated)').animate({
            width: '197'
        },400,function(){

        });
    });
    toolbar.on('mouseleave',function(){
        toolbar.filter(':not(:animated)').animate({
            width: '59'
        },200,function(){
            // when complete

        });
    });

    var dialog = $('<div id="dialog">I am the dialog, I am cool, I have all the cool features.</div>');
    dialog.dialog({
        autoOpen: false,
    	show: "blind",
    	hide: "explode"
    });

    var button_power = $('<div id="button_power" class="off"></div>');
    button_power.on('click',function(){
        toolbar.toggleClass('on');
        button_power.toggleClass('on');
    });

    var button_draw = $('<div id="button_draw" class="off"></div>');
    button_draw.on('click',function(){
        button_draw.toggleClass('on');
        dialog.dialog("open");
    });

    var button_chat = $('<div id="button_chat" class="off"></div>');
    button_chat.on('click',function(){
        button_chat.toggleClass('on');
        dialog.dialog("open");
    });

    var button_send = $('<div id="button_send" class="off"></div>');
    button_send.on('click',function(){
        button_send.toggleClass('on');
    });

    toolbar.append(button_power,button_draw,button_chat,button_send);
    toolbar.appendTo('body');



});