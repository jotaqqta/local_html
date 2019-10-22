var g_modulo="Restricción al Cambio de Medidor";
var g_titulo="Restricción al Cambio de Medidor";
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
	//Se cargan las variables que vienen desde el server
	/*
	$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	*/

	$("#tx_orden").focus();
	
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
    $("#tx_lec_ant").prop("disabled", true);
	$("#tx_lec_ant2").prop("disabled", true);
    
    jQuery('#tx_cliente').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});    

  //DIBUJA LOS ICONOS DE LOS BOTONES     
  
  	jQuery('#tx_lec_ant').keypress(function(tecla) {
		if(tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	jQuery('#tx_lec_ant2').keypress(function(tecla) {
		if(tecla.charCode < 48 || tecla.charCode > 57) return false;
	});

	
	$("#tx_cliente").bind("keydown",function(e){
		if(e.keyCode == 13){
			tab = true;
			fn_leer();
			return false;
		}
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
			if($("#tx_cliente").val()==""){
				fn_mensaje_boostrap("FAVOR DIGITE NUMERO DE CLIENTE", g_titulo, $("#tx_cliente"));
					return;
			}
			fn_leer();
         }
		else 
			fn_abre_modal();
	});
	
	$("#co_cancel").on("click", function (e){

		fn_limpiar();
		
    });
    
    $("#co_cancelar").on("click", function (e) {
        $('#div_filtro_bts').modal('hide');
    })
  
});	
  //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
///FUNCIONES EVENTOS///
function fn_carga_orden()
{
	dato_ori = [];
    parameters = 
    {
		"func":"fn_lee_cliente",
        "empresa":$("#tx_empresa").val(),
		"p_cliente":$("#tx_cliente").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != ""){
			$("#co_lec").html("<span class='glyphicon glyphicon-user'></span> Reasignar");
			dato_ori = text.split("|");
			//$("#co_leer").prop("disabled",true);
			$("#tx_cliente").prop("disabled",true);
			$("#tx_cod_cliente").val(dato_ori[1]);
			$("#tx_ruta").val(dato_ori[3]);
			$("#tx_cenoper").val(dato_ori[4]);
			$("#tx_locali").val(dato_ori[5]);
			$("#tx_dir").val(dato_ori[6]);
            $("#chk_grancli").val(dato_ori[8]);
			$("#tx_tarifa").val(dato_ori[7]);
			$("#cb_motivo").val(dato_ori[8]);
            $("#chk_tempo").val(dato_ori[8]);
            $("#chk_indef").val(dato_ori[8]);
            $("#tx_fecha_desde").val(dato_ori[7]);
            $("#tx_fecha_hasta").val(dato_ori[7]);           
		}
		else{
			fn_mensaje_boostrap("No se encontro la orden indicada!!!", g_titulo, $(""));
			return;
		}
		if(dato_ori[0] == "F"){
			$("#co_lec").prop("disabled",true);
			fn_mensaje_boostrap("ESTA ORDEN YA FUE FINALIZADA, NO PUEDE SER REASIGNADA !", g_titulo,$(""));
			return;
		}
		
		//$("#co_reasignar").prop("disabled",false);
		$("#cb_reasigna_nuevo").prop("disabled",false);
	         
    });
	
}
//-------------------------------------------------------------------------------------------
function fn_leer(){
	if ($.trim($("#co_lec").text()) == "Leer")
	{
				
		$("#co_lec").html("<span class='glyphicon glyphicon-floppy-disk'></span> Actualizar");
		
		$("#tx_cliente").val("45223");
		$("#tx_cod_cliente").val("Maria");
		$("#tx_ruta").val("Activo");
		$('#tx_cenoper').val("Si");
		$("#tx_locali").val("Panamá Metro");
		$("#tx_dir").val("8000-01-244");
		$("#chk_grancli").val("Residencial");
		$("#tx_tarifa").val("Residencial");
		$("#cb_motivo").val("23234345");            
		$("#chk_tempo").val("5/1"); 
		$("#chk_indef").val("MCUB");  
		$("#tx_fecha_desde").val("2344");
		$("#tx_fecha_hasta").val("152"); 
	}
}

//-------------------------------------------------------------------------------------------
function fn_abre_modal() {

    $("#div_filtro_bts").modal({ backdrop: "static", keyboard: false });
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();

    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpiar(){
//IDENTIFICACIÓN

	$("#co_lec").html("<span class='glyphicon glyphicon-search'></span> Leer");
	$('#tx_cod_cliente').val("");   
	$('#tx_ruta').val("");
	$('#tx_cenoper').val("");
	$('#tx_locali').val("");
	$('#tx_dir').val("");
	$('#tx_tarifa').val("");
	$('#chk_grancli').prop("checked",false);
	$('#cb_motivo').val("");
	$('#chk_tempo').prop("checked",false);
	$('#chk_indef').prop("checked",false);
	$('#chk_grancli').prop("checked",false);
	$("#tx_cliente").focus();
	$("#tx_cliente").val("");
	$("#tx_fecha_desde").val("");
	$("#tx_fecha_hasta").val("");
}
	