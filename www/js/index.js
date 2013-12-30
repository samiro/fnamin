var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('offline', this.onChangeConnection, false);
        document.addEventListener('online', this.onChangeConnection, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');*/

        console.log('Received Event: ' + id);
    },
    //
    onChangeConnection: function(){
    	if( app.checkConnection() ){
    		$("body").removeClass("no-internet")
            app.with_internet = true
    	} else {
    		$("body").addClass("no-internet")
            app.with_internet = false
    	}
    },
    // Devuelve si hay o no conexión a internet
    checkConnection: function() {
	    console.log("checkConnection: Comprobando conectividad a internet!");
	    var networkState = navigator.connection.type;
	    if (networkState == Connection.NONE || networkState == Connection.UNKNOWN) {
	      console.log("checkConnection: No hay internet!");
	      return false;
	    } else {
	      console.log("checkConnection: Si hay internet!");
	      return true;
	    }
	},
};
