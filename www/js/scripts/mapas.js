/*



*/



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
var markersArray = [];
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
            txt_punto_atencion: "Punto de atención FNA - Punto Empresarial FNA"
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
    ciudades: [
        "LETICIA@AMAZONAS",
        "MEDELLIN@ANTIOQUIA",
        "APARTADO@ANTIOQUIA",
        "ARAUCA@ARAUCA",
        "BARRANQUILLA@ATLÁNTICO",
        "TUNJA@BOYACÁ",
        "MANIZALES@CALDAS",
        "FLORENCIA@CAQUETÁ",
        "POPAYÁN@CAUCA",
        "VALLEDUPAR@CESAR",
        "QUIBDO@CHOCO",
        "MONTERIA@CORDOBA",
        "CUCUTA@NORTE DE SANTANDER",
        "PUERTO INRIDA@GUAINIA",
        "RIOHACHA@GUAJIRA",
        "SAN JOSE DEL GUAVIARE@GUAVIARE",
        "NEIVA@HUILA",
        "SANTA MARTHA@MAGDALENA",
        "VILLAVICENCIO@META",
        "PASTO@NARIÑO",
        "MOCOA@PUTUMAYO",
        "OCAÑÁ@NORTE DE SANTANDER",
        "ARMENIA@QUINDÍO",
        "PEREIRA@RISARALDA",
        "BUCARAMANGA@SANTANDER",
        "SINCELEJO@SUCRE",
        "PUERTO CARREÑO@VICHADA",
        "IBAGUE@TOLIMA",
        "PROVIDENCIA@SAN ANDRÉS",
        "MITU@VAUPÉS",
        "SOACHA@CUNDINAMARCA",
        "BOGOTÁ@CUNDINAMARCA",
        "CARTAGENA@BOLÍVAR",
        "YOPAL@CASANARE",
        "GIRARDOT@CUNDINAMARCA",
        "ACACÍAS@META",
        "BARBOSA@SANTANDER",
        "SAN JOSE CUCUTA@NORTE DE SANTANDER",
        "FUNZA@CUNDINAMARCA",
        "FUSAGASUGA@CUNDINAMARCA",
        "IPIALES@NARIÑO",
        "LA DORADA@CALDAS",
        "MADRID@CUNDINAMARCA",
        "MAICAO@GUAJIRA",
        "MARIQUITA@TOLIMA",
        "PITALITO@HUILA",
        "SOGAMOSO@BOYACÁ",
        "TUMACO@NARIÑO",
        "ZIPAQUIRA@CUNDINAMARCA",
        "FACATATIVA@CUNDINAMARCA",
        "CALI@VALLE DEL CAUCA",
        "BUGA@VALLE DEL CAUCA",
        "SAN PEDRO@VALLE DEL CAUCA",
        "PALMIRA@VALLE DEL CAUCA",
        "BUENAVENTURA@VALLE DEL CAUCA",
        "TULUA@VALLE DEL CAUCA",
        "GUACARI@VALLE DEL CAUCA",
        "CANDELARIA@VALLE DEL CAUCA",
        "YUMBO@VALLE DEL CAUCA",
        "DAGUA@VALLE DEL CAUCA",
        "RESTREPO@VALLE DEL CAUCA",
        "JAMUNDI@VALLE DEL CAUCA",
        "VIJES@VALLE DEL CAUCA",
        "EL CERRITO@VALLE DEL CAUCA",
        "FLORIDA@VALLE DEL CAUCA",
        "CALIMA@VALLE DEL CAUCA",
        "RIOFRIO@VALLE DEL CAUCA",
        "TRUJILLO@VALLE DEL CAUCA",
        "ANDALUCIA@VALLE DEL CAUCA",
        "GINEBRA@VALLE DEL CAUCA",
        "BUGALAGRANDE@VALLE DEL CAUCA",
        "PRADERA@VALLE DEL CAUCA",
        "LOS ANDES@NARIÑO",
        "LA PINTADA@ANTIOQUIA",
        "LA UNIÓN@ANTIOQUIA",
        "RIONEGRO@ANTIOQUIA",
        "SANTA BÁRBARA@ANTIOQUIA",
        "PEÑOL@ANTIOQUIA",
        "SAN RAFAEL@ANTIOQUIA",
        "CARMEN DE VIBORAL@ANTIOQUIA",
        "CARACOLI@ANTIOQUIA",
        "SEGOVIA@ANTIOQUIA",
        "GUARNE@ANTIOQUIA",
        "ITAGUI@ANTIOQUIA",
        "PUERTO NARE@ANTIOQUIA",
        "RETIRO@ANTIOQUIA",
        "SONSON@ANTIOQUIA",
        "CONCEPCIÓN@ANTIOQUIA",
        "ENVIGADO@ANTIOQUIA",
        "COCORNA@ANTIOQUIA",
        "SAN VICENTE@ANTIOQUIA",
        "SANTO DOMINGO@ANTIOQUIA",
        "SAN ROQUE@ANTIOQUIA",
        "PUERTO TRIUNFO@ANTIOQUIA",
        "EL SANTUARIO@ANTIOQUIA",
        "CAROLINA@ANTIOQUIA",
        "GUADALUPE@ANTIOQUIA",
        "SAN LUIS@ANTIOQUIA",
        "VEGACHI@ANTIOQUIA",
        "REMEDIOS@ANTIOQUIA",
        "GRANADA@ANTIOQUIA",
        "AMALFI@ANTIOQUIA",
        "SAN CARLOS@ANTIOQUIA",
        "ABEJORRAL@ANTIOQUIA",
        "ARGELIA@ANTIOQUIA",
        "NARIÑO@ANTIOQUIA",
        "CISNEROS@ANTIOQUIA",
        "MACEO@ANTIOQUIA",
        "YOLOMBO@ANTIOQUIA",
        "PUERTO BERRIO@ANTIOQUIA",
        "MARINILLA@ANTIOQUIA",
        "LA ESTRELLA@ANTIOQUIA",
        "LA CEJA@ANTIOQUIA",
        "URRAO@ANTIOQUIA",
        "SOLEDAD@ATLÁNTICO",
        "CIÉNAGA DE ORO@MAGDALENA",
        "PENSILVANIA@CALDAS",
        "ZARZAL@VALLE DEL CAUCA",
        "SEVILLA@VALLE DEL CAUCA",
        "ANSERMA@CALDAS",
        "VILLAMARIA@CALDAS",
        "EL AGUILA@VALLE DEL CAUCA",
        "DOSQUEBRADAS@RISARALDA",
        "SALAMINA@CALDAS",
        "PALESTINA@CALDAS",
        "HONDA@TOLIMA",
        "NEIRA@CALDAS",
        "CARTAGO@VALLE DEL CAUCA",
        "PUERTO BOYACÁ@BOYACÁ",
        "MARMATO@CALDAS",
        "MANZANARES@CALDAS",
        "TORO@VALLE DEL CAUCA",
        "MARQUETALIA@CALDAS",
        "SAN JOSÉ@CALDAS",
        "CHINCHINA@CALDAS",
        "PACORA@CALDAS",
        "BOLIVAR@VALLE DEL CAUCA",
        "SUPIA@CALDAS",
        "PUERTO SALGAR@CUNDINAMARCA",
        "SAMANA@CALDAS",
        "NORCASIA@CALDAS",
        "ARGELIA@VALLE DEL CAUCA",
        "ULLOA@VALLE DEL CAUCA",
        "ANSERMANUEVO@VALLE DEL CAUCA",
        "LA MERCED@CALDAS",
        "VICTORIA@CALDAS",
        "VERSALLES@VALLE DEL CAUCA",
        "RISARALDA@CALDAS",
        "EL DOVIO@VALLE DEL CAUCA",
        "OBANDO@VALLE DEL CAUCA",
        "FILADELFIA@CALDAS",
        "BELALCAZAR@CALDAS",
        "RIOSUCIO@CALDAS",
        "ARANZAZU@CALDAS",
        "LA UNION@VALLE DEL CAUCA",
        "VITERBO@CALDAS",
        "ROLDANILLO@VALLE DEL CAUCA",
        "LA VICTORIA@VALLE DEL CAUCA",
        "AGUADAS@CALDAS",
        "CAICEDONIA@VALLE DEL CAUCA",
        "ALCALA@VALLE DEL CAUCA",
        "PINILLOS@BOLÍVAR",
        "LORICA@CORDOBA",
        "CORDOBA@BOLÍVAR",
        "SAN JUAN NEPOMUCENO@BOLÍVAR",
        "CARMEN DE BOLIVAR@BOLÍVAR",
        "SANTA ANA@MAGDALENA",
        "SAN LUIS DE SINCE@SUCRE",
        "MOMIL@CORDOBA",
        "MAGANGUE@BOLÍVAR",
        "SAN JACINTO@BOLÍVAR",
        "MAHATES@BOLÍVAR",
        "MOMPÓS@BOLÍVAR",
        "CERETE@CORDOBA",
        "BARRANCO DE LOBA@BOLÍVAR",
        "SARAVENA@ARAUCA",
        "AGUACHICA@CESAR",
        "MUTISCUA@NORTE DE SANTANDER",
        "ARAUQUITA@ARAUCA",
        "CUBARA@BOYACÁ",
        "FORTUL@ARAUCA",
        "PAMPLONA@NORTE DE SANTANDER",
        "MALAGA@SANTANDER",
        "CHINACOTA@NORTE DE SANTANDER",
        "LOS PATIOS@NORTE DE SANTANDER",
        "VILLA DEL ROSARIO@NORTE DE SANTANDER",
        "CAPITANEJO@SANTANDER",
        "CERRITO@SANTANDER",
        "PUERTO SANTANDER@NORTE DE SANTANDER",
        "LA PLAYA@NORTE DE SANTANDER",
        "EL CARMEN@NORTE DE SANTANDER",
        "TAME@ARAUCA",
        "EL ZULIA@NORTE DE SANTANDER",
        "GAMARRA@CESAR",
        "SARDINATA@NORTE DE SANTANDER",
        "ARBOLEDAS@NORTE DE SANTANDER",
        "TIBU@NORTE DE SANTANDER",
        "CRAVO NORTE@ARAUCA",
        "RIO DE ORO@CESAR",
        "SAN JOSÉ DE MIRANDA@SANTANDER",
        "RAGONVALIA@NORTE DE SANTANDER",
        "SALAZAR@NORTE DE SANTANDER",
        "LABATECA@NORTE DE SANTANDER",
        "TOLEDO@NORTE DE SANTANDER",
        "VILLA CARO@NORTE DE SANTANDER",
        "CACHIRA@NORTE DE SANTANDER",
        "SILOS@NORTE DE SANTANDER",
        "HERRÁN@NORTE DE SANTANDER",
        "CUCUTILLA@NORTE DE SANTANDER",
        "PUERTO RONDON@ARAUCA",
        "CHITAGA@NORTE DE SANTANDER",
        "SAN ANDRÉS@SANTANDER",
        "CHISCAS@BOYACÁ",
        "EL ESPINO@BOYACÁ",
        "GÜICAN@BOYACÁ",
        "SAN MATEO@BOYACÁ",
        "ABREGO@NORTE DE SANTANDER",
        "CONVENCION@NORTE DE SANTANDER",
        "CONCEPCION@SANTANDER",
        "MIRANDA@CAUCA",
        "LOPEZ@CAUCA",
        "BARBACOAS@NARIÑO",
        "SAMANIEGO@NARIÑO",
        "PAEZ@CAUCA",
        "SUAREZ@CAUCA",
        "SANTANDER DE QUILICHAO@CAUCA",
        "EL TAMBO@CAUCA",
        "ANZA@ANTIOQUIA",
        "MUTATA@ANTIOQUIA",
        "FREDONIA@ANTIOQUIA",
        "SABANALARGA@ANTIOQUIA",
        "CALDAS@ANTIOQUIA",
        "CAREPA@ANTIOQUIA",
        "TAMESIS@ANTIOQUIA",
        "TURBO@ANTIOQUIA",
        "DABEIBA@ANTIOQUIA",
        "TITIRIBI@ANTIOQUIA",
        "JARDIN@ANTIOQUIA",
        "SANTAFE DE ANTIOQUIA@ANTIOQUIA",
        "CHIGORODÓ@ANTIOQUIA",
        "CAÑASGORDAS@ANTIOQUIA",
        "CONCORDIA@ANTIOQUIA",
        "CIUDAD BOLIVAR@ANTIOQUIA",
        "SOPETRAN@ANTIOQUIA",
        "BETULIA@ANTIOQUIA",
        "AMAGA@ANTIOQUIA",
        "EBEJICO@ANTIOQUIA",
        "PUEBLORRICO@ANTIOQUIA",
        "PEQUE@ANTIOQUIA",
        "ANGELOPOLIS@ANTIOQUIA",
        "JERICO@ANTIOQUIA",
        "SAN JERÖNIMO@ANTIOQUIA",
        "VENECIA (ANT)@ANTIOQUIA",
        "SALGAR@ANTIOQUIA",
        "ANDES@ANTIOQUIA",
        "NECOCLI@ANTIOQUIA",
        "FRONTINO@ANTIOQUIA",
        "URABA@ANTIOQUIA",
        "MOSQUERA@CUNDINAMARCA",
        "VILLAPINZON@CUNDINAMARCA",
        "DISTRACCION@GUAJIRA",
        "AGUSTIN CODAZZI@CESAR",
        "BOSCONIA@CESAR",
        "ASTREA@CESAR",
        "SAN JUAN DEL CESAR@GUAJIRA",
        "LA JAGUA DE IBIRICO@CESAR",
        "BECERRIL@CESAR",
        "BARRANCAS@GUAJIRA",
        "ALBANIA@GUAJIRA",
        "LA PAZ@CESAR",
        "PUEBLO BELLO@CESAR",
        "VILLANUEVA@GUAJIRA",
        "DIBULLA@GUAJIRA",
        "CHIMICHAGUA@CESAR",
        "HATONUEVO@GUAJIRA",
        "EL PASO@CESAR",
        "MANAURE@GUAJIRA",
        "FONSECA@GUAJIRA",
        "EL MOLINO@GUAJIRA",
        "SAN DIEGO@CESAR",
        "MANAURE@CESAR",
        "URIBIA@GUAJIRA",
        "URUMITA@GUAJIRA",
        "EL COPEY@CESAR"],
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
                        var departamento = results[1].address_components[1].long_name
                        console.log("obtener_mi_posicion")
                        console.log(results)
                        MapaAtributos.ciudad = ciudad.toUpperCase()
                        MapaAtributos.mi_ciudad = ciudad.toUpperCase()
                        MapaAtributos.departamento = departamento.toUpperCase()
                        $("#sel_city").val(MapaAtributos.ciudad+ "@" + MapaAtributos.departamento)

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
            //navigator.notification.alert("OMP: " + error.message , "",  "C: " + error.code, "Aceptar");
            if(error.code == PositionError.POSITION_UNAVAILABLE){
                //navigator.notification.alert("OMP: No es posible localizar tu posición", "", "Error", "Aceptar");
            }else if(error.code == PositionError.TIMEOUT){
                //navigator.notification.alert("OMP: No es posible localizar tu posición", "", "Tiempo fuera", "Aceptar");
            }else if(error.code == PositionError.PERMISSION_DENIED){
                //navigator.notification.alert("OMP: Permiso denegado", "", "Permiso", "Aceptar");
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
            }
        }else{
            navigator.notification.alert("El mapa no se cargó no se puede ubicar mi posición", "", "Error", "Aceptar");
        }
    },
    //
    // Funcion que filtra el objeto según los criterios configurador MapaAtributos
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
                    navigator.notification.alert("No se ha podido geolocalizar a " + MapaAtributos.ciudad , "", "Falló geolocalización", "Aceptar");
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
        var url = MapaAtributos.general.puntos_json

        MapaAtributos.mapa.setZoom(17);

        //Ésta instrucción debe estar habilitada para que funcione en Manizales
        //MapaAtributos.ciudad = ''

        if(MapaAtributos.ciudad != ''){
            /*url += "&$filter=municipio LIKE '%" + MapaAtributos.ciudad + "%'"*/
            url += "&$filter=municipio EQ '" + MapaAtributos.ciudad + "'"
            if(MapaAtributos.departamento != ''){
                url += " AND departamento EQ '" + MapaAtributos.departamento + "'"
            }
        }

        console.log(url)

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            success: function (data) {
                var atencion = []
                var recaudo = []
                var bounds = new google.maps.LatLngBounds();

                var es_atencion = "Punto de atención FNA"

                if( data.d.length == 0){
                    //navigator.notification.alert("No hay puntos de atención o recaudo que estén en ésta ciudad.", "", "No hay puntos", "Aceptar");
                    $("#message-txt").text("No hay resultados.")
                }else{
                    $("#message-txt").text(data.d.length + " resultados")
                }

                var puntos_colocados = []

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
                            var image = MapaAtributos.general.pin_persona

                            bounds.extend(point);

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

                            markersArray.push(marker);
                            puntos_colocados.push(data.d[i])


                            marker.info  = '<div ><div class="info-window"><h2>'+ (bool_atencion? 'Punto de atención FNA': 'Punto de recaudo') +'</h2> '
                            marker.info += '<h1>'+ data.d[i].tipodeentidad +'</h1> '
                            marker.info += '<h3>'+ ubicacion +'</h3> '
                            marker.info += '<div class="info1">Costo transacción: <span>'+ data.d[i].costodetransaccion +'</span></div> '
                            marker.info += '<div class="info1">Horario de atención: <span>'+ horario +'</span></div> '
                            marker.info += '<div class="btns"><button class="btn-blue" onclick="MapaObjeto.mostrar_ruta(\''+data.d[i].latitud+'\', \''+data.d[i].longitud+'\')" type="button" >Como llegar</button> '
                            marker.info += '<button class="btn-blue" onclick="MapaObjeto.mostrar_puntuacion()" type="button" >Puntuar</button></div> </div> </div>'

                            marker.punto = data.d[i]


                            google.maps.event.addListener(marker, 'click', function() {
                                info_window.content = this.info;
                                info_window.maxWidth = 300;
                                info_window.open(this.getMap(), this);
                                MapaAtributos.mapa.panTo(this.getPosition());
                                MapaAtributos.punto_seleccionado = this.punto
                            });
                    }
                }

                if(MapaAtributos.mi_ciudad != MapaAtributos.ciudad && puntos_colocados.length > 0){
                    MapaAtributos.mapa.fitBounds(bounds);


                    if( puntos_colocados.length == 1){
                        MapaAtributos.mapa.setZoom(16);
                    }else{
                        var primero = puntos_colocados[0]
                        var solo_uno = true
                        for (var i = 1; i < puntos_colocados.length; i++) {
                            var otro = puntos_colocados[i]
                            if(primero.latitud != otro.latitud || primero.longitud != otro.longitud)
                                solo_uno = false
                        }
                        if(solo_uno)
                            MapaAtributos.mapa.setZoom(16);
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

        if(puntos == "" ){
            navigator.notification.alert("Debes dar una calificación.", "", "Error", "Aceptar");
            return false;
        }

        if(tipo == "" ){
            navigator.notification.alert("Debes seleccionar lo que calificas.", "", "Error", "Aceptar");
            return false;
        }

        

        $.loading('show',"Enviando puntuación");

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
            $.loading( "hide" );
            if (xmlhttp.readyState == 4) {
                try {
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                    var error = xmlDoc.getElementsByTagName("CodigoError")[0].childNodes[0].nodeValue
                    var error_msj = xmlDoc.getElementsByTagName("MensajeError")[0].childNodes[0].nodeValue
                    if(error != "0"){
                        navigator.notification.alert(error_msj, "", "Ha ocurrido un error", "Aceptar");
                    }else{
                        navigator.notification.alert(error_msj, "", "Transacción exitosa", "Aceptar");
                        //alert("ir a mapas")
                        //$.mobile.changePage("#map-page")
                        MapaObjeto.ocultar_puntuacion()
                        
                        $("#input-puntos").val(1)
                        /*$("#input-puntos-txt").text(1)*/
                        $("#input-tipo").val("")
                        $("#input-opinion").val("")
                    }
                }catch (e) {
                    navigator.notification.alert("Lo sentimos. Intentalo de nuevo.", "", "Ha ocurrido un error", "Aceptar");
                }
            }
        }
        xmlhttp.send(data);
    },
    //
    //Esto es para ejecutarlo en la consola, de prueba
    ciudades: function(){
        var url = MapaAtributos.general.puntos_json

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'jsonp',
            crossDomain: true,
            success: function (data) {
                var ciudades_tmp = {}
                for (var i = 0; i < data.d.length; i++) {
                    ciudades_tmp[data.d[i].municipio + "@" + data.d[i].departamento] = data.d[i].municipio
                }

                var ciudades = '[\n'
                for (var key in ciudades_tmp){
                    ciudades += '"' + key + '",\n'
                }
                ciudades += '\n]'

                console.log(ciudades)+
                console.log("Hasta aqui.")
                navigator.notification.alert("Lísto el pollo.", "", "Error", "Aceptar");
            },
            error: function (x, y, z) {
                navigator.notification.alert("Ocurrió un error al buscar las ciudades donde está presente el FNA.", "", "Error", "Aceptar");
            }
        });
    },

}





var Contenido = {
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
                    "Debes tener conexión a internet para acceder a ésta sección",
                    function(){
                        window.location.href="__inicio.html"
                    }, 
                    "Sin conexión", 
                    "Aceptar")
            }
    },
    // Carga el contenido segun la petición de página que le halla llegado
    cargar_mi_posicion: function(){
        clearOverlays()
        $.loading( "hide" );
        $.loading( 'show', "Ubicando mi posición");
        
        MapaAtributos.mi_posicion = null

        MapaObjeto.ubicarme( function(){
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
        if (navigator.connection.type == Connection.NONE){
            return false;
        }else{
            return true;
        }
    }
}





google.maps.event.addDomListener(window, 'load', function(){
    //document.addEventListener("deviceready", function(){
    //MapaObjeto.obtener_mi_posicion(function(){})
    Contenido.cargar()
    //}, false);
});




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
})









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
        select.append('<option value="">Selecciona tu ciudad</option>')
    for( var i = 0; i < ciudades.length; i++ ){
        var datos = ciudades[i].split('@')
        var ciudad = datos[0]
        var depto = datos[1]
        select.append('<option value="' + ciudades[i] + '">' + ciudad + '</option>')
    }
}



function cambio_ciudad(){
    $("#message-txt").text("")
    var sel = $("#sel_city").val()
    if(sel!=''){
        $("#message-window-mapa").removeClass("centered")
        var datos = sel.split('@')
        var ciudad = datos[0]
        var depto = datos[1]
    
        MapaAtributos.ciudad = ciudad
        MapaAtributos.departamento = depto
        MapaWindow.filtro_listo()
    }
}
