$(function(){


    var canvas_shape_ctx = document.getElementById("canvas_shape").getContext('2d');
    canvas_shape_ctx.fillStyle = "#FF3366";
    canvas_shape_ctx.fillRect(15,15,70,70);

        // draw circle
    canvas_shape_ctx.fillStyle = "#0066FF";
    canvas_shape_ctx.beginPath();
    canvas_shape_ctx.arc(75,75,35,0,Math.PI*2,true);
    canvas_shape_ctx.fill();



    $('#capture_button').on('click',function(){

        //$('#canvas_shape').hide();

        html2canvas( [ document.body ], {
            onrendered: function( canvas ) {

                document.body.appendChild(canvas);

                var data = canvas.toDataURL('image/png');
                var output = data.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

                var canvas_shape = document.getElementById("canvas_shape");
                var shape_data = canvas_shape.toDataURL('image/png').replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

                $.ajax({
                  type: 'POST',
                  url: '/upload',
                  data: {
                      img: output,
                      overlay: shape_data
                  },
                  success: function() {
                    console.log('sent');
                  }
                });

            }
        });

    });


});