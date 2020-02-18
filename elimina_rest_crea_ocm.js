var g_modulo = "Corte y Reposición";
var g_tit = "Eliminación de restricciones y creación de OCM";
var $grid_principal;
var $grid_secundaria;
var sql_grid_prim = "";
var sql_grid_second = "";
var my_url = "elimina_rest_crea_ocm";
var parameters = {};
var unCheck;
var edit = false;
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

    $(".number").inputmask("integer");

    // COMBOS

    fn_regional();
    fn_motiv_rest();
    fn_marca_medidor();
    fn_modelo();
    fn_rango_inicial();
    fn_rango_final();
    fn_fech_desde();
    fn_fech_hasta();
    fn_fech_int_desde();
    fn_fech_int_hasta();
    fn_motiv_cambio();

    fn_set_grid_principal();
    fn_set_grid_second();


    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    // BUTTONS ICONS

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_generar").html("<span class='glyphicon glyphicon-ok'></span> Generar");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $("#div_second").hide();

    //$(".sin_conv").hide();
    $("#title_mod_new").html(g_tit);

    fn_limpiar();


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_consultar").on( "click", function () {

        if ($.trim($("#co_consultar").text()) === "Consultar") {

            if ($("#cb_regional").val() === "") {
                fn_mensaje_boostrap("FAVOR SELECCIONE UNA REGIONAL", g_tit, $("#cb_regional"));
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_consultar"));
            $("#div_second").slideDown();
            $("#div_prin").slideUp();
            $("#div_second").hide();
            $("#div_prin").show();
            $(window).scrollTop(0);
        }
    });

    $("#co_generar_2").on("click", function () {

        if ($.trim($("#co_generar_2").text()) === "Generar") {

            if ($("#cb_motiv_cambio").val() === "") {
                fn_mensaje('#mensaje_gen', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONE UN MOTIVO DE CAMBIO!!!</strong></div>', 3000);
                $("#cb_motiv_cambio").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar_2"));
            $("#div_prin").slideDown();
            $("#div_gen_bts").slideUp();
            $('#div_gen_bts').modal('hide');
            $(window).scrollTop(0);
        }
    });

    $('input[type=checkbox][name=chk_int_creacion_ocm]').click(function(){
        if($(this).is(":checked")){
            $("#cb_fech_int_desde").prop( "disabled", false );
            $("#cb_fech_int_desde").focus();
            $("#cb_fech_int_hasta").prop( "disabled", false );
        }

        if (!$(this).is(":checked")){
            $("#cb_fech_int_desde").prop( "disabled", true );
            $("#cb_fech_int_hasta").prop( "disabled", true );
        }
    });

    $('input[type=checkbox][name=chk_localidades]').click(function(){
        if($(this).is(":checked")){
            edit = true;
            $grid_secundaria.pqGrid("refreshView");
        }

        if (!$(this).is(":checked")){
            edit = false;
            $grid_secundaria.pqGrid("refreshView");
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

    $("#co_filtro").on("click", function () {

        $("#div_second").slideUp();
        $("#div_prin").slideDown();
        $("#div_second").show();
        $("#div_prin").hide();
    });

    $("#co_generar").on("click", function () {
        $("#div_gen_bts").modal({backdrop: "static",keyboard:false});
        $("#div_gen_bts").on("shown.bs.modal", function () {
            $("#div_gen_bts div.modal-footer button").focus();
        });
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

    $grid_secundaria.pqGrid({
        refresh: function (event, ui) {

            if (unCheck) {

                this.Checkbox('checkBox').unCheckAll();
                unCheck = false;
                edit = false;
                $grid_secundaria.pqGrid("refreshView");

            }
        }
    });

    $grid_secundaria.pqGrid({
        check: function( event, ui ) {

            if (ui.check) {
                rowIndx2.push(ui.rowIndx);

            } else {

                if (rowIndx2.includes(ui.rowIndx)) {
                    var pos = rowIndx2.indexOf(ui.rowIndx);
                    rowIndx2.splice(pos, 1);
                }

                if (!this.Checkbox('checkBox').isHeadChecked()) {
                    rowIndx2 = []
                }

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
        toolbar: {
            cls: "pq-toolbar-export btn-group-sm",
            items: [
                {type: "button", label: "Excel", attr: "id=co_filtro", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Excel", attr: "id=co_generar", cls: "btn btn-primary btn-sm"},
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
                { C1: '35', C2: 'PLANTILLA CICLO 35/8000' },
                { C1: '35', C2: 'PLANTILLA CICLO 35/8000' },
                { C1: '35', C2: 'PLANTILLA CICLO 35/8000' },
            ]},
    };

    obj.colModel = [
        { title: "Número Cliente", width: 120, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Fecha Creación Restricción", width: 190, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "Fecha Inicio Vigencia", width: 150, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Fecha Termino Vigencia", width: 170, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Motivo", width: 90, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Tiene Intento", width: 100, dataType: "string", dataIndx: "C6", halign: "center", align: "center" },
        { title: "Fecha ultimo Intento", width: 150, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },
        { title: "Usuario Creación", width: 120, dataType: "string", dataIndx: "C8", halign: "center", align: "center" },
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
        height: 200,
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
        selectionModel: {type: 'all', mode: 'block'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200, 500]},
        toolbar: false,
    };

    obj.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: function () {
                return edit;
            },
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: true,
                header: true,
                select: true
            }
        },
        { title: "Código", width: 522, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 522, dataType: "strig", dataIndx: "C2", halign: "center", align: "center", editable: false },
    ];

    obj.dataModel = { data: data };

    $grid_secundaria = $("#div_grid_second").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Modales -->

//                                  <-- Combos -->

function fn_regional(){

    $("#cb_regional").html("<option value='' selected></option><option value='1'>PANAMÁ METRO</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_motiv_rest(){

    $("#cb_motiv_rest").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_marca_medidor(){

    $("#cb_marca_medidor").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_modelo(){

    $("#cb_modelo").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_rango_inicial(){

    $("#cb_rango_inicial").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_rango_final(){

    $("#cb_rango_final").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_fech_desde(){

    $("#cb_fech_desde").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_fech_hasta(){

    $("#cb_fech_hasta").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_fech_int_desde(){

    $("#cb_fech_int_desde").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_fech_int_hasta(){

    $("#cb_fech_int_hasta").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_motiv_cambio(){

    $("#cb_motiv_cambio").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_limpiar(type) {

    if (type === undefined) {
        $("#cb_regional").val("");
        $("#cb_motiv_rest").val("");
        $("#tx_num_client").val("");
        $("#tx_num_medidor").val("");
        $("#cb_marca_medidor").val("");
        $("#cb_modelo").val("");
        $("#cb_rango_inicial").val("");
        $("#cb_rango_final").val("");
        $("#cb_fech_desde").val("");
        $("#cb_fech_hasta").val("");
        $("#chk_int_creacion_ocm").prop("checked", false);
        $("#chk_localidades").prop("checked", false);
        $("#cb_fech_int_desde").val("");
        $("#cb_fech_int_hasta").val("");

        edit = false;

        $grid_secundaria.pqGrid("refreshView");

        $("#cb_fech_int_desde").prop( "disabled", true );
        $("#cb_fech_int_hasta").prop( "disabled", true );
    }

    if (type === 1) {
        $("#cb_regional").val("");
        $("#cb_motiv_rest").val("");
        $("#tx_num_client").val("");
        $("#tx_num_medidor").val("");
        $("#cb_marca_medidor").val("");
        $("#cb_modelo").val("");
        $("#cb_rango_inicial").val("");
        $("#cb_rango_final").val("");
        $("#cb_fech_desde").val("");
        $("#cb_fech_hasta").val("");
        $("#chk_int_creacion_ocm").prop("checked", false);
        $("#chk_localidades").prop("checked", false);
        $("#cb_fech_int_desde").val("");
        $("#cb_fech_int_hasta").val("");

        unCheck = true;

        $grid_secundaria.pqGrid("refreshView");

        $("#cb_fech_int_desde").prop( "disabled", true );
        $("#cb_fech_int_hasta").prop( "disabled", true );
    }

    if (type === 2) {
        $("#cb_motiv_cambio").val("");
        $("#chk_clientes").prop("checked", false);

    }

}

function fn_mensaje(id, mensaje, segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function () {$(id).html("");$(id).hide() }, segundos);
}


