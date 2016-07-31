
var google_app_number		= '605310976500';
var pushwoosh_app_id		= 'D7BEC-C3C5B';
var url_redirect						= 'http://dmsapp.net/herb-e/herbsmith/';

var pushNotification;

function onDeviceReady() {
	$("#app-status-ul").append('<li>deviceready event received</li>');

	document.addEventListener("backbutton", function(e)
	{
		$("#app-status-ul").append('<li>backbutton event received</li>');

		if( $("#home").length > 0)
		{
			// call this to get a new token each time. don't call it to reuse existing token.
			//pushNotification.unregister(handlerSuccess, handlerError);
			e.preventDefault();
			navigator.app.exitApp();
		}
		else
		{
			navigator.app.backHistory();
		}
	}, false);
}


function deviceRegister()
{
	try
	{
		pushNotification = window.plugins.pushNotification;
		$("#app-status-ul").append('<li>registering ' + device.platform + '</li>');

		if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
			pushNotification.register(handlerSuccess, handlerError, {
				"senderID": google_app_number,	// FIXME: put in config file or area.  replace_with_sender_id (app registration code) via registered app at https://console.developers.google.com/start
				"ecb":"onNotificationGCM"});		// required!
		} else {
			pushNotification.register(function(result)
			{
				$("#app-status-ul").append('<li>push register 1 - ' + result + '</li>');
				$("#app-status-ul").append('<li>updateRegistrationWebServer regID = ' + result + '</li>');
				updateRegistrationWebServer(result);
			}, handlerError, {
				"badge":"true",
				"sound":"true",
				"alert":"true",
				"ecb":"onNotificationAPN"});	// required!
		}
	}
	catch(err)
	{
		txt="There was an error on this page.\n\n";
		txt+="Error description: " + err.message + "\n\n";
		$("#app-status-ul").append('<li>' + txt + '</li>');
	}
}

function deviceUnregister()
{
	try
	{
		pushNotification = window.plugins.pushNotification;
		$("#app-status-ul").append('<li>registering ' + device.platform + '</li>');
		if (device.platform == 'android' || device.platform == 'Android' || device.platform == 'amazon-fireos' ) {
			pushNotification.unregister(handlerSuccess, handlerError, {
				"senderID":google_app_number,	// replace_with_sender_id (app registration code) via registered app at https://console.developers.google.com/start
				"ecb":"onNotificationGCM"});		// required!
		} else {
			pushNotification.unregister(handlerSuccess, handlerError, {
				"badge":"true",
				"sound":"true",
				"alert":"true",
				"ecb":"onNotificationAPN"});	// required!
		}
	}
	catch(err)
	{
		txt="There was an error on this page.\n\n";
		txt+="Error description: " + err.message + "\n\n";
		$("#app-status-ul").append('<li>' + txt + '</li>');
	}
}

function updateRegistrationWebServer(regid)
{
	$.ajax({
			type: "GET",
			url: "http://img-oc.com/herb-e/register_device.php",
			dataType: "json",
			data: "type=" + device.platform + "&deviceID=" + encodeURIComponent(regid)
		}).done(function(data) {
			$("#app-status-ul").append('<li>------------</li>');
			$("#app-status-ul").append('<li>success.  registration code = :'+ regid +'</li>');
			$("#app-status-ul").append('<li>server registered device '+ data +'</li>');
			$("#app-status-ul").append('<li>' + data.msg + '</li>');
		}).fail(function(jqXHR, textStatus, msg){
			$("#app-status-ul").append('<li> --------- fail --------</li>');
			$("#app-status-ul").append('<li>qXHR=' + jqXHR + ' status=' + textStatus + ' msg=' + msg + '</li>');
	});
}

// handle APNS notifications for iOS
function onNotificationAPN(e) {
	$("#app-status-ul").append('<li>onnotification</li>');
	if (e.alert) {
		 $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
		 // showing an alert also requires the org.apache.cordova.dialogs plugin
		 navigator.notification.$("#app-status-ul").append('<li>' + e.alert + '</li>');
	}

	if (e.sound) {
		// playing a sound also requires the org.apache.cordova.media plugin
		var snd = new Media(e.sound);
		snd.play();
	}

	if (e.badge) {
		pushNotification.setApplicationIconBadgeNumber(function (result) {
				$("#app-status-ul").append('<li>updateRegistrationWebServer regID = ' + result + '</li>');
				updateRegistrationWebServer(result);
			},
			handlerError,
			e.badge);
	}
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
	$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

	switch( e.event )
	{
		case 'registered':
		if ( e.regid.length > 0 )
		{
			$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
			// Your GCM push server needs to know the regID before it can push to this device
			// here is where you might want to send it the regID for later use.
			$("#app-status-ul").append('<li>updateRegistrationWebServer regID = ' + e.regid + '</li>');
			updateRegistrationWebServer(e.regid)
		}
		break;

		case 'message':
			// if this flag is set, this notification happened while we were in the foreground.
			// you might want to play a sound to get the user's attention, throw up a dialog, etc.
			if (e.foreground)
			{
				$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

					// on Android soundname is outside the payload.
						// On Amazon FireOS all custom attributes are contained within payload
						var soundfile = e.soundname || e.payload.sound;
						// if the notification contains a soundname, play it.
						// playing a sound also requires the org.apache.cordova.media plugin
						var my_media = new Media("/android_asset/www/"+ soundfile);

				my_media.play();
			}
			else
			{	// otherwise we were launched because the user touched a notification in the notification tray.
				if (e.coldstart)
					$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
				else
				$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
			}

			$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
			//android only
			$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
			//amazon-fireos only
			$("#app-status-ul").append('<li>MESSAGE -> TIMESTAMP: ' + e.payload.timeStamp + '</li>');
		break;

		case 'error':
			$("#app-status-ul").append('<li style="color:red;">ERROR -> MSG:' + e.msg + '</li>');
		break;

		default:
			$("#app-status-ul").append('<li style="color:red;">EVENT -> Unknown, an event was received and we do not know what it is</li>');
		break;
	}
}

function handlerSuccess (result) {
	$("#app-status-ul").append('<li>handlerSuccess ' + result + '</li>');
}

function handlerError (error) {
	$("#app-status-ul").append('<li style="color:red;">error:'+ error +'</li>');
}

document.addEventListener('deviceready', onDeviceReady, true);
