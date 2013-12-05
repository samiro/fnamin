
var Insertar = {
	agr_ingreso: function(accion){
		if(accion == 'show'){
			$("#window_ingreso").css("display", "block")
		}else if(accion == 'hide'){
			$("#window_ingreso").css("display", "none")
		}
	},


	agr_egreso: function(accion){
		if(accion == 'show'){
			$("#window_egreso").css("display", "block")
		}else if(accion == 'hide'){
			$("#window_egreso").css("display", "none")
		}
	},
	
	ver_historia: function(accion){
		if(accion == 'show'){
			$("#window_egreso").css("display", "block")
		}else if(accion == 'hide'){
			$("#window_egreso").css("display", "none")
		}
	}
}


	$(document).ready(function() {
		var d=new Date();
        var dat=d.getDate();
        var mon=d.getMonth();
        var year=d.getFullYear();
        
        var todayDateD = year+"-"+setDateZero(mon)+"-"+setDateZero(dat);
        $('#f_desde').val(todayDateD);

        var monH=d.getMonth()+1;
        var todayDateH = year +"-"+ setDateZero(monH) +"-"+ setDateZero(dat);
        $('#f_hasta').val(todayDateH);
        
        //$( "#ingresos-tabla" ).table( "refresh" );
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
                navigator.notification.alert("Debe diligenciar todos los datos. El valor debe ser numérico y sin puntos.", "", "Error", "Aceptar");
			}else{
                navigator.notification.alert("Información almacenada.", "", "Transacción exitosa", "Aceptar");
				RealizarConsultaIngre();
				window.location.href = "__finanzas.html";
			}
		});
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
			tx.executeSql('INSERT INTO ingresos (fecha_ing, valor_ing, tipo_ing, nota_ing) VALUES ("'+hoy+'", "'+valor+'", "'+tipo+'","'+nota+'")');
		}else{
			ing_vacios = "S";
		}
    }
	
	function errorOperacion(err) {
        navigator.notification.alert("Ocurrió un fallo, por favor vuelve a intentarlo.", "", "Error", "Aceptar");
    }
	
	function RealizarConsultaIngre() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(consultaIngresos, errorOperacion, exito);
    }

    function consultaIngresos(tx) {
        var fd = $("#f_desde").val();
        var fh = $("#f_hasta").val();
        tx.executeSql("SELECT * FROM ingresos WHERE fecha_ing >='" +fd+ "'AND fecha_ing <='" +fh+"'", [], ResultadosIngresos, function(error){
            console.log("consultaIngresos error: " + error)
        });
    }

    function ResultadosIngresos(tx, results) {
		var len = results.rows.length;
        $("#entradas-ingresos").html("")
        for (var i=0; i<len; i++){
            $("#entradas-ingresos").append('<div class="entrada-finanzas"><label class="fecha">'+results.rows.item(i).fecha_ing+'</label><label class="valor">$'+results.rows.item(i).valor_ing+'</label></div>')
        }
       RealizarSumaIngresos();
    }
	
	 function RealizarSumaIngresos() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(SumarIngresos, errorOperacion, exito);
    }

    function SumarIngresos(tx) {
        var fd = $("#f_desde").val();
        var fh = $("#f_hasta").val();
        tx.executeSql("SELECT SUM(valor_ing) as totalIng FROM ingresos WHERE fecha_ing >='" +fd+ "'AND fecha_ing <='" +fh+"'",[], ResSumaIngresos, errorOperacion);
    }

    function ResSumaIngresos(tx, results) {
        window.ingresos = results.rows.item(0).totalIng;
        SumarEgresos(tx);
    }
	
	function SumarEgresos(tx) {
       var fd = $("#f_desde").val();
       var fh = $("#f_hasta").val();
       tx.executeSql("SELECT SUM(valor_eg) as totalEg FROM egresos WHERE fecha_eg >='" +fd+ "'AND fecha_eg <='" +fh+"'",[], SaldoTotal, errorOperacion);
    }

    function SaldoTotal(tx, results) {
		var egresos = results.rows.item(0).totalEg;
        var diferencia = window.ingresos - egresos;
		$("#sActual").html(diferencia);
    }
	
	function exito() {
      	console.log("Exito")
    }
	
	function listoAgregarEgreso() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(AgregarEgreso, errorOperacion, function(){
		
			if(egr_vacios=="S"){
                navigator.notification.alert("Debe diligenciar todos los datos. El valor de ser númerico y sin puntos.", "", "Error", "Aceptar");
			}else{
                navigator.notification.alert("Información almacenada.", "", "Transacción exitosa", "Aceptar");
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
			tx.executeSql('INSERT INTO egresos (fecha_eg, valor_eg, tipo_eg, nota_eg) VALUES ("'+hoy+'", "'+valor+'", "'+tipo+'","'+nota+'")');
		}else{
			egr_vacios= "S";
		}
    }

    function RealizarConsultaEgre() {
        var db = window.openDatabase("bd_finanzas", "1.0", "Mis finanzas", 200000);
        db.transaction(consultaEgresos, errorOperacion, exito);
    }

    function consultaEgresos(tx) {
        var fd = $("#f_desde").val();
        var fh = $("#f_hasta").val();
        tx.executeSql("SELECT * FROM egresos WHERE fecha_eg >='" +fd+ "'AND fecha_eg <='" +fh+"'", [], ResultadosEgresos, function(error){
            console.log("consultaEgresos error: " + error)
        });
	}

    function ResultadosEgresos(tx, results) {
        var len = results.rows.length;
        $("#entradas-egresos").html("");
        for (var i=0; i<len; i++){
            $("#entradas-egresos").append('<div class="entrada-finanzas"><label class="fecha">'+results.rows.item(i).fecha_eg+'</label><label class="valor">$'+results.rows.item(i).valor_eg+'</label></div>')
        }
        RealizarSumaIngresos();
    }
