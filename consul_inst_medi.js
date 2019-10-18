var g_modulo="Restricción al Cambio de Medidor";
var g_titulo="Consulta de Instalación de Medidores";
var parameters={};
var my_url="reasigna_ajuste.asp";
var $grid;
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
    
    $("._input_selector").inputmask("dd/mm/yyyy");
	fn_reg();
	fn_mar();
	fn_mod();
	fn_contra();
	fn_inspec();
	fn_diam();


	$("#tx_fec_ini").focus();


   // EL CAMPO No. Orden lo limito a 8 digitos y solo numeros
	jQuery('#tx_med').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	jQuery('#tx_num_sum').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	jQuery('#tx_num_ord').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
	
	$("#tx_med").on("keydown", function(event) {
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
    $("#tx_lec_ant").prop("disabled", true);
	$("#tx_lec_ant2").prop("disabled", true);
    
    jQuery('#tx_cliente').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});

    
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
  //DIBUJA LOS ICONOS DE LOS BOTONES     
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_excel3").html("<span class='glyphicon glyphicon-save'></span> Excel");

  	jQuery('#tx_lec_ant').keypress(function(tecla) {
		if(tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	jQuery('#tx_lec_ant2').keypress(function(tecla) {
		if(tecla.charCode < 48 || tecla.charCode > 57) return false;
	});

	
	$("#tx_orden").bind("keydown",function(e){
		if(e.keyCode == 13){
			tab = true;
			fn_leer();
			return false;
		}
	 });

	$("#co_cancelar").on("click",function(){
		if ($.trim($("#co_cancelar").text())=="Cancelar"){
			$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");			     
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

		return;			
	});
    ///EVENTO BOTONES///
    $("#co_lec").on("click", function(){
		//Validación de informacion
		if ($.trim($("#co_lec").text()) == "Leer") {
	    /*if($("#tx_cliente").val()==""){
			fn_mensaje_boostrap("DIGITE NUMERO DE CLIENTE", g_titulo, $("#tx_cliente"));

				return;
			}*/
         }      	
	});
	$("#co_cancel").on("click", function (e){

		fn_limpiar();
		
    });

  
});	
  //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_orden()
{

	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_reg(){
	$("#cb_reg").html("<option value='0'></option><option value='1'>Opcion 1</option><option value='2'>Opcion 2</option>");

}
function fn_contra(){
	$("#cb_contra").html("<option value='0'></option><option value='1'>Opcion 1</option><option value='2'>Opcion 2</option>");

}
function fn_inspec(){
	$("#cb_inspec").html("<option value='0'></option><option value='1'>Opcion 1</option><option value='2'>Opcion 2</option>");

}
function fn_mar(){
	$("#cb_mar").html("<option value='0'></option><option value='1'>Opcion 1</option><option value='2'>Opcion 2</option>");

}
function fn_mod(){
	$("#cb_mod").html("<option value='0'></option><option value='1'>Opcion 1</option><option value='2'>Opcion 2</option>");

}
function fn_diam(){
	$("#cb_diam").html("<option value='0'></option><option value='1'>Opcion 1</option><option value='2'>Opcion 2</option>");

}
function fn_limpiar(){
//IDENTIFICACIÓN
$("#tx_fec_ini").val("");
$('#tx_fec_fin').val("");
$("#cb_reg").val("0");
$('#cb_contra').val("0");
$("#cb_inspec").val("0");
$("#tx_med").val("");
$("#cb_mar").val("0");
$("#cb_mod").val("0");
$("#cb_diam").val("0");            
$("#tx_num_sum").val(""); 
$("#tx_num_ord").val("");  

}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function fn_validar_fecha(value) {
	var real, info;

	if (/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/.test(value)) {
		info = value.split(/\//);
		var fecha = new Date(info[2], info[1] - 1, info[0]);
		if (Object.prototype.toString.call(fecha) === '[object Date]') {
			real = fecha.toISOString().substr(0, 10).split('-');
			if (info[0] === real[2] && info[1] === real[1] && info[2] === real[0]) {
				return true;
			}
			return false;
		} else {
			return false;
		}
	}
	else {
		return false;
	}
}

