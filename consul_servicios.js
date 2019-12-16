var g_modulo = "Restricción al Cambio de Medidor";
var g_titulo = "Consulta de servicios";
var parameters = {};
var my_url = "reasigna_ajuste.asp";
var SFtotal1;
var SFtotal2;
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

	// PARA ELIMINAR EL SUBMIT
	$("button").on("click", function () { return false; });
	//INGRESA LOS TITULOS
	document.title = g_titulo;
	document.body.scroll = "yes";
	$("#div_header").load("/syn_globales/header.htm", function () {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);
	});

	$("._input_selector").inputmask("dd/mm/yyyy");
	fn_cierre();
	fn_dia();
	fn_estado();
	fn_plazo();
	fn_canal_comuni();
	fn_tipo_aten();
    fn_buscar_por();
    $("#tx_desde").focus();
    $("#tx_med").on("keydown", function (event) {
		var tecla = event.which || event.keyCode;
		if (tecla == 13) {
			if (!$("#tx_cliente").prop("readonly"))  //Readonly se deshabilita el enter
			{
				$("#co_leer").trigger("click");
				return false;
			}
		}

	});
	//Footer
	$("#div_footer").load("/syn_globales/footer.htm");
	// SE INHABILITAN LOS IMPUT
	$("#tx_desde").prop("disabled", true);
	$("#tx_hasta").prop("disabled", true);

	jQuery('#tx_cliente').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    $("#co_cancelar").on("click", function () {
		if ($.trim($("#co_cancelar").text()) == "Cancelar") {
			
			$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
			fn_limpiar();
			return;
		}
		else
			window.close();
	});

	$("#co_reasignar").on("click", function () {
		if ($("#cb_reasigna_nuevo").val() == "") {
			fn_mensaje_boostrap("FAVOR INDIQUE EL ROL", g_titulo, $("#cb_reasigna_nuevo"));
			return;
		}

		if ($("#tx_rol_actual").val() == $("#cb_reasigna_nuevo").val()) {
			fn_mensaje_boostrap("DEBE SELECCIONAR UN USUARIO DIFERENTE AL ACTUAL", g_titulo, $("#cb_reasigna_nuevo"));
			return;
		}
		//////////////////////////////////////////////////////////////
		/////////////////SE ACTUALIZA EL REGISTRO/////////////////////
		//////////////////////////////////////////////////////////////

		return;
	});
    	$("#cb_dia").on("click", function () {
		if ($("#cb_dia").val() == "1") {
				$("#tx_desde").prop("disabled", false);
	            $("#tx_hasta").prop("disabled", false);
		}

		/*if ($("#tx_rol_actual").val() == $("#cb_reasigna_nuevo").val()) {
			fn_mensaje_boostrap("DEBE SELECCIONAR UN USUARIO DIFERENTE AL ACTUAL", g_titulo, $("#cb_reasigna_nuevo"));
			return;
		}*/
		//////////////////////////////////////////////////////////////
		/////////////////SE ACTUALIZA EL REGISTRO/////////////////////
		//////////////////////////////////////////////////////////////

		return;
	});
	///EVENTO BOTONES///
	$("#co_gen").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_gen").text()) == "Generar") {
			if ($("#cb_cierre").val() == "0") {


				fn_mensaje_boostrap("SELECCIONE CAMPO EN CIERRE", g_titulo, $("#cb_cierre"));
				return;

			}

			if (fn_validar_fecha($("#tx_desde").val()) == false) {
				fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA DE INICIO. EL FORMATO ES DD/MM/YYYY.", g_titulo, $("#tx_desde"));
				return false;
			}
			if ($("#tx_hasta").val() == "") {

				fn_mensaje_boostrap("DIGITE LA FECHA FINAL", g_titulo, $("#tx_hasta"));
				return;
			}
			if (fn_validar_fecha($("#tx_hasta").val()) == false) {
				fn_mensaje_boostrap("INFORMACIÓN INCORRECTA EN EL CAMPO FECHA FINAL. EL FORMATO ES DD/MM/YYYY.", g_titulo, $("#tx_hasta"));
				return false;
			}
			if (SYNComp_Fechas($("#tx_desde").val(), $("#tx_hasta").val()) == ">") {
				fn_mensaje_boostrap("FECHA DE INICIO DEBE SER MENOR QUE LA FECHA FINAL", g_titulo, $("#tx_desde"));
				return;
			}
			fn_carga_orden()
		}

	});
	$("#co_cancel").on("click", function (e) {

		fn_limpiar();

	});


});
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_orden() {
	alert("Se cargo");

}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~


function fn_cierre () {
	$("#cb_cierre").html("<option value='0'></option><option value='1'>Opcion 1</option><option value='2'>Opcion 2</option>");

}

function fn_estado () {
	$("#cb_estado").html("<option value='0'></option><option value='1'>Producción</option><option value='2'>Opcion 2</option>");

}
function fn_dia () {
	$("#cb_dia").html("<option value='0'></option><option value='1'>Producción</option><option value='2'>Opcion 2</option>");

}
function fn_plazo() {
	$("#cb_plazo").html("<option value='0'></option><option value='1'>Opcion 1</option><option value='2'>Opcion 2</option>");

}
function fn_canal_comuni() {
	$("#cb_canal_comuni").html("<option value='0'></option><option value='1'>Opcion 1</option><option value='2'>Opcion 2</option>");

}
function  fn_tipo_aten() {
	$("#cb_tipo_aten").html("<option value='0'></option><option value='1'>Opcion 1</option><option value='2'>Opcion 2</option>");

}
function fn_buscar_por() {
	$("#cb_buscar_por").html("<option value='0'></option><option value='1'>Opcion 1</option><option value='2'>Opcion 2</option>");

}
function fn_limpiar() {
	//IDENTIFICACIÓN
	$("#tx_desde").val("");
	$("#tx_hasta").val("");
	$("#cb_cierre").val("0");
	$('#cb_estado').val("0");
	$("#cb_dia").val("0");
    $("#cb_plazo").val("0");
	$('#cb_canal_comuni').val("0");
	$("#cb_tipo_aten").val("0");
    $("#cb_buscar_por").val("0");



}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

function SYNComp_Fechas(SFec_uno, SFec_dos) {

	SFarr1 = SFec_uno.split(" ");
	p11 = SFarr1[0].split("/");

	if (SFarr1.length > 1)
		p21 = SFarr1[1].split(":");
	else
		p21 = new Array('', '', '');

	SFtotal1 = p11[2] + p11[1] + p11[0] + p21[0] + p21[1] + p21[2];



	//_____
	SFarr2 = SFec_dos.split(" ");
	p12 = SFarr2[0].split("/");

	if (SFarr2.length > 1)
		p22 = SFarr2[1].split(":");
	else
		p22 = new Array('', '', '');

	SFtotal2 = p12[2] + p12[1] + p12[0] + p22[0] + p22[1] + p22[2];
	console.log(SFtotal1);
	console.log(SFtotal2);
	if (SFtotal1 * 1 == SFtotal2 * 1)
		return "=";
	else {
		if (SFtotal1 * 1 >= SFtotal2 * 1)
			return ">";
		else
			return "<";
	}


}


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





























