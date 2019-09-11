var g_modulo = "Facturación Clientes - Lecturas y Consumos";
var g_titulo = "Ingreso de lecturas tomadas en terreno.";
var parameters = {};
var my_url = "reasigna_ajuste.asp";
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

	// PARA ELIMINAR EL SUBMIT
	$("button").on("click", function () { return false; });
	//INGRESA LOS TITULOS
	document.title = g_titulo;
	document.body.scroll = "yes";
	$("#div_header").load("/syn_globales/header.htm", function () {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);
	});
	// INICIA CON EL CURSOR EN EL CAMPO No. ORDEN
	$("#tx_orden").focus();
	// EL CAMPO No. Orden lo limito a 8 digitos y solo numeros
	jQuery('#tx_orden').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});

	//Footer
	$("#div_footer").load("/syn_globales/footer.htm");
	//DEFINE LA GRILLA PRINCIPAL
	fn_setea_grid_principal();
	//DIBUJA LOS ICONOS DE LOS BOTONES     
	$("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
	$("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	$("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
	$("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
	$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
	$("#co_leer").html("<span class='glyphicon glyphicon-book'></span> Leer");
	$("#co_act").html("<span class='glyphicon glyphicon-floppy-disk'></span> Actualizar");
    //FUNCIONES DE CAMPOS
    fn_cent();
 

    //BOTONES-EVENTOS
	$("#co_filtro").on("click", function (e) {
		fn_Muestra_Filtro();


	});
	$("#co_leer").on("click", function (e) {
		fn_Muestra_Lectura();


	});
	$("#co_act").on("click", function (e) {
		fn_Muestra_Actualizar();

	});

	$("._input_selector").inputmask("dd/mm/yyyy");

	jQuery('#tx_lec_ant').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
    //BOTONES
    //BOTONES-FILTRO
	$("#co_aceptar").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_aceptar").text()) == "Aceptar") {
			if ($("#cb_cent_opt").val() ==""){
				fn_mensaje_boostrap("CAMPOS DE CENTRO OPERATIVO SON OBLIGATORIOS", g_titulo, $("#co_cent_opt"));
				return;
			}else{
             if ($("#cb_cent_opt_dos").val()==""){
				fn_mensaje_boostrap("CAMPOS DE CENTRO OPERATIVO SON OBLIGATORIOS", g_titulo, $("#cb_cent_opt_dos"));
				return;
			}
          if ($("#cb_ciclo").val()==""){
				fn_mensaje_boostrap("SELECCIONE CICLO", g_titulo, $("#cb_ciclo"));
				return;
			}
             if ($("#cb_ruta").val()==""){
				fn_mensaje_boostrap("DIGITE RUTA", g_titulo, $("#cb_ruta"));
				return;
			}else{
                fn_carga_grilla();
                $('#div_filtro_bts').modal('hide');
                fn_lim_filtro(); 
                
            }
            
        }
            
        }
	});
     //BOTONES-LECTURA
    	$("#co_aceptar_lec").on("click", function (){
		//Validación de informacion
		if ($.trim($("#co_aceptar_lec").text()) == "Aceptar"){
			if ($("#cb_lector").val() == "" || $("#cb_lector_dos").val() == ""){
				fn_mensaje_boostrap("DIGITE LA FECHA DE PROCESO", g_titulo, $("#cb_lector"));
				return;
			}
		}
	});
    	$("#co_aceptar_act").on("click", function () {
		//Validación de informacion
		if ($.trim($("#co_aceptar").text()) == "Aceptar") {
			if ($("#fec_proc").val() == "") {
				fn_mensaje_boostrap("DIGITE LA FECHA DE PROCESO", g_titulo, $("#fec_proc"));
				return;
			} else {
				if (fn_validar_fecha($("#fec_proc").val())) {
					fn_carga_grilla();

				} else {
					fn_mensaje_boostrap("POR FAVOR DIGITE LA FECHA EN FORMATO DD/MM/YYYY.", g_titulo, $("#fec_proc"));
					return;

				}
			}
			if ((fn_validar_fecha($("#fec_proc").val()))) {
				/*&& $("#cb_period").val())) && (($("#cb_ciclo").val())&&($("#cb_ruta").val())))*/
				$('#div_filtro_bts').modal('hide');
				fn_limpiar();
			}
			fn_carga_grilla();
		}
	});
	$("#co_limpiar").on("click", function () {
		if ($.trim($("#co_limpiar").text()) == "Limpiar") {
		fn_lim_filtro();
			return;
		}
		else
			window.close();
	});

	$("#co_close").on("click", function (e) {
		$('#div_filtro_bts').modal('hide');
	});
	$("#co_excel").on("click", function (e) {
		e.preventDefault();
		var col_model = $("#div_grid_principal").pqGrid("option", "colModel");
		var cabecera = "";
		for (i = 0; i < col_model.length; i++) {
			if (col_model[i].hidden != true) cabecera += "<th>" + col_model[i].title + "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element = $grid_principal.pqGrid("option", "dataModel.data");
		if (element)
			a = element.length;
		else
			a = 0;
		if (a > 0) {
			$("#tituloexcel").val(g_tit);
			$("#sql").val(sql_grid_prim);
			$("#frm_Exel").submit();
			return;
		}
	});
	$("#cb_period").on("change", function (evt) {
		if ($(this).val() == "") {
			//$("#cb_ruta").prop("disabled",true);
			fn_lim_period();
		}
		else {
			fn_ciclo();
			$("#cb_ciclo").prop("disabled", false);
			$("#cb_ruta").prop("disabled", true);
			$("#cb_ciclo").focus();
		}
	});

	$("#cb_ciclo").on("change", function (evt) {
		if ($(this).val() == "") {
			//$("#cb_ruta").prop("disabled",true);
			fn_lim_ciclo();

			$("#cb_ruta").prop("disabled", true);
		}
		else {
			fn_ruta();
			$("#cb_ruta").prop("disabled", false);
			$("#cb_ruta").focus();
		}
	});

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal() {
	var data = [
		{ C1: 1, C2: 295264, C3: 141139947, C4: 5, C5: "SERVE E INV DIAMOND SA", C6: "UMB MARCASA CALLE VIA JO", C7: "16-050-0160", C8: "MCUB", C9: 030, C10: 0 },
		{ C1: 1, C2: 295264, C3: 141139947, C4: 5, C5: "KEYTLING GISELLE TREJOS VAR", C6: "RES-COL-LOS.ALAMOS.APTO", C7: "16-050-0160", C8: "MCUB", C9: 030, C10: 0 },
		{ C1: 1, C2: 295264, C3: 141139947, C4: 5, C5: "REYNA P Y OTROS R", C6: "LA FLORIDA 00026", C7: "16-050-0160", C8: "MCUB", C9: 030, C10: 0 },

	];
	var obj = {
		height: 540,
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		editable: false,
		selectionModel: { type: 'cell' },
		numberCell: { show: false },
		title: "Ingreso de lecturas tomadas en terreno",
		pageModel: { type: "local" },
		scrollModel: { autoFit: true, theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items:
				[{ type: "button", label: " Filtros", attr: "id=co_filtro", cls: "btn btn-primary" },
				{ type: "button", label: "Leer", attr: "id=co_leer", cls: "btn btn-primary" },
				{ type: "button", label: "Actualizar", attr: "id=co_act", cls: "btn btn-primary" },
				{ type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm" }

				]
		}
	};
	obj.colModel = [
		{ title: "Nro", resizable: false, width: 5, dataType: "number", dataIndx: "C1", halign: "center", align: "center" },
		{ title: "NIC", width: 80, dataType: "number", dataIndx: "C2", halign: "center", align: "center" },
		{ title: "Medidor", width: 70, dataType: "number", dataIndx: "C3", halign: "center", align: "center" },
		{ title: "N.D", width: 5, dataType: "number", dataIndx: "C4", halign: "center", align: "center" },
		{ title: "Nombre Cliente", width: 100, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
		{ title: "Dirección", width: 80, dataType: "string", dataIndx: "C6", halign: "center", align: "center" },
		{ title: "Sec. Ruta", width: 80, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },
		{ title: "T. Med", width: 10, dataType: "string", dataIndx: "C8", halign: "center", align: "center" },
		{ title: "Clave", width: 10, dataType: "number", dataIndx: "C9", halign: "center", align: "center" },
		{ title: "Lectura tomada", width: 10, dataType: "number", dataIndx: "C10", halign: "center", align: "center" }
	];

	obj.dataModel = { data: data };
	$grid = $("#div_grid_dos").pqGrid(obj);
	$grid.pqGrid("refreshDataAndView");
}

function fn_carga_orden() {
	dato_ori = [];
	parameters =
		{
			"func": "fn_lee_orden",
			"empresa": $("#tx_empresa").val(),
			"p_orden": $("#tx_orden").val()
		};
	HablaServidor(my_url, parameters, 'text', function (text) {
		if (text != "") {
			$("#co_leer").html("<span class='glyphicon glyphicon-user'></span> Reasignar");
			dato_ori = text.split("|");
			//$("#co_leer").prop("disabled",true);
			$("#tx_orden").prop("disabled", true);
			$("#tx_cod_cliente").val(dato_ori[1]);
			$("#tx_rol_actual").val(dato_ori[3]);
			$("#tx_nombre").val(dato_ori[4]);
			$("#tx_estado").val(dato_ori[5]);
			$("#tx_ruta").val(dato_ori[6]);
			$("#tx_tarifa").val(dato_ori[7]);
			$("#tx_actividad").val(dato_ori[8]);
		}
		else {
			fn_mensaje_boostrap("No se encontro la orden indicada!!!", g_titulo, $(""));
			return;
		}
		if (dato_ori[0] == "F") {
			$("#co_leer").prop("disabled", true);
			fn_mensaje_boostrap("ESTA ORDEN YA FUE FINALIZADA, NO PUEDE SER REASIGNADA !", g_titulo, $(""));
			return;
		}

		//$("#co_reasignar").prop("disabled",false);
		$("#cb_reasigna_nuevo").prop("disabled", false);

	});

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_Muestra_Filtro() {
	$("#div_filtro_bts").modal({ backdrop: "static", keyboard: false });
	$("#div_filtro_bts").on("shown.bs.modal", function () {
		$("#div_filtro_bts div.modal-footer button").focus();

	});


}
function fn_Muestra_Lectura() {
	$("#div_lec_bts").modal({ backdrop: "static", keyboard: false });
	$("#div_lec_bts").on("shown.bs.modal", function () {
		$("#div_lec_bts div.modal-footer button").focus();

	});


}
function fn_Muestra_Actualizar() {
	$("#div_act_bts").modal({ backdrop: "static", keyboard: false });
	$("#div_act_bts").on("shown.bs.modal", function () {
		$("#div_act_bts div.modal-footer button").focus();

	});


}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_roles() {
	var param =
	{
		"func": "fn_roles_ajuste",
		"empresa": $("#tx_empresa").val()
	};
	HablaServidor(my_url, param, "text", function (text) {
		$("#cb_reasigna_nuevo").html(text);
	});
}

function fn_act_orden() {

	var param =
	{
		"func": "fn_actualiza",
		"empresa": $("#tx_empresa").val(),
		"p_orden": $("#tx_orden").val(),
		"rol": $("#tx_rol").val(),
		"p_rol_nuevo": $("#cb_reasigna_nuevo").val()
	};
	HablaServidor(my_url, param, "text", function (text) {
		if (text == "") {
			$("#cb_reasigna_nuevo").prop("disabled", true);
			$("#cb_reasigna_nuevo").prop("disabled", true);
			fn_mensaje_boostrap("ACCIÓN REALIZADA !", g_titulo, $(""));
			fn_limpiar();
		}
		else
			fn_mensaje_boostrap(text, g_tit, $(""));
	});
}

function fn_limpiar() {

	$("#fec_proc").val("");
	$("#cb_period").val("");
	$("#cb_ciclo").val("");
	$("#cb_ruta").val("");
	$("#fec_proc").focus();
}
function fn_carga_opc_conve() {
	var options = '<option value="1"selected="selected">--- CHOOSE CITY --- </option>';
	$("#tx_fil_ciclo").html(options);
}
function fn_carga_grilla() {

}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
//FUNCIONES MODAL

function fn_cent() {

    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/

	$("#cb_cent_opt_dos").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_ciclo() {

    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/

	$("#cb_ciclo").html("<option value='' selected></option><option value='1'>10</option> <option value='2' >20</option> <option value='3'>30</option>");
}

function fn_ruta() {

    /*parameters = 
    {
		"func":"fn_regional",
		"empresa":$("#tx_empresa").val(),
		"rol":$("#tx_rol").val()
    };
    HablaServidor(my_url,parameters,'text', function(text) 
    {
        if(text != "")
            $("#cb_regional").html(text);
    });*/

	$("#cb_ruta").html("<option value='' selected></option><option value='1'>005</option> <option value='2' >010</option> <option value='3'>015</option>");
}
//FUNCIONES LIMPIAR-MODAL
function fn_lim_filtro() {
	$("#cb_cent_opt").val("");
	$("#cb_cent_opt_dos").val("");
	$("#cb_ciclo").val("");
	$("#cb_ruta").val("");
}


function fn_lim_ciclo() {
	$("#cb_ruta").val("");
	$("#cb_ruta").prpr("disabled", true);
}
function fn_lim_lec() {
	$("#cb_ciclo").val("");
	$("#cb_ruta").val("");
	$("#cb_ciclo").prop("disabled", true);
	$("#cb_ruta").prop("disabled", true);
}


function fn_lim_act() {
	$("#cb_ruta").val("");
	$("#cb_ruta").prpr("disabled", true);
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*


