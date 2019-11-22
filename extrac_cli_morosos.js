var g_modulo = "Corte y Reposición - Administración de Corte y Reposición";
var g_titulo = "Extración de Clientes Morosos";
var parameters = {};
var my_url = "correc_prome_dudo.asp";
var $grid;
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function (e) {

	if (e.keyCode === 8) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});

$(document).ready(function () {
	$("button").on("click", function () { return false; });

	document.title = g_titulo;
	document.body.scroll = "yes";

	$("#div_header").load("syn_globales/header.htm", function () {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);
	});

	//Footer
	$("#div_footer").load("syn_globales/footer.htm");

	$("#tx_cli").focus();
	fn_setea_grid_principal();

	fn_diametro();
	fn_modelo();
	fn_numero_medidor();
	fn_num_fab();
	fn_almacen_destino();
	fn_accion_realizada();
	fn_estado();
	fn_condición_medidor();
	fn_clave_reacondicionamiento();
	fn_propiedad_medidor();


	$("._input_selector").inputmask("dd/mm/yyyy");
	$('input[name="optradio"]').prop('disabled', false);

	jQuery('#tx_num_med').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	jQuery('#tx_num_fab').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});

	//BOTONES-EVENTOS
	$("#co_cancelar").on("click", function (e) {
		window.close();
	});
	$("#cb_prov").on("change", function (evt) {
		if ($(this).val() != "") {
			$("#cb_dist").prop("disabled", false);
			fn_distrito();
		}

		else {
			$("#cb_dist").val("");
			$("#cb_corre").val("");
			$("#cb_barrio").val("");
			$("#cb_dist").prop("disabled", true);
			$("#cb_corre").prop("disabled", true);
			$("#cb_barrio").prop("disabled", true);
		}
	});
	$("#cb_dist").on("change", function (evt) {
		if ($(this).val() != "") {
			$("#cb_corre").prop("disabled", false);

		}

		else {
			$("#cb_corre").val("");
			$("#cb_barrio").val("");
			$("#cb_corre").prop("disabled", true);
			$("#cb_barrio").prop("disabled", true);
		}
	});
	$("#cb_corre").on("change", function (evt) {
		if ($(this).val() != "") {
			$("#cb_barrio").prop("disabled", false);
			fn_barrio();
		}

		else {
			$("#cb_barrio").val("");
			$("#cb_barrio").prop("disabled", true);
		}
	});

	$("#co_lec").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_lec").text()) == "Leer") {
	    if($("#tx_num_fab").val()==""){
			fn_mensaje_boostrap("DIGITE NUMERO DE FABRICA", g_titulo, $("#tx_num_fab"));

				return;
			}
         }
		$("#co_lec").html("<span class='glyphicon glyphicon-plus'></span> Ingresar");
		fn_carga_fil();
	
	});
	
	$("#co_lec").on("click", function () {
		if ($.trim($("#co_lec").text()) == "Ingresar") {
        fn_cargar_lectura();

		}
    });



	$("#co_cancel").on("click", function (e){

		fn_limpiar_fil();
		
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
function fn_diametro() {
	$("#cb_mar_inp").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_modelo() {
	$("#cb_model").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_numero_medidor() {
	$("#tx_num_med").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_num_fab() {
	$("#tx_num_fab").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_almacen_destino() {
	$("#cb_alm_dest").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_accion_realizada() {
	$("#cb_acc_real").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_estado() {
	$("#cb_est").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_condición_medidor() {
	$("#cb_cond_med").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_clave_reacondicionamiento() {
	$("#cb_clav_reac").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_propiedad_medidor() {
	$("#cb_pro_med").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_cargar_lectura() {
	$('#cb_alm_dest').val("1");
	$('#cb_acc_real').val("2");
	$('#cb_est').val("3");
	$('#cb_cond_med').val("1")
	$('#tx_diam').val("5/8''");
	$('#tx_tec').val("MAGNETICA");
	$('#tx_cls_metro').val("CALSE B");
	$('#tx_anio_fab').val("2019");
	$('#chk_prot').prop("checked",true);
	$('#tx_fec_cre').val(20022019);
	$('#tx_anio_reac').val("2018");
	$('#cb_clav_reac').val("2");
	$('#cb_pro_med').val("3");
}
function fn_carga_fil(){
	$("#cb_mar_inp").val("2");
	$("#cb_model").val("1");
	$("#tx_num_med").val(45454);

}
function fn_carga_grilla() {


}
function fn_gen() {
	alert('Se genero.');
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function fn_limpiar_fil() {
     $("#cb_mar_inp").val("0");
	 $("#cb_model").val("0");
	 $("#tx_num_med").val("");
	 $("#tx_num_fab").val("");
}
function fn_limpiar(){
	$('#cb_alm_dest').val("0");
	$('#cb_acc_real').val("0");
	$('#cb_est').val("0");
	$('#cb_cond_med').val("0")
	$('#tx_diam').val("");
	$('#tx_tec').val("");
	$('#tx_cls_metro').val("");
	$('#tx_anio_fab').val("");
	$('#chk_prot').prop("checked",false);
	$('#tx_fec_cre').val("");
	$('#tx_anio_reac').val("");
	$('#cb_clav_reac').val("0");
	$('#cb_pro_med').val("0");

}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

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



