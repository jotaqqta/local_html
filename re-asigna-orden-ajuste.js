
var g_modulo="Facturación Clientes - Ajustes";
var g_titulo="Re-Asignar Ordenes de Ajuste";

$(document).ready(function() {

// PARA ELIMINAR EL SUBMIT
$("button").on("click", function(){return false;});

//Invocar la cabecera de la pagina
$("#div_header").load("header.htm", function() {
	$("#div_mod0").html(g_modulo);
	$("#div_tit0").html(g_titulo);	
});
	
// SE COLOCAN LOS TITULOS
$("#div_mod1").html(g_modulo);
$("#div_tit1").html(g_titulo);
$("#div_mod2").html(g_modulo);
$("#div_tit2").html(g_titulo);
	
	//fn_mensaje_boostrap("Debe elegir un Tipo de Identidad", g_tit, $("#"));  //sin objeto
	//fn_mensaje_boostrap("Debe elegir un Tipo de Identidad", g_tit, $("#cb_tipo_doc")); //con objeto
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
 function fn_mensaje(p_mensaje, p_titulo, $p_objeto)
{
    $("#lb_mensaje").html(p_mensaje);
        
    $( "#dialog-message" ).dialog({
        title:p_titulo,
        modal: true,
        buttons: [{
			id:"co_menj_ok",
			text : "Ok",
            click: function() {
				$( this ).dialog( "close" );
				$p_objeto.focus();
            }
        }],
		open: function( event, ui ) {$("#co_menj_ok").focus();}
    });
	
	$("#dialog-message").dialog("open");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_mensaje_boostrap(p_mensaje, p_titulo, $p_objeto)
{
    $("#lb_mensaje").html(p_mensaje);
        
    $( "#dialog-message" ).dialog({
        title:p_titulo,
        modal: true,
        buttons: [{
			id:"co_menj_ok",
			text : "Ok",
            click: function() {
				$( this ).dialog( "close" );
				$p_objeto.focus();
            }
        }],
		open: function( event, ui ) {$("#co_menj_ok").focus();}
    });
	
}