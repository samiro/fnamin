/*
Estos objetos y atributos están dispuestos para la manipulación,
de los mapas usados en la sección FNA Mas Cerca, de la aplicación
FNA En Tu Bolsillo
*/

/*
   Éstas variables globales, son usadas por el mapa
*/
var directionsDisplay;
var geocoder;
var directionsService = new google.maps.DirectionsService();
var info_window = new google.maps.InfoWindow({content: ''});
var markersArray = [];
var markerPersona = null;
var MapaMarkerSelected = null;
/*
    Éste objeto tiene todos los atributos usados para la sección mapas del FNA
*/
var MapaAtributos = {
    //
    //Ciudad donde el usuario está ubicado ó que ha elejido.
    mi_ciudad: '',
    //
    //Ciudad donde el usuario está ubicado
    ciudad: '',
    //
    //Departamento donde el usuario está ubicado
    departamento: '',
    //
    //Objeto que contiene el mapa
    mapa: null,
    //
    // Latitud y longitud de mi posición
    mi_posicion: null,
    //
    //Punto de atencion que tiene seleccionado
    punto_seleccionado: null,
    //
    //Configuración de estilo para el mapa
    estilo_mapa: [
          {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
              { "visibility": "on" },
              { "color": "#ffffff" }
            ]
          },{
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
              { "visibility": "on" },
              { "color": "#090808" }
            ]
          },{
            "featureType": "road.arterial",
            "elementType": "labels.text.stroke",
            "stylers": [
              { "visibility": "on" },
              { "color": "#808080" },
              { "weight": 0.8 }
            ]
          },{
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
              { "visibility": "on" },
              { "hue": "#ff1a00" },
              { "weight": 2 }
            ]
          },{
            "featureType": "transit.line",
            "stylers": [
              { "visibility": "on" }
            ]
          }],
    //
    //Configuración usada para el mapa
    opciones_mapa: {
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(5.067132, -75.518288),
            panControl: false,
            panControlOptions: {
              position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            streetViewControl: false,
            mapTypeControl: false,
            scrollwheel: true,
            zoomControl: true,
            zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_BOTTOM,
              style: google.maps.ZoomControlStyle.DEFAULT
            },
            styles: this.estilo_mapa
    },
    //
    //Variables de uso más general de la aplicación
    general: {
            puntos_json: 'http://servicedatosabiertoscolombia.cloudapp.net/v1/Fondo_Nacional_Ahorro/puntosatencion08082013?$format=json',
            pin_persona: 'img/pines/persona.png',
            pin_fnaconcosto: 'img/pines/fna_sincosto.png',
            pin_fnasincosto: 'img/pines/fna_sincosto.png',
            pin_recaudoconcosto: 'img/pines/recaudo_concosto.png',
            pin_recaudosincosto: 'img/pines/recaudo_concosto.png',
            txt_punto_atencion: "Punto de atención FNA - Punto Empresaria FNA"
    },
    //
    //Configuración del filtro
    filtros: {
        horario_extendido: true,
        sin_horario_extendido: true,
        sin_costo: true,
        con_costo: true,
        puntos_atencion: true,
        puntos_recaudo: true
    },
    //
    //Ciudades. Ésto se hace a través de un script
    ciudades: [],
}



/*
    Éste objeto tiene todas las funciones usadas para la sección mapas del FNA
*/
var MapaObjeto = {
    //
    // inicializador
    inicializar: function(callback) {
        var map           = new google.maps.Map(document.getElementById('map-canvas'), MapaAtributos.opciones_mapa);
        geocoder          = new google.maps.Geocoder();
        directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers : true});

        directionsDisplay.setMap(map);
        google.maps.visualRefresh = true;
        MapaAtributos.mapa = map

        if(callback!=undefined)
            callback()
    },
    //
    // Obtiene mi posición
    obtener_mi_posicion: function(callback){
        navigator.geolocation.getCurrentPosition( function(position){
            MapaAtributos.mi_posicion = position

            var lat = position.coords.latitude
            var lon = position.coords.longitude
            var point = new google.maps.LatLng(lat, lon)
            geocoder.geocode({'latLng': point}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    try{
                        /*var ciudad = results[1].address_components[0].long_name
                        var departamento = results[1].address_components[1].long_name*/

                        var ciudad       = results[results.length - 3].address_components[0].long_name
                        var departamento = results[results.length - 3].address_components[1].long_name

                        /*console.log(results)*/

                        MapaAtributos.ciudad = ciudad.toUpperCase()
                        MapaAtributos.mi_ciudad = ciudad.toUpperCase()
                        MapaAtributos.departamento = departamento.toUpperCase()

                        if(MapaAtributos.ciudad == 'BOGOTÁ'){
                            MapaAtributos.departamento = "CUNDINAMARCA"
                        }

                        $("#sel_city").val(MapaAtributos.ciudad+ "@" + MapaAtributos.departamento)

                    }catch(e){
                        navigator.notification.alert("No pudimos localizar su ciudad.", function(){}, "Sin localización", "Aceptar");
                    }

                    if(callback!=undefined)
                        callback()

                } else {
                    navigator.notification.alert("No pudimos localizar su ciudad.", function(){}, "Sin localización", "Aceptar");
                    if(callback!=undefined)
                        callback()

                }
            });
        },
        function( error ){
            //navigator.notification.alert("OMP: " + error.message , "",  "C: " + error.code, "Aceptar");
            if(error.code == PositionError.POSITION_UNAVAILABLE){

              console.log("obtener_mi_posicion: POSITION_UNAVAILABLE")
              navigator.notification.alert("No está disponible la localización", function(){}, "Lo sentimos", "Aceptar");

            }else if(error.code == PositionError.TIMEOUT){
              console.log("obtener_mi_posicion: TIMEOUT")
              navigator.notification.alert("No está disponible la localización", function(){}, "Lo sentimos", "Aceptar");

            }else if(error.code == PositionError.PERMISSION_DENIED){
              console.log("obtener_mi_posicion: PERMISSION_DENIED")
              navigator.notification.alert("No está disponible la localización", function(){}, "Lo sentimos", "Aceptar");

            }else{
              console.log("obtener_mi_posicion: OTRO con codigo " + error.code)
              navigator.notification.alert("No está disponible la localización", function(){}, "Lo sentimos", "Aceptar");
            }

            $.loading('hide')
            if(MapaAtributos.ciudad == '')
                MapaObjeto.mostrar_seleccion_ciudad("El GPS no funciona correctamente")
        },
        { timeout: 15000 });
    },
    //
    //Si la geolocalizacion de mi ubicacion no funciona se usa esta funcion,
    //para pedirle al usuario que seleccione una ciudad.
    mostrar_seleccion_ciudad: function(message){
        $("#message-txt").text(message)
        $("#message-window-mapa").addClass("centered")
    },
    //
    // Si ya tiene mi ubicación centra el mapa en éste punto
    centrarme: function(){
        if(MapaAtributos.mi_posicion != null){
            var punto = new google.maps.LatLng(MapaAtributos.mi_posicion.coords.latitude, MapaAtributos.mi_posicion.coords.longitude)
            MapaAtributos.mapa.setCenter(punto)
        }else{
            this.ubicarme(function(){})
        }
    },
    //
    // Ubicar mi posición en el mapa
    ubicarme: function(callback){
        if(MapaAtributos.mapa != null){

            if( MapaAtributos.mi_posicion != null ){
                var position = MapaAtributos.mi_posicion
                var lat = position.coords.latitude
                var lon = position.coords.longitude
                var point = new google.maps.LatLng(lat, lon)
                var marker = new google.maps.Marker({
                    position: point,
                    title:"Yo!",
                    icon: MapaAtributos.general.pin_persona
                });

                if(markerPersona != null){
                    markerPersona.setMap(null)
                }

                markerPersona = marker

                marker.setMap(MapaAtributos.mapa)
                MapaAtributos.mapa.setCenter(point)

                if(callback != undefined)
                    callback()
            }else{
                MapaObjeto.obtener_mi_posicion(function(){
                    MapaObjeto.ubicarme(callback)
                })
            }
        }else{
            navigator.notification.alert("El mapa no se cargó no se puede ubicar mi posición", function(){}, "Error", "Aceptar");
        }
    },
    //
    // Funcion que filtra el objeto según los criterios configurador MapaAtributos
    // El criterio es (PRIMERO AND SEGUNDO) OR (PRIMERO AND TERCERO)
    pasa_filtros: function(obj){
        //return true;

        var municipio = obj.municipio
        var sin_costo = obj.costodetransaccion.toUpperCase() == "GRATUITO"? true : false
        var con_costo = !sin_costo
        var hor_extendido = obj.horarioextendido.toUpperCase() == "NO HAY SERVICIO"? true : false
        var es_atencion =  MapaAtributos.general.txt_punto_atencion.toUpperCase().indexOf(obj.tipodeentidad.toUpperCase()) !== -1? true : false
        var es_recaudo = !es_atencion

        // Primer filtro de si es punto de atencion o recaudo
        if(MapaAtributos.filtros.puntos_atencion == false && es_atencion) return false;
        if(MapaAtributos.filtros.puntos_recaudo == false && es_recaudo) return false;


        // Segundo fitro de si es con costo
        if(MapaAtributos.filtros.sin_costo && sin_costo) return true;
        if(MapaAtributos.filtros.con_costo && con_costo) return true;


        // Tercer filtro de si es con horario extendido
        if(MapaAtributos.filtros.horario_extendido && hor_extendido) return true;
        if(MapaAtributos.filtros.sin_horario_extendido && !hor_extendido) return true;


        // Pasó los filtros
        return false;


        /*// Primer filtro de si es punto de atencion o recaudo
        if(MapaAtributos.filtros.puntos_atencion == false && es_atencion) return false;
        if(MapaAtributos.filtros.puntos_recaudo == false && es_recaudo) return false;

        // Segundo fitro de si es con costo
        if(MapaAtributos.filtros.sin_costo == false && sin_costo) return false;
        if(MapaAtributos.filtros.con_costo == false && con_costo) return false;

        // Tercer filtro de si es con horario extendido
        if(MapaAtributos.filtros.horario_extendido == false && hor_extendido) return false;

        // Pasó los filtros
        return true;*/

    },
    //
    //Centrar a la ciudad
    centrar_ciudad: function(){
        if(MapaAtributos.ciudad != ''){
            geocoder.geocode({'address': MapaAtributos.ciudad + ', Colombia'}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    MapaAtributos.mapa.setCenter(results[0].geometry.location, 10);
                }else{
                    navigator.notification.alert("No se ha podido geolocalizar a " + MapaAtributos.ciudad , function(){}, "Falló geolocalización", "Aceptar");
                }
            });
        }
    },
    //
    //Actualiza las variables de filtros según el formulario de filtros
    /*actualizar_filtros: function(){
        MapaAtributos.filtros.horario_extendido = $("#horario-extendido").val() == "true"? true:false
        MapaAtributos.filtros.sin_costo = $("#sin-costo").val() == "true"? true:false
        MapaAtributos.filtros.con_costo = $("#con-costo").val() == "true"? true:false
        MapaAtributos.filtros.puntos_atencion = $("#puntos-atencion").val() == "true"? true:false
        MapaAtributos.filtros.puntos_recaudo = $("#puntos-recaudo").val() == "true"? true:false
    },*/
    //
    // Cargar los puntos que retorna el setdatos
    cargar_todos_puntos: function(por_ciudad, callback){
        MapaAtributos.mapa.setZoom(16);

        var url = MapaAtributos.general.puntos_json

        //Ésta instrucción debe estar habilitada para que funcione en Manizales
        //MapaAtributos.ciudad = ''

        url += "&$orderBy=no"

        if(MapaAtributos.ciudad != ''){
            /*url += "&$filter=municipio LIKE '%" + MapaAtributos.ciudad + "%'"*/
            url += "&$filter=municipio EQ '" + MapaAtributos.ciudad + "'"
            if(MapaAtributos.departamento != ''){
                url += " AND departamento EQ '" + MapaAtributos.departamento + "'"
            }
        }


        MapaObjeto.cargar_puntos_data = []
        MapaObjeto.cargar_puntos_bounds = null
        MapaObjeto.cargar_puntos_bounds = new google.maps.LatLngBounds()

        MapaObjeto.cargar_puntos_descargar(url, "0", callback)
    },

    cargar_puntos_data: [],

    cargar_puntos_bounds: {},

    cargar_puntos_descargar: function(url, ultimoid, callback){
        $.ajax({
                url: url + " AND no > '" + ultimoid + "'",
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                success: function (data) {
                    var lista_mapa = $("#lista-mapas .lista-mapa-items")
                    lista_mapa.html("")

                    for (var i = 0; i < data.d.length; i++) {
                        if(MapaObjeto.pasa_filtros(data.d[i])){
                            var ubicacion = data.d[i].direccion + " - " + data.d[i].municipio + ", " + data.d[i].departamento
                            var tiene_costo = data.d[i].costodetransaccion.toUpperCase() == "GRATUITO"? true : false
                            var documentos = data.d[i].cedulaocodigodebarras
                            var servicio = data.d[i].tipodeservicioqueofrecealafiliado
                            var hor_extendido = data.d[i].horarioextendido.toUpperCase() == "NO HAY SERVICIO"? true : false
                            var horario = data.d[i].horariodeatencion
                            var bool_atencion = MapaAtributos.general.txt_punto_atencion.toUpperCase().indexOf(data.d[i].tipodeentidad.toUpperCase()) !== -1? true : false
                            var image = ""

                            var latitud = normalizeLatLong(data.d[i].latitud)
                            var longitud = normalizeLatLong(data.d[i].longitud)

                            var point = new google.maps.LatLng(latitud, longitud)
                            MapaObjeto.cargar_puntos_bounds.extend(point);

                            if ( bool_atencion ){
                                if( tiene_costo )
                                    image = MapaAtributos.general.pin_fnaconcosto;
                                else
                                    image = MapaAtributos.general.pin_fnasincosto;
                            }else{
                                if( tiene_costo )
                                    image = MapaAtributos.general.pin_recaudoconcosto;
                                else
                                    image = MapaAtributos.general.pin_recaudosincosto;
                            }

                            var marker = new google.maps.Marker({
                                position: point,
                                title: data.d[i].tipodeentidad,
                                icon: image,
                                map: MapaAtributos.mapa,
                                clickable: true
                            });


                            markersArray.push(marker);
                            MapaObjeto.cargar_puntos_data.push(data.d[i])
                            //
                            //
                            // Se crea la maquetación para el marker
                            //
                            marker.info  = '<div class="info-window-min" onclick="MapaObjeto.mostrar_detalles()"><div class="info-window"><h2>'+ (bool_atencion? 'Punto de atención FNA': 'Punto de recaudo') +'</h2> '
                            marker.info += '<h1>'+ data.d[i].tipodeentidad +'</h1> '
                            marker.info += '<h3>'+ ubicacion +'</h3> '
                            marker.info += '<div class="info1">Costo transacción: <span>'+ data.d[i].costodetransaccion +'</span></div> '
                            marker.info += '<div class="info1">Horario de atención: <span>'+ horario +'</span></div> '
                            marker.info += '<div class="btns">'
                            if(MapaAtributos.mi_ciudad == MapaAtributos.ciudad){
                              marker.info += '<button class="btn-blue btn-mapa-ruta" onclick="MapaObjeto.mostrar_ruta(\''+data.d[i].latitud+'\', \''+data.d[i].longitud+'\')" type="button" >Cómo llegar</button>'
                            }
                            marker.info += '<button class="btn-blue" onclick="MapaObjeto.mostrar_puntuacion()" type="button" >Puntuar</button></div>'
                            marker.info += ' </div> </div>'
                            marker.punto = data.d[i]
                            //
                            //
                            // Se crea la maquetación para la lista
                            //
                            var info_lista  = '<div><div class="info-window"><h2>'+ (bool_atencion? 'Punto de atención FNA': 'Punto de recaudo') +'</h2> '
                            info_lista += '<h1>'+ data.d[i].tipodeentidad +'</h1> '
                            info_lista += '<h3>'+ ubicacion +'</h3> '
                            info_lista += '<div class="info1">Costo transacción: <span>'+ data.d[i].costodetransaccion +'</span></div> '
                            info_lista += '<div class="info1">Horario de atención: <span>'+ horario +'</span></div> '
                            lista_mapa.append('<li onclick="Contenido.lista_seluno(' + markersArray.length + ')">' + info_lista + ' </div> </div> </li>')
                            //
                            //
                            // Se crea el evento del click sobre el marker
                            //

                            google.maps.event.addListener(marker, 'click', function() {
                                info_window.content = this.info;
                                info_window.maxWidth = 300;
                                info_window.open(this.getMap(), this);
                                /* 0.0032 se le suma a latitud para bajar*/
                                var pos = new google.maps.LatLng(this.getPosition().lat() + 0.0025, this.getPosition().lng())
                                MapaAtributos.mapa.panTo(pos);
                                MapaAtributos.punto_seleccionado = this.punto
                            });
                        }
                    }

                    if(data.d.length == 1000){
                        MapaObjeto.cargar_puntos_descargar(url, data.d[data.d.length-1].no, callback)
                    }else{
                        MapaObjeto.cargar_puntos_finalizar(callback)
                    }
                },
                error: function (x, y, z) {
                    navigator.notification.alert("Se ha reiniciado la conexión con el servidor. Por favor inténtelo más tarde.", function(){}, "Error", "Aceptar");
                }
            });
    },

    cargar_puntos_finalizar: function(callback){
        if( MapaObjeto.cargar_puntos_data.length == 0){
            //navigator.notification.alert("No hay puntos de atención o recaudo que estén en ésta ciudad.", "", "No hay puntos", "Aceptar");
            $("#message-txt").text("No hay resultados en " + MapaAtributos.ciudad + ", " + MapaAtributos.departamento)
        }else{
            $("#message-txt").text(MapaObjeto.cargar_puntos_data.length + " resultados " + MapaAtributos.ciudad + ", " + MapaAtributos.departamento)
        }
        /*
            Si la ciudad que estoy viendo es distinta a la que estoy ubicado, hace un ajuste para ver todos los puntos
        */
        console.log("cargar_puntos_finalizar: centralizar")
        if(MapaAtributos.mi_ciudad != MapaAtributos.ciudad && MapaObjeto.cargar_puntos_data.length > 0){
            MapaAtributos.mapa.fitBounds(MapaObjeto.cargar_puntos_bounds);

            if( MapaObjeto.cargar_puntos_data.length == 1){
                MapaAtributos.mapa.setZoom(16);
            }else{
                var primero = MapaObjeto.cargar_puntos_data[0]
                var solo_uno = true
                for (var i = 1; i < MapaObjeto.cargar_puntos_data.length; i++) {
                    var otro = MapaObjeto.cargar_puntos_data[i]
                    if(primero.latitud != otro.latitud || primero.longitud != otro.longitud)
                        solo_uno = false
                }
                if(solo_uno)
                    MapaAtributos.mapa.setZoom(16);
            }
        }

        if( callback != undefined ){
            console.log("cargar_puntos_finalizar: callback")
            callback()
        }
    },
    //
    //
    mostrar_detalles: function(){
      if(info_window!=null){
        console.log("mostrar")
        var content = $(info_window.content).attr("onclick", "")
        $("#detail-map-content").html(content)
        $("#window_punto_detalle").show()
      }
    },
    //
    //
    ocultar_detalles: function(){
      console.log("ocultar")
      $("#window_punto_detalle").hide()
    },
    //
    // Carga la ruta desde mi punto de ubicacion hasta el punto fna o recaudo señalado
    mostrar_ruta: function(lat, lon){
        MapaObjeto.ocultar_detalles()
        if( MapaAtributos.mi_posicion != null && MapaAtributos.mi_ciudad == MapaAtributos.ciudad){
            var position = MapaAtributos.mi_posicion
            var start = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            var end = new google.maps.LatLng(lat, lon)

            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.WALKING
            };

            directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                info_window.close()
                directionsDisplay.setDirections(response);
              }else if(status == google.maps.DirectionsStatus.NOT_FOUND || status == google.maps.DirectionsStatus.ZERO_RESULTS ){
                info_window.close()
                navigator.notification.alert("No es posible calcular ruta hasta ese destino.", function(){}, "Lo sentimos", "Aceptar");
              }else if(status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT || status == google.maps.DirectionsStatus.REQUEST_DENIED ){
                info_window.close()
                navigator.notification.alert("Ésta funcionalidad no es posible usarla por el momento. Intente más tarde.", function(){}, "Lo sentimos", "Aceptar");
              }else{
                info_window.close()
                navigator.notification.alert("No es posible calcular ruta hasta ese destino.", function(){}, "Lo sentimos", "Aceptar");
              }
            });
        }else{
            navigator.notification.alert("Debe estar en su ciudad por ubicación satelital, para poder usar esta función", function(){}, "Atención", "Aceptar");
        }
    },
    //
    // dispara el evento de redimensionar la pantalla
    resize_trigger: function(){

        google.maps.event.trigger( MapaAtributos.mapa, 'resize');
    },
    //
    //Mostrar la ventana de la puntuación
    mostrar_puntuacion: function(){
        MapaObjeto.ocultar_detalles()
        $("#window_puntuacion").css("display", "block")
        //$.mobile.changePage("#puntuar", {transition: 'pop', role: 'dialog'})
    },
    //
    //Mostrar la ventana de la puntuación
    ocultar_puntuacion: function(){
        $("#input-puntos").val("")
        /*$("#input-puntos-txt").text(1)*/
        $("#input-tipo").val("")
        $("#input-opinion").val("")
        $("#window_puntuacion").css("display", "none")
    },
    //
    //Envia la puntuacion al webservice
    enviar_puntuacion: function(){
        var puntos = $("#input-puntos").val()
        var tipo = $("#input-tipo").val()
        var opinion = $("#input-opinion").val()
        var celular = window.localStorage.getItem("telefonoCelular")

        if(celular == null){
            celular = "0000000000"
        }

        if(puntos == "" ){
            navigator.notification.alert("Debe dar una calificación.", function(){}, "Error", "Aceptar");
            return false;
        }

        if(tipo == "" ){
            navigator.notification.alert("Debe seleccionar lo que califica.", function(){}, "Error", "Aceptar");
            return false;
        }



        $.loading('show',"Enviando puntuación");

        var data =  '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pun="http://PuntuacionHackatonService/PuntuacionService">' +
                        '<soapenv:Header/>' +
                        '<soapenv:Body>' +
                            '<pun:procesarPuntuacion>' +
                                '<arg0>' +
                                    '<idPuntoAtencion>' + MapaAtributos.punto_seleccionado.no + '</idPuntoAtencion>' +
                                    '<nombre>' + MapaAtributos.punto_seleccionado.tipodeentidad + '</nombre>' +
                                    '<ciudad>' + MapaAtributos.punto_seleccionado.municipio + '</ciudad>' +
                                    '<direccion>' + MapaAtributos.punto_seleccionado.direccion + '</direccion>' +
                                    '<categoria>' + tipo + '</categoria>' +
                                    '<calificacion>' + puntos + '</calificacion>' +
                                    '<comentarios>' + opinion + '</comentarios>' +
                                    '<celular>' + celular + '</celular>' +
                                '</arg0>' +
                            '</pun:procesarPuntuacion>' +
                        '</soapenv:Body>' +
                    '</soapenv:Envelope>';

        var xmlhttp = new window.XMLHttpRequest();

        xmlhttp.open('POST', CONFIGURACION.URL_PUNTUACION_PRUEBAS, true);

        xmlhttp.setRequestHeader('Content-Type', 'text/xml');

        xmlhttp.onreadystatechange = function () {
            $.loading( "hide" );
            if (xmlhttp.readyState == 4) {
                try {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var error = xmlDoc.getElementsByTagName("return")[0].getElementsByTagName("codigoRespuesta")[0].childNodes[0].nodeValue;
                    var error_msj = xmlDoc.getElementsByTagName("return")[0].getElementsByTagName("mensajeRespuesta")[0].childNodes[0].nodeValue;
                    if(error != "00001"){
                        navigator.notification.alert(error_msj, function(){}, "Ha ocurrido un error", "Aceptar");
                    }else{
                        navigator.notification.alert(error_msj, function(){}, "Puntación enviada", "Aceptar");
                        MapaObjeto.ocultar_puntuacion()

                        $("#input-puntos").val("")
                        $("#input-tipo").val("")
                        $("#input-opinion").val("")
                    }
                }catch (e) {
                    navigator.notification.alert("Lo sentimos. Inténtelo de nuevo.", function(){}, "Ha ocurrido un error", "Aceptar");
                }
            }
        }
        xmlhttp.send(data);
    },
    //
    //Esto es para ejecutarlo en la consola, de prueba
    ciudades: function(){
        function ciudades_cargar(ultimoid){
            console.log("llamado")
            $.ajax({
                url: MapaAtributos.general.puntos_json + "&$orderBy=no&$filter=no > '" + ultimoid + "'",
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                success: function (data) {
                    for (var i = 0; i < data.d.length; i++) {
                        MapaObjeto.ciudades_tmp[data.d[i].municipio + "@" + data.d[i].departamento] = data.d[i].municipio
                    }
                    if(data.d.length == 1000)
                        ciudades_cargar(data.d[data.d.length-1].no)
                    else
                        ciudades_finalizar()

                },
                error: function (x, y, z) {
                    navigator.notification.alert("Ocurrió un error al buscar las ciudades donde está presente el FNA.", function(){}, "Error", "Aceptar");
                }
            });
        }


        function ciudades_finalizar(){
            var ciudades = '[\n'
            for (var key in MapaObjeto.ciudades_tmp){
                ciudades += '"' + key + '",\n'
            }
            ciudades += '\n]'
            console.log(ciudades)
            navigator.notification.alert("Lísto el pollo.", function(){}, "Error", "Aceptar");
        }


        MapaObjeto.ciudades_tmp = null
        MapaObjeto.ciudades_tmp = []
        ciudades_cargar("0")
    },

    ciudades_tmp: [],

}





var Contenido = {
    bienvenido: function(accion){
        if(accion == 'show'){
            $("#window_bienvenido").show()
        }else if(accion == 'hide'){
            var skip = $('#skip_bienvenido').is(':checked')? 'yes': 'no'
            window.localStorage.setItem("skip", skip)
            $("#window_bienvenido").hide()
        }
    },
    // Carga el contenido de los mapas, consultando inicialmente la posición del
    // usuario
    cargar: function(){
            if ( Contenido.tiene_conexion() ){
                //MapaObjeto.actualizar_filtros()
                $.loading('show', "Iniciando Google Maps");
                MapaObjeto.inicializar( function(){
                    $.loading( "hide" );
                    $.loading('show', "Ubicando mi posición");

                    MapaObjeto.ubicarme( function(){

                        $.loading( "hide" );
                        $.loading('show', "Cargando puntos FNA");
                        MapaObjeto.cargar_todos_puntos( true, function(){
                            MapaObjeto.resize_trigger()
                            MapaObjeto.centrarme()
                            $.loading( "hide" );
                        })
                    })
                })
            } else {
                navigator.notification.alert(
                    "Debe tener conexión a internet para acceder a esta sección",
                    function(){
                        window.location.href="index.html"
                    },
                    "Sin conexión",
                    "Aceptar")
            }
    },

    /*




              OJO CAMBIE CLEAROVERLAYS() DE POSICION A QUE ESTÉ DENTRO DE UBICACION. ANTES ESTABA
              AL PRINCIPIO DEL METODO.


    */
    // Carga el contenido segun la petición de página que le halla llegado
    cargar_mi_posicion: function(){

        $.loading( "hide" );
        $.loading( 'show', "Ubicando mi posición");

        MapaAtributos.mi_posicion = null

        MapaObjeto.ubicarme( function(){
            clearOverlays()
            $.loading( "hide" );
            $.loading('show', "Cargando puntos FNA");
            MapaObjeto.cargar_todos_puntos( true, function(){
                MapaObjeto.resize_trigger()
                $.loading( "hide" );
            })
        })

    },
    //
    // verifica si tiene o nó conexión a internet el celular.
    tiene_conexion: function(){
        /*if (navigator.connection.type == Connection.NONE){
            return false;
        }else{
            return true;
        }*/
        return true;
    },

    lista_mostrar: function(){
      touchScroll('lista-mapas-content')
      touchScroll('window_lista')

      if($("#lista-mapas-content .lista-mapa-items").html() == ""){
        console.log("mostrar lista: esta vacio")
        if(MapaAtributos.ciudad == ''){
          console.log("mostrar lista: sin ciudad escojida")
          $("#window_lista .no-lista-sinpuntos").hide()
          $("#window_lista .no-lista-sinciudad").show()
        } else {
          console.log("mostrar lista: con ciudad escojida")
          $("#window_lista .no-lista-sinpuntos").show()
          $("#window_lista .no-lista-sinciudad").hide()
        }
      } else {
        console.log("mostrar lista: si hay items")
        $("#window_lista .no-lista-sinpuntos").hide()
        $("#window_lista .no-lista-sinciudad").hide()
      }

      $("#window_lista").css("display", "block")
    },


    lista_seluno: function(pos){
      var marker = markersArray[pos-1]

      /*var html = '<div class="info-window-min">'
      html += marker.info
      html += '</div>'*/

      /*var html = $(marker.info).attr("onclick", "")*/
      var html = marker.info

      info_window.content = html;
      info_window.maxWidth = 200;
      info_window.open(marker.getMap(), marker);

      var pos = new google.maps.LatLng(marker.getPosition().lat() + 0.0025, marker.getPosition().lng())
      MapaAtributos.mapa.panTo(pos);
      MapaAtributos.punto_seleccionado = marker.punto

      $("#window_lista").css("display", "none")
    },

    lista_ocultar: function(){
      $("#window_lista").css("display", "none")
    }
}










$(document).on("ready", function(){
    /*
    $(".btn-enviar-puntuacion").tap(function(event){
        event.preventDefault()
        MapaObjeto.enviar_puntuacion()
    })
    */

    $('#filtro #con_h_extendido').change(function() {
        var checkbox = $(this)
        MapaAtributos.filtros.horario_extendido = checkbox.is(":checked")
        renderizar_checkbox(checkbox)
    });

    $('#filtro #sin_h_extendido').change(function() {
        var checkbox = $(this)
        MapaAtributos.filtros.sin_horario_extendido = checkbox.is(":checked")
        renderizar_checkbox(checkbox)
    });

    $('#filtro #con_costo').change(function() {
        var checkbox = $(this)
        MapaAtributos.filtros.con_costo = checkbox.is(":checked")
        renderizar_checkbox(checkbox)
    });

    $('#filtro #sin_costo').change(function() {
        var checkbox = $(this)
        MapaAtributos.filtros.sin_costo = checkbox.is(":checked")
        renderizar_checkbox(checkbox)
    });

    $('#filtro #ptos_recaudo').change(function() {
        var checkbox = $(this)
        MapaAtributos.filtros.puntos_recaudo = checkbox.is(":checked")
        renderizar_checkbox(checkbox)
    });

    $('#filtro #ptos_atencion').change(function() {
        var checkbox = $(this)
        MapaAtributos.filtros.puntos_atencion = checkbox.is(":checked")
        renderizar_checkbox(checkbox)
    });



    var chk_1 = $('#filtro #con_h_extendido').attr('checked', MapaAtributos.filtros.horario_extendido );
    renderizar_checkbox(chk_1)
    var chk_2 = $('#filtro #sin_h_extendido').attr('checked', MapaAtributos.filtros.sin_horario_extendido );
    renderizar_checkbox(chk_2)
    var chk_3 = $('#filtro #con_costo').attr('checked', MapaAtributos.filtros.con_costo );
    renderizar_checkbox(chk_3)
    var chk_4 = $('#filtro #sin_costo').attr('checked', MapaAtributos.filtros.sin_costo );
    renderizar_checkbox(chk_4)
    var chk_5 = $('#filtro #ptos_recaudo').attr('checked', MapaAtributos.filtros.puntos_recaudo );
    renderizar_checkbox(chk_5)
    var chk_6 = $('#filtro #ptos_atencion').attr('checked', MapaAtributos.filtros.puntos_atencion );
    renderizar_checkbox(chk_6)


    $("#input-puntos").change(function(event){
        $("#input-puntos-txt").text($(this).val())
    })



    cargar_ciudades_select()

    var skip = window.localStorage.getItem("skip")
    if(skip != "yes"){
        Contenido.bienvenido('show')
    }
})




/*document.addEventListener("deviceready", function(){*/
  google.maps.event.addDomListener(window, 'load', function(){
      console.log("Google loaded.")
      Contenido.cargar()
  });
/*}, false);*/








function clearOverlays() {
  for (var i = 0; i < markersArray.length; i++ ) {
    markersArray[i].setMap(null);
  }
  markersArray.length = 0;
  //markersArray = []
}




function renderizar_checkbox(checkbox){
    var parent = checkbox.parent('.input_checkbox')

    if(checkbox.is(":checked")) {
        parent.addClass("checked")
    }else{
        parent.removeClass("checked")
    }
}




var MapaWindow = {
    filtro: function(accion){
        if(accion == 'show'){
            $("#window_filtro").css("display", "block")
        }else if(accion == 'hide'){
            $("#window_filtro").css("display", "none")
        }
    },


    filtro_listo: function(){
        clearOverlays();
        $("#window_filtro").css("display", "none")
        $.loading( "hide" );
        $.loading('show', "Filtrando puntos FNA");
        MapaObjeto.cargar_todos_puntos( true, function(){
            MapaObjeto.resize_trigger()
            //MapaObjeto.centrarme()
            $.loading( "hide" );
        })
    }


}


function cargar_ciudades_select(){
    var ciudades = MapaAtributos.ciudades.sort()
    var select = $("#sel_city").html("")
        select.append('<option value="">Seleccione su ciudad</option>')
    var ciudades_select = {}

    for( var i = 0; i < ciudades.length; i++ ){
        var datos = ciudades[i].split('@')
        var ciudad = datos[0]
        var depto = datos[1]

        if(ciudades_select[ciudad] == undefined){
          ciudades_select[ciudad] = []
        }
        ciudades_select[ciudad].push(depto)
    }


    for(var ciudad in ciudades_select){
      if (ciudades_select.hasOwnProperty(ciudad)) {
        if(ciudades_select[ciudad].length == 1){
          var completo = ciudad + "@" + ciudades_select[ciudad][0]
          select.append('<option value="' + completo + '">' + ciudad + '</option>')
        }else if(ciudades_select[ciudad].length > 1){
          for (var i = 0; i < ciudades_select[ciudad].length; i++) {
            var completo = ciudad + "@" + ciudades_select[ciudad][i]
            select.append('<option value="' + completo + '">' + ciudad + ' (' + ciudades_select[ciudad][i] + ')</option>')
          }
        }
      }
    }

}



function cambio_ciudad(){
    $("#message-txt").text("")
    var sel = $("#sel_city").val()
    if( sel != '' ){
        $("#message-window-mapa").removeClass("centered")
        var datos = sel.split('@')
        var ciudad = datos[0]
        var depto = datos[1]

        MapaAtributos.ciudad = ciudad
        MapaAtributos.departamento = depto
        MapaWindow.filtro_listo()
    }
}

function normalizeLatLong(latlng){
    var result = ""
    var punto_ya = false
    for( var i = 0; i < latlng.length; i++ ){
        if(latlng[i] == "." && !punto_ya){
            punto_ya = true
            result += latlng[i]
        }

        if(latlng[i] != "."){
            result += latlng[i]
        }
    }
    return result
}