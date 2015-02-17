<?php

require_once 'lib/phpmailer/class.phpmailer.php';


if ( $_SERVER['REQUEST_URI'] == '/client.js' ) {

    $PATH = '/opt/zerocool/trunk';

    ob_start();

    require $PATH.'/demosite/js/jquery.min.js';
    require $PATH.'/demosite/js/addcss.js';
    require $PATH.'/demosite/js/jquery-ui-1.8.16.custom.min.js';
    require $PATH.'/demosite/js/bootstrap.min.js';
    require $PATH.'/demosite/js/html2canvas.js';
    require $PATH.'/demosite/js/jquery.plugin.html2canvas.js';
    require $PATH.'/demosite/js/paper.js';
    echo file_get_contents('http://api.zerocool.reisys.com:4000/nowjs/now.js');
    require $PATH.'/demosite/js/draw.js';

    header('Content-type: text/javascript');
    echo ob_get_clean();

} else if ( $_SERVER['REQUEST_URI'] == '/client.css') {

    $PATH = '/opt/zerocool/trunk';

    ob_start();

    require $PATH.'/demosite/css/bootstrap.min.css';
    require $PATH.'/demosite/css/custom-theme/jquery-ui-1.8.16.custom.css';
    require $PATH.'/demosite/css/demo.css';
    require $PATH.'/demosite/css/bootstrap-responsive.min.css';

    header('Content-type: text/css');
    echo ob_get_clean();


} else if ( $_SERVER['REQUEST_URI'] == '/info' ) {

    phpinfo();
} else if ( $_SERVER['REQUEST_URI'] == '/upload' ) {

    if ( !empty($_POST['img']) ) {
        $encodedData = $_POST['img'];
        $encodedData = str_replace(' ','+',$encodedData);
        $decodedData = base64_decode($encodedData);
        $image_filename = md5($decodedData).'.png';
        file_put_contents('/tmp/'.$image_filename,$decodedData);

        $mail = new PHPMailer(true);

        $mail->IsSMTP();
        $mail->Host = "mail.reisys.com";
        //$mail->SMTPDebug  = 2;

        try {
            $mail->AddAddress($_POST['email']);
            $mail->SetFrom('zerocool@reisystems.com', 'Jibe Capture');
            $mail->Subject = 'Screenshot';
            $mail->Body = $_POST['message']; // optional - MsgHTML will create an alternate automatically
            $mail->AddAttachment('/tmp/'.$image_filename);      // attachment
            $mail->Send();
            echo "Message Sent OK";
        } catch (phpmailerException $e) {
            echo $e->errorMessage(); //Pretty error messages from PHPMailer
        } catch (Exception $e) {
            echo $e->getMessage(); //Boring error messages from anything else!
        }

        unlink('/tmp/'.$image_filename);

    }
} else {
    header("Status: 404 Not Found");
}
