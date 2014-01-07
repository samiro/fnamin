
$.loading = function(accion, texto){
	if(texto != undefined)
		$("#loading h1").text(texto)
	if(accion == 'show'){
		$("#loading").show()
	}else{
		$("#loading").hide()
	}
}

/*document.addEventListener("offline", function(){
	navigator.notification.alert(
        "Debes tener conexión a internet para acceder a ésta sección",
        function(){
        	window.location.href="index.html"
        },
        "Sin conexión",
        "Aceptar")
}, false);*/


/*$( "#window_compartir, #window_acerca" ).tap(function(event){
	$(this).css("display", "none")
})*/


var Funciones = {
	acerca_de: function(accion){
		if(accion == 'show'){
			$("#window_acerca").css("display", "block")
		}else if(accion == 'hide'){
			$("#window_acerca").css("display", "none")
		}
	},

	compartir: function(accion){
		if(accion == 'show'){
			$("#window_compartir").css("display", "block")
		}else if(accion == 'hide'){
			$("#window_compartir").css("display", "none")
		}
	}
}



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
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    	app.onChangeConnection()
    	app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
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
    		if($("body").attr("required-internet") == "1"){
    			navigator.notification.alert(
    				"Ésta sección requiere acceso a internet.", 
    				function(){
    					window.location.href = "index.html"
    				}, "Sin conexión a internet", "Ir al inicio");
    		}
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
