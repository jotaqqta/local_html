var g_modulo = "Facturación Clientes - Lecturas y Consumos";
var g_titulo = "Consulta de ordenes de cambio de medidor";
var parameters = {};
var my_url = "correc_prome_dudo.asp";
var $grid;
var $grid_sec;
var $grid_ter;
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
	
    // INICIA CON EL CURSOR EN EL CAMPO FECHA
	
	$("._input_selector").inputmask("dd/mm/yyyy");
    
	//Footer
	$("#div_footer").load("syn_globales/footer.htm");

	$("#tx_cli").focus();
    fn_setea_grid_principal();
    fn_setea_grid_sec();
    fn_setea_grid_ter();
    
    $('input[name="optradio"]').prop('disabled', false);

	jQuery('#tx_num_ord').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	jQuery('#tx_num_fab').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});

	//BOTONES-EVENTOS
	$("#co_cancelar").on("click", function (e) {
		window.close();
	});


	$("#co_lec").on("click", function(){
		//Validación de informacion
		if ($.trim($("#co_lec").text()) == "Leer") {
	    if($("#tx_num_ord").val()==""){
			fn_mensaje_boostrap("DIGITE NUMERO DE ORDEN", g_titulo, $("#tx_num_ord"));

				return;
			}
         }
        fn_cargar_lectura()
        fn_carga_fil();
        fn_carga_grilla();
	
	});
	$("#co_cancel").on("click", function (e){

		fn_limpiar();
		
    });




$(".nav-tabs a").on("shown.bs.tab", function(event){
	var x = $(event.target).prop("href");  // tab activada
	var dato_original = [];
dato_original = x.split("#");
x = dato_original[1];
	if(x == "MedidorRetirado")
		$grid_principal.pqGrid( "refreshView" );
if(x == "MedidorInstalado"){
		$grid_ter.pqGrid( "refreshView" );
$grid_sec.pqGrid( "refreshView" );
}
});

});



//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_setea_grid_principal() {

	var obj = {
		height: 340,
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
		title: "Lecturas",
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items: [

			

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
		{ title: "Lectura", width: 300, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
		{ title: "Constante", width: 300, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
		{ title: "Entero/Decimal", width: 300, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },

	];

	$grid_principal = $("#div_grid_principal").pqGrid(obj);

    

}

    //_______________________________________________________________________________________________________
    function fn_setea_grid_sec() {
    var obj = {
		height: "80%",
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
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items: [

			

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
		{ title: "Numero", width: 55, dataType: "number", dataIndx: "C1", halign: "center", align: "center" },
		{ title: "Marca", width: 300, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
		{ title: "Modelo", width: 300, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
		{ title: "Propiedad_equipo", width: 300, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
		{ title: "Diametro", width: 300, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },

	];
   
	$grid_sec= $("#div_grid_sec").pqGrid(obj);

}
 //--------------------------------------------------------------------------------------------------------------
 function fn_setea_grid_ter() {
 var obj = {
    height: "80%",
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
    pageModel: { type: "local" },
    scrollModel: { theme: true },
    toolbar:
    {
        cls: "pq-toolbar-export",
        items: [

         

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
    { title: "Lectura", width: 300, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
    { title: "Constante", width: 300, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
   

];

$grid_ter= $("#div_grid_ter").pqGrid(obj);

}
/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_cargar_lectura(){
    //IDENTIFICACIÓN

	$('#tx_fec_crea').val(11032018);
	$('#tx_est_ord').val("Finalizada");
    $('#tx_motiv').val("l_solicitud idaan");
    $('#tx_tip_ord').val("Preventivo");
	$('#tx_fec_emi').val(11022017);
	$('#tx_num_sum').val(380492);
	$('#tx_nom').val("Hernandez Jose Maria")
	$('#tx_dir').val("Ave omar t herrera estacion prime");
	$('#tx_tip_clie').val("Normal");
	$('#tx_usur').val("MSANCHEZ2");
	$('#tx_sub_zonal').val("PANAMA METRO")
    $('#tx_local').val("ANCON");
	$('#tx_sector').val("CICLO 44");
	$('#tx_obs').val("CAMBIO DE MEDIDOR POR ORDEN DE JEFATURA SE INSTALO MEDIDOR AMCO 14265184");
    //INFORMACION DE TERRENO
    
	$('#tx_fec_act').val(11032018);
	$('#tx_situ_enc').val("Finalizada");
    $('#tx_motiv').val("l_solicitud idaan");
    $('#tx_inspec').val("Preventivo");
	$('#tx_usur_ing').val(11022017);
	$('#tx_acc_real').val(380492);
	$('#tx_contra').val("Hernandez Jose Maria")
	$('#tx_fec_terr').val(12212019);
	$('#tx_ofi_cam').val("Normal");
	$('#chk_env_cart').prop("checked",true);
	$('#chk_autor_cli').prop("checked",true);
  

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
//IDENTIFICACIÓN

$('#tx_fec_crea').val("");
$('#tx_est_ord').val("");
$('#tx_motiv').val("");
$('#tx_tip_ord').val("");
$('#tx_fec_emi').val("");
$('#tx_num_sum').val("");
$('#tx_nom').val("");
$('#tx_dir').val("");
$('#tx_tip_clie').val("");
$('#tx_usur').val("");
$('#tx_sub_zonal').val("");
$('#tx_local').val("");
$('#tx_sector').val("");
$('#tx_obs').val("");
//INFORMACION DE TERRENO

$('#tx_fec_act').val("");
$('#tx_situ_enc').val("");
$('#tx_motiv').val("");
$('#tx_inspec').val("");
$('#tx_usur_ing').val("");
$('#tx_acc_real').val("");
$('#tx_contra').val("");
$('#tx_fec_terr').val("");
$('#tx_ofi_cam').val("");
$('#chk_env_cart').prop("checked",false);
$('#chk_autor_cli').prop("checked",false);
$("#tx_num_ord").focus();
$("#tx_num_ord").val("");


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



