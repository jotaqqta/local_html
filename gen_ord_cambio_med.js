var g_modulo = "Medidores y Equipos";
var g_tit = "Generación de Ordenes de Cambio de Medidor";
var $grid_localidades;
var $grid_tarifas;
var $grid_act_eco;
var $grid_marcas;
var $grid_modelos;
var $grid_diametros;
var sql_grid_prim = "";
var sql_grid_second = "";
var my_url = "elimina_rest_crea_ocm";
var parameters = {};
var unCheck;
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
    $(".number").inputmask("integer");

    // COMBOS

    fn_regional();
    fn_tecnologia();
    fn_clase_metro();
    fn_propiedad();
    fn_sect_inicial();
    fn_sect_final();

    fn_set_grids();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    $("#co_control").prop("disabled", true);
    $("#co_alerta").prop("disabled", true);

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_generar").on( "click", function () {

        if ($.trim($("#co_generar").text()) === "Generar") {

            if ($("#cb_regional").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONE UNA REGIONAL", g_tit, $("#cb_regional"));
                return;
            }

            if ($("#tx_fech_inst_desde").val() !== "") {
                if (fn_validar_fecha($("#tx_fech_inst_desde").val()) === false) {
                    fn_mensaje_boostrap("FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY", g_tit, $("#tx_fech_inst_desde"));
                    return;
                }
            }

            if ($("#tx_fech_inst_hasta").val() !== "") {
                if (fn_validar_fecha($("#tx_fech_inst_hasta").val()) === false) {
                    fn_mensaje_boostrap("FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY", g_tit, $("#tx_fech_inst_hasta"));
                    return;
                }
            }

            if ($("#tx_fech_inst_desde").val() !== "" && $("#tx_fech_inst_hasta").val() !== "") {
                if (fn_fecha($("#tx_fech_inst_desde").val(), $("#tx_fech_inst_hasta").val()) === false) {
                    fn_mensaje_boostrap("FAVOR VALIDAR EL RANGO DE TIEMPO INGRESADO", g_tit, $("#tx_fech_inst_desde"));
                    return;
                }
            }

            if ($("#tx_vida_util_desde").val() !== "") {
                if (fn_validar_fecha($("#tx_vida_util_desde").val()) === false) {
                    fn_mensaje_boostrap("FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY", g_tit, $("#tx_vida_util_desde"));
                    return;
                }
            }

            if ($("#tx_vida_util_hasta").val() !== "") {
                if (fn_validar_fecha($("#tx_vida_util_hasta").val()) === false) {
                    fn_mensaje_boostrap("FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY", g_tit, $("#tx_vida_util_hasta"));
                    return;
                }
            }

            if ($("#tx_vida_util_desde").val() !== "" && $("#tx_vida_util_hasta").val() !== "") {
                if (fn_fecha($("#tx_vida_util_desde").val(), $("#tx_vida_util_hasta").val()) === false) {
                    fn_mensaje_boostrap("FAVOR VALIDAR EL RANGO DE TIEMPO INGRESADO", g_tit, $("#tx_vida_util_desde"));
                    return;
                }
            }

            if ($("#tx_uso_desde").val() !== "" || $("#tx_uso_hasta").val() !== "") {
                if ($("#tx_uso_desde").val() > $("#tx_uso_hasta").val()) {
                    fn_mensaje_boostrap("FAVOR VALIDAR EL RANGO DE TIEMPO INGRESADO", g_tit, $("#tx_vida_util_desde"));
                    return;
                }
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_consultar"));
            $(window).scrollTop(0);
        }
    });

    $("#co_limpiar").on("click", function () {
        fn_limpiar(1);
    });

    $("#co_limpiar_2").on("click", function () {
        fn_limpiar(2);
    });

    $("#co_cancel").on("click", function (){
        $("#div_prin").show();
        $("#div_second").hide();
    });

    $("#co_cancelar_2").on("click", function (){
        $('#div_gen_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function () {
        window.close();
    });

    $("#co_volver").on( "click", function () {
        $("#div_second").hide();
        $("#div_prin").show();
    });

    $("#tx_uso_desde").blur(function () {
        if ($("#tx_uso_desde").val() >= 2200) {
            $("#tx_uso_desde").val("2200");
        }

        if ($("#tx_uso_desde").val() < 1800) {
            $("#tx_uso_desde").val("1800");
        }
    });

    $("#tx_uso_hasta").blur(function () {
        if ($("#tx_uso_hasta").val() >= 2200) {
            $("#tx_uso_hasta").val("2200");
        }

        if ($("#tx_uso_hasta").val() < 1800) {
            $("#tx_uso_hasta").val("1800");
        }
    });

    $("#tx_time_fabrica").blur(function () {
        if ($("#tx_time_fabrica").val() >= 2200) {
            $("#tx_time_fabrica").val("2200");
        }

        if ($("#tx_time_fabrica").val() < 1800) {
            $("#tx_time_fabrica").val("1800");
        }
    });

    $grid_secundaria.pqGrid({
        refresh: function (event, ui) {

            if (unCheck) {

                this.Checkbox('checkBox').unCheckAll();
                unCheck = false;
                $grid_secundaria.pqGrid("refreshView");

            }
        }
    });

    $grid_secundaria.pqGrid({
        check: function( event, ui ) {

            if (ui.check) {
                rowIndx.push(ui.rowIndx);

            } else {

                if (rowIndx.includes(ui.rowIndx)) {
                    var pos = rowIndx.indexOf(ui.rowIndx);
                    rowIndx.splice(pos, 1);
                }

                if (!this.Checkbox('checkBox').isHeadChecked()) {
                    rowIndx = []
                }

            }
        }
    });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->

function fn_set_grids() {

    // GRID LOCALIDADES

    var data =  [
        { C1: '096', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '102', C2: 'TEXTO DE EJEMPLO' },
        { C1: '112', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '127', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '132', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '133', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '134', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
    ];

    var obj = {
        height: 110,
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
        { title: "Código", width: 150, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 302, dataType: "strig", dataIndx: "C2", halign: "center", align: "center", editable: false },
    ];

    obj.dataModel = { data: data };

    $grid_localidades = $("#div_grid_localidades").pqGrid(obj);

    // GRID TARIFAS

    var data2 =  [
        { C1: '096', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '102', C2: 'TEXTO DE EJEMPLO' },
        { C1: '112', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '127', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '132', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '133', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '134', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
    ];

    var obj2 = {
        height: 110,
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
        toolbar: false,
    };

    obj2.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: true,
                header: true,
            }
        },
        { title: "Código", width: 150, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 302, dataType: "strig", dataIndx: "C2", halign: "center", align: "center", editable: false },
    ];

    obj2.dataModel = { data: data2 };

    $grid_tarifas = $("#div_grid_tarifas").pqGrid(obj2);

    // GRID ACTIVIDAD ECONOMICA

    var data3 =  [
        { C1: '096', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '102', C2: 'TEXTO DE EJEMPLO' },
        { C1: '112', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '127', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '132', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '133', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '134', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
    ];

    var obj3 = {
        height: 110,
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
        toolbar: false,
    };

    obj3.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: true,
                header: true,
            }
        },
        { title: "Código", width: 150, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 302, dataType: "strig", dataIndx: "C2", halign: "center", align: "center", editable: false },
    ];

    obj3.dataModel = { data: data3 };

    $grid_act_eco = $("#div_grid_act_eco").pqGrid(obj3);

    // GRID MARCAS

    var data4 =  [
        { C1: '096', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '102', C2: 'TEXTO DE EJEMPLO' },
        { C1: '112', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '127', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '132', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '133', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '134', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
    ];

    var obj4 = {
        height: 110,
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
        toolbar: false,
    };

    obj4.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: true,
                header: true,
            }
        },
        { title: "Código", width: 150, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 302, dataType: "strig", dataIndx: "C2", halign: "center", align: "center", editable: false },
    ];

    obj4.dataModel = { data: data4 };

    $grid_marcas = $("#div_grid_marcas").pqGrid(obj4);

    // GRID MODELOS

    var data5 =  [
        { C1: '096', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '102', C2: 'TEXTO DE EJEMPLO' },
        { C1: '112', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '127', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '132', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '133', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '134', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
    ];

    var obj5 = {
        height: 110,
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
        toolbar: false,
    };

    obj5.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: true,
                header: true,
            }
        },
        { title: "Código", width: 150, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 302, dataType: "strig", dataIndx: "C2", halign: "center", align: "center", editable: false },
    ];

    obj5.dataModel = { data: data5 };

    $grid_modelos = $("#div_grid_modelos").pqGrid(obj5);

    // GRID ACTIVIDAD ECONOMICA

    var data6 =  [
        { C1: '096', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '102', C2: 'TEXTO DE EJEMPLO' },
        { C1: '112', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '098', C2: 'TEXTO DE EJEMPLO' },
        { C1: '127', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '132', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '133', C2: 'TEXTO DE EJEMPLO' },
        { C1: '099', C2: 'TEXTO DE EJEMPLO' },
        { C1: '129', C2: 'TEXTO DE EJEMPLO' },
        { C1: '134', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
        { C1: '125', C2: 'TEXTO DE EJEMPLO' },
        { C1: '128', C2: 'TEXTO DE EJEMPLO' },
    ];

    var obj6 = {
        height: 110,
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
        toolbar: false,
    };

    obj6.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: true,
                header: true,
            }
        },
        { title: "Código", width: 150, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 302, dataType: "strig", dataIndx: "C2", halign: "center", align: "center", editable: false },
    ];

    obj6.dataModel = { data: data6 };

    $grid_diametros = $("#div_grid_diametros").pqGrid(obj6);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Modales -->

//                                  <-- Combos -->

function fn_regional(){

    $("#cb_regional").html("<option value='' selected></option><option value='1'>PANAMÁ METRO</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_tecnologia(){

    $("#cb_tecnologia").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_clase_metro(){

    $("#cb_clase_metro").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_propiedad(){

    $("#cb_propiedad").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_sect_inicial(){

    $("#cb_sect_inicial").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_sect_final(){

    $("#cb_sect_final").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

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

function fn_fecha(valor, valor2) {

    var fecha = valor.split("/");
    fecha.reverse();
    Date.parse(fecha);

    var fecha2 = valor2.split("/");
    fecha2.reverse();
    Date.parse(fecha2);

    if (fecha <= fecha2) {
        return true;
    } else {
        return false;
    }


}

function fn_limpiar(type) {


}

function fn_mensaje(id, mensaje, segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function () {$(id).html("");$(id).hide() }, segundos);
}


