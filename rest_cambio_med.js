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
	    if($("#tx_cliente").val()==""){
			fn_mensaje_boostrap("DIGITE NUMERO DE CLIENTE", g_titulo, $("#tx_cliente"));

				return;
			}
         }      	
	});
	$("#co_cancel").on("click", function (e){

		fn_limpiar();
		
    });

  
});	
  //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
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
			fn_mensaje_boostrap("ESTA ORDEN YA FUE FINALIZADA, NO PUEDE SER REASIGNADA !", g_titulo,$(""));
			return;
		}
		
		//$("#co_reasignar").prop("disabled",false);
		$("#cb_reasigna_nuevo").prop("disabled",false);
	         
    });
	
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer(){
	if ($.trim($("#co_leer").text()) == "Leer")
	{
				
		
		$("#tx_cod_cliente").val("45223");
		$("#tx_dir").val("Maria");
		$("#tx_est_client").val("Activo");
		$('#tx_est_conex').val("Si");
		$("#tx_reg").val("Panamá Metro");
		$("#tx_ruta").val("8000-01-244");
		$("#tx_tarif").val("Residencial");
		$("#tx_actividad").val("Residencial");
		$("#tx_num_medidor").val("23234345");            
		$("#tx_ent_decim").val("5/1"); 
		$("#tx_tipo_med").val("MCUB");  
		$("#tx_lec_ant").val("2344");
		$("#tx_lec_actu").val("152");  
		$("#tx_consum").val("23000"); 
		$("#tx_fac_conv_consum").val("10002");  
		$("#tx_consum_fact_gls").val("1000");  
		$("#tx_peri_dia_prom").val("2"); 
		$("#tx_peri_dia_norm ").val("2"); 
		$("#tx_num_medidor2").val("");         
		$("#tx_ent_decim2").val(""); 
		$("#tx_tipo_med2").val(""); 
        $("#tx_lec_actu2").val(""); 
		$("#tx_consum2").val(""); 

		if($("#tx_lec_ant").val() > $("#tx_lec_actu").val()){
			fn_mensaje_boostrap("La lectura anterior 1 ("+$("#tx_lec_ant").val()+") es superior a la lectura actual 1 ("+$("#tx_lec_actu").val()+"). Verifique si se ha producido una vuelta del reloj del medidor.", "ADVERTENCIA!!!", $("#tx_lec_ant"));
		}

		if($("#tx_lec_ant2").val() > $("#tx_lec_actu2").val()){
			fn_mensaje_boostrap("La lectura anterior 2 ("+$("#tx_lec_ant2").val()+") es superior a la lectura actual 2 ("+$("#tx_lec_actu2").val()+"). Verifique si se ha producido una vuelta del reloj del medidor.", "ADVERTENCIA!!!", $("#tx_lec_ant2"));
		}
		
		$("#tx_lec_ant").prop("disabled", false);
        $("#tx_lec_ant2").prop("disabled", false); //Para habilitar

	}
}


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
//IDENTIFICACIÓN

$('#tx_cod_cliente').val("");
$('#tx_ruta').val("");
$('#tx_cenoper').val("");
$('#tx_locali').val("");
$('#tx_dir').val("");
$('#tx_tarifa').val("");
$('#cb_motivo').val("");
$('#chk_env_cart').prop("checked",false);
$('#chk_autor_cli').prop("checked",false);
$("#tx_cod_cliente").focus();
$("#tx_cod_cliente").val("");
}
	