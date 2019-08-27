var g_modulo="Facturación Clientes - Ajustes";
var g_titulo="Re-Asignar Ordenes de Ajuste";

$(document).ready(function() {

	// PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});
	
	// INICIA CON EL CURSOR EN EL CAMPO No. ORDEN
	$("#tx_orden").focus();

	// EL CAMPO No. Orden lo limito a 8 digitos y solo numeros
	jQuery('#tx_orden').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

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

	// SE INHABILITAN LOS IMPUT
	$("#co_reasignar").prop("disabled",true);
	$("#tx_cod_cliente").prop("disabled",true);
	$("#tx_nombre").prop("disabled",true);
	$("#tx_rol_actual").prop("disabled",true);
	$("#cb_reasigna_nuevo").prop("disabled",true);

		//fn_mensaje_boostrap("Debe elegir un Tipo de Identidad", g_tit, $("#"));  //sin objeto
		//fn_mensaje_boostrap("Debe elegir un Tipo de Identidad", g_tit, $("#cb_tipo_doc")); //con objeto

	$("#co_leer").on("click", function(){
		//Validación de informacion
		if( $("#tx_orden").val() == ""){
			fn_mensaje_boostrap("Debe digitar el Numero de Orden", g_titulo, $("#tx_orden"));
			return;
		}

		//HAcer la funcionalidad adicional
		
		$("#tx_cod_cliente").val("123456");
		$("#tx_nombre").val("Pepito Perez");
		$("#tx_rol_actual").val("Maria");
		
		$("#co_leer").prop("disabled",true);
		$("#tx_orden").prop("disabled",true);
		$("#co_reasignar").prop("disabled",false);
		$("#cb_reasigna_nuevo").prop("disabled",false);

		fn_carga_rol();
		$("#cb_reasigna_nuevo").focus();
	});

	$("#co_cancelar").on("click",function(){
		$("#tx_orden").val("");
		$("#tx_cod_cliente").val("");
		$("#tx_nombre").val("");
		$("#tx_rol_actual").val("");
		$('#cb_reasigna_nuevo').html('');

		$("#tx_orden").prop("disabled",false);
		$("#co_leer").prop("disabled",false);
		$("#co_reasignar").prop("disabled",true);
		$("#cb_reasigna_nuevo").prop("disabled",true);

		$("#tx_orden").focus();
		return;
	});

	$("#co_reasignar").on("click",function(){
		if( $("#cb_reasigna_nuevo").val() == ""){
			fn_mensaje_boostrap("Debe Seleccionar el rol a Reasignar", g_titulo, $("#cb_reasigna_nuevo"));
			return;
		}
		
		//////////////////////////////////////////////////////////////
		/////////////////SE ACTUALIZA EL REGISTRO/////////////////////
		//////////////////////////////////////////////////////////////
		var var_orden = $("#tx_orden").val();

		alert("Se Re-Asigno La Orden Nro. "+var_orden+" Correctamente.");

		$("#tx_orden").val("");
		$("#tx_cod_cliente").val("");
		$("#tx_nombre").val("");
		$("#tx_rol_actual").val("");
		$('#cb_reasigna_nuevo').html('');

		$("#tx_orden").prop("disabled",false);
		$("#co_leer").prop("disabled",false);
		$("#co_reasignar").prop("disabled",true);
		$("#cb_reasigna_nuevo").prop("disabled",true);

		$("#tx_orden").focus();
		return;			
	});	
});


function fn_carga_rol()
{
    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/
	
	$("#cb_reasigna_nuevo").html("<option value='' selected>SELECCIONE ROL...</option><option value='01'>Nelson</option> <option value='2' >Julian</option> <option value='3'>Jairo</option> <option value='4'>David</option>");
}