var g_modulo = "Modificaciones Synergia Comercial - Modificaciones Comercial";
var g_tit = "Auditoría Modificaciones de Parámetros";
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


    // INICIA CON EL CURSOR EN EL CAMPO FECHA

    $("._input_selector").inputmask("dd/mm/yyyy");


    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();    
    //FUNCIONES  DE LOS COMBOS
    fn_limpiar();
    fn_sistema();
    fn_aplicacion();
    fn_rol();
    

    //DIBUJA LOS ICONOS DE LOS BOTONES     
    $("#co_buscar").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_ant").html("<span class='glyphicon glyphicon-arrow-left'></span> Anterior");
    $("#co_sig").html("<span class='glyphicon glyphicon-arrow-right'></span> Siguiente");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    $("#co_volver_fil").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
				
    $("#co_limpiar").on("click", function () {
		fn_limpiar();
		return;
    });
	
    $("#co_cancelar").on("click", function (e) {
        $('#div_filtro_bts').modal('hide');
    });

    //BOTONES ELIMINAR DE LAS GRILLAS
    $("#co_eliminar").on("click", function (e) {

        $("#dlg_confirmamod").modal({ backdrop: "static", keyboard: false });
        $("#dlg_confirmamod").on("shown.bs.modal", function () {
            $("#co_confirmamod_no").focus();
        });

    });

    $("#co_buscar").on("click", function (e) {
        fn_limpiar();
		fn_nuevo();
    });
	
    $("#co_volver_fil").on("click", function (e) {
        $("#div_prin").slideDown();
        $("#div_filtros").slideUp();
        $(window).scrollTop(0);
    });
	
    $("#co_close-m").on("click", function (e) {
        $('#div_modal').modal('hide');

    });
    $("#co_cancelar").on("click", function (e) {
        window.close();
    });

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    $("._input_selector").inputmask("dd/mm/yyyy");

    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES
    $("#co_aceptar").on("click", function () {
        //Validación de informacion      
		if ($("#cb_sistemas").val() == "") {
			fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR TIPO DE SISTEMAS!!!</strong></div>',3000);
			$("#cb_sistemas").focus();
			return;
		}
		 if ($("#cb_aplicacion").val() == "") {
			fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR APLICACIÓN!!!</strong></div>',3000);
			$("#cb_aplicacion").focus();
			return;

		 }
		 if ($("#tx_rol").val() == "") {
			fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ROL!!!</strong></div>',3000);
			$("#tx_rol").focus();
			return;
		 }
		 if ($("#tx_fecha_ini").val() == "") {
			fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR FECHA DE INICIO!!!</strong></div>',3000);
			$("#tx_fecha_ini").focus();
			return;                				
		 }
          if ($("#tx_fecha_fin").val() == "") {
            fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR FECHA DE FIN!!!</strong></div>',3000);
            $("#tx_fecha_fin").focus();
            return;                             
         }

		fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
		fn_carga_grilla();
		$("#div_prin").slideDown();
		$("#div_filtros").slideUp();
		$(window).scrollTop(0);

    });

    $("#div_modal").draggable({
        handle: ".modal-header"
    });
    
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //EXCEL    
    $("#co_excel").on("click", function (e) {

        fn_filtro();
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

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
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
        numberCell: { show: true },
        title: "Auditoría Modificaciones de Parámetros",
        pageModel: { type: "local" },
        scrollModel: { theme: true },
        toolbar:
        {
            cls: "pq-toolbar-export",
            items: [
            { type: "button", label: "Filtro", attr: "id=co_buscar", cls: "btn btn-primary" },
            { type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary" },
            { type: "button", label: "Cerrar", attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm" }
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
                { C1: 'Sistema 01', C2: 'CONSUMO DE AGUA NO FACTURADO', C3: 'UNIDAD', C4: '18/11/2019', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: 'Sistema 02', C2: 'SUBSIDIADO POR CASO SOCIAL', C3: 'UNIDAD', C4: '18/11/2019', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: 'Sistema 03', C2: 'SUBSIDIO POR CASO SOCIAL', C3: 'UNIDAD', C4: '18/11/2019', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                
            ]
        }
    };

    obj.colModel = [
        { title: "Sistema", width: 100, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Estructura", width: 150, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Acción", width: 150, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Fecha", width: 85, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Rol", width: 150, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Aplicación", width: 150, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Descripción", width: 150, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Ip", width: 150, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Observaciones", width: 200, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
              
    ];

    $grid_principal = $("#div_grid_principal").pqGrid(obj);
    $grid_principal.pqGrid("refreshDataAndView");    
}



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_filtro() {
    parameters =
        {
            "func": "fn_grid_principal",
            "sistemas": $("#cb_sistemas").val(),
        };

}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_nuevo() {

    $("#div_filtro_bts").modal({ backdrop: "static", keyboard: false });
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();

    });
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_sistema() {

    $("#cb_sistemas").html("<option value='' selected></option><option value='1'>Sistema 01</option> <option value='2' >Sistema 02</option> <option value='3'>Sistema 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
//FUNCIONES COMBOS

function fn_aplicacion() {
    $("#cb_aplicacion").html("<option value='' selected></option><option value='1'>CONSUMO DE AGUA NO FACTURADO</option> <option value='2' >SUBSIDIADO POR CASO SOCIAL</option> <option value='3'>SUBSIDIADO POR CASO SOCIAL</option>");
}
		
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
function fn_rol() {
    $("#tx_rol").html("<option value='' selected></option><option value='1'>CONSUMO DE AGUA NO FACTURADO</option> <option value='2' >SUBSIDIADO POR CASO SOCIAL</option> <option value='3'>SUBSIDIADO POR CASO SOCIAL</option>");
}
		
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_mensaje(id,mensaje,segundos)
{
	$(id).show();
	$(id).html(mensaje);
	setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_limpiar(){
    $("#cb_sistemas").val("");
    $("#cb_aplicacion").val("");
    $("#tx_rol").val("");
    $("#tx_fecha_ini").val("");
    $("#tx_fecha_fin").val("");
}
    
