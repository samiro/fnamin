/***
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
/*
    Éste objeto tiene todos los atributos usados para la sección mapas del FNA
*/
var MapaAtributos = {
	//
    //Ciudad donde el usuario está ubicado
    ciudad: '',
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
            streetViewControl: false,
            mapTypeControl: false,
            scrollwheel: true,
            zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP,
              style: google.maps.ZoomControlStyle.DEFAULT
            },
            styles: this.estilo_mapa
    },
    //
    //Variables de uso más general de la aplicación
    general: {
            puntos_json: 'http://servicedatosabiertoscolombia.cloudapp.net/v1/Fondo_Nacional_Ahorro/puntosatencion08082013?$format=json',
            pin_persona: 'img/pines/persona.png',
            pin_fnaconcosto: 'img/pines/fna_concosto.png',
            pin_fnasincosto: 'img/pines/fna_sincosto.png',
            pin_recaudoconcosto: 'img/pines/recaudo_concosto.png',
            pin_recaudosincosto: 'img/pines/recaudo_sincosto.png',
            txt_punto_atencion: "Punto de atención FNA - Punto Empresaria FNA"
    },
    //
    //Configuración del filtro
    filtros: {
        horario_extendido: true,
        sin_costo: true,
        con_costo: true,
        puntos_atencion: true,
        puntos_recaudo: true
    },
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
                        var ciudad = results[1].address_components[0].long_name
                        MapaAtributos.ciudad = ciudad.toUpperCase()

                    }catch(e){
                        navigator.notification.alert("No pudimos localizar tu ciudad.", "", "Error", "Aceptar");
                    }

                    if(callback!=undefined)
                        callback()

                } else {
                    if(callback!=undefined)
                        callback()
                    navigator.notification.alert("No pudimos localizar tu ciudad.", "", "Error", "Aceptar");
                }
            });
        }, 
        function( error ){
            console.log("error")
            console.log(error)
            navigator.notification.alert("OMP: " + error.message , "",  "C: " + error.code, , "Aceptar");
            if(error.code == PositionError.POSITION_UNAVAILABLE){
                navigator.notification.alert("OMP: No es posible localizar tu posición", "", "Error", "Aceptar");
            }else if(error.code == PositionError.TIMEOUT){
                navigator.notification.alert("OMP: No es posible localizar tu posición", "", "Tiempo fuera", "Aceptar");
            }else if(error.code == PositionError.PERMISSION_DENIED){
                navigator.notification.alert("OMP: Permiso denegado", "", "Permiso", "Aceptar");
            }else{
                navigator.notification.alert("OMP: Otro error", "", "Permiso", "Aceptar");
            }
        },
        { timeout: 10000 });
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

            if(MapaAtributos.mi_posicion != null){
                var position = MapaAtributos.mi_posicion
                var lat = position.coords.latitude
                var lon = position.coords.longitude
                var point = new google.maps.LatLng(lat, lon)
                var marker = new google.maps.Marker({
                    position: point,
                    title:"Yo!",
                    icon: MapaAtributos.general.pin_persona
                });

                marker.setMap(MapaAtributos.mapa)
                MapaAtributos.mapa.setCenter(point)
                if(callback != undefined)
                    callback()
            }else{
                MapaObjeto.obtener_mi_posicion(function(){
                    MapaObjeto.ubicarme(callback)
                })
                /*
                navigator.geolocation.getCurrentPosition(
                    function(position){
                        MapaAtributos.mi_posicion = position

                        var lat = position.coords.latitude
                        var lon = position.coords.longitude
                        var point = new google.maps.LatLng(lat, lon)
                        var marker = new google.maps.Marker({
                            position: point,
                            title:"Yo!",
                            icon: MapaAtributos.general.pin_persona
                        });
                        
                        marker.setMap(MapaAtributos.mapa)
                        MapaAtributos.mapa.setCenter(point)
                        if(callback != undefined)
                            callback()
                    }, 
                    function(error){
                        alert("Error obtiendo mi posición.\n" + error)
                        if(callback != undefined)
                            callback()
                    }
                );
                */ 
            }
        }else{
            navigator.notification.alert("El mapa no se cargó no se puede ubicar mi posición", "", "Error", "Aceptar");
        }
    },
    //
    // Funcion que filtra el objeto según los criterios configurador MapaAtributos
    pasa_filtros: function(obj){
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
        if(MapaAtributos.filtros.sin_costo == false && sin_costo) return false;
        if(MapaAtributos.filtros.con_costo == false && con_costo) return false;

        // Tercer filtro de si es con horario extendido
        if(MapaAtributos.filtros.horario_extendido == false && hor_extendido) return false;

        // Pasó los filtros
        return true;
        
    },
    //
    //Actualiza las variables de filtros según el formulario de filtros
    actualizar_filtros: function(){
        MapaAtributos.filtros.horario_extendido = $("#horario-extendido").val() == "true"? true:false
        MapaAtributos.filtros.sin_costo = $("#sin-costo").val() == "true"? true:false
        MapaAtributos.filtros.con_costo = $("#con-costo").val() == "true"? true:false
        MapaAtributos.filtros.puntos_atencion = $("#puntos-atencion").val() == "true"? true:false
        MapaAtributos.filtros.puntos_recaudo = $("#puntos-recaudo").val() == "true"? true:false
    },
    //
    // Cargar los puntos que retorna el setdatos
    cargar_todos_puntos: function(por_ciudad, callback){
        var url = MapaAtributos.general.puntos_json

        MapaAtributos.mapa.setZoom(15);

        //Ésta instrucción debe estar habilitada para que funcione en Manizales
        MapaAtributos.ciudad = ''

        if(MapaAtributos.ciudad != ''){
            url += "&$filter=municipio='"+MapaAtributos.ciudad+"'"
        }

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            success: function (data) {
                var atencion = []
                var recaudo = []
                //var ciudad = "MANIZALES"
                var es_atencion = "Punto de atención FNA"

                for (var i = 0; i < data.d.length; i++) {
                    if(MapaObjeto.pasa_filtros(data.d[i])){
                            var point = new google.maps.LatLng(data.d[i].latitud, data.d[i].longitud)
                            var tipo_entidad = (data.d[i].tipodeentidad).toUpperCase()
                            var ubicacion = data.d[i].direccion + " - " + data.d[i].municipio + ", " + data.d[i].departamento
                            var tiene_costo = data.d[i].costodetransaccion.toUpperCase() == "GRATUITO"? true : false
                            var documentos = data.d[i].cedulaocodigodebarras
                            var servicio = data.d[i].tipodeservicioqueofrecealafiliado
                            var hor_extendido = data.d[i].horarioextendido.toUpperCase() == "NO HAY SERVICIO"? true : false
                            var horario = data.d[i].horariodeatencion
                            var bool_atencion = tipo_entidad == es_atencion.toUpperCase()? true : false
                            var image = ""


                            if ( tipo_entidad == es_atencion.toUpperCase() ){
                                if( tiene_costo )
                                    image = MapaAtributos.general.pin_fnaconcosto;
                                else
                                    image = MapaAtributos.general.pin_fnasincosto;
                                atencion.push( data.d[i] )
                            }else{
                                if( tiene_costo )
                                    image = MapaAtributos.general.pin_recaudoconcosto;
                                else
                                    image = MapaAtributos.general.pin_recaudosincosto;
                                recaudo.push( data.d[i] )
                            }


                            var marker = new google.maps.Marker({
                                position: point,
                                title: data.d[i].tipodeentidad,
                                icon: image,
                                map: MapaAtributos.mapa,
                                clickable: true
                            });


                            marker.info  = '<div ><div class="info-window"><h2>'+ (bool_atencion? 'Punto de atención FNA': 'Punto de recaudo') +'</h2> '
                            marker.info += '<h1>'+ data.d[i].tipodeentidad +'</h1> '
                            marker.info += '<h3>'+ ubicacion +'</h3> '
                            marker.info += '<div class="info1">Costo transacción: <span>'+ data.d[i].costodetransaccion +'</span></div> '
                            marker.info += '<div class="info1">Horario de atención: <span>'+ horario +'</span></div> '
                            marker.info += '<div class="btns"><button class="boton_js" onclick="MapaObjeto.mostrar_ruta(\''+data.d[i].latitud+'\', \''+data.d[i].longitud+'\')" data-inline="true" type="button" data-theme="b">Como llegar</button> '
                            marker.info += '<button class="boton_js" onclick="MapaObjeto.mostrar_puntuacion()" data-inline="true" data-theme="b">Puntuar</button></div> </div> </div>'

                            marker.punto = data.d[i]

                            google.maps.event.addListener(marker, 'click', function() {
                                info_window.content = this.info;
                                info_window.maxWidth = 300;
                                info_window.open(this.getMap(), this);
                                MapaAtributos.mapa.panTo(this.getPosition());
                                MapaAtributos.punto_seleccionado = this.punto
                                $(".boton_js").buttonMarkup( "refresh" );
                            });
                    }
                }

                if(callback != undefined){
                    callback()
                }
                
            },
            error: function (x, y, z) {
                navigator.notification.alert("Ocurrió un error al cargar el mapa y sus puntos de atención.", "", "Error", "Aceptar");
            }
        });
    },
    //
    // Carga la ruta desde mi punto de ubicacion hasta el punto fna o recaudo señalado
    mostrar_ruta: function(lat, lon){
        if( MapaAtributos.mi_posicion != null ){
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
                navigator.notification.alert("No es posible calcular ruta hasta ése destino.", "", "Lo sentimos", "Aceptar");
              }else if(status == google.maps.DirectionsStatus.OVER_QUERY_LIMIT || status == google.maps.DirectionsStatus.REQUEST_DENIED ){
                info_window.close()
                navigator.notification.alert("Ésta funcionalidad no es posible usarla por el momento. Intenta más tarde.", "", "Lo sentimos", "Aceptar");
              }else{
                info_window.close()
                navigator.notification.alert("No es posible calcular ruta hasta ése destino.", "", "Lo sentimos", "Aceptar");
              }
            });
        }else{
            navigator.notification.alert("No hemos podido determinar tu ubicación.", "", "Error", "Aceptar");
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
        $.mobile.changePage("#puntuar", {transition: 'pop', role: 'dialog'})
    },
    //
    //Envia la puntuacion al webservice
    enviar_puntuacion: function(){
        var puntos = $("#input-puntos").val()
        var tipo = $("#input-tipo").val()
        var opinion = $("#input-opinion").val()

        if(puntos == "" ){
            navigator.notification.alert("Debes dar una calificación.", "", "Error", "Aceptar");
            return false;
        }

        if(tipo == "" ){
            navigator.notification.alert("Debes seleccionar lo que calificas.", "", "Error", "Aceptar");
            return false;
        }

        

        $.mobile.loading('show', {
            text: "Enviando puntuación",
            textVisible: true,
            textonly: false
        });

        var data =  '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pun="http://PuntuacionHackatonService/PuntuacionService">' +
                        '<soapenv:Header/>' +
                        '<soapenv:Body>' +
                            '<pun:procesarPuntuacion>' +
                                '<procesarPuntuacion>' +
                                    '<IdPuntoAtencion>' + MapaAtributos.punto_seleccionado.no + '</IdPuntoAtencion>' +
                                    '<ClaseCalificacion>' + tipo + '</ClaseCalificacion>' +
                                    '<Calificacion>' + puntos + '</Calificacion>' +
                                    '<Observaciones>' + opinion + '</Observaciones>' +
                                    '<Celular>0000000000</Celular>' +
                                '</procesarPuntuacion>' +
                            '</pun:procesarPuntuacion>' +
                        '</soapenv:Body>' +
                    '</soapenv:Envelope>';
        var xmlhttp = new window.XMLHttpRequest();
        xmlhttp.open('POST', 'https://www.fna.gov.co:8445/PuntuacionHackatonServiceWeb/sca/WSPuntuacionServiceExport', true);
        xmlhttp.setRequestHeader('Content-Type', 'text/xml');
        xmlhttp.onreadystatechange = function () {
            $.mobile.loading( "hide" );
            if (xmlhttp.readyState == 4) {
                try {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var error = xmlDoc.getElementsByTagName("CodigoError")[0].childNodes[0].nodeValue
                    var error_msj = xmlDoc.getElementsByTagName("MensajeError")[0].childNodes[0].nodeValue
                    if(error != "0"){
                        navigator.notification.alert(error_msj, "", "Error", "Aceptar");
                    }else{
                        navigator.notification.alert(error_msj, "", "Exito", "Aceptar");
                        $.mobile.changePage("#map-page")
                        
                        $("#input-puntos").val(1).slider('refresh');
                        $("#input-tipo").val("").selectmenu('refresh');
                        $("#input-opinion").val("")
                    }
                }catch (e) {
                    navigator.notification.alert("Lo sentimos. Intentalo de nuevo.", "", "Error", "Aceptar");
                }
            }
        }
        xmlhttp.send(data);
    },
}
/*
    Obtiene mi posición una vez el google maps halla cargado la libreria
*/
google.maps.event.addDomListener(window, 'load', function(){
    document.addEventListener("deviceready", function(){
        MapaObjeto.obtener_mi_posicion(function(){})
    }, false);
});


$(document).on("ready", function(){
    $(".btn-enviar-puntuacion").tap(function(event){
        event.preventDefault()
        MapaObjeto.enviar_puntuacion()
    })
})
