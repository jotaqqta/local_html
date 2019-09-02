var g_modulo="Facturación Clientes - Ajustes";
var g_titulo="Re-Asignar Ordenes de Ajuste";
var parameters = {};
var my_url = "reasigna_ajuste.asp";

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function(e) {

	if (e.keyCode === 8 ) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});

$(document).ready(function() {
    
    // PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});

    //INGRESA LOS TITULOS
    document.title = g_titulo ;
	document.body.scroll = "yes";
    
	$("#div_header").load("/syn_globales/header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);	
	});
		
	//Se cargan las variables que vienen desde el server
	/*
	$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	*/
	//fn_carga_roles();
	// INICIA CON EL CURSOR EN EL CAMPO No. ORDEN
	$("#tx_orden").focus();

	// EL CAMPO No. Orden lo limito a 8 digitos y solo numeros
	
	jQuery('#tx_orden').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
	
	$("#tx_orden").on("keydown", function(event) {
        var tecla =  event.which || event.keyCode;
        if(tecla==13)
        {
			if(!$("#tx_cliente").prop("readonly"))  //Readonly se deshabilita el enter
			{	
				$("#co_leer").trigger( "click" );
				return false;
			}
        }
    });
	//Footer
	$("#div_footer").load("/syn_globales/footer.htm");
	// SE INHABILITAN LOS IMPUT
	$("#co_reasignar").prop("disabled",true);
	$("#tx_cod_cliente").prop("disabled",true);
	$("#tx_nombre").prop("disabled",true);
	$("#tx_rol_actual").prop("disabled",true);
	$("#cb_reasigna_nuevo").prop("disabled",true);
	$("#tx_tarifa").prop("disabled",true);
	$("#tx_actividad").prop("disabled",true);
	$("#tx_estado").prop("disabled",true);
	$("#tx_ruta").prop("disabled",true);

	$("#co_leer").on("click", function(){
		//Validación de informacion
		if ($.trim($("#co_leer").text())=="Leer"){
			if( $("#tx_orden").val() == ""){
				fn_mensaje_boostrap("DIGITE EL NÚMERO DE ORDEN", g_titulo, $("#tx_orden"));
				return;
			}
			$("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar");
			fn_carga_orden();
		}
		else{
			
			if( $("#cb_reasigna_nuevo").val() == ""){
				fn_mensaje_boostrap("SELECCIONE EL USUARIO PARA REALIZAR LA ASIGNACIÓN", g_titulo, $("#cb_reasigna_nuevo"));
				return;
			}

			if($("#tx_rol_actual").val() == $("#cb_reasigna_nuevo").val())
			{
				fn_mensaje_boostrap("DEBE SELECCIONAR UN USUARIO DIFERENTE AL ACTUAL", g_titulo, $("#cb_reasigna_nuevo"));
				return;
			}
			//////////////////////////////////////////////////////////////
			/////////////////SE ACTUALIZA EL REGISTRO/////////////////////
			//////////////////////////////////////////////////////////////
			fn_act_orden();
			return;	
		}
	});

	$("#co_cancelar").on("click",function(){
		if ($.trim($("#co_cancelar").text())=="Cancelar"){
			fn_limpiar();
			return;
		}
		else
			window.close();
	});

	$("#co_reasignar").on("click",function(){
		if( $("#cb_reasigna_nuevo").val() == ""){
			fn_mensaje_boostrap("FAVOR INDIQUE EL ROL", g_titulo, $("#cb_reasigna_nuevo"));
			return;
		}

		if($("#tx_rol_actual").val() == $("#cb_reasigna_nuevo").val())
		{
			fn_mensaje_boostrap("DEBE SELECCIONAR UN USUARIO DIFERENTE AL ACTUAL", g_titulo, $("#cb_reasigna_nuevo"));
			return;
		}
		//////////////////////////////////////////////////////////////
		/////////////////SE ACTUALIZA EL REGISTRO/////////////////////
		//////////////////////////////////////////////////////////////
		fn_act_orden();

		//$("#tx_orden").focus();
		return;			
	});	
});


function fn_carga_orden()
{
	dato_ori = [];
    parameters = 
    {
		"func":"fn_lee_orden",
		"empresa":$("#tx_empresa").val(),
		"p_orden":$("#tx_orden").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != ""){
			$("#co_leer").html("<span class='glyphicon glyphicon-user'></span> Reasignar");
			dato_ori = text.split("|");
			//$("#co_leer").prop("disabled",true);
			$("#tx_orden").prop("disabled",true);
			$("#tx_cod_cliente").val(dato_ori[1]);
			$("#tx_rol_actual").val(dato_ori[3]);
			$("#tx_nombre").val(dato_ori[4]);
			$("#tx_estado").val(dato_ori[5]);
			$("#tx_ruta").val(dato_ori[6]);
			$("#tx_tarifa").val(dato_ori[7]);
			$("#tx_actividad").val(dato_ori[8]);
		}
		else{
			fn_mensaje_boostrap("No se encontro la orden indicada!!!", g_titulo, $(""));
			return;
		}
		if(dato_ori[0] == "F"){
			$("#co_leer").prop("disabled",true);
			fn_mensaje_boostrap("ESTA ORDEN YA FUE FINALIZADA, NO PUEDE SER REASIGNADA !", g_titulo, $(""));
			return;
		}
		
		//$("#co_reasignar").prop("disabled",false);
		$("#cb_reasigna_nuevo").prop("disabled",false);
	         
    });
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_roles()
{
    var param= 
    {
        "func":"fn_roles_ajuste",
        "empresa":$("#tx_empresa").val()
    };
    HablaServidor(my_url, param, "text", function(text) 
    {
        $("#cb_reasigna_nuevo").html(text);
    }); 
}

function fn_act_orden(){
	
	var param= 
    {
        "func":"fn_actualiza",
        "empresa":$("#tx_empresa").val(),
		"p_orden":$("#tx_orden").val(),
		"rol":$("#tx_rol").val(),
		"p_rol_nuevo":$("#cb_reasigna_nuevo").val()
    };
    HablaServidor(my_url, param, "text", function(text) 
    {
        if(text == ""){
			$("#cb_reasigna_nuevo").prop("disabled", true);
			$("#cb_reasigna_nuevo").prop("disabled",true);
			fn_mensaje_boostrap("ACCIÓN REALIZADA !", g_titulo, $(""));
			fn_limpiar();
		}
		else
			fn_mensaje_boostrap(text, g_tit, $(""));
    }); 
}

function fn_limpiar(){
	$("#tx_orden").val("");
	$("#tx_cod_cliente").val("");
	$("#tx_nombre").val("");
	$("#tx_rol_actual").val("");
	$('#cb_reasigna_nuevo').val("");
	$("#tx_tarifa").val("");
	$("#tx_actividad").val("");
	$("#tx_estado").val("");
	$("#tx_ruta").val("");

	$("#tx_orden").prop("disabled",false);
	$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
	$("#co_leer").prop("disabled",false);
	$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
	//$("#co_reasignar").prop("disabled",true);
	$("#cb_reasigna_nuevo").prop("disabled",true);
	$("#tx_orden").focus();
}
	