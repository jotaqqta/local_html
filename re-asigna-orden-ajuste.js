
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

$("#co_reasignar").prop("disabled",true);
	//fn_mensaje_boostrap("Debe elegir un Tipo de Identidad", g_tit, $("#"));  //sin objeto
	//fn_mensaje_boostrap("Debe elegir un Tipo de Identidad", g_tit, $("#cb_tipo_doc")); //con objeto
$("#co_leer").on("click", function(){
	//Validación de informacion
	if( $("#tx_orden").val() == ""){
		fn_mensaje_boostrap("Faltan Datos", g_titulo, $("#tx_orden"));
		return;
	}
	//HAcer la funcionalidad adicional
	$("#tx_cod_cliente").val("123456");
	$("#tx_nombre").val("Pepito Perez");
	$("#tx_rol_actual").val("Maria");
	$("#co_reasignar").prop("disabled",false);
});

	
});

