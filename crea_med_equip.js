var g_modulo = "Facturación Clientes - Lecturas y Consumos";
var g_titulo = "Consulta de medidores";
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
			


		}
		fn_cargar_lectura(); 
		fn_carga_grilla();
		fn_limpiar();


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
function fn_setea_grid_principal() {

	var obj = {
		height: "50%",
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		editable: false,
		editor: { type: "textbox", select: true, style: "outline:none;" },
		selectionModel: { type: 'cell' },
		numberCell: { show: true },
		title: "Tipo de medición",
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items: [

				{ type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm" },

			]
		},
		editModel: {
			clicksToEdit: 1,
			keyUpDown: true,
			pressToEdit: true,
			cellBorderWidth: 0
		},
		dataModel: {
			data: [
				{ C1: '0001', C2: 'CONSUMO DE AGUA', C3: '1', C4: 1212121, C5: '1', C6: '1', C7: "1", C8: '1' },
				{ C1: '0002', C2: 'CONSUMO DE AGUA NO FACTURADO', C3: '2', C4: 455455, C5: '2', C6: '2', C7: "2", C8: '2' },
				{ C1: '0003', C2: 'SUBSIDIADO POR CASO SOCIAL', C3: '3', C4: 421212, C5: '3', C6: '3', C7: "3", C8: '3' },
				{ C1: '0004', C2: 'SUBSIDIO POR CASO SOCIAL', C3: '1', C4: 584884, C5: '1', C6: '1', C7: "1", C8: '1' },
				{ C1: '0005', C2: 'MATERIALES AGUA', C3: '2', C4: 8878, C5: '2', C6: '2', C7: "2", C8: '2' },
				{ C1: '0006', C2: 'MANO DE OBRA - AGUA ', C3: '3', C4: 847848, C5: '3', C6: '3', C7: "1", C8: '3' },
				{ C1: '0007', C2: 'CONSUMO DE AGUA HISTORICO', C3: '1', C4: 78777, C5: '1', C6: "1", C7: "2", C8: '1' },
				{ C1: '0008', C2: 'DERECHO DE CONEXION - AGUA', C3: '2', C4: 878989, C5: '2', C6: "2", C7: "1", C8: '2' },
				{ C1: '0009', C2: 'REINST. SERVICIO AGUA POTABLE', C3: '3', C4: 811555, C5: '3', C6: "3", C7: "2", C8: '3' },
				{ C1: '00010', C2: 'DESCUENTO DE EMPLEADO', C3: '1', C4: 646545, C5: '1', C6: "1", C7: "1", C8: '1' },
				{ C1: '00011', C2: 'DESCUENTO DE JUBILADO', C3: '2', C4: 48441, C5: '2', C6: "1", C7: "3", C8: '2' },
				{ C1: '00012', C2: 'COMPEM DEFICIENCIA SUMINISTRO AGUA', C3: '3', C4: 485545521, C5: '3', C6: "2", C7: "1", C8: '1' },
				{ C1: '00013', C2: 'CONSUMO DE AGUA - DITO RELIQ', C3: '1', C4: 54551, C5: '1', C6: "3", C7: "1", C8: '2' },
				{ C1: '00014', C2: 'CONSUMO DE AGUA - CREDITO RELIQ', C3: '2', C4: 6968568, C5: '2', C6: "1", C7: "2", C8: '3' },
				{ C1: '00015', C2: 'DEBITO RELIQ DE SUBSIDIOS', C3: '3', C4: 98992, C5: '3', C6: "2", C7: "1", C8: '1' },
				{ C1: '00016', C2: 'CREDITO RELIQ. JUBILADO/ EMPELADO', C3: '1', C4: 0202020, C5: '1', C6: "3", C7: "2", C8: '2' },
				{ C1: '00017', C2: 'DEBITO RELIQ. JUBILADO/EMPELADO', C3: '2', C4: 96336966, C5: '2', C6: "1", C7: "3", C8: '3' },
				{ C1: '00018', C2: 'MANEJO DE CHEQUE DEVUELTO', C3: '3', C4: 1121212, C5: '2', C6: "2", C7: "1", C8: '1' },
				{ C1: '00019', C2: 'COSTOS LEGALES', C3: '1', C4: 336698, C5: '10000', C6: "3", C7: "1", C8: '2' },
				{ C1: '00020', C2: 'RECARGO POR PAGO ATRASADO', C3: '2', C4: 343443434, C5: '1', C6: "1", C7: "2", C8: '3' },
				{ C1: '00021', C2: 'ARREGLO DE PAGO - AGUA', C3: '3', C4: 78787878, C5: '10000', C6: "2", C7: "1", C8: '1' },
				{ C1: '00022', C2: 'RECARGOPAGO ATRASADO - HISTORICO', C3: '1', C4: 89888111, C5: '3', C6: "3", C7: "2", C8: '2' }

			]
		}
	};

	obj.colModel = [
		{ title: "Codigo", width: 55, dataType: "number", dataIndx: "C1", halign: "center", align: "center" },
		{ title: "Descripción", width: 300, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
		{ title: "Constante", width: 300, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
		{ title: "Decimal", width: 300, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
		{ title: "Entero", width: 300, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },

	];

	$grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid("refreshDataAndView");
}
/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_diametro() {
	$("#cb_mar_inp").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_modelo() {
	$("#cb_model").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_numero_medidor() {
	$("#tx_num_med").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_num_fab() {
	$("#tx_num_fab").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_almacen_destino() {
	$("#cb_alm_dest").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_accion_realizada() {
	$("#cb_acc_real").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_estado() {
	$("#cb_est").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_condición_medidor() {
	$("#cb_cond_med").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_clave_reacondicionamiento() {
	$("#cb_clav_reac").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_propiedad_medidor() {
	$("#cb_pro_med").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
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
	$('#tx_prot').prop("checked",true);
	$('#tx_fec_cre').val(20022019);
	$('#tx_anio_reac').val("2018");
	$('#cb_clav_reac').val("2");
	$('#cb_pro_med').val("3");
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



