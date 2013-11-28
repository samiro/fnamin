var Connection = {
    NONE: 'no',
    TIENE: 'tiene'
}
navigator.connection = {}
navigator.connection.type = Connection.TIENE
navigator.notification = {}
navigator.notification.alert = function(mensaje, callback, titulo, boton){
    alert(mensaje)
    if(callback!="")
        callback()
}

PositionError = {}