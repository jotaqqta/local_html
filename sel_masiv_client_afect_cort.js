var g_modulo = "Corte y Reposición";
var g_tit = "Configuración de Plantilla de Corte";
var $grid_principal;
var $grid_secundaria;
var $grid_terciaria;
var sql_grid_prim = "";
var sql_grid_second = "";
var sql_grid_third = "";
var my_url = "sel_masiv_client_afect_cort";
var parameters = {};
var rowIndx = [];
var rowIndx2 = [];

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

    fn_convenio();
    fn_inst_cort();
    fn_actividad();
    fn_tarifa();
    fn_estado();
    fn_conexion();

    fn_set_grid_principal();
    fn_set_grid_second();
    fn_set_grid_third();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    // BUTTONS ICONS

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_sel_client").html("<span class='glyphicon glyphicon-plus'></span> Selección de Clientes");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $("#div_second").hide();

    //$(".sin_conv").hide();
    $("#title_mod_new").html(g_tit);

    fn_hide_show();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_consultar").on( "click", function () {

        if ($.trim($("#co_consultar").text()) === "Consultar") {

            if ($("#cb_inst_cort").val() === "") {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONE UNA INSTANCIA DE CORTE!!! </strong></div>', 3000);
                $("#cb_inst_cort").focus();
                return;
            }

            if ($("#cb_actividad").val() === "") {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONE UNA ACTIVIDAD!!! </strong></div>', 3000);
                $("#cb_actividad").focus();
                return;
            }

            if ($("#cb_tarifa").val() === "") {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONE UNA TARIFA!!! </strong></div>', 3000);
                $("#cb_tarifa").focus();
                return;
            }

            if ($("#cb_estado").val() === "") {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONE UN ESTADO!!! </strong></div>', 3000);
                $("#cb_estado").focus();
                return;
            }

            if ($("#cb_conexion").val() === "") {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONE UNA CONEXIÓN!!! </strong></div>', 3000);
                $("#cb_conexion").focus();
                return;
            }

            if ($("#cb_convenio").val() === "") {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONE UN CONVENIO!!! </strong></div>', 3000);
                $("#cb_convenio").focus();
                return;
            }

            if ($("#tx_deuda").val() === "" && $("#tx_deuda").is(":visible")) {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDIQUE EL VALOR DE LA DEUDA!!! </strong></div>', 3000);
                $("#tx_deuda").focus();
                return;
            }

            if ($("#tx_deuda_entre").val() === "" && $("#tx_deuda_entre").is(":visible")) {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDIQUE EL VALOR DE LA DEUDA!!! </strong></div>', 3000);
                $("#tx_deuda_entre").focus();
                return;
            }

            if ($("#tx_deuda_entre2").val() === "" && $("#tx_deuda_entre2").is(":visible")) {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDIQUE EL VALOR DE LA DEUDA!!! </strong></div>', 3000);
                $("#tx_deuda_entre2").focus();
                return;
            }

            if ($("#tx_deud_conv").val() === "" && $("#tx_deud_conv").is(":visible")) {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDIQUE EL VALOR DE LA DEUDA CONVENIO!!! </strong></div>', 3000);
                $("#tx_deud_conv").focus();
                return;
            }

            if ($("#tx_antig_deuda_conv").val() === "" && $("#tx_antig_deuda_conv").is(":visible")) {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDIQUE EL VALOR DE LA ANTIGÜEDAD DE LA DEUDA!!! </strong></div>', 3000);
                $("#tx_antig_deuda_conv").focus();
                return;
            }

            if ($("#tx_cant_cuot_fact").val() === "" && $("#tx_cant_cuot_fact").is(":visible")) {
                fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDIQUE EL VALOR DE CUOTAS FACTURADAS!!! </strong></div>', 3000);
                $("#tx_cant_cuot_fact").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_consultar"));
            $("#div_prin").slideDown();
            $("#div_filtro_bts").slideUp();
            $('#div_filtro_bts').modal('hide');
            $(window).scrollTop(0);
        }
    });

    $("select[id=cb_convenio]").change(function(){

        if ($('select[id=cb_convenio]').val() === "") {
            fn_hide_show();
        }

        if ($('select[id=cb_convenio]').val() === "1") {
            fn_hide_show();
            fn_hide_show(1);
        }

        if ($('select[id=cb_convenio]').val() === "2") {
            fn_hide_show();
            fn_hide_show(2);
        }

        if ($('select[id=cb_convenio]').val() === "3") {
            fn_hide_show();
            fn_hide_show(3);
        }

    });

    $("#co_generar_sol").on("click", function () {

        if (rowIndx2.length >= 1) {

            // DO SOMETHING

            fn_mensaje_boostrap("Se genero.", g_tit, $("#co_generar_sol"));
        } else {
            fn_mensaje_boostrap("Por favor seleccione una fila para poder generar.", g_tit, $("#co_generar_sol"));
        }

    });

    $("#co_sel_client").on("click", function () {

        if (rowIndx.length >= 1) {

            // FUNCTION GET CHECKED

            $("#div_prin").hide();
            $("#div_second").show();
            $grid_secundaria.pqGrid("refreshView");
        } else {
            fn_mensaje_boostrap("Por favor seleccione una fila para poder ingresar", g_tit, $("#co_sel_client"));
        }


    });

    $("#co_ver_clients").on("click", function () {

        if (rowIndx2.length >= 1) {

            $("#div_see_clients_bts").modal({backdrop: "static",keyboard:false});
            $("#div_see_clients_bts").on("shown.bs.modal", function () {
                $("#div_see_clients_bts div.modal-footer button").focus();
            });

            setTimeout(function() {

                $grid_terciaria.pqGrid("refreshView");

            }, 400);
        } else {
            fn_mensaje_boostrap("Por favor seleccione una fila para poder visualizar.", g_tit, $("#co_generar_sol"));
        }



    });

    $("#co_filtro").on("click", function () {

        fn_filtro();
    });

    $("#co_limpiar").on("click", function () {
        fn_limpiar();
    });

    $("#co_cancel").on("click", function (){
        $('#div_filtro_bts').modal('hide');
    });

    $("#co_cerrar_2").on("click", function (){
        $('#div_see_clients_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function () {
        window.close();
    });

    $("#co_volver").on( "click", function () {
        $("#div_second").hide();
        $("#div_prin").show();
    });

    $grid_principal.pqGrid({
        check: function( event, ui ) {

            var isCheck = this.Checkbox('checkBox').isHeadChecked();


            if (ui.check) {
                rowIndx.push(ui.rowIndx);

            } else {

                if (rowIndx.includes(ui.rowIndx)) {
                    var pos = rowIndx.indexOf(ui.rowIndx);
                    rowIndx.splice(pos, 1);
                }

                if (!isCheck) {
                    rowIndx = [];
                }

            }

        }
    });

    $grid_secundaria.pqGrid({
        check: function( event, ui ) {

            var isCheck = this.Checkbox('checkBox').isHeadChecked();

            if (ui.check) {
                rowIndx2.push(ui.rowIndx);

            } else {

                if (rowIndx2.includes(ui.rowIndx)) {
                    var pos = rowIndx2.indexOf(ui.rowIndx);
                    rowIndx2.splice(pos, 1);
                }

                if (!isCheck) {
                    rowIndx2 = []
                }

            }

            var suma = 0;
            var clientes = 0;
            this.Checkbox('checkBox').getCheckedNodes().map(function(rd) {

                var val;
                var val2;

                val2 = rd.C5;

                val = rd.C6;

                val = val.replace('.', '');

                val = val.replace(',', '.');

                suma += parseFloat(val);

                clientes += parseInt(val2);
            });

            suma = suma.toFixed(2);

            $("#selected").html(clientes);
            $("#selected_deuda").html(new Intl.NumberFormat().format(suma));
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

    $("#co_excel_3").on("click", function (e) {

        e.preventDefault();
        var col_model = $("#div_grid_second").pqGrid("option", "colModel");
        var cabecera = "";
        for (i = 0; i < col_model.length; i++) {
            if (col_model[i].hidden !== true) cabecera += "<th>" + col_model[i].title + "</th>";
        }
        $("#excel_cabecera").val(cabecera);
        var element = $grid_terciaria.pqGrid("option", "dataModel.data");
        if (element)
            a = element.length;
        else
            a = 0;
        if (a > 0) {
            $("#tituloexcel").val(g_tit);
            $("#sql").val(sql_grid_third);
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
            cls: "pq-toolbar-export",
            items: [
                {type: "button", label: "Excel", attr: "id=co_filtro", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Excel", attr: "id=co_sel_client", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Excel", attr: "id=co_excel", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Cerrar", attr: "id=co_cerrar", cls: "btn btn-default btn-sm"},
            ]},
        dataModel:{ data: [
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
            ]},
    };

    obj.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: true,
                header: true,
            }
        },
        { title: "Plantilla", width: 90, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 970, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", editable: false },
    ];

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

function fn_set_grid_second() {

    var data =  [
        { C1: '096', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '14', C6: '1.712,04', C7: '97', C8: 'N'},
        { C1: '125', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '6', C6: '8.712,04', C7: '24', C8: 'N'},
        { C1: '098', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '10', C6: '2.055,64', C7: '98', C8: 'N'},
        { C1: '125', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '6', C6: '8.712,04', C7: '24', C8: 'N'},
        { C1: '128', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '15', C6: '2.652,04', C7: '65', C8: 'N'},
        { C1: '128', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '15', C6: '2.652,04', C7: '65', C8: 'N'},
        { C1: '099', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '7', C6: '1.450,44', C7: '88', C8: 'N'},
        { C1: '128', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '15', C6: '2.652,04', C7: '65', C8: 'N'},
        { C1: '102', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '4', C6: '500,85', C7: '76', C8: 'N'},
        { C1: '112', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '45', C6: '65.124,04', C7: '95', C8: 'N'},
        { C1: '125', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '6', C6: '8.712,04', C7: '24', C8: 'N'},
        { C1: '098', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '10', C6: '2.055,64', C7: '98', C8: 'N'},
        { C1: '127', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '7', C6: '9.512,04', C7: '36', C8: 'N'},
        { C1: '099', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '7', C6: '1.450,44', C7: '88', C8: 'N'},
        { C1: '128', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '15', C6: '2.652,04', C7: '65', C8: 'N'},
        { C1: '129', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '18', C6: '3.712,04', C7: '14', C8: 'N'},
        { C1: '099', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '7', C6: '1.450,44', C7: '88', C8: 'N'},
        { C1: '132', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '17', C6: '1.562,04', C7: '84', C8: 'N'},
        { C1: '125', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '6', C6: '8.712,04', C7: '24', C8: 'N'},
        { C1: '125', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '6', C6: '8.712,04', C7: '24', C8: 'N'},
        { C1: '099', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '7', C6: '1.450,44', C7: '88', C8: 'N'},
        { C1: '133', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '25', C6: '9.518,04', C7: '18', C8: 'N'},
        { C1: '099', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '7', C6: '1.450,44', C7: '88', C8: 'N'},
        { C1: '129', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '18', C6: '3.712,04', C7: '14', C8: 'N'},
        { C1: '134', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '8', C6: '1.782,04', C7: '52', C8: 'N'},
        { C1: '128', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '15', C6: '2.652,04', C7: '65', C8: 'N'},
        { C1: '125', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '6', C6: '8.712,04', C7: '24', C8: 'N'},
        { C1: '128', C2: '14', C3: '1', C4: 'CORTE PRIMERA INSTANCIA', C5: '15', C6: '2.652,04', C7: '65', C8: 'N'},
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
        postRenderInterval: 0,
        scrollModel: {theme: true},
        numberCell: {show: true},
        summaryData: calcularTotal(data),
        selectionModel: {type: 'row', mode: 'single'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200, 500]},
        toolbar: false,
    };

    obj.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: true,
                header: true,
            }
        },
        { title: "Ruta", width: 90, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Ciclo", width: 90, dataType: "strig", dataIndx: "C2", halign: "center", align: "center", editable: false },
        { title: "Codigo Instancia", width: 120, dataType: "strig", dataIndx: "C3", halign: "center", align: "center", editable: false },
        { title: "Instancia Corte", width: 250, dataType: "strig", dataIndx: "C4", halign: "center", align: "left", editable: false },
        { title: "Cantidad Clientes", width: 128, dataType: "strig", dataIndx: "C5", halign: "center", align: "center", editable: false },
        { title: "Deuda Total", width: 128, dataType: "strig", dataIndx: "C6", halign: "center", align: "center", editable: false, summary: { type: "sum" } },
        { title: "Antigüedad", width: 128, dataType: "strig", dataIndx: "C7", halign: "center", align: "center", editable: false },
        { title: "Tiene Convenio", width: 120, dataType: "strig", dataIndx: "C8", halign: "center", align: "center", editable: false },
    ];

    obj.dataModel = { data: data };

    $grid_secundaria = $("#div_grid_second").pqGrid(obj);

}

function fn_set_grid_third() {

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
        toolbar: false,
        dataModel:{ data: [
                { C1: '14', C2: '096',   C3: '0085', C4: '8745', C5: '', C6: '2023 - RESIDENCIAL', C7: '12', C8: 'N', C9: '2.015,12', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0200', C4: '8365', C5: '', C6: '2023 - RESIDENCIAL', C7: '45', C8: 'N', C9: '9.542,15', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0214', C4: '1546', C5: '', C6: '2023 - RESIDENCIAL', C7: '21', C8: 'N', C9: '1.213,25', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0056', C4: '8564', C5: '', C6: '2023 - RESIDENCIAL', C7: '02', C8: 'N', C9: '2.321,12', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0125', C4: '5428', C5: '', C6: '2023 - RESIDENCIAL', C7: '56', C8: 'N', C9: '1.985,04', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '2012', C4: '0235', C5: '', C6: '2023 - RESIDENCIAL', C7: '48', C8: 'N', C9: '1.254,05', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0245', C4: '1573', C5: '', C6: '2023 - RESIDENCIAL', C7: '17', C8: 'N', C9: '1.966,56', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0105', C4: '6841', C5: '', C6: '2023 - RESIDENCIAL', C7: '35', C8: 'N', C9: '2.325,05', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0125', C4: '0185', C5: '', C6: '2023 - RESIDENCIAL', C7: '36', C8: 'N', C9: '1.235,48', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0213', C4: '9875', C5: '', C6: '2023 - RESIDENCIAL', C7: '24', C8: 'N', C9: '1.326,45', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0047', C4: '1057', C5: '', C6: '2023 - RESIDENCIAL', C7: '25', C8: 'N', C9: '1.325,78', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0045', C4: '3215', C5: '', C6: '2023 - RESIDENCIAL', C7: '37', C8: 'N', C9: '2.384,45', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0046', C4: '0157', C5: '', C6: '2023 - RESIDENCIAL', C7: '39', C8: 'N', C9: '2.482,48', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0078', C4: '1368', C5: '', C6: '2023 - RESIDENCIAL', C7: '42', C8: 'N', C9: '2.394,45', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0236', C4: '3845', C5: '', C6: '2023 - RESIDENCIAL', C7: '14', C8: 'N', C9: '3.254,74', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0215', C4: '3651', C5: '', C6: '2023 - RESIDENCIAL', C7: '41', C8: 'N', C9: '4.251,48', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0954', C4: '2189', C5: '', C6: '2023 - RESIDENCIAL', C7: '32', C8: 'N', C9: '5.324,74', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0365', C4: '2515', C5: '', C6: '2023 - RESIDENCIAL', C7: '75', C8: 'N', C9: '2.125,48', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0178', C4: '2154', C5: '', C6: '2023 - RESIDENCIAL', C7: '85', C8: 'N', C9: '1.845,74', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0985', C4: '1754', C5: '', C6: '2023 - RESIDENCIAL', C7: '92', C8: 'N', C9: '1.562,25', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0854', C4: '0354', C5: '', C6: '2023 - RESIDENCIAL', C7: '59', C8: 'N', C9: '7.654,23', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0744', C4: '3148', C5: '', C6: '2023 - RESIDENCIAL', C7: '93', C8: 'N', C9: '1.348,96', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
                { C1: '14', C2: '096',   C3: '0177', C4: '6842', C5: '', C6: '2023 - RESIDENCIAL', C7: '94', C8: 'N', C9: '8.235,45', C10: 'RES. PMÁ - COLÓN', C11: 'No esta en Proceso de Facturación', C12: 'N', C13: '', C14: 'ACTIVO', C15: 'CON SUMINISTRO' },
            ] }
    };

    obj.colModel = [
        { title: "Ciclo", width: 50, dataType: "string", dataIndx: "C1", halign: "center", align: "center", },
        { title: "Ruta", width: 50, dataType: "strig", dataIndx: "C2", halign: "center", align: "center", },
        { title: "Correlativo", width: 100, dataType: "strig", dataIndx: "C3", halign: "center", align: "center", },
        { title: "Numero Suministro", width: 150, dataType: "strig", dataIndx: "C4", halign: "center", align: "left", },
        { title: "Nombre", width: 300, dataType: "strig", dataIndx: "C5", halign: "center", align: "left", },
        { title: "Act. Economica", width: 200, dataType: "strig", dataIndx: "C6", halign: "center", align: "left", },
        { title: "Antigüedad", width: 100, dataType: "strig", dataIndx: "C7", halign: "center", align: "center", },
        { title: "Tiene Convenio", width: 120, dataType: "strig", dataIndx: "C8", halign: "center", align: "center", },
        { title: "Deuda", width: 80, dataType: "strig", dataIndx: "C9", halign: "center", align: "center", },
        { title: "Tarifa", width: 200, dataType: "strig", dataIndx: "C10", halign: "center", align: "left", },
        { title: "Estado Facturación", width: 300, dataType: "strig", dataIndx: "C11", halign: "center", align: "left", },
        { title: "Caso Solicitado", width: 120, dataType: "strig", dataIndx: "C12", halign: "center", align: "center", },
        { title: "Agrupación", width: 120, dataType: "strig", dataIndx: "C13", halign: "center", align: "center", },
        { title: "Estado Suministro", width: 130, dataType: "strig", dataIndx: "C14", halign: "center", align: "center", },
        { title: "Estado Conexión", width: 130, dataType: "strig", dataIndx: "C15", halign: "center", align: "left", },
    ];

    $grid_terciaria = $("#div_grid_terciaria").pqGrid(obj);
    $grid_terciaria.pqGrid("refreshDataAndView");

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Modales -->

function fn_filtro() {

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();
    });
}

//                                  <-- Combos -->

function fn_inst_cort(){

    $("#cb_inst_cort").html("<option value='' selected></option><option value='1'>PRIMERA INSTANCIA</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_actividad(){

    $("#cb_actividad").html("<option value='' selected></option><option value='1'>TODAS</option> <option value='2' >RESIDENCIAL</option>  <option value='3' >SOLAR O LOTE BALDIO</option>  <option value='4'>SERVICIO DE ASEO MUNICIPAL</option>");
}

function fn_tarifa(){

    $("#cb_tarifa").html("<option value='' selected></option><option value='1'>TODAS</option> <option value='2' >RES. PMÁ - COLON</option>  <option value='3' >RES. ESPECIAL</option>  <option value='4'>RES. INTERIOR - URBANO</option>");
}

function fn_estado(){

    $("#cb_estado").html("<option value='' selected></option><option value='1'>ACTIVO</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_conexion(){

    $("#cb_conexion").html("<option value='' selected></option><option value='1'>TODOS</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_convenio(){

    $("#cb_convenio").html("<option value='' selected></option><option value='1'>TODOS</option> <option value='2' >CON CONVENIO</option>  <option value='3' >SIN CONVENIO</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function calcularTotal(datos) {
    var deudaTotal = 0,
        data = $grid_secundaria? $grid_secundaria.option('dataModel.data'): datos;

    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        var valor;

        valor = row["C6"].replace('.', '');
        valor = valor.replace(',', '.');

        deudaTotal += parseFloat(valor);

    }

    deudaTotal = deudaTotal.toFixed(2);

    const total = { C1: "Total:", C6: new Intl.NumberFormat().format(deudaTotal)};

    return [total];
}

function fn_limpiar() {

    fn_hide_show();

    $("#cb_inst_cort").val("");
    $("#cb_actividad").val("");
    $("#cb_tarifa").val("");
    $("#cb_estado").val("");
    $("#cb_conexion").val("");
    $("#cb_convenio").val("");
    $("#tx_deuda").val("");
    $("#tx_deuda_entre").val("");
    $("#tx_deuda_entre2").val("");
    $("#tx_deud_conv").val("");
    $("#tx_antig_deuda_conv").val("");
    $("#tx_cant_cuot_fact").val("");

}

function fn_hide_show(type) {

    if (type === 1) {
        $(".sin_conv").show();
        $(".con_conv").show();
    }

    if (type === 2) {
        $(".con_conv").show();
    }

    if (type === 3) {
        $(".sin_conv").show();
    }

    if (type === undefined) {
        $(".sin_conv").hide();
        $(".con_conv").hide();
    }

}

function fn_mensaje(id, mensaje, segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function () {$(id).html("");$(id).hide() }, segundos);
}


