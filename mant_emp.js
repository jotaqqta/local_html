var g_modulo="Mantenedor_Empresa";
var g_titulo="Mantenedor Empresa";
var parameters={};
var my_url="correc_prome_dudo.asp";
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
    $("button").on("click", function(){return false;});

    document.title = g_titulo ;
	document.body.scroll = "yes";

    $("#div_header").load("syn_globales/header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);	
	});

	//Footer
	$("#div_footer").load("syn_globales/footer.htm");	
		
	$("#tx_cliente").focus();
   
    fn_giro();
	fn_localidad();
    fn_monedalocal();
    fn_radica();
    fn_estado();
    fn_resumen();
    
    
    
        
    $("._input_selector").inputmask("dd/mm/yyyy");
    $('input[name="optradio"]').prop('disabled', false);
    ///Validación Solo números pestaña "Mantenedor Empresa"/// 
	jQuery('#tx_rut').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_tel').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_fax').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    ///Validación Solo números pestaña "Instalación Parámetros"///
    ///Datos Generales///
    jQuery('#tx_cantsec').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_numcuen').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_valdia').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_permin').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_parsen').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_bolse').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    ///Limites Generales///
    jQuery('#tx_limin30').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_limin60').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_limin').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_limax30').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_limax60').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    ///Números Históricos///
     jQuery('#tx_fact').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_conve').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_refac').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_corte').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_pagos').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    ///Irregularidades///
    jQuery('#tx_consup').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_disup').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_consumo').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_porinf').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_porsup').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
     jQuery('#tx_facinfe').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_facsup').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    ///Decimales///
    jQuery('#tx_desfis').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_desmon').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_destasa').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_calfis').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_calmon').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
     jQuery('#tx_caltasa').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    ///Días///
    jQuery('#tx_dialib').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_difac').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_diarep').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
     ///Validación Solo números pestaña "Otros Datos Generales"///
    ///Formato Fecha///
    jQuery('#tx_externo').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_interno').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    ///Otros///
    jQuery('#cb_canrefac').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    
    
    
     //BOTONES-EVENTOS
	 $("#co_cancelar").on("click", function (e) {
        window.close(); 
    }); 
     $("#cb_prov").on("change", function(evt){
        if($(this).val()!= ""){
		 $("#cb_dist").prop("disabled", false);
         fn_distrito();
    }
	  
       else{ 
           $("#cb_dist").val("");
           $("#cb_corre").val("");
           $("#cb_barrio").val("");
           $("#cb_dist").prop("disabled", true);
           $("#cb_corre").prop("disabled", true);
           $("#cb_barrio").prop("disabled", true);
               }
    });
       $("#cb_dist").on("change", function(evt){
        if($(this).val()!= ""){
		 $("#cb_corre").prop("disabled", false);
          fn_corregimiento();
    }
	  
       else{ 
           $("#cb_corre").val("");
           $("#cb_barrio").val("");
           $("#cb_corre").prop("disabled", true);
           $("#cb_barrio").prop("disabled", true);  
       }
    });
      $("#cb_corre").on("change", function(evt){
        if($(this).val()!= ""){
		 $("#cb_barrio").prop("disabled", false);
         fn_barrio();
    }
	  
       else{ 
          $("#cb_barrio").val("");
           $("#cb_barrio").prop("disabled", true);  
       }
    });
    
    $("#co_gen").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_gen").text()) == "Generar"){
        if ($("#fec_sum_in").val() == ""){
					fn_mensaje_boostrap("DIGITE LA FECHA DE INICIO.", g_titulo, $("#fec_sum_in"));
				
				return;
					return;}
					else{
						if(fn_validar_fecha($("#fec_sum_in").val()) == false){
							fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE PROCESO. EL FORMATO ES DD/MM/YYYY.", g_titulo, $("#fec_sum_in"));
							//fn_mensaje_bootstrap_fecv();
							return false;
					}
                }
               if ($("#fec_sum_fin").val() == ""){
					fn_mensaje_boostrap("DIGITE LA FECHA FINAL.", g_titulo, $("#fec_sum_fin"));
				
				return;
					return;}
					else{
						if(fn_validar_fecha($("#fec_sum_fin").val()) == false){
							fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE PROCESO. EL FORMATO ES DD/MM/YYYY.", g_titulo, $("#fec_sum_fin"));
							//fn_mensaje_bootstrap_fecv();
							return false;
					}
                } 
           
           }
           fn_mensaje_boostrap("Se genero", g_titulo, $("#co_gen"));
           fn_carga_grilla(); 
           fn_limpiar();
        
   
    });
    

    $("#co_lim").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_lim").text()) == "Limpiar") {
            fn_limpiar();
        }
        
    });
    	
    
 

});



//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_giro() {


	$("#cb_giro").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_localidad() {


	$("#cb_local").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_monedalocal() {


	$("#cb_mone").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_radica() {


	$("#cb_radica").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_estado() {


	$("#cb_estado").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_resumen() {


	$("#cb_facres").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}

function fn_carga_grilla(){
    
    
}
function fn_gen(){
     alert('Se genero.');
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function fn_limpiar(){
        $("#fec_sum_in").val(""); 
        $("#fec_sum_fin").val(""); 	
    	$("#num_cli").val("");
    	$("#rut_com").val("");
    	$("#num_med").val("");
    	$("#fec_sum").val("");
    	$("#mar_inp").val("");
    	$("#diam_inp").val("");
    	$("#tar_inp").val("");
    	$("#cb_prov").val("");
    	$("#cb_dist").val("");
    	$("#cb_corre").val("");
    	$("#cb_barrio").val("");
    	$('input[name="optradio"]').prop('checked', false);
	    $('input[name="optradio"]').prop('checked', false);
        $("#cb_dist").prop("disabled", true);
        $("#cb_corre").prop("disabled", true);
        $("#cb_barrio").prop("disabled", true);

    
  
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function fn_validar_fecha(value){
	var real, info;

	if (/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/.test(value)) {
		info = value.split(/\//);
		var fecha = new Date(info[2], info[1]-1, info[0]);
		if ( Object.prototype.toString.call(fecha) === '[object Date]' ){
			real = fecha.toISOString().substr(0,10).split('-');
			if (info[0] === real[2] && info[1] === real[1] && info[2] === real[0]) {
				return true;
			}
			return false;
		}else{
		return false;
		}
	}
	else {
	return false;
	}
}



