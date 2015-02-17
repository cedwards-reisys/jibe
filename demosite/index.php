<?php

require_once 'lib/phpmailer/class.phpmailer.php';

//print_r($_SERVER);

if ( $_SERVER['REQUEST_URI'] == '/info' ) {

    phpinfo();
}

if ( $_SERVER['REQUEST_URI'] == '/upload' ) {

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
}