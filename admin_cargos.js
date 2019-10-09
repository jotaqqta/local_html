var g_modulo = "Administración Central - Configuración Base del Sistema";
var g_tit = "Consulta de cargos";
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
    jQuery('#tx_cargo').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    jQuery('#tx_amort').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    jQuery('#tx_niv_imp').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    jQuery('#tx_niv_pre').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_ord_i').keypress(function (tecla) {
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


    // INICIA CON EL CURSOR EN EL CAMPO FECHA

    $("._input_selector").inputmask("dd/mm/yyyy");

    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
    fn_uni_med();
    fn_car_aut();
    fn_inp_group();
    fn_inp_tip_acc();
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    $("#co_leer").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_ant").html("<span class='glyphicon glyphicon-arrow-left'></span> Anterior");
    $("#co_sig").html("<span class='glyphicon glyphicon-arrow-right'></span> Siguiente");
    $("#co_selec").html("<span class='glyphicon glyphicon-plus'></span> Seleccionar");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    $("#co_cerrar_t").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS


    $("#co_leer").on("click", function () {

        fn_limpiar_fi();
        fn_Muestra_Filtro();
    });
    $("#co_cerrar_t").on("click", function (e) {
        window.close();
    });
    $("#co_aceptar").on("click", function () {
        //Validación de informacion
        if ($.trim($("#co_aceptar").text()) == "Aceptar") {
            if ($("#cb_agrup").val() == "0") {
                fn_mensaje_boostrap("SELECCIONE AGRUPACIÓN", g_tit, $("#cb_agrup"));
                return;
            }
            if ($("#cb_tip_acc").val() == "0") {
                fn_mensaje_boostrap("SELECCIONE TIPO DE ACCIÓN", g_tit, $("#cb_tip_acc"));
                return;
            } else {
                fn_mensaje_boostrap("Se genero", g_tit, $("#co_aceptar"));
                fn_carga_grilla();
                $('#div_filtro_bts').modal('hide');
                fn_limpiar();
            }
        }
    });
    $("#co_limpiar").on("click", function () {
        if ($.trim($("#co_limpiar").text()) == "Limpiar") {
            fn_limpiar();
            return;
        }
        else
            window.close();
    });
    $("#co_cancelar").on("click", function (e) {
        $('#div_filtro_bts').modal('hide');
    });

    $("#co_cancelar").on("click", function (e) {
        window.close();
    });

    //BOTONES ELIMINAR DE LAS GRILLAS
    $("#co_eliminar").on("click", function (e) {

        $("#dlg_confirmamod").modal({ backdrop: "static", keyboard: false });
        $("#dlg_confirmamod").on("shown.bs.modal", function () {
            $("#co_confirmamod_no").focus();
        });

    });

    $("#co_nuevo").on("click", function (e) {
        fn_nuevo();
        fn_limpiar_fi();
    });
    $("#co_volver_fil").on("click", function (e) {

        $("#div_prin").slideDown();
        $("#div_filtros").slideUp();
        $(window).scrollTop(0);

    });
    $("#co_close-m").on("click", function (e) {
        $('#div_modal').modal('hide');

    });
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

    $("#co_volver2").on("click", function (e) {
        $("#div_prin").show();
        $("#div_tabla").hide();
        $(window).scrollTop(0);
    });


    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    $("._input_selector").inputmask("dd/mm/yyyy");


    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES
    $("#co_guardar").on("click", function () {
        //Validación de informacion
        if ($.trim($("#co_guardar").text()) == "Guardar") {
            if ($("#tx_cargo").val() == "") {
                fn_mensaje_boostrap("DIGITE CODIGO.", g_tit, $("#tx_cargo"));

                return;
            }
            if ($("#tx_nom").val() == "") {
                fn_mensaje_boostrap("DIGITE NOMBRE.", g_tit, $("#tx_nom"));

                return;
            }
            if ($("#cb_uni_med").val() == "") {
                fn_mensaje_boostrap("SELECCIONE UNIDAD DE MEDIDA.", g_tit, $("#tx_uni_med"));

                return;
            }
            if ($("#tx_glosa").val() == "") {
                fn_mensaje_boostrap("DIGITE GLOSA DE DOCUMENTO", g_tit, $("#tx_glosa"));

                return;
            }
            if ($("#cb_car_aut").val() == "0") {
                fn_mensaje_boostrap("SELECCIONE CARGO DE DOCUMENTO", g_tit, $("#cb_car_aut"));

                return;
            }

            if ($("#tx_ord_i").val() == "") {
                fn_mensaje_boostrap("DIGITE ORDEN DE IMPRESIÓN", g_tit, $("#tx_ord_i"));

                return;
            }
            if ($("#tx_amort").val() == "") {
                fn_mensaje_boostrap("DIGITE NIVEL DE AMORTIZACIÓN", g_tit, $("#tx_amort"));

                return;
            }
            if ($("#tx_niv_imp").val() == "") {
                fn_mensaje_boostrap("DIGITE NIVEL DE IMPRESIÓN", g_tit, $("#tx_niv_imp"));

                return;
            }

            if ($("#tx_niv_pre").val() == "") {
                fn_mensaje_boostrap("DIGITE NIVEL DE PRESENTACIÓN", g_tit, $("#tx_niv_pre"));

                return;
            }



            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            fn_carga_grilla();
            fn_limpiar_fi();
            $("#div_prin").slideDown();
            $("#div_filtros").slideUp();
            $(window).scrollTop(0);



        }
    });


    $("#co_limpiar").on("click", function () {
        if ($.trim($("#co_limpiar").text()) == "Limpiar") {
            fn_limpiar();
            return;
        }
        else
            window.close();
    });
    $("#div_modal").draggable({
        handle: ".modal-header"
    });

    $grid_principal.pqGrid({
        rowDblClick: function fn_sss(event, ui) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
                $("#div_prin").slideUp();
                $("#div_filtros").slideDown();
                $(window).scrollTop(0);
                $grid_2.pqGrid("refreshView");

                $("#tx_cargo").val(dataCell.C1);
                $("#tx_nom").val(dataCell.C2);
                $("#cb_uni_med").val("2");
                $("#tx_glosa").val(dataCell.C4);
                $("#cb_car_aut").val("1");
                $("#tx_ord_i").val(dataCell.C8);
                $("#tx_amort").val(dataCell.C5);
                $("#tx_niv_imp").val(dataCell.C9);
                $("#tx_niv_pre").val(dataCell.C10);
                $("#chk_comb").prop("checked", true);
                $("#chk_amort").prop("checked", true);
                $("#tx_fec_ant").prop("disabled", true);
                $("#tx_fec_des").prop("disabled", true);
                $("#tx_fec_ant").val(dataCell.C6);
                $("#tx_fec_des").val(dataCell.C7);

            }
            fn_carga_grilla();


        }
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
        title: "Administrador de cargos",
        pageModel: { type: "local" },
        scrollModel: { theme: true },
        toolbar:
        {
            cls: "pq-toolbar-export",
            items: [
                { type: "button", label: "Nuevo", attr: "id=co_leer", cls: "btn btn-primary" },
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
                { C1: '0001', C2: 'CONSUMO DE AGUA', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0002', C2: 'CONSUMO DE AGUA NO FACTURADO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0003', C2: 'SUBSIDIADO POR CASO SOCIAL', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0004', C2: 'SUBSIDIO POR CASO SOCIAL', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0005', C2: 'MATERIALES AGUA', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0006', C2: 'MANO DE OBRA - AGUA ', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0007', C2: 'CONSUMO DE AGUA HISTORICO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0008', C2: 'DERECHO DE CONEXION - AGUA', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '0009', C2: 'REINST. SERVICIO AGUA POTABLE', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00010', C2: 'DESCUENTO DE EMPLEADO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00011', C2: 'DESCUENTO DE JUBILADO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00012', C2: 'COMPEM DEFICIENCIA SUMINISTRO AGUA', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00013', C2: 'CONSUMO DE AGUA - DITO RELIQ', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00014', C2: 'CONSUMO DE AGUA - CREDITO RELIQ', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00015', C2: 'DEBITO RELIQ DE SUBSIDIOS', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00016', C2: 'CREDITO RELIQ. JUBILADO/ EMPELADO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00017', C2: 'DEBITO RELIQ. JUBILADO/EMPELADO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00018', C2: 'MANEJO DE CHEQUE DEVUELTO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00019', C2: 'COSTOS LEGALES', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00020', C2: 'RECARGO POR PAGO ATRASADO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00021', C2: 'ARREGLO DE PAGO - AGUA', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' },
                { C1: '00022', C2: 'RECARGOPAGO ATRASADO - HISTORICO', C3: 'UNIDAD', C4: 'GEP-003-TX', C5: '10000', C6: 11042019, C7: 12042019, C8: '122-222-22', C9: '1', C10: '2', C10: '3' }

            ]
        }
    };

    obj.colModel = [
        { title: "Codigo", width: 100, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripcion", width: 100, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "Unidad de medida", width: 100, dataType: "string", dataIndx: "C3", halign: "center", align: "center", hidden: true },
        { title: "Glosa en documento", width: 100, dataType: "string", dataIndx: "C4", halign: "center", align: "center", hidden: true },
        { title: "Cargo automatico", width: 100, dataType: "string", dataIndx: "C5", halign: "center", align: "center", hidden: true },
        { title: "Fecha activación", width: 100, dataType: "number", dataIndx: "C6", halign: "center", align: "center", hidden: true },
        { title: "Fecha desactivación", width: 100, dataType: "number", dataIndx: "C7", halign: "center", align: "center", hidden: true },
        { title: "Orden de impresión", width: 100, dataType: "string", dataIndx: "C8", halign: "center", align: "center", hidden: true },
        { title: "Nivel de amortización", width: 100, dataType: "number", dataIndx: "C9", halign: "center", align: "center", hidden: true },
        { title: "Nivel de impresión", width: 100, dataType: "number", dataIndx: "C10", halign: "center", align: "center", hidden: true },
        { title: "Nivel de amortización", width: 100, dataType: "number", dataIndx: "C11", halign: "center", align: "center", hidden: true },
        { title: "Nivel de presentación", width: 100, dataType: "number", dataIndx: "C11", halign: "center", align: "center", hidden: true }
    ];

    $grid_principal = $("#div_grid_principal").pqGrid(obj);
    $grid_principal.pqGrid("refreshDataAndView");

    //***********************************************************************************************
    data = [
        { C1: '0001', C2: 'CONSUMO DE AGUA' },
        { C1: '0002', C2: 'CONSUMO DE AGUA NO FACTURADO' },
        { C1: '0003', C2: 'SUBSIDIADO POR CASO SOCIAL' },
        { C1: '0004', C2: 'SUBSIDIO POR CASO SOCIAL' },
        { C1: '0005', C2: 'MATERIALES AGUA' },
        { C1: '0006', C2: 'MANO DE OBRA - AGUA ' },
        { C1: '0007', C2: 'CONSUMO DE AGUA HISTORICO' },
        { C1: '0008', C2: 'DERECHO DE CONEXION - AGUA' },
        { C1: '0009', C2: 'REINST. SERVICIO AGUA POTABLE' },
        { C1: '00010', C2: 'DESCUENTO DE EMPLEADO' },
        { C1: '00011', C2: 'DESCUENTO DE JUBILADO' },
        { C1: '00012', C2: 'COMPEM DEFICIENCIA SUMINISTRO AGUA' },
        { C1: '00013', C2: 'CONSUMO DE AGUA - DITO RELIQ' },
        { C1: '00014', C2: 'CONSUMO DE AGUA - CREDITO RELIQ' },
        { C1: '00015', C2: 'DEBITO RELIQ DE SUBSIDIOS' },
        { C1: '00016', C2: 'CREDITO RELIQ. JUBILADO/ EMPELADO' },
        { C1: '00017', C2: 'DEBITO RELIQ. JUBILADO/EMPELADO' },
        { C1: '00018', C2: 'MANEJO DE CHEQUE DEVUELTO' },
        { C1: '00019', C2: 'COSTOS LEGALES' },
        { C1: '00020', C2: 'RECARGO POR PAGO ATRASADO' },
        { C1: '00021', C2: 'ARREGLO DE PAGO - AGUA' },
        { C1: '00022', C2: 'RECARGOPAGO ATRASADO - HISTORICO' }
    ]
    var obj2 = {
        height: 500,
        showTop: true,
        showHeader: true,
        roundCorners: true,
        rowBorders: true,
        fillHandle: "",
        columnBorders: true,
        editable: false,
        selectionModel: { type: "row", mode: "single" },
        showTitle: true,
        collapsible: false,
        numberCell: { show: false },
        title: "Detalle",
        pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500] },
        scrollModel: { theme: true },
        toolbar: {

            cls: "pq-toolbar-export",
            items: [
                { type: "button", label: "Nuevo", attr: "id=co_nuevo", cls: "btn btn-primary" },
                { type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Cerrar", attr: "id=co_cerrar_t", cls: "btn btn-default btn-sm" },
            ]
        }

    };

    obj2.colModel = [
        { title: "Agrupación", width: 100, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Tipo Acción", width: 300, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        {
            title: "Eliminar", width: 80, dataType: "string", align: "center", editable: false, minWidth: 100, sortable: false,
            render: function (ui) {

                return "<button name='co_elim' id='co_elim' class='btn btn-primary btn-sm'>Eliminar</button>";
            }
        }
    ];

    obj2.dataModel = { data: data };

    $grid_2 = $("#div_grid_sec").pqGrid(obj2);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_limpiar() {

    $("#cb_agrup").val("0");
    $("#cb_tip_acc").val("0");
    $("#cb_agrup").focus();
}

function fn_limpiar_fi() {

    $("#tx_cargo").val("");
    $("#tx_nom").val("");
    $("#cb_uni_med").val("");
    $("#tx_glosa").val("");
    $("#cb_car_aut").val("");
    $("#tx_ord_i").val("");
    $("#tx_amort").val("");
    $("#tx_niv_imp").val("");
    $("#tx_niv_pre").val("");
    $("#tx_cargo").focus("");
    $("#tx_cargo").focus("");
    $("#tx_fec_ant").val("");
    $("#tx_fec_des").val("");
    $("#chk_comb").prop("checked", false);
    $("#chk_amort").prop("checked", false);
}


function fn_filtro() {
    parameters =
        {
            "func": "fn_grid_principal",
            "empresa": $("#tx_empresa").val(),
        };

}
function fn_nuevo() {

    $("#div_filtro_bts").modal({ backdrop: "static", keyboard: false });
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();

    });
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
function fn_carga_grilla() {


}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_sistema() {

    $("#cb_sistema").html("<option value='' selected></option><option value='1'>Sistema 01</option> <option value='2' >Sistema 02</option> <option value='3'>Sistema 03</option>");
}
function fn_Muestra_Filtro() {
    $("#div_prin").slideUp();
    $("#div_filtros").slideDown();
    $(window).scrollTop(0);
    $grid_2.pqGrid("refreshView");
    $("#inp_fec_ant").prop("disabled", false);
    $("#inp_fec_des").prop("disabled", false);



}



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
//FUNCIONES COMBOS
function fn_uni_med() {
    $("#cb_uni_med").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_car_aut() {
    $("#cb_car_aut").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_inp_group() {
    $("#cb_agrup").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}
function fn_inp_tip_acc() {
    $("#cb_tip_acc").html("<option value='0' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option> <option value='3'>OPCION 03</option>");
}

function fn_carga_grilla() {


}
function fn_gen() {
    alert('Se genero.');
}
//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
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
