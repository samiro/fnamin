var Portafolio = {
    URL_DATOS: "http://servicedatosabiertoscolombia.cloudapp.net/v1/Fondo_Nacional_Ahorro/portafolioservfna?$format=json",
    cargar_todos: function(){
        $(".lista-portafolio").html("")
        $.loading('show', 'Cargando servicios');
        $.ajax({
            url: Portafolio.URL_DATOS,
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            success: function( data ) {
                $.loading( 'hide' )
                var servicios = data.d
                Portafolio.guardar_datos( servicios, function(){
                    for (var i = 0; i < servicios.length; i++) {
                        var servicio = "<li><div><div class='btn-text'><a href=\"javascript: Portafolio.ir_a('" +servicios[i].RowKey+ "')\">"
                            servicio+= '<h2>'+servicios[i].servicios+'</h2>'
                            servicio+= '<p>'+servicios[i].mensaje+'</p></a></div><span class="icon">&nbsp;</span></div></li>'

                        $(".lista-portafolio").append(servicio)
                    }
                })

            },
            error: function (x, y, z) {
                console.log("cargar_todos: Error cargando Portafolio Todos")
            }
        });
    },
    cargar_detalle: function( key ){
        var key = window.localStorage.getItem("key_servicio");
        if(key != undefined && key!=""){
            var db = window.openDatabase("bd_servicios", "1.0", "Servicios", 200000);
            db.transaction(function(tx){
                tx.executeSql("SELECT * FROM servicios WHERE key = '" + key + "'", [],
                    function(tx, results){
                        if(results.rows.length > 0){
                            var servicio = results.rows.item(0)
                            $("#servicio-nombre").html(servicio.nombre_servicio)
                            $("#servicio-imagen").html(servicio.logo)
                            $("#servicio-titulo").html(servicio.titulo)
                            $("#servicio-detalle").html(servicio.descripcion.replace(/•/g, "<br />•"))
                            $("#servicio-beneficios").html(servicio.beneficios)
                        }
                    },
                    function(error){
                        console.log("cargar_detalle: error consultando")
                        console.log(error)
                    });
            },
            function(error){
                console.log("cargar_detalle: error abriendo db")
                console.log(error)
            },
            function(){
                console.log("cargar_detalle: exito")
            })
        }
    },
    ir_a: function(key){
        window.localStorage.setItem("key_servicio", key);
        window.location.href = "__portafolio_detalle.html"
    },
    guardar_datos: function( datos , callback){
        var db = window.openDatabase("bd_servicios", "1.0", "Servicios", 200000);
        db.transaction(function(tx){
            /*Ejecutar*/
            tx.executeSql('CREATE TABLE IF NOT EXISTS servicios (key, nombre_servicio, mensaje, titulo, descripcion, beneficios, logo)');
            tx.executeSql('DELETE FROM servicios WHERE 1 = 1',
                function(){
                    console.log("Error borrando datos")
                }, function(){

                    for (var i = 0; i < datos.length; i++) {
                        var key = datos[i].RowKey
                        var nombre_servicio = datos[i].servicios
                        var mensaje = datos[i].mensaje
                        var titulo = datos[i].titulo
                        var descripcion = datos[i].descripciondelservicio
                        var beneficios = datos[i].beneficios
                        var logo = datos[i].logodelservicio
                        tx.executeSql('INSERT INTO servicios (key, nombre_servicio, mensaje, titulo, descripcion, beneficios, logo) VALUES ("'+key+'", "'+nombre_servicio+'", "'+mensaje+'", "'+titulo+'", "'+descripcion+'", "'+beneficios+'", "'+logo+'")');
                    }


                });


        },
        function(error){
            /*Error*/
            console.log("Ha ocurrido un error al crear la tabla")
            console.log(error)
        },
        function(){
            if(callback){
                callback()
            }
            console.log("guadar_datos portafolio bien")
        });
    }
}
