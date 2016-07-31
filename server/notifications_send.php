<?php

include 'config.php';
require_once('lib/PushNotifications.php');

// Message payload
$msg_payload = array (
	'mtitle' => 'Test push notification title',
	'mdesc' => 'Test push notification body',
);

//~ $deviceID_android_regID 			= 'APA91bHdOmMHiRo5jJRM1jvxmGqhComcpVFDqBcPfLVvaieHeFI9WVrwoDeVVD1nPZ82rV2DxcyVv-oMMl5CJPhVXnLrzKiacR99eQ_irrYogy7typHQDb5sg4NB8zn6rFpiBuikNuwDQzr-2abV6Gl_VWDZlJOf4w';
//~ $deviceID_iphone_deviceToken	= 'FE66489F304DC75B8D6E8200DFF8A456E8DAEACEC428B427E9518741C92C6660';
//~ $deviceID_wp8_uri							= 'http://s.notify.live.net/u/1/sin/HmQAAAD1XJMXfQ8SR0b580NcxIoD6G7hIYP9oHvjjpMC2etA7U_xy_xtSAh8tWx7Dul2AZlHqoYzsSQ8jQRQ-pQLAtKW/d2luZG93c3Bob25lZGVmYXVsdA/EKTs2gmt5BG_GB8lKdN_Rg/WuhpYBv02fAmB7tjUfF7DG9aUL4';
//~
//~ $device_type = 'android';

//~ $registered_devices = Array(
	//~ Array (
		//~ 'type'			=>	'android',
		//~ 'deviceID'	=> $deviceID_android_regID
	//~ )
//~ );

try {
	$sth = $pdo->prepare('SELECT type, deviceID from registered_devices');

	$sth->execute();
	$registered_devices = $sth->fetchAll();
}
catch(PDOException $e) {
	die("lookup error: $e");
}

$oPushNotifications = new PushNotifications;

foreach ($registered_devices as $device)
{
	switch (strtolower($device['type']))
	{
		case 'android':
			echo $oPushNotifications->android($msg_payload, $device['deviceID']);
			break;
		case 'wp' :
			$oPushNotifications->WP8($msg_payload, $device['deviceID']);
			break;
		case 'ios':
			$oPushNotifications->iOS($msg_payload, $device['deviceID']);
			break;
	}
}