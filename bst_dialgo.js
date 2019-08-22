
//Declaracion de variables globales.
var g_titulo="Titulo del Mensaje....";

$(document).ready(function(){
    
    //abrir dialogo
    $("#myBtn").click(function(){
        $("#myModal").modal({backdrop: "static", keyboard: false});
        fn_limpiar();
    });
    
    $("#btn_confirma").click(function(){
        $("#example").modal({backdrop: "static", keyboard: false});
        //fn_limpiar();
    });
    
    $("#btn_mensaje").click(function(){
        fn_mensaje_bt("Cuerpo del Mensaje...........cuerpo del mensaje.........",g_titulo);
    });
    
    
    //establecer el focus en el dialogo
    $("#myModal").on("shown.bs.modal", function () {
        $('#texto1').focus();
    });
    
     $("#example").on("shown.bs.modal", function () {
        $('#texto1').focus();
    });
    
    $("#btn_guardar").on("click", function(){
        alert($("#area1").val()); 
        //$("#myModal").modal("hide");
    });
    
    $("#mensaje").on("shown.bs.modal", function () {
        $("#btn_cerrar_msg").focus();
    });
    
    
    
    $("#btn_guardar2").on("click", function(){
        $("#btn_cerrar_conf").trigger( "click" );
        alert("Boton guardar");
    });
    
});

    
function fn_limpiar()
{
    $("#texto1").val("");
     $("#area1").val("");
}

function fn_mensaje_bt(p_mensaje, g_titulo)
{
     $("#mensaje").modal({backdrop: "static", keyboard: false});
     $("#titulo_msg").text(g_titulo);
     $("#text_mensaje").text(p_mensaje);
     $("#btn_cerrar_msg").focus();
}