﻿
var Insertar = {
	agr_ingreso: function(accion){
		if(accion == 'show'){
			$("#window_ingreso").css("display", "block")
			$("#mes").hide()
		}else if(accion == 'hide'){
			$("#mes").show()
			$("#window_ingreso").css("display", "none")
			$("#montoIng").val("")
			$("#notaIng").val("")
		}
	},


	agr_egreso: function(accion){
		if(accion == 'show'){
			$("#window_egreso").css("display", "block")
			$("#mes").hide()
		}else if(accion == 'hide'){
			$("#mes").show()
			$("#window_egreso").css("display", "none")
			$("#montoEgr").val("")
			$("#notaEgr").val("")
		}
	},
	
	ver_historia: function(accion){
		if(accion == 'show'){
			$("#mes").hide()
			$("#window_historia").css("display", "block")
			ConsultarHistoriaIngre();
			ConsultarHistoriaEgr();
		}else if(accion == 'hide'){
			$("#mes").show()
			$("#window_historia").css("display", "none")
		}
	}
}


	$(document).ready(function() {
		var d=new Date();
        var dat=d.getDate();
        var mon=d.getMonth();
        var year=d.getFullYear();        
       // var hoy = year+"-"+setDateZero(mon)+"-"+setDateZero(dat);
              
        $( "#mes" ).val(mon+1);
        configurar_db()
        RealizarLaConsulta();
	});
	
	var ing_vacios = "";
	var egr_vacios = "";
	function configurar_db(){

        function execute(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS ingresos (fecha_ing, valor_ing, tipo_ing, nota_ing)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS egresos (fecha_eg, valor_eg, tipo_eg, nota_eg)');
        }

        function error(error){
            console.log("Error al configurar base de datos", error)
        }

        function exito(){
            console.log("Configuración exitosa")
        }

        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(execute , error, exito);
    }
	
	function setDateZero(date){
		return date < 10 ? '0' + date : date;
    }
	
	function RealizarLaConsulta(tx) {
       RealizarConsultaIngre();
       RealizarConsultaEgre();
       RealizarSumaIngresos();
    }
	
	function GuardarNuevoIngreso() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(AgregarIngreso, errorOperacion, function(){
			if(ing_vacios=="S"){
                navigator.notification.alert("Debe diligenciar el campo valor, éste debe ser numérico y sin puntos.", function(){}, "Campo valor inválido", "Aceptar");
			}
			else if(ing_vacios == "NO_INT"){
				navigator.notification.alert("El valor debe ser numérico.", function(){}, "Campo valor inválido", "Aceptar");
			}
			else if(ing_vacios=="NN"){
                navigator.notification.alert("El valor debe ser numérico.", function(){}, "Campo valor inválido", "Aceptar");
			}
			else if(ing_vacios=="NG"){
                navigator.notification.alert("El valor debe tener máximo 9 digitos.", function(){}, "Campo valor inválido", "Aceptar");
			}
			else{
                navigator.notification.alert("Información almacenada.", function(){}, "Transacción exitosa", "Aceptar");
				RealizarConsultaIngre();
				window.location.href = "__finanzas.html";
			}
		});
    }
	
	function isNumber(value) {
	    if ((undefined === value) || (null === value)) {
	        return false;
	    }
	    if (typeof value == 'number') {
	        return true;
	    }
	    return !isNaN(value - 0);
	}


	function isInteger(value) {
	    if ((undefined === value) || (null === value)) {
	        return false;
	    }
	    return value % 1 == 0;
	}

	function AgregarIngreso(tx) {
        var today=new Date();
        var dia=today.getDate();
        var mes=today.getMonth()+1;
        var anio=today.getFullYear();

        var valor = $("#ingreso input[name='montoIng']").val();
        var hoy = anio+"-"+setDateZero(mes)+"-"+setDateZero(dia);
        var tipo = $("#ingreso [name='tipoIng']").val();
        var nota = $("#ingreso input[name='notaIng']").val();
		
		ing_vacios = "";
		
		if(valor != ""){
			if(valor.length <= 9){
				if (isInteger(valor)){
					if(!isNaN(valor) && valor > 0 && valor.indexOf(".") == -1 && valor.indexOf(",")== -1){
						tx.executeSql('INSERT INTO ingresos (fecha_ing, valor_ing, tipo_ing, nota_ing) VALUES ("'+hoy+'", "'+valor+'", "'+tipo+'","'+nota+'")');
					}else{
						ing_vacios= "NN";
					}	
				}else{
					ing_vacios = "NO_INT"
				}
				
			}else{
				ing_vacios= "NG";
			}
		}else{
			ing_vacios = "S";
		}
    }
	
	function errorOperacion(err) {
		console.log("Finanzas:errorOperacion: ")
		console.log(err)
        //navigator.notification.alert("Ocurrió un fallo, por favor vuelve a intentarlo.", function(){}, "Error", "Aceptar");
    }
	
	function RealizarConsultaIngre() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(consultaIngresos, errorOperacion, exito);
    }

    function consultaIngresos(tx) {
       		
		 var mesSeleccionado = $("#mes").val();
		 var fechas = fechaConsultas(mesSeleccionado);
		 var fechasVec= new Array(); 
		 var fechasVec = fechas.split('/');
		 
        tx.executeSql("SELECT * FROM ingresos WHERE fecha_ing >='" +fechasVec[0]+ "'AND fecha_ing <='" +fechasVec[1]+"'", [], ResultadosIngresos, function(error){
            console.log("consultaIngresos error: " + error)
        });
    }

    function ResultadosIngresos(tx, results) {
		var len = results.rows.length;
        $("#entradas-ingresos").html("");
		
;		if(len > 0){
			for (var i=0; i<len; i++){
				var nota = " Sin comentario ";
				if(results.rows.item(i).nota_ing != ""){
					nota = results.rows.item(i).nota_ing;
				}	
				var formatValor = dar_formato(results.rows.item(i).valor_ing);				
				$("#entradas-ingresos").append('<div class="entrada-finanzas"><label class="fecha">'+results.rows.item(i).fecha_ing+"  "+results.rows.item(i).tipo_ing+'</label><label class="valor">$'+formatValor+'</label><label class="fecha">'+nota+'</label></div>')
			}		
		}else{
			$("#entradas-ingresos").append('<div class="entrada-finanzas"><label class="fecha">No hay registro de ingresos en este mes</label><label class="valor">$0</label><label class="fecha">  </label></div>')
		}
       RealizarSumaIngresos();
    }
	
	 function RealizarSumaIngresos() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(SumarIngresos, errorOperacion, exito);
    }

    function SumarIngresos(tx) {
         var mesSeleccionado = $("#mes").val();
		 var fechas = fechaConsultas(mesSeleccionado);
		 var fechasVec= new Array(); 
		 var fechasVec = fechas.split('/');
		 
        tx.executeSql("SELECT SUM(valor_ing) as totalIng FROM ingresos WHERE fecha_ing >='" +fechasVec[0]+ "'AND fecha_ing <='" +fechasVec[1]+"'",[], ResSumaIngresos, errorOperacion);
    }

    function ResSumaIngresos(tx, results) {
        window.ingresos = results.rows.item(0).totalIng;
        SumarEgresos(tx);
    }
	
	function SumarEgresos(tx) {
		var mesSeleccionado = $("#mes").val();
		var fechas = fechaConsultas(mesSeleccionado);
		var fechasVec= new Array(); 
		var fechasVec = fechas.split('/');
		tx.executeSql("SELECT SUM(valor_eg) as totalEg FROM egresos WHERE fecha_eg >='" +fechasVec[0]+ "'AND fecha_eg <='" +fechasVec[1]+"'",[], SaldoTotal, errorOperacion);
    }

    function SaldoTotal(tx, results) {
		var egresos = results.rows.item(0).totalEg;
		var dif = window.ingresos - egresos
		var	rtado = dar_formato(dif);
        var diferencia = "$" +rtado;
		
		if(dif < 0){
			$("#tit_ahorro").text("Haz gastado más de lo que haz ganado");
			$("#sActual").html(diferencia);
			$("#sActual").css("color","#B40404");
			$("#pie_ahorro").text("Planea mejor tus gastos según tu presupuesto.");
		}else if(dif == 0){
			$("#tit_ahorro").text("No haz logrado ahorrar en este periodo");
			$("#sActual").html(diferencia);
			$("#sActual").css("color","#1A3C8F");
			$("#pie_ahorro").text("Mejora tu plan de gastos según tu presupuesto.");
		}else{
			$("#tit_ahorro").text("Haz ahorrado en este periodo");
			$("#sActual").html(diferencia);
			$("#sActual").css("color","#C1D82F");
			$("#pie_ahorro").text("Puedes acercarte a una oficina fna para invertir tu ahorro.");
		}
    }
	
	function exito() {
      	console.log("Exito")
    }
	
	function listoAgregarEgreso() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(AgregarEgreso, errorOperacion, function(){		
			if(egr_vacios=="S"){
                navigator.notification.alert("Debe diligenciar el campo valor, éste debe ser numérico y sin puntos.", function(){}, "Campo valor inválido", "Aceptar");
			}
			else if(egr_vacios=="NO_INT"){
                navigator.notification.alert("El valor debe ser numérico.", function(){}, "Campo valor inválido", "Aceptar");
			}
			else if(egr_vacios=="NN"){
                navigator.notification.alert("El valor debe ser numérico.", function(){}, "Campo valor inválido", "Aceptar");
			}
			else if(egr_vacios=="NG"){
                navigator.notification.alert("El valor debe tener máximo 9 digitos.", function(){}, "Campo valor inválido", "Aceptar");
			}
			else{
                navigator.notification.alert("Información almacenada.", function(){}, "Transacción exitosa", "Aceptar");
				RealizarConsultaEgre();
				window.location.href = "__finanzas.html";
			}
		});
	}
   
   function AgregarEgreso(tx) {
        var today=new Date();
        var dia=today.getDate();
        var mes=today.getMonth()+1;
        var anio=today.getFullYear();

        var valor = $("#egreso input[name='montoEgr']").val();
        var hoy = anio+"-"+setDateZero(mes)+"-"+setDateZero(dia);
        var tipo = $("#egreso [name='tipoEgr']").val();
        var nota = $("#egreso input[name='notaEgr']").val();
		egr_vacios = "";
		if(valor != ""){
			if(valor.length <= 9){
				if (isInteger(valor)){
					if(!isNaN(valor) && valor > 0 && valor.indexOf(".")== -1 && valor.indexOf(",")== -1){
						tx.executeSql('INSERT INTO egresos (fecha_eg, valor_eg, tipo_eg, nota_eg) VALUES ("'+hoy+'", "'+valor+'", "'+tipo+'","'+nota+'")');
					}else{
						egr_vacios= "NN";
					}
				}else{
					egr_vacios = "NO_INT"
				}
			}else{
				egr_vacios= "NG";
			}
		}else{
			egr_vacios= "S";
		}
    }

    function RealizarConsultaEgre() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(consultaEgresos, errorOperacion, exito);
    }

    function consultaEgresos(tx) {
        var mesSeleccionado = $("#mes").val();
		var fechas = fechaConsultas(mesSeleccionado);
		var fechasVec= new Array(); 
		var fechasVec = fechas.split('/');
        tx.executeSql("SELECT * FROM egresos WHERE fecha_eg >='" +fechasVec[0]+ "'AND fecha_eg <='" +fechasVec[1]+"'", [], ResultadosEgresos, function(error){
            console.log("consultaEgresos error: " + error)
        });
	}

    function ResultadosEgresos(tx, results) {
        var len = results.rows.length;
        $("#entradas-egresos").html("");
		if(len > 0){
			for (var i=0; i<len; i++){
				var nota = " Sin comentario ";
				if(results.rows.item(i).nota_eg != ""){
					nota = results.rows.item(i).nota_eg;
				}	
				var formatValor = dar_formato(results.rows.item(i).valor_eg);
				$("#entradas-egresos").append('<div class="entrada-finanzas"><label class="fecha">'+results.rows.item(i).fecha_eg+" - "+results.rows.item(i).tipo_eg+'</label><label class="valor">$'+formatValor+'</label><label class="fecha">'+nota+'</label></div>')
			}
		}else{
			$("#entradas-egresos").append('<div class="entrada-finanzas"><label class="fecha">No hay registro de gastos en este mes</label><label class="valor">$0</label><label class="fecha">  </label></div>')
		}
        RealizarSumaIngresos();
    }
	
	function fechaConsultas(mesSeleccionado) {
       
		var d=new Date();
        var dat=d.getDate();
        var mon=d.getMonth();
		var monH=d.getMonth()+1;
        var year=d.getFullYear();
		var fd ="";
		var fh ="";
		//var Hoy = year +"-"+ setDateZero(monH) +"-"+ setDateZero(dat);
		
		if(mesSeleccionado == "1" || mesSeleccionado == "3" || mesSeleccionado == "5" || mesSeleccionado == "7" || mesSeleccionado == "8" || mesSeleccionado == "10" || mesSeleccionado == "12"){
			var diaFin = "31";
		}else if(mesSeleccionado == "2"){
			var diaFin = "28";
		}else{
			var diaFin = "30";
		}
		
		if(mesSeleccionado <= monH){
			fd = year +"-"+ mesSeleccionado +"-"+ "01";
			fh = year +"-"+ mesSeleccionado +"-"+ diaFin;
		}else if(mesSeleccionado > monH){
			fd = (year -1) +"-"+ mesSeleccionado +"-"+ "01";
			fh = (year -1) +"-"+ mesSeleccionado +"-"+ diaFin;
		}
		return fd + "/" + fh;
    }

	
	////////////////////////////
function dar_formato(num){  
  
	var cadena = "";
	var aux; 
	var cont = 0,m,k;  
	 
	num=num.toString();  
	  	  
	for(m=num.length-1; m>=0; m--){ 	  
		cadena = num.charAt(m) + cadena; 	  
		cont++;
		if(cont == 3 && num.length > 3)
		{
			cadena = "," + cadena; 
		}
		else if(cont == 6 && num.length > 7)
		{
			cadena = "'" + cadena; 
		}
		else if(cont == 9 && num.length > 10)
		{
			cadena = "," + cadena; 
		}
	}  
	return cadena;  
}  

