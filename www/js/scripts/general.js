$.loading = function(accion, texto){
	if(texto != undefined)
		$("#loading h1").text(texto)
	if(accion == 'show'){
		$("#loading").show()
	}else{
		$("#loading").hide()
	}
}

$( "#window_compartir, #window_acerca" ).tap(function(event){
	$(this).css("display", "none")
})






$( ".tap-acerca" ).tap( function( event ){
	$("#window_acerca").css("display", "block")
})

$( ".tap-compartir" ).tap( function( event ){
	$("#window_compartir").css("display", "block")
})

