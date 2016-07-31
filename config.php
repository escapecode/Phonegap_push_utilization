<?

$API_key_google = '';	// (Android)API access key from Google API's Console.
$API_key_iphone = '';																		// (iOS) Private key's passphrase.
$API_key_wp		= "";																	// (Windows Phone 8) name of this app's push channel.

$db_host	= "localhost";
$db_user	= "";
$db_pass	= "";
$db_db		= "";

try {
	$pdo = new PDO("mysql:host=" . $db_host . ";dbname=" . $db_db, $db_user, $db_pass);
}
catch(PDOException $e) {
	die("can't connect to database $e");
}