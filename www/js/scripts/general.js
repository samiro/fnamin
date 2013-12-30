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


document.addEventListener("deviceready", function(){
	console.log("deviceready: Dispositivo listo")
})