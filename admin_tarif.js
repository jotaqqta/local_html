var g_modulo = "Administración Central - Configuración Base del Sistema";
var g_tit = "Administrador de tarifa";
var $grid_principal;
var $grid_2;
var sql_grid_prim = "";
var sql_grid_2 = "";
var sql_grid_3 = "";
var parameters = {};


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function (e) {

	if (e.keyCode === 8) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).ready(function () {
	jQuery('#tx_cod').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
    jQuery('#tx_cons').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	
    // PARA ELIMINAR EL SUBMIT
	$("button").on("click", function () { return false; });
	//INGRESA LOS TITULOS
	document.title = g_tit;
	document.body.scroll = "yes";
	///raiz/
	$("#div_header").load("syn_globales/header.htm", function () {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_tit);
	});
	
	//Footer  ///raiz/
	$("#div_footer").load("syn_globales/footer.htm");
	$("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
	$("#tx_rol").val("SYNERGIA");
	$("#tx_ip").val("127.0.0.1");
	
    // INICIA CON EL CURSOR EN EL CAMPO FECHA
	
	$("._input_selector").inputmask("dd/mm/yyyy");
    
	//DEFINE LA GRILLA PRINCIPAL
	fn_setea_grid_principal();
    fn_cb_compe();
    fn_cb_jub();
    fn_cb_prom();
    fn_cb_subs();
    fn_cb_unid_hab();
	//DIBUJA LOS ICONOS DE LOS BOTONES     
	$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
	$("#co_ant").html("<span class='glyphicon glyphicon-arrow-left'></span> Anterior");
    $("#co_sig").html("<span class='glyphicon glyphicon-arrow-right'></span> Siguiente");
	$("#co_selec").html("<span class='glyphicon glyphicon-plus'></span> Seleccionar");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//BOTONES-EVENTOS
    
    $("#co_nuevo").on("click", fn_nuevo);
    
    $("#co_cerrar_t").on("click", function(e){
        window.close(); 
    });
    $("#co_guardar").on("click", function () {
		
        if ($.trim($("#co_guardar").text()) == "Guardar") {
            if ($("#tx_desc").val() == "") {
                fn_mensaje_boostrap("DIGITE DESCRIPCIÓN.", g_tit, $("#tx_desc"));

                return;
            }
            if ($("#cb_unid_hab").val() == "0"){
                fn_mensaje_boostrap("SELECCIONE UNIDAD HABIACIÓNAL.", g_tit, $("#cb_unid_hab"));

                return;
            }
            if ($("#tx_cons").val() == "") {
                fn_mensaje_boostrap("DIGITE CONSUMO MINIMO.", g_tit, $("#tx_cons"));

                return;
            }
            if ($("#cb_subs").val() == "0") {
                fn_mensaje_boostrap("SELECCIONE SUBSIDIO", g_tit, $("#cb_subs"));

                return;
            }
            if ($("#cb_jub").val() == "0") {
                fn_mensaje_boostrap("SELECCIONE JUBILADOO", g_tit, $("#cb_jub"));

                return;
            }

            if ($("#cb_prom").val() == "0") {
                fn_mensaje_boostrap("SELECCIONE PROMEDIO AREA", g_tit, $("#cb_prom"));

                return;
            }
            if ($("#cb_compe").val() == "0") {
                fn_mensaje_boostrap("SELECCIONE SI ES COMPENSABLE", g_tit, $("#cb_compe"));

                return;
			}
			
            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            fn_carga_grilla();
            fn_limpiar();
            $("#div_prin").slideDown();
            $("#div_filtro_bts").slideUp();
        

        }
    });

    $("#co_limpiar").on("click",function(){
		if ($.trim($("#co_limpiar").text())=="Limpiar"){
			fn_limpiar();
			return;
		}
		else
			window.close();
	});
	$("#co_cancel").on("click", function (e){
		$('#div_filtro_bts').modal('hide');	
		fn_limpiar();
    });
	
	$("#co_cerrar").on("click", function (e){
       window.close();
    });
 
//BOTONES ELIMINAR DE LAS GRILLAS
    $("#co_eliminar").on("click", function(e){
		 
        $("#dlg_confirmamod").modal({backdrop: "static",keyboard:false});					
		$("#dlg_confirmamod").on("shown.bs.modal", function () {
			$("#co_confirmamod_no").focus();
				});
    	
	});
 
    $("#co_nuevo").on("click", function(e){
 		fn_nuevo();            
    }); 
 //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	$("._input_selector").inputmask("dd/mm/yyyy");

	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES
    $("#co_limpiar").on("click", function(){
		if ($.trim($("#co_limpiar").text()) == "Limpiar") {
		    fn_limpia_modal();
			return;
		}
		else
			window.close();
	});

	
	$("#div_modal").draggable({
        handle: ".modal-header"
    });
	


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//EXCEL    
	$("#co_excel").on("click", function (e) {
		
		fn_filtro();
		e.preventDefault();
        var col_model=$( "#div_grid_principal" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid_principal.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#tituloexcel").val(g_tit);
			$("#sql").val(sql_grid_prim);	
			$("#frm_Exel").submit();
			return;
		}	
    });
	$grid_principal.pqGrid({
        rowDblClick: function fn_sss(event, ui) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
				$("#tx_cod").val(dataCell.C1);
				$("#tx_cod").attr("readonly", true);
				$("#tx_desc").val(dataCell.C2);
				$("#cb_unid_hab").val(dataCell.C3);
				$("#tx_cons").val(dataCell.C4);
				$("#cb_subs").val(dataCell.C5);
				$("#cb_jub").val(dataCell.C6);
				$("#cb_prom").val(dataCell.C7);
				$("#cb_compe").val(dataCell.C8);


				$("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
				$("#div_filtro_bts").on("shown.bs.modal", function () {
				$("#div_filtro_bts div.modal-footer button").focus();
				});
            }
            fn_carga_grilla();


        }
    });



	    	 
	 
});
           
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal() {
	
	var obj = {
		height: "100%",
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		editable: false,
		editor: { type: "textbox", select: true, style: "outline:none;" },
		selectionModel: { type: 'cell' },
		numberCell: { show: true},
		title: "Administrador de cargos",
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items:[
				{ type: "button", label: "Nuevo",    attr: "id=co_nuevo",  cls: "btn btn-primary" }, 
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"}               
				]
		},
        editModel: {
            clicksToEdit: 1,
            keyUpDown: true,
            pressToEdit: true,
            cellBorderWidth: 0
        },
		dataModel:{ data: [
			{ C1: '0001', C2: 'CONSUMO DE AGUA', C3: '1', C4: 1212121, C5: '1', C6: '1', C7: "1", C8: '1'},
			{ C1: '0002', C2: 'CONSUMO DE AGUA NO FACTURADO',C3: '2', C4: 455455, C5: '2', C6:'2', C7: "2", C8: '2'},
			{ C1: '0003', C2: 'SUBSIDIADO POR CASO SOCIAL', C3: '3', C4: 421212, C5: '3', C6: '3', C7: "3", C8: '3'},
			{ C1: '0004', C2: 'SUBSIDIO POR CASO SOCIAL',C3: '1', C4: 584884, C5: '1', C6:'1', C7: "1", C8: '1'},
			{ C1: '0005', C2: 'MATERIALES AGUA',C3: '2', C4: 8878, C5: '2', C6:'2', C7: "2", C8: '2'},
			{ C1: '0006', C2: 'MANO DE OBRA - AGUA ',C3: '3', C4: 847848, C5: '3', C6: '3', C7: "1", C8: '3'},
			{ C1: '0007', C2: 'CONSUMO DE AGUA HISTORICO', C3: '1', C4: 78777, C5: '1', C6: "1", C7: "2", C8: '1'},
			{ C1: '0008', C2: 'DERECHO DE CONEXION - AGUA',C3: '2', C4: 878989, C5: '2', C6: "2", C7: "1", C8: '2'},
			{ C1: '0009', C2: 'REINST. SERVICIO AGUA POTABLE',C3: '3', C4: 811555, C5: '3', C6: "3", C7: "2", C8: '3'},
			{ C1: '00010', C2: 'DESCUENTO DE EMPLEADO', C3: '1', C4: 646545, C5: '1', C6: "1", C7: "1", C8: '1'},
			{ C1: '00011', C2: 'DESCUENTO DE JUBILADO',C3: '2', C4: 48441, C5: '2', C6: "1", C7: "3", C8: '2'},
			{ C1: '00012', C2: 'COMPEM DEFICIENCIA SUMINISTRO AGUA',C3: '3', C4: 485545521, C5: '3', C6:"2", C7: "1", C8: '1'},
			{ C1: '00013', C2: 'CONSUMO DE AGUA - DITO RELIQ',C3: '1', C4: 54551, C5: '1', C6:"3", C7: "1", C8: '2'},
			{ C1: '00014', C2: 'CONSUMO DE AGUA - CREDITO RELIQ',C3: '2', C4: 6968568, C5: '2', C6: "1", C7: "2", C8: '3'},
			{ C1: '00015', C2: 'DEBITO RELIQ DE SUBSIDIOS',C3: '3', C4: 98992, C5: '3', C6: "2", C7: "1", C8: '1'},
			{ C1: '00016', C2: 'CREDITO RELIQ. JUBILADO/ EMPELADO', C3: '1', C4: 0202020, C5: '1', C6:"3", C7: "2", C8: '2'},
			{ C1: '00017', C2: 'DEBITO RELIQ. JUBILADO/EMPELADO',C3: '2', C4: 96336966, C5: '2', C6: "1", C7: "3", C8: '3'},
			{ C1: '00018', C2: 'MANEJO DE CHEQUE DEVUELTO', C3: '3', C4: 1121212, C5: '2', C6: "2", C7: "1", C8: '1'},
			{ C1: '00019', C2: 'COSTOS LEGALES',C3: '1', C4: 336698, C5: '10000', C6: "3", C7: "1", C8: '2'},
			{ C1: '00020', C2: 'RECARGO POR PAGO ATRASADO', C3: '2', C4: 343443434, C5: '1', C6: "1", C7: "2", C8: '3'},
			{ C1: '00021', C2: 'ARREGLO DE PAGO - AGUA',C3: '3', C4:78787878, C5: '10000', C6: "2", C7: "1", C8: '1'},
			{ C1: '00022', C2: 'RECARGOPAGO ATRASADO - HISTORICO',C3: '1', C4: 89888111, C5: '3', C6: "3", C7: "2", C8: '2'}

        ] }
	};
	
    obj.colModel = [
		{ title: "Codigo", width: 100, dataType: "number", dataIndx: "C1", halign: "center", align: "center" },
		{ title: "Descripcion", width: 100, dataType: "string", dataIndx: "C2", halign: "center", align: "center"},
        { title: "Unidad de habitad",width: 100, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
		{ title: "Consumo minimo", width: 100, dataType: "number", dataIndx: "C4", halign: "center", align: "center"},
        { title: "Subsidio",width: 100, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
		{ title: "Jubilado", width: 100, dataType: "string", dataIndx: "C6", halign: "center", align: "center"},
        { title: "Promedio area",width: 100, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },
		{ title: "Es compensable", width: 100, dataType: "string", dataIndx: "C8", halign: "center", align: "center"} 
	];

	$grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid("refreshDataAndView");
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_nuevo(){
	
     $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	 $("#div_filtro_bts").on("shown.bs.modal", function () {
	 $("#div_filtro_bts div.modal-footer button").focus();
	 
			
	});
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_limpia_modal2() 
{
	$("#tx_val1").val("");
	$("#tx_val1").val("");
	$("#tx_descod").val("");
	$("#tx_codigo").val("");
    $("#tx_fecing").val("");
	$("#tx_fecmod").val("");
}
function fn_Muestra_Filtro()
{
	$("#div_prin").slideUp();
	$("#div_filtros").slideDown();
	$(window).scrollTop(0);

}
 
/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
//FUNCIONES COMBOS
function fn_cb_unid_hab() {
    $("#cb_unid_hab").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_cb_subs() {
    $("#cb_subs").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_cb_jub() {
    $("#cb_jub").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_cb_prom() {
    $("#cb_prom").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_cb_compe() {
    $("#cb_compe").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}

function fn_carga_grilla() {


}
function fn_gen() {
    alert('Se genero.');
}
function fn_gen(){
     alert('Se genero.');
}
function fn_limpiar(){
    $("#tx_cod").val("");
    $("#tx_desc").val("");
    $("#cb_unid_hab").val("0");
    $("#tx_cons").val("");
    $("#cb_subs").val("0");
    $("#cb_jub").val("0");
    $("#cb_prom").val("0");
    $("#cb_compe").val("0");

}


