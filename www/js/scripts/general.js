$.loading = function(accion, texto){
	if(texto != undefined)
		$("#loading h1").text(texto)
	if(accion == 'show'){
		$("#loading").show()
	}else{
		$("#loading").hide()
	}
}