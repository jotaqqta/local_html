var g_modulo = "Administrador Tarifario";
var g_tit = "Actualización de Precios";
var $grid_principal;
var $grid_secundaria;
var sql_grid_prim = "";
var sql_grid_second = "";
var my_url = "config_plant_corte";
var rowIndxG;
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

    // COMBOS

    //fn_set_grid_principal();
    fn_set_grid_second();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    // BUTTONS ICONS

    $("#co_volver").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $("#div_second").show();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_guardar").on( "click", function () {

        if ($.trim($("#co_guardar").text()) === "Guardar") {

            if ($("#tx_ruta").val() === "") {
                fn_mensaje('#mensaje_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UN NUMERO DE RUTA!!! </strong></div>', 3000);
                $("#tx_ruta").focus();
                return;
            }

            if (!$.isNumeric($("#tx_ruta").val())) {
                fn_mensaje('#mensaje_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!! </strong></div>', 3000);
                $("#tx_ruta").focus();
                return;
            }

            if ($("#tx_ruta").val().includes("e") || $("#tx_ruta").val().includes(".") || $("#tx_ruta").val().includes(",") || $("#tx_ruta").val().includes("-") || $("#tx_ruta").val().includes("+")) {
                fn_mensaje('#mensaje_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!! </strong></div>', 3000);
                $("#tx_ruta").focus();
                return;
            }

            if ($("#tx_ciclo").val() === "") {
                fn_mensaje('#mensaje_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UN NUMERO DE CICLO!!! </strong></div>', 3000);
                $("#tx_ciclo").focus();
                return;
            }

            if (!$.isNumeric($("#tx_ciclo").val())) {
                fn_mensaje('#mensaje_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!! </strong></div>', 3000);
                $("#tx_ciclo").focus();
                return;
            }

            if ($("#tx_ciclo").val().includes("e") || $("#tx_ciclo").val().includes(".") || $("#tx_ciclo").val().includes(",") || $("#tx_ciclo").val().includes("-") || $("#tx_ciclo").val().includes("+")) {
                fn_mensaje('#mensaje_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!! </strong></div>', 3000);
                $("#tx_ciclo").focus();
                return;
            }

            fn_mensaje_boostrap("Se modifico", g_tit, $("#co_guardar"));
            $("#div_second").slideDown();
            $("#div_edit_bts").slideUp();
            $('#div_edit_bts').modal('hide');
            $(window).scrollTop(0);
        }
    });

    $("#co_limpiar").on("click", function () {
        fn_limpiar();
    });

    $("#co_cancel").on("click", function (){
        $('#div_edit_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function () {
        window.close();
    });

    $("#co_volver").on( "click", function () {
        $("#div_second").hide();
        $("#div_prin").show();
    });

    $("#co_confirm_yes").on( "click", function () {

        if ($("#div_grid_principal").is( ":visible")) {
            $grid_principal.pqGrid("deleteRow", { rowIndx: rowIndxG });
        } else {
            $grid_secundaria.pqGrid("deleteRow", { rowIndx: rowIndxG });
        }

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
            if (ui.rowData)
            {
                var dataCell = ui.rowData;

                // --> Funcion cargar info <--

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
                alert("Grilla");
                var dataCell = ui.rowData;

                fn_edit(dataCell);

            }
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
        { C1: '1', C2: 'PLANTILLA CICLO 01/8000' },
        { C1: '2', C2: 'PLANTILLA CICLO 02/8000' },
        { C1: '3', C2: 'PLANTILLA CICLO 03/8000' },
        { C1: '4', C2: 'PLANTILLA CICLO 04/8000' },
        { C1: '5', C2: 'PLANTILLA CICLO 05/8000' },
        { C1: '6', C2: 'PLANTILLA CICLO 06/8000' },
        { C1: '7', C2: 'PLANTILLA CICLO 07/8000' },
        { C1: '8', C2: 'PLANTILLA CICLO 08/8000' },
        { C1: '9', C2: 'PLANTILLA CICLO 09/8000' },
        { C1: '10', C2: 'PLANTILLA CICLO 10/8000' },
        { C1: '11', C2: 'PLANTILLA CICLO 11/8000' },
        { C1: '12', C2: 'PLANTILLA CICLO 12/8000' },
        { C1: '13', C2: 'PLANTILLA CICLO 13/8000' },
        { C1: '14', C2: 'PLANTILLA CICLO 14/8000' },
        { C1: '15', C2: 'PLANTILLA CICLO 15/8000' },
        { C1: '16', C2: 'PLANTILLA CICLO 16/8000' },
        { C1: '17', C2: 'PLANTILLA CICLO 17/8000' },
        { C1: '18', C2: 'PLANTILLA CICLO 18/8000' },
        { C1: '19', C2: 'PLANTILLA CICLO 19/8000' },
        { C1: '20', C2: 'PLANTILLA CICLO 20/8000' },
        { C1: '25', C2: 'PLANTILLA CICLO 25/8000' },
        { C1: '27', C2: 'PLANTILLA CICLO 27/8000' },
        { C1: '28', C2: 'PLANTILLA CICLO 28/8000' },
        { C1: '29', C2: 'PLANTILLA CICLO 29/8000' },
        { C1: '30', C2: 'PLANTILLA CICLO 30/8000' },
        { C1: '35', C2: 'PLANTILLA CICLO 35/8000' },
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
            cls: "pq-toolbar-export",
            items: [
                {type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Cerrar", attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Codigo", width: 55, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 970, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", },
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

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

function fn_set_grid_second() {

    var data =  [
        { C1: '005', C2: '04' },
        { C1: '006', C2: '04' },
        { C1: '008', C2: '04' },
        { C1: '009', C2: '04' },
        { C1: '010', C2: '04' },
        { C1: '012', C2: '04' },
        { C1: '015', C2: '04' },
        { C1: '016', C2: '04' },
        { C1: '017', C2: '04' },
        { C1: '018', C2: '04' },
        { C1: '020', C2: '04' },
        { C1: '025', C2: '04' },
        { C1: '026', C2: '04' },
        { C1: '028', C2: '04' },
        { C1: '030', C2: '04' },
        { C1: '032', C2: '04' },
        { C1: '034', C2: '04' },
        { C1: '036', C2: '04' },
        { C1: '037', C2: '04' },
        { C1: '038', C2: '04' },
        { C1: '039', C2: '04' },
        { C1: '042', C2: '04' },
        { C1: '045', C2: '04' },
        { C1: '046', C2: '04' },
        { C1: '048', C2: '04' },
        { C1: '050', C2: '04' },
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
            cls: "pq-toolbar-export",
            items: [
                {type: "button", label: "Volver", attr: "id=co_volver", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Excel", attr: "id=co_excel2", cls: "btn btn-primary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Ruta", width: 512, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Ciclo", width: 512, dataType: "strig", dataIndx: "C2", halign: "center", align: "center", },
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

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*


//                                  <-- Combos -->


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_edit(dataCell) {

    $("#tx_ruta").val(dataCell.C1);
    $("#tx_ciclo").val(dataCell.C2);

    $("#div_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_edit_bts").on("shown.bs.modal", function () {
        $("#div_edit_bts div.modal-footer button").focus();
    });
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

    $("#tx_ruta").val("");
    $("#tx_ciclo").val("");

}

function fn_mensaje(id, mensaje, segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function () {$(id).html("");$(id).hide() }, segundos);
}


