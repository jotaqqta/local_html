var g_modulo = "Administrador Central";
var g_tit = "Actualización de Precios";
var $grid_principal;
var $grid_secundaria;
var sql_grid_prim = "";
var sql_grid_second = "";
var my_url = "act_precios";
var checkValue;
var rowIndxG;
var parameters = {};
var rowIndx = [];

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

    $("._input_selector").inputmask("dd/mm/yyyy");

    // COMBOS

    fn_set_grid_principal();
    fn_set_grid_second();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    // BUTTONS ICONS

    $("#co_act_tramo").html("<span class='glyphicon glyphicon-plus'></span> Actualizar Tramo");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_excel_2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $("#div_second").hide();

    //$(".sin_conv").hide();
    $("#title_mod_new").html(g_tit);

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_act_tramo").on("click", function () {

        if (rowIndx.length >= 1) {

            $("#tx_precio").val(checkValue);
            $("#tx_fech_vig").val(fn_fecha_actual());

            $("#div_prin").hide();
            $("#div_second").show();
            $grid_secundaria.pqGrid("refreshView");
        } else {
            fn_mensaje_boostrap("Por favor seleccione una fila para poder ingresar", g_tit, $("#co_sel_client"));
        }

    });

    $("#co_modificar").on("click", function () {

        if ($.trim($("#co_modificar").text()) === "Modificar") {

            if ($("#tx_fech_aplic").val() === "") {
                fn_mensaje('#mensaje_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UNA FECHA APLICACIÓN!!!</strong></div>', 3000);
                $("#tx_fech_aplic").focus();
                return;
            }

            if ($("#tx_fech_actua").val() === "") {
                fn_mensaje('#mensaje_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UNA FECHA ACTUALIZACIÓN!!!</strong></div>', 3000);
                $("#tx_fech_actua").focus();
                return;
            }

            if ($("#tx_fech_aplic").val() !== "") {
                if (fn_validar_fecha($("#tx_fech_aplic").val()) === false) {
                    fn_mensaje('#mensaje_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fech_aplic").focus();
                    return;
                }
            }

            if ($("#tx_fech_actua").val() !== "") {
                if (fn_validar_fecha($("#tx_fech_actua").val()) === false) {
                    fn_mensaje('#mensaje_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fech_actua").focus();
                    return;
                }
            }
        }

        // BACKEND EDIT

        fn_mensaje_boostrap("Se modifico", g_tit, $("#co_consultar"));
        $("#div_prin").slideDown();
        $("#div_edit_bts").slideUp();
        $('#div_edit_bts').modal('hide');
        $(window).scrollTop(0);
    });

    $("#co_modificar_2").on("click", function () {

        if ($.trim($("#co_modificar").text()) === "Modificar") {

            if ($("#tx_fin").val() === "") {
                fn_mensaje('#mensaje_edit_2', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UN VALOR FIN!!!</strong></div>', 3000);
                $("#tx_fin").focus();
                return;
            }

            if ($("#tx_valor").val() === "") {
                fn_mensaje('#mensaje_edit_2', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UN VALOR!!!</strong></div>', 3000);
                $("#tx_valor").focus();
                return;
            }

            if ($("#tx_valor").val().includes("e") || $("#tx_valor").val().includes("E") || $("#tx_valor").val().includes(",") || $("#tx_valor").val().includes("-") || $("#tx_valor").val().includes("+")) {
                fn_mensaje('#mensaje_edit_2', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!! </strong></div>', 3000);
                $("#tx_valor").focus();
                return;
            }

            if ($("#tx_fact_aplic").val() === "") {
                fn_mensaje('#mensaje_edit_2', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UN FACTOR APLICADO!!!</strong></div>', 3000);
                $("#tx_fact_aplic").focus();
                return;
            }
        }

        fn_mensaje_boostrap("Se modifico", g_tit, $("#co_consultar"));
        $("#div_second").slideDown();
        $("#div_edit_2_bts").slideUp();
        $('#div_edit_2_bts').modal('hide');
        $(window).scrollTop(0);
    });

    $("#co_limpiar").on("click", function () {
        fn_limpiar(1);
    });

    $("#co_limpiar_2").on("click", function () {
        fn_limpiar(2);
    });

    $("#co_volver").on( "click", function () {
        $("#div_second").hide();
        $("#div_prin").show();
    });

    $("#co_cerrar").on("click", function () {
        window.close();
    });

    $("#co_cancelar").on("click", function () {
        $("#div_prin").slideDown();
        $("#div_edit_bts").slideUp();
        $('#div_edit_bts').modal('hide');
        $(window).scrollTop(0);
    });

    $("#co_cancelar_2").on("click", function () {
        $("#div_second").slideDown();
        $("#div_edit_2_bts").slideUp();
        $('#div_edit_2_bts').modal('hide');
        $(window).scrollTop(0);
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

    $grid_principal.pqGrid({
       rowDblClick: function ( event, ui ) {

           if (ui.rowData) {
               var dataCell = ui.rowData;

               fn_edit(dataCell, 1);

           }
       }
    });

    $grid_secundaria.pqGrid({
        rowDblClick: function ( event, ui ) {

            if (ui.rowData) {
                var dataCell = ui.rowData;

                fn_edit(dataCell, 2);

            }
        }
    });

    $grid_principal.pqGrid({
        check: function( event, ui ) {

            rowIndx = [];

            if (ui.check) {
                rowIndx.push(ui.rowIndx);

                checkValue = this.Checkbox('checkBox').getCheckedNodes().map(function(rd){
                    return rd.C2;
                });

                $("#tx_desc_2").val(this.Checkbox('checkBox').getCheckedNodes().map(function(rd){
                    return rd.C2;
                }));

            }
        }
    });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    $("#co_excel").on("click", function (e) {

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

    $("#co_excel_2").on("click", function (e) {

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

    var obj = {
        height: "100%",
        showtop: true,
        showBottom: true,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible: true,
        postRenderInterval: 0,
        scrollModel: {theme: true},
        numberCell: {show: true},
        selectionModel: {type: 'row', mode: 'single'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200, 500]},
        toolbar: {
            cls: "pq-toolbar-export btn-group-sm",
            items: [
                {type: "button", label: "Actualizar Tramo", attr: "id=co_act_tramo", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Cerrar", attr: "id=co_cerrar", cls: "btn btn-default btn-sm"},
            ]},
        dataModel:{ data: [
                { C1: '00220', C2: 'PRECIO ALC TARIFA 0220', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00221', C2: 'PRECIO ALC TARIFA 0221', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00222', C2: 'PRECIO ALC TARIFA 0222', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00223', C2: 'PRECIO ALC TARIFA 0223 - 0224', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'N' },
                { C1: '00225', C2: 'PRECIO ALC TARIFA 0225', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00226', C2: 'PRECIO ALC TARIFA 0226', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'N' },
                { C1: '00227', C2: 'PRECIO ALC TARIFA 0227', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00229', C2: 'PRECIO ALC TARIFA 0228', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'N' },
                { C1: '00700', C2: 'PRECIO CARGO INFORMATIVO SERVICIO ALCANTARILLADO', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00600', C2: 'PRECIO PARA CERTIFICADO PAZ Y SALVO', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00001', C2: 'PRECIO PARA TARIFA 0020', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00002', C2: 'PRECIO PARA TARIFA 0021', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00003', C2: 'PRECIO PARA TARIFA 0022', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00004', C2: 'PRECIO PARA TARIFA 0023-0024', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'N' },
                { C1: '00005', C2: 'PRECIO PARA TARIFA 0025-0026', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00006', C2: 'PRECIO PARA TARIFA 0027', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00007', C2: 'PRECIO PARA TARIFA AGUA CRUDA', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00008', C2: 'PRECIO PARA TARIFA CONTADORA', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'N' },
                { C1: '00702', C2: 'PRECIO RECONEXION INTERIOR', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00701', C2: 'PRECIO RECONEXION PANAMA Y COLON', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00320', C2: 'PRECIO TAS TARIFA 0320', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00323', C2: 'PRECIO TAS TARIFA 0323 - 0324', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'S' },
                { C1: '00325', C2: 'PRECIO TAS TARIFA 0325', C3: '12/02/2020', C4: '14/02/2020', C5: '0.0005', C6: 'N' },
            ]},
    };

    obj.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: false,
                header: false,
                maxCheck: 1,
            }
        },
        { title: "Código", width: 90, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 500, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", editable: false },
        { title: "Fecha Aplicación", width: 140, dataType: "strig", dataIndx: "C3", halign: "center", align: "center", editable: false },
        { title: "Fecha Actualización", width: 150, dataType: "strig", dataIndx: "C4", halign: "center", align: "center", editable: false },
        { title: "Valor", width: 91, dataType: "strig", dataIndx: "C5", halign: "center", align: "center", editable: false },
        { title: "Con Tramo", width: 90, dataType: "strig", dataIndx: "C6", halign: "center", align: "center", editable: false },
    ];

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

function fn_set_grid_second() {

    var data =  [
        { C1: '1', C2: '0', C3: '10000', C4: '0.00019', C5: '',},
        { C1: '2', C2: '10001', C3: '15000', C4: '0.00039', C5: '',},
        { C1: '3', C2: '15001', C3: '20000', C4: '0.0005', C5: '',},
        { C1: '4', C2: '20001', C3: '30000', C4: '0.0005', C5: '',},
        { C1: '5', C2: '30001', C3: '50000', C4: '0.0005', C5: '',},
        { C1: '6', C2: '50001', C3: '100000', C4: '0.0005', C5: '',},
        { C1: '7', C2: '100001', C3: '150000', C4: '0.0005', C5: '',},
        { C1: '8', C2: '150001', C3: '200000', C4: '0.0005', C5: '',},
        { C1: '9', C2: '200001', C3: '99999999', C4: '0.0005', C5: '',},
    ];

    var obj = {
        height: "100%",
        showtop: true,
        editable: false,
        showBottom: true,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible: true,
        postRenderInterval: 0,
        scrollModel: {theme: true},
        numberCell: {show: true},
        selectionModel: {type: 'row', mode: 'single'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200, 500]},
        toolbar: false,
    };

    obj.colModel = [
        { title: "Tramo", width: 205, dataType: "string", dataIndx: "C1", halign: "center", align: "center", },
        { title: "Inicio", width: 205, dataType: "string", dataIndx: "C2", halign: "center", align: "center", },
        { title: "Fin", width: 205, dataType: "string", dataIndx: "C3", halign: "center", align: "center", },
        { title: "Valor", width: 205, dataType: "string", dataIndx: "C4", halign: "center", align: "center", },
        { title: "Factor Aplicación", width: 205, dataType: "string", dataIndx: "C5", halign: "center", align: "center", },
        { title: "Eliminar", width: 66, dataType: "string", halign: "center", align: "center", editable: false, sortable: false,
            render: function () {
                return "<button class='btn btn-sm btn-primary' id='co_cerrar_prin' type='button'><span class='glyphicon glyphicon-trash'></span></button>";
            },
            postRender: function (ui) {

                var rowIndx = ui.rowIndx;

                var $grid = this;
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

//                                  <-- Modales -->

function fn_edit(dataCell, grid) {

    if (grid === 1) {

        $("#tx_desc").val(dataCell.C2);

        $("#tx_valor_precio").val(dataCell.C5);
        $("#tx_fech_aplic").val(dataCell.C3);
        $("#tx_fech_actua").val(dataCell.C4);

        if (dataCell.C6 === "S") {
            $("#chk_resp_auto").prop("checked", true);
        } else {
            $("#chk_resp_auto").prop("checked", false);
        }

        $("#div_edit_bts").modal({backdrop: "static", keyboard: false});
        $("#div_edit_bts").on("shown.bs.modal", function () {
            $("#div_edit_bts div.modal-footer button").focus();
        });

    }

    if (grid === 2) {

        $("#tx_tramo").val(dataCell.C1);
        $("#tx_inicio").val(dataCell.C2);
        $("#tx_fin").val(dataCell.C3);
        $("#tx_valor").val(parseFloat(dataCell.C4));
        $("#tx_fact_aplic").val(dataCell.C5);

        $("#div_edit_2_bts").modal({backdrop: "static", keyboard: false});
        $("#div_edit_2_bts").on("shown.bs.modal", function () {
            $("#div_edit_2_bts div.modal-footer button").focus();
        });

    }
}

function fn_borrar(rowIndx) {

    $("#confirm_msg").html("¿Estas seguro de que quieres eliminar la fila " + (rowIndx + 1) + "?");

    rowIndxG = rowIndx;

    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
    $("#dlg_confirm").on("shown.bs.modal", function () {
        $("#dlg_confirm div.modal-footer button").focus();
    });

}

//                                  <-- Combos -->

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_validar_fecha(value){
    var real, info;
    if (/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/.test(value)) {
        info = value.split(/\//);
        var fecha = new Date(info[2], info[1]-1, info[0]);
        if ( Object.prototype.toString.call(fecha) === '[object Date]' ){
            real = fecha.toISOString().substr(0,10).split('-');
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

function fn_fecha_actual() {

    var fecha = new Date();

    var mes = ((fecha.getMonth().length+1) === 1)? (fecha.getMonth()+1) : '0' + (fecha.getMonth()+1);

    return fecha.getDate() + "/" + mes + "/" + fecha.getFullYear();
}

function fn_limpiar(grid) {

    if (grid === 1) {
        $("#chk_resp_auto").prop("checked", false);
        $("#tx_fech_aplic").val("");
        $("#tx_fech_actua").val("");
    }

    if (grid === 2) {
        $("#tx_fin").val("");
        $("#tx_valor").val("");
        $("#tx_fact_aplic").val("");
    }

}

function fn_mensaje(id, mensaje, segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function () {$(id).html("");$(id).hide() }, segundos);
}


