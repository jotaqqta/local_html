var g_modulo="Solicitud de Corte y Reposici&oacute;n";
var g_titulo="Solicitud Individual de Reposici&oacute;n";
var parameters={};
var my_url="corte_y_reposc.asp";
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

     $("#div_filtro_bts_").on("shown.bs.modal", function () {
       $("#tx_can_com").focus();
   	});

    $("#co_medid").prop( "disabled", true);
    $("#co_deuda").prop( "disabled", true);

	//Footer
	$("#div_footer").load("syn_globales/footer.htm");	
	
	$("#tx_cliente").focus();
       
    $("._input_selector").inputmask("dd/mm/yyyy");

    ///Validación Solo números pestaña "Mantenedor Empresa"/// 
	jQuery('#tx_num_sum').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    
     //BOTONES-EVENTOS
	 $("#co_cancelar").on("click", function (e) {
        window.close(); 
    });

    $("#co_cancel").on("click", function (e) {
    $("#div_edit_bts").modal("hide"); 
    });
    

    
    $("#co_leer").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_leer").text()) == "Leer"){
			if ($("#tx_num_sum").val() == ""){
				fn_mensaje_boostrap("DIGITE EL N&Uacute;MERO DE SUMINISTRO.", g_titulo, $("#tx_num_sum"));
				return;
			}
            $("#co_medid").prop( "disabled", false);
            fn_leer();

		}

    });
    

    /*$("#co_medid").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_medid").text()) == "Limpiar") {
            fn_limpiar();
        }   
    });*/

    $("#co_medid").on("click", function (){
        $('#div_edit_bts').modal('show');
    });

	$("#co_leer").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_lim").text()) == "Limpiar") {
			fn_modal_1();
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


//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function fn_modal_1(){
   $("#div_edit_bts").modal({ backdrop: "static", keyboard: false });
   $("#div_edit_bts").on("shown.bs.modal", function () {
       $("#tx_num").focus();
   });
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