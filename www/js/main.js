$.mobile.defaultPageTransition   = 'none'
$.mobile.defaultDialogTransition = 'none'
$.mobile.buttonMarkup.hoverDelay = 0


$( document ).on( "ready", function( event ){
    //
    // Esto es para modificar el comportamiento cada vez que se le hace click a un 
    // hipervinculo que lleva a otra pagina
    $( "a" ).tap( function(event){
        event.preventDefault();
        var element = $( this )
        //
        // Si el hipervinculo al que se le hizo click tiene la clase External, 
        // es porque va a cargar un .html externo. Por lo tanto la carga se debe hacerse
        // de una manera distinta.
        //
        // De lo contrario
        // Hace el llamado correspondiente al objeto Contenido
        if( element.hasClass("external") ){
            window.location.href = element.attr( "href" )
        }else{
            if(element.attr( "href" ) == "#filter-maps" || element.attr( "href" ) == "#acerca" || element.attr( "href" ) == "#compartir"){
                $.mobile.changePage( element.attr( "href" ), {transition: 'pop', role: 'dialog'})
            }else{
                $.mobile.changePage( element.attr( "href" ) )
            }
            //Contenido.cargar( element.attr( "href" ) )
        }
    })

    $("[data-role='page']").on("pageshow", function(){
        var page = $(this)
        Contenido.cargar("#" + page.attr("id"))
    })

    $( "#portafolio" ).on( "pagebeforeshow", function( event ) { 
        $('#portafolio li').removeClass('ui-btn-active ui-focus');
    })


    $("#puntuar ").on("pagebeforeshow", function(event){
        $("#input-puntos").val(1).slider('refresh');
        $("#input-tipo").val("").selectmenu('refresh');
        $("#input-opinion").val("")
        $("#puntuar .ui-btn-active").removeClass("ui-btn-active ui-focus")
    })
    
})




/*
    Este objeto contiene las funciones necesarias para cargar el contenido de una pagina
    despues de que cambia la url
*/
var Contenido = {
    // Carga el contenido segun la petición de página que le halla llegado
    cargar: function( href ){
        if( href == "#map-page" ){
            if ( Contenido.tiene_conexion() ){
                MapaObjeto.actualizar_filtros()
                $.mobile.loading('show', {
                    text: "Iniciando Google Maps",
                    textVisible: true,
                    textonly: false
                });
                MapaObjeto.inicializar( function(){
                    $.mobile.loading( "hide" );
                    $.mobile.loading('show', {
                        text: "Ubicando mi posición",
                        textVisible: true,
                        textonly: false
                    });

                    MapaObjeto.ubicarme( function(){
                        
                        $.mobile.loading( "hide" );
                        $.mobile.loading('show', {
                            text: "Cargando puntos FNA",
                            textVisible: true,
                            textonly: false
                        });
                        MapaObjeto.cargar_todos_puntos( true, function(){
                            MapaObjeto.resize_trigger()
                            MapaObjeto.centrarme()
                            $.mobile.loading( "hide" );
                        })
                    })
                })
            } else {
                navigator.notification.alert(
                    "Debes tener conexión a internet para acceder a ésta sección",
                    function(){
                        $.mobile.changePage( "#inicio" )
                    }, 
                    "Sin conexión", 
                    "Aceptar")
            }
        } else if( href ==  "#educacion" ){
            Portafolio.cargar_educacion()

        } else if( href == "#vivienda" ){
            Portafolio.cargar_vivienda()

        } else if( href == "#cesantias" ){
            Portafolio.cargar_cesantias()

        } else if( href == "#ahorro" ){
            Portafolio.cargar_ahorro()

        } else if( href == "#asesoria" ){
            if ( Contenido.tiene_conexion() ){
                if(localStorage.getItem("nombre")!= null){
                     $("#nombre").val(localStorage.getItem("nombre"));
                     $("#cedula").val(localStorage.getItem("cedula"));
                     $("#celular").val(localStorage.getItem("telefonoCelular"));
                     $("#direccion").val(localStorage.getItem("direccion"));
                     $("#email").val(localStorage.getItem("email"));
                }
            }else{
                navigator.notification.alert(
                    "Debes tener conexión a internet para acceder a ésta sección",
                    function(){
                        $.mobile.changePage( "#inicio" )
                    }, 
                    "Sin conexión", 
                    "Aceptar")
            }
        }
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


//Con esta funciona se cambia a la página atrevéz del identificador
function ir(idpage){
      $.mobile.changePage('#'+idpage)
    }