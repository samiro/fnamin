$.loading = function(accion, texto){
	if(texto != undefined)
		$("#loading h1").text(texto)
	if(accion == 'show'){
		$("#loading").show()
	}else{
		$("#loading").hide()
	}
}

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
	},


	filtro: function(accion){
		if(accion == 'show'){
			$("#window_filtro").css("display", "block")
		}else if(accion == 'hide'){
			$("#window_filtro").css("display", "none")
		}
	}
}

