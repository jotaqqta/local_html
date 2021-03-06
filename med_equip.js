var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Consulta de medidores";
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
   
    fn_marca();
	fn_diametro();
    fn_tarifa();
    fn_provincia();
    
   


    
    $("._input_selector").inputmask("dd/mm/yyyy");
    $('input[name="optradio"]').prop('disabled', false);
      
	jQuery('#num_cli').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#num_med').keypress(function(tecla) {
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
function fn_marca() {


	$("#mar_inp").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_diametro() {


	$("#diam_inp").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_tarifa() {


	$("#tar_inp").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_provincia() {


	$("#cb_prov").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_distrito() {


	$("#cb_dist").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_corregimiento() {


	$("#cb_corre").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_barrio() {


	$("#cb_barrio").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
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



