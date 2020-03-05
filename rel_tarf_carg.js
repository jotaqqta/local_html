var g_modulo = "Administrador Central";
var g_tit = "Relación Tarifa Cargo";
var $grid_principal;
var $grid_secundaria;
var $grid_cargo;
var $grid_codigo_valor;
var sql_grid_prim = "";
var sql_grid_second = "";
var my_url = "config_plant_corte";
var rowIndxG;
var rowEdit = false;
var rowData = {};
var parameters = {};

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).keydown(function (e) {

    if (e.keyCode === 8) {
        var element = e.target.nodeName.toLowerCase();
        if ((element !== 'input' && element !== 'textarea') || $(e.target).attr("readonly")) {
            return false;
        }
    }
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).ready(function () {

    // PARA ELIMINAR EL SUBMIT
    $("button").on("click", function () {
        return false;
    });
    //INGRESA LOS TITULOS
    document.title = g_tit;
    document.body.scroll = "yes";
    // Raiz
    $("#div_header").load("syn_globales/header.htm", function () {
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_tit);
    });

    $(".number").inputmask("integer");

//  <-- Combos -->

    fn_type_proc();
    fn_type_calc();
    fn_activo();

//  <-- Grids -->

    fn_set_grid_principal();
    fn_set_grid_second();
    fn_set_grids_complementarias();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

//  <-- Buttons Icons -->

    $("#co_volver").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $("#div_second").hide();
    $("#div_edit_new").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_nuevo").on("click", function () {

        fn_limpiar();

        $("#div_second").slideUp();
        $("#div_second").hide();
        $("#div_edit_new").slideDown();
        $("#div_edit_new").show();
        $(window).scrollTop(0);

        $grid_cargo.pqGrid("refreshData");
        $grid_codigo_valor.pqGrid("refreshData");
    });

    $("#co_guardar").on( "click", function () {

        if ($.trim($("#co_guardar").text()) === "Guardar") {



            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
        }

        if ($.trim($("#co_guardar").text()) === "Modificar") {



            fn_mensaje_boostrap("Se modifico", g_tit, $("#co_guardar"));
        }

        $("#div_edit_new").slideUp();
        $("#div_edit_new").hide();
        $("#div_second").slideDown();
        $("#div_second").show();
        $(window).scrollTop(0);
    });

    $("#co_limpiar").on("click", function () {
        fn_limpiar();
    });

    $("#co_cancelar").on("click", function (){
        $("#div_edit_new").slideUp();
        $("#div_edit_new").hide();
        $("#div_second").slideDown();
        $("#div_second").show();
        $(window).scrollTop(0);
    });

    $("#co_cerrar").on("click", function () {
        window.close();
    });

    $("#co_volver").on( "click", function () {
        $("#div_second").hide();
        $("#div_prin").show();
    });

    $("#co_confirm_yes").on( "click", function () {

        $grid_secundaria.pqGrid("deleteRow", { rowIndx: rowIndxG });

        /*HablaServidor(my_url, parameters, 'text', function() {
            fn_mensaje("EL MOVIMIENTO FUE ELIMINADO", g_titulo, $(""));
        });*/

        $('#dlg_confirm').modal('hide');

    });

    $("#co_confirm_no").on( "click", function () {

        $('#dlg_confirm').modal('hide');

    });

    $grid_principal.pqGrid( {
        rowDblClick: function (event, ui) {

            if (ui.rowData) {

                var dataCell = ui.rowData;

                $("#tx_codigo").val(dataCell.C1);
                $("#tx_desc").val(dataCell.C2);

                $("#div_prin").hide();
                $("#div_second").show();
                $grid_secundaria.pqGrid("refreshView");
            }
        }
    });

    $grid_secundaria.pqGrid( {
        rowDblClick: function (event, ui) {
            if (ui.rowData)
            {
                var dataCell = ui.rowData;

                rowData = { C1: dataCell.C1, C2: dataCell.C2, C3: dataCell.C3 };

                fn_edit(dataCell);
            }
        }
    });

    $grid_cargo.pqGrid( {
        refresh: function (event, ui) {

            if (rowEdit) {

                var data = this.getData();

                for (var i = 0; i < data.length; i++) {

                    if (rowData.C1 === data[i].C1 && rowData.C2 === data[i].C2) {

                        this.setSelection({ rowIndx: i, focus: true });

                        $("#selected_cargo").html(data[i].C1);
                        $("#selected_desc").html(data[i].C2);
                    }
                }
            }
        }
    });

    $grid_cargo.pqGrid( {
        rowSelect: function (event, ui) {

            var dataCell = ui.addList[0].rowData;

            $("#selected_cargo").html(dataCell.C1);
            $("#selected_desc").html(dataCell.C2);
        }
    });

    $grid_codigo_valor.pqGrid( {
        refresh: function (event, ui) {

            if (rowEdit) {

                var data = this.getData();

                for (var i = 0; i < data.length; i++) {

                    if (rowData.C3 === data[i].C2) {

                        this.setSelection({ rowIndx: i, focus: true });

                        $("#selected_codigo").html(data[i].C1);
                        $("#selected_valor").html(data[i].C2);
                    }
                }
            }
        }
    });

    $grid_codigo_valor.pqGrid( {
        rowSelect: function (event, ui) {

            var dataCell = ui.addList[0].rowData;

            $("#selected_codigo").html(dataCell.C1);
            $("#selected_valor").html(dataCell.C2);
        }
    });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    $("#co_excel").on("click", function (e) {

        fn_filtro();
        e.preventDefault();
        var col_model = $("#div_grid_principal").pqGrid("option", "colModel");
        var cabecera = "";
        for (i = 0; i < col_model.length; i++) {
            if (col_model[i].hidden !== true) cabecera += "<th>" + col_model[i].title + "</th>";
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

    $("#co_excel2").on("click", function (e) {

        fn_filtro();
        e.preventDefault();
        var col_model = $("#div_grid_second").pqGrid("option", "colModel");
        var cabecera = "";
        for (i = 0; i < col_model.length; i++) {
            if (col_model[i].hidden !== true) cabecera += "<th>" + col_model[i].title + "</th>";
        }
        $("#excel_cabecera").val(cabecera);
        var element = $grid_secundaria.pqGrid("option", "dataModel.data");
        if (element)
            a = element.length;
        else
            a = 0;
        if (a > 0) {
            $("#tituloexcel").val(g_tit);
            $("#sql").val(sql_grid_second);
            $("#frm_Exel").submit();
            return;
        }
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->

function fn_set_grid_principal() {

    var data =  [
        { C1: '200', C2: 'AGRUPADOR' },
        { C1: '23', C2: 'COMERCIAL' },
        { C1: '35', C2: 'COMERCIAL AGUA CRUDA' },
        { C1: '223', C2: 'CONTADORA' },
        { C1: '32', C2: 'CONTADORA - SOLO AGUA' },
        { C1: '33', C2: 'CONTADORA - SOLO ALCANTARILLADO' },
        { C1: '41', C2: 'CORPORATIVO ENTIDADES AUTONOMAS' },
        { C1: '40', C2: 'CORPORATIVO GOBIERNO CENTRAL' },
        { C1: '42', C2: 'CORPORATIVO MUNICIPIO' },
        { C1: '26', C2: 'ENTIDAD AUTONOMA' },
        { C1: '226', C2: 'ENTIDAD AUTONOMA ALCANTARILLADO' },
        { C1: '25', C2: 'ENTIDAD DEL GOBIERNO' },
        { C1: '225', C2: 'ENTIDAD DEL GOBIERNO ALCANTARILLADO' },
        { C1: '34', C2: 'GOBIERNO - AGUA CRUDA' },
        { C1: '24', C2: 'INDUSTRIAL' },
        { C1: '224', C2: 'INDUSTRIAL ALCANTARILLADO' },
        { C1: '27', C2: 'JUNTA PUEBLO GOB. INTERIOR' },
        { C1: '227', C2: 'JUNTA PUEBLO GOB. INTERIR ALCANTARILLADO' },
        { C1: '29', C2: 'MUNICIPIO' },
        { C1: '229', C2: 'MUNICIPIO ALCANTARILLADO' },
    ];

    var obj = {
        height: "100%",
        showtop: true,
        showBottom: true,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible: true,
        editable: false,
        postRenderInterval: 0,
        scrollModel: {theme: true},
        numberCell: {show: true},
        selectionModel: {type: 'row', mode: 'single'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200, 500]},
        toolbar: {
            cls: "pq-toolbar-export btn-group-sm",
            items: [
                {type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Cerrar", attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Código", width: 91, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 1000, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", },
    ];

    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

function fn_set_grid_second() {

    var data =  [
        { C1: '0001', C2: 'CONSUMO DE AGUA', C3: '0.0016225', C4: '1', C5: 'GALONES', C6: '', C7: 'ACTIVO' },
        { C1: '0777', C2: 'ALCANTARILLADO', C3: '0.0005', C4: '2', C5: 'GALONES', C6: '', C7: 'ACTIVO' },
        { C1: '0251', C2: 'ALCANTARILLADO', C3: '0.0255', C4: '1', C5: 'GALONES', C6: '', C7: 'ACTIVO' },
        { C1: '0003', C2: 'CONSUMO DE AGUA', C3: '0.0018525', C4: '1', C5: 'GALONES', C6: '', C7: 'ACTIVO' },
        { C1: '0053', C2: 'CONSUMO DE AGUA', C3: '0.0154845', C4: '2', C5: 'GALONES', C6: '', C7: 'ACTIVO' },
        { C1: '0089', C2: 'CONSUMO DE AGUA', C3: '0.0000547', C4: '1', C5: 'GALONES', C6: '', C7: 'ACTIVO' },
        { C1: '0365', C2: 'ALCANTARILLADO', C3: '0.1021', C4: '2', C5: 'GALONES', C6: '', C7: 'ACTIVO' },
        { C1: '0387', C2: 'ALCANTARILLADO', C3: '0.1251', C4: '1', C5: 'GALONES', C6: '', C7: 'ACTIVO' },
        { C1: '0625', C2: 'ALCANTARILLADO', C3: '0.4478', C4: '4', C5: 'GALONES', C6: '', C7: 'ACTIVO' },

    ];

    var obj = {
        height: "100%",
        showtop: true,
        showBottom: true,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible: true,
        editable: false,
        postRenderInterval: 0,
        scrollModel: {theme: true},
        numberCell: {show: true},
        selectionModel: {type: 'row', mode: 'single'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200, 500]},
        toolbar: {
            cls: "pq-toolbar-export btn-group-sm",
            items: [
                {type: "button", label: "Volver", attr: "id=co_volver", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Nuevo", attr: "id=co_nuevo", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Excel", attr: "id=co_excel2", cls: "btn btn-primary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Cargo", width: 80, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 320, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", },
        { title: "Valor", width: 120, dataType: "strig", dataIndx: "C3", halign: "center", align: "center", },
        { title: "Fac Apl", width: 60, dataType: "strig", dataIndx: "C4", halign: "center", align: "center", },
        { title: "Tipo Calc", width: 120, dataType: "strig", dataIndx: "C5", halign: "center", align: "center", },
        { title: "Procedimiento", width: 225, dataType: "strig", dataIndx: "C6", halign: "center", align: "center", },
        { title: "Estado", width: 100, dataType: "strig", dataIndx: "C7", halign: "center", align: "center", },
        { title: "Eliminar", width: 66, dataType: "string", halign: "center", align: "center", editable: false, sortable: false,
            render: function () {
                return "<button class='btn btn-sm btn-primary' id='co_cerrar_prin' type='button'><span class='glyphicon glyphicon-trash'></span></button>";
            },
            postRender: function (ui) {

                var rowIndx = ui.rowIndx;

                var $grid = this,
                    $grid = $grid.getCell(ui);

                $grid.find("button")
                    .on("click", function () {

                        fn_borrar(rowIndx);

                    });

            }
        },
    ];

    obj.dataModel = { data: data };

    $grid_secundaria = $("#div_grid_second").pqGrid(obj);

}

function fn_set_grids_complementarias() {

    // GRID CARGO

    var data =  [
        { C1: '0001', C2: 'CONSUMO DE AGUA' },
        { C1: '0777', C2: 'ALCANTARILLADO' },
    ];

    var obj = {
        height: 250,
        showtop: true,
        showBottom: true,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible: true,
        editable: false,
        scrollModel: {theme: true},
        numberCell: {show: true},
        selectionModel: {type: 'row', mode: 'single'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200, 500]},
        toolbar: false,
    };

    obj.colModel = [
        { title: "Cargo", width: 522, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 522, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", },
    ];

    obj.dataModel = { data: data };

    $grid_cargo = $("#div_grid_cargo").pqGrid(obj);

    // GRID CODIGO VALOR

    var data2 =  [
        { C1: '00223', C2: '0.0005' },
        { C1: '00321', C2: '0.0016225' },
    ];

    var obj2 = {
        height: 250,
        showtop: true,
        showBottom: true,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible: true,
        editable: false,
        scrollModel: {theme: true},
        numberCell: {show: true},
        selectionModel: {type: 'row', mode: 'single'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200, 500]},
        toolbar: false,
    };

    obj2.colModel = [
        { title: "Código", width: 522, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Valor", width: 522, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", },
    ];

    obj2.dataModel = { data: data2 };

    $grid_codigo_valor = $("#div_grid_cod_valor").pqGrid(obj2);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*


//                                  <-- Combos -->

function fn_type_proc(){

    $("#cb_type_proc").html("<option value='' selected></option><option value='1'>GALONES</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCION 03</option>");
}

function fn_type_calc(){

    $("#cb_type_calc").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCION 03</option>");
}

function fn_activo(){

    $("#cb_activo").html("<option value='' selected></option><option value='1'>ACTIVO</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCION 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_edit(dataCell) {

    rowEdit = true;

    fn_limpiar();

    $("#tx_fact_aplic").val(dataCell.C4);

    $("#cb_type_proc option").each(function() {
        if ($(this).text() === dataCell.C5) {
            $("#cb_type_proc").val($(this).val());
        }
    });

    $("#cb_activo option").each(function() {
        if ($(this).text() === dataCell.C7) {
            $("#cb_activo").val($(this).val());
        }
    });

    $("#div_prin").hide();

    $("#div_second").slideUp();
    $("#div_second").hide();
    $("#div_edit_new").slideDown();
    $("#div_edit_new").show();
    $(window).scrollTop(0);

    $grid_cargo.pqGrid("refreshView");
    $grid_codigo_valor.pqGrid("refreshView");

    rowEdit = false;

}

function fn_borrar(rowIndx) {

    $("#confirm_msg").html("¿Estas seguro de que quieres eliminar la fila " + (rowIndx + 1) + "?");

    rowIndxG = rowIndx;

    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
    $("#dlg_confirm").on("shown.bs.modal", function () {
        $("#dlg_confirm div.modal-footer button").focus();
    });

}

function fn_limpiar() {

    $("#tx_fact_aplic").val("");
    $("#cb_type_proc").val("");
    $("#cb_type_calc").val("");
    $("#cb_activo").val("");

    $("#selected_cargo").html("");
    $("#selected_desc").html("");
    $("#selected_codigo").html("");
    $("#selected_valor").html("");

}

function fn_mensaje(id, mensaje, segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function () {$(id).html("");$(id).hide() }, segundos);
}


