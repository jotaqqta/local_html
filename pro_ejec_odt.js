
var g_modulo="Sistema de Ordenes de Trabajo";
var g_titulo="Consulta de Proceso Ejecutados por ODTs";
var grid;
var obj2 = {}; 
var grid2 = "";

$(document).ready(function() {

// PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});

// SE COLOCAN LOS TITULOS
$("#div_mod1").html(g_modulo);
$("#div_tit1").html(g_titulo);

//$("#tx_nom").inputmask( "decimal",{max: parseInt(20), allowMinus: true });
    



$("#co_leer").on("click", function (e) {


});

$("#co_cancelar").on("click", function (e) {


});

//$("#tx_finca").inputmask("integer");
//$("#tx_finca").inputmask({mask:"9999999999", placeholder: ""});
//$("#tx_tomo").inputmask("integer");
//$("#tx_tomo").inputmask({mask:"9999999999", placeholder: ""});
//$("#tx_folio").inputmask("integer");
//$("#tx_folio").inputmask({mask:"9999999999", placeholder: ""});        
//$("#tx_doc").inputmask("integer");

    	$("#tx_folio").blur(function(){
		fn_rellenar_input($(this), 7);
	});


});
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar_dia()
{
    $("#tx_doc").val("");
    $("#tx_doc1").val("");
    $("#tx_doc2").val("");
    $("#tx_doc3").val("");
    $("#cb_tipo_doc2").val("");  
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_habilita_dia(estado)
{
    $("#tx_doc").prop("disabled", estado);
    $("#tx_doc1").prop("disabled", estado);
    $("#tx_doc2").prop("disabled", estado);  
    $("#tx_doc3").prop("disabled", estado);   
    $("#cb_tipo_doc2").prop("disabled", estado);
}

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

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_tx_numeros() 
{        
	if (parseFloat($("#tx_nro_cuo_max").val()) > 180)
        {
          $("#tx_nro_cuo_max").val("");
		  return false;
        }
}