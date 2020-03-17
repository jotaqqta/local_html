var g_modulo = "Medidores y Equipos";
var g_tit = "Mantención de Tablas de Parametros Generales de Medidores";
var $grid_motiv_camb;
var $grid_situa_encon;
var $grid_acc_rea;
var rowIndxG;

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

    //COMBOS

    fn_cargar_combos();

    fn_set_grid_motiv_camb();
    fn_set_grid_situa_econ();
    fn_set_grid_acc_rea();

    // PARA ELIMINAR EL SUBMIT
    $("button").on("click", function () {
        return false;
    });
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

    fn_hide();
    $("#div_motiv_camb").show();
    $("#row_radios_situa").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $(".nav-tabs a").click(function(){

        $(this).tab('show');
        fn_hide();

        if (this.text === "Motivo Cambio") {
            $("#div_motiv_camb").show();
            $grid_motiv_camb.pqGrid("refreshView");
        }

        if (this.text === "Situación Encontrada") {
            $("#div_situa_encon").show();
            $grid_situa_encon.pqGrid("refreshView");
        }

        if (this.text === "Acción Realizada") {
            $("#div_acc_rea").show();
            $grid_acc_rea.pqGrid("refreshView");
        }

        if (this.text === "Relación") {
            $("#div_relacion").show();
        }

    });

    $("#co_modificar").on( "click", function () {

        if ($.trim($("#co_modificar").text()) === "Modificar") {

            if ($("#tx_desc").val() === "") {
                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indica una descripción.</strong></div>',3000);
                $("#tx_desc").focus();
                return;
            }

            if ($("#cb_estado").val() === "") {
                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona un estado.</strong></div>',3000);
                $("#cb_estado").focus();
                return;
            }

            if ($("#cb_acc_rea").val() === "") {
                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona una acción.</strong></div>',3000);
                $("#cb_acc_rea").focus();
                return;
            }

            if ($("#div_motiv_camb").is(":visible")) {
                if (!$('input[type=radio][name=opt_arch_palm]').is(":checked")) {
                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indique si cuenta con Archivos Palm (Si o No).</strong></div>',3000);
                    $("#opt_arch_palm_si").focus();
                    return;
                }
            }

            if ($("#div_situa_encon").is(":visible")) {
                if (!$('input[type=radio][name=opt_genera_carta]').is(":checked")) {
                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indique si Genera Cartera (Si o No).</strong></div>',3000);
                    $("#opt_genera_carta_si").focus();
                    return;
                }

                if (!$('input[type=radio][name=opt_camb_correct]').is(":checked")) {
                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indique si cuenta con Cambio Correctivo (Si o No).</strong></div>',3000);
                    $("#opt_camb_correct_si").focus();
                    return;
                }
            }

            if ($("#div_acc_rea").is(":visible")) {

                if (!$('input[type=radio][name=opt_indq_ord_improc]').is(":checked")) {
                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indique si Indica orden Inprocedente (Si o No).</strong></div>',3000);
                    $("#opt_indq_ord_improc_si").focus();
                    return;
                }
            }

            fn_mensaje_boostrap("Se Modifico", g_tit, $("#co_modificar"));
            $('#div_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });

    $("#co_limpiar").on("click", fn_limpiar);

    $("#co_cancel").on("click", function () {
        $('#div_edit_bts').modal('hide');
    });

    $("#co_confirm_yes").on( "click", function () {

        if ($("#div_motiv_camb").is(":visible")) {
            $grid_motiv_camb.pqGrid("deleteRow", { rowIndx: rowIndxG });
        }

        if ($("#div_situa_encon").is(":visible")) {
            $grid_situa_encon.pqGrid("deleteRow", { rowIndx: rowIndxG });
        }

        if ($("#div_acc_rea").is(":visible")) {
            $grid_acc_rea.pqGrid("deleteRow", { rowIndx: rowIndxG });
        }

        /*HablaServidor(my_url, parameters, 'text', function() {
            fn_mensaje("EL MOVIMIENTO FUE ELIMINADO", g_titulo, $(""));
        });*/

        $('#dlg_confirm').modal('hide');

    });

    $("#co_confirm_no").on( "click", function () {

        $('#dlg_confirm').modal('hide');

    });

    $("#co_cerrar").on("click", function (){ window.close(); });

    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_motiv_camb.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;

                fn_edit(dataCell, 1);
            }
        }
    });

    $grid_situa_encon.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;

                fn_edit(dataCell, 2);
            }
        }
    });

    $grid_acc_rea.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;

                fn_edit(dataCell, 3);
            }
        }
    });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    /*$("#co_excel").on("click", function (e) {

        var col_model;
        var element;
        var cabecera = "";

        if ($("#div_motiv_camb").is(":visible")) {
            e.preventDefault();
            col_model= $( "#div_motiv_camb" ).pqGrid( "option", "colModel" );

            for (i = 0; i < col_model.length; i++){
                if(col_model[i].hidden !== true) cabecera += "<th>"+col_model[i].title+ "</th>";
            }

            $("#excel_cabecera").val(cabecera);
            element =$grid_motiv_camb.pqGrid("option","dataModel.data");

            if (element)
                a = element.length;
            else
                a = 0;
            if(a > 0){
                $("#tituloexcel").val(g_tit);
                $("#sql").val(sql_grid_prim);
                $("#frm_Exel").submit();
                return;
            }
        }

        if ($("#div_situa_encon").is(":visible")) {
            e.preventDefault();
            col_model= $( "#div_situa_encon" ).pqGrid( "option", "colModel" );
            for (i = 0; i < col_model.length; i++){
                if(col_model[i].hidden !== true) cabecera += "<th>"+col_model[i].title+ "</th>";
            }
            $("#excel_cabecera").val(cabecera);
            element =$grid_situa_encon.pqGrid("option","dataModel.data");
            if (element)
                a = element.length;
            else
                a = 0;
            if(a > 0){
                $("#tituloexcel").val(g_tit);
                $("#sql").val(sql_grid_prim);
                $("#frm_Exel").submit();
                return;
            }
        }

    });*/

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->

function fn_set_grid_motiv_camb() {

    // GRID MOTIVO CAMBIO

    var data =  [
        { C1: 'RKK', C2: 'R-PRUEBA DE MEDIDOR', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2006', C6: '1/06/2019', C7: 'ACTIVO' },
        { C1: 'RKA', C2: 'R-MEDIDOR EN MAL ESTADO', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2008', C6: '1/06/2019', C7: 'INACTIVO' },
        { C1: 'IA1', C2: 'I-SOLICITUD CLIENTE', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2008', C6: '1/06/2019', C7: 'ACTIVO' },
        { C1: 'IA2', C2: 'I-SOLICITUD FACTURACIÓN', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2008', C6: '1/06/2019', C7: 'INACTIVO' },
        { C1: 'IA3', C2: 'I-SOLICITUD IDAAN', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'ACTIVO' },
        { C1: 'IA4', C2: 'I-SIN MOTIVO', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'INACTIVO' },
        { C1: 'IA5', C2: 'I-INSTALACIÓN MASIVA', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'ACTIVO' },
        { C1: 'IA6', C2: 'I-SOLICITUD GTE - MEDIDORES', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'INACTIVO' },
        { C1: 'R3', C2: 'R-MEDIDOR DIFICIL ACCESO', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'ACTIVO' },
        { C1: 'C9', C2: 'C-MEDIDOR DIFICIL ACCESO', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'ACTIVO' },
        { C1: 'C4', C2: 'C-VARIACIÓN DE CONSUMO', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'ACTIVO' },
        { C1: 'C8', C2: 'C-CAMBIO MASIVO', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'ACTIVO' },
        { C1: 'CJ', C2: 'C-MEDIDOR EN MAL ESTADO', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'ACTIVO' },
        { C1: 'CT', C2: 'C-MEDIDOR MANIPULADO', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'ACTIVO' },
        { C1: 'CV', C2: 'C-PRUEBA DE MEDIDOR', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'ACTIVO' },
        { C1: 'C2', C2: 'C-MEDIDOR PARADO', C3: 'P', C4: 'MEDIDOR NORMALIZADO', C5: '19/07/2004', C6: '1/06/2019', C7: 'ACTIVO' },
    ];

    var obj = {
        height: "100%",
        showtop: true,
        filterModel: {
            on: true,
            mode: "AND",
            header: true,
        },
        editable: false,
        rowBorders: true,
        showTitle: false,
        showBottom: true,
        collapsible: true,
        roundCorners: true,
        columnBorders: true,
        postRenderInterval: 0,
        numberCell: { show: true },
        scrollModel: { theme: true },
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200]},
        toolbar: false,
    };

    obj.colModel = [
        { title: "Código", width: 65, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 287, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", filter: { crules: [{ condition: 'contain' }] } },
        { title: "Archivo Paml", width: 100, dataType: "strig", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Acción", width: 240, dataType: "strig", dataIndx: "C4", halign: "center", align: "left" },
        { title: "Fecha Creación", width: 115, dataType: "strig", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Fecha Modificación", width: 135, dataType: "strig", dataIndx: "C6", halign: "center", align: "center" },
        { title: "Estado", width: 75, dataType: "strig", dataIndx: "C7", halign: "center", align: "center" },
        { title: "Eliminar", width: 58, dataType: "string", halign: "center", align: "center", editable: false, sortable: false,
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

    $grid_motiv_camb = $("#div_grid_motiv_camb").pqGrid(obj);
}

function fn_set_grid_situa_econ() {

    // GRID SITUACIÓN ENCONTRADA

    var data =  [
        { C1: 'AI', C2: 'ARRANQUE INTERVENIDO', C3: 'NO', C4: 'NO', C5: 'PENDIENTE O REENVIADA', C6: '22/07/2006', C7: '', C8: 'ACTIVO' },
        { C1: 'AI', C2: 'AJUSTE DATOS (INSTALACIÓN)', C3: 'SI', C4: 'SI', C5: 'PENDIENTE O REENVIADA', C6: '22/07/2006', C7: '', C8: 'INACTIVO' },
    ];

    var obj = {
        height: "100%",
        showtop: true,
        filterModel: {
            on: true,
            mode: "AND",
            header: true,
        },
        editable: false,
        rowBorders: true,
        showTitle: false,
        showBottom: true,
        collapsible: true,
        roundCorners: true,
        columnBorders: true,
        postRenderInterval: 0,
        numberCell: { show: true },
        scrollModel: { theme: true },
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200]},
        toolbar: false,
    };

    obj.colModel = [
        { title: "Código", width: 55, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 260, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", filter: { crules: [{ condition: 'contain' }] } },
        { title: "Genera Carta", width: 95, dataType: "strig", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Correctivo", width: 75, dataType: "strig", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Acción", width: 217, dataType: "strig", dataIndx: "C5", halign: "center", align: "left" },
        { title: "Fecha Creación", width: 110, dataType: "strig", dataIndx: "C6", halign: "center", align: "center" },
        { title: "Fecha Modificación", width: 130, dataType: "strig", dataIndx: "C7", halign: "center", align: "center" },
        { title: "Estado", width: 75, dataType: "strig", dataIndx: "C8", halign: "center", align: "center" },
        { title: "Eliminar", width: 58, dataType: "string", halign: "center", align: "center", editable: false, sortable: false,
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

    $grid_situa_encon = $("#div_grid_situa_encon").pqGrid(obj);
}

function fn_set_grid_acc_rea() {

    // GRID ACCIÓN  REALIZADA

    var data =  [
        { C1: 'IM', C2: 'INSTALACIÓN DE MEDIDOR', C3: 'NO', C4: '', C5: '28/07/2008', C6: '22/07/2012', C7: 'ACTIVO' },
        { C1: 'CM', C2: 'CAMBIO DE MEDIDOR', C3: 'SI', C4: '', C5: '25/10/2007', C6: '12/04/2014', C7: 'INACTIVO' },
        { C1: 'CN', C2: 'OCM NO EJECUTADA (IMPRCEDENTE)', C3: 'SI', C4: '', C5: '24/12/2009', C6: '02/12/2015', C7: 'ACTIVO' },
        { C1: 'MA', C2: 'MEDIDOR NORMALIZADO', C3: 'NO', C4: '', C5: '12/11/2009', C6: '02/02/2018', C7: 'ACTIVO' },
        { C1: 'RM', C2: 'RETIRO DE MEDIDOR', C3: 'NO', C4: '', C5: '18/02/2009', C6: '02/02/2018', C7: 'INACTIVO' },
    ];

    var obj = {
        height: "100%",
        showtop: true,
        filterModel: {
            on: true,
            mode: "AND",
            header: true,
        },
        editable: false,
        rowBorders: true,
        showTitle: false,
        showBottom: true,
        collapsible: true,
        roundCorners: true,
        columnBorders: true,
        postRenderInterval: 0,
        numberCell: { show: true },
        scrollModel: { theme: true },
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200]},
        toolbar: false,
    };

    obj.colModel = [
        { title: "Código", width: 65, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 260, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", filter: { crules: [{ condition: 'contain' }] } },
        { title: "Improcedente", width: 100, dataType: "strig", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Acción", width: 260, dataType: "strig", dataIndx: "C4", halign: "center", align: "left" },
        { title: "Fecha Creación", width: 120, dataType: "strig", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Fecha Modificación", width: 140, dataType: "strig", dataIndx: "C6", halign: "center", align: "center" },
        { title: "Estado", width: 72, dataType: "strig", dataIndx: "C7", halign: "center", align: "center" },
        { title: "Eliminar", width: 58, dataType: "string", halign: "center", align: "center", editable: false, sortable: false,
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

    $grid_acc_rea = $("#div_grid_acc_rea").pqGrid(obj);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

//                                  <-- Combos -->

//                         <-- TAB 1 (Motivo Cambio - Modal) -->

function fn_estado() {

    $("#cb_estado").html("<option value='' selected></option>  <option value='1'>ACTIVO</option> <option value='2'>INACTIVO</option>  <option value='3'>OPCION 03</option>")
}

function fn_acc_rea() {

    $("#cb_acc_rea").html("<option value='' selected></option>  <option value='1'>MEDIDOR NORMALIZADO</option> <option value='2'>OPCIÓN 02</option>  <option value='3'>OPCION 03</option>")
}

//                       <-- TAB 2 (Situación encontrada) -->

//                        <-- TAB 3 (Acciones Realizadas) -->

//                             <-- TAB 4 (Relación) -->

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_edit(dataCell, grid) {

    if (grid === 1) {

        $("#row1_pt_ii").html("");
        $("#row2_pt_i").html("<div class=\"row\"> <div class=\"col-xs-4\"> <label for=\"tx_desc\">Descripción:</label> </div> <div class=\"col-xs-8\"> <input id=\"tx_desc\" class=\"form-control\"> </div> </div>");
        $("#row2_pt_ii").html("<div class=\"row\"> <div class=\"col-xs-5\"> <label for=\"cb_estado\">Estado:</label> </div> <div class=\"col-xs-7\"> <select class=\"form-control\" id=\"cb_estado\" name=\"cb_estado\"> </select> </div> </div>");
        $("#row3_pt_i").html("<div class=\"row\"> <div class=\"col-xs-4\"> <div class=\"row\"> <div class=\"col-xs-12\"> <label>Archivos Palm:</label> </div> </div> </div> <div class=\"col-xs-6\"> <div class=\"row\"> <div class=\"col-xs-4\"><span class=\"radio-inline\"><input class=\"radio-inline\" type=\"radio\" id=\"opt_arch_palm_si\" name=\"opt_arch_palm\" value=\"opt_1\"><label for=\"opt_arch_palm_si\">Si</label></span> </div> <div class=\"col-xs-4\"> <span class=\"radio-inline\"><input class=\"radio-inline\" type=\"radio\" id=\"opt_arch_palm_no\" name=\"opt_arch_palm\" value=\"opt_2\"><label for=\"opt_arch_palm_no\">No</label></span> </div> </div> </div> </div>");
        $("#row3_pt_ii").html("<div class=\"row\"> <div class=\"col-xs-5\"> <label for=\"cb_acc_rea\">Acción a Realizar:</label> </div> <div class=\"col-xs-7\"> <select class=\"form-control\" id=\"cb_acc_rea\" name=\"cb_acc_rea\"></select> </div> </div>");

        $("#row3").show();
        $("#row_radios_situa").hide();

        fn_estado();
        fn_acc_rea();

        $("#tx_codigo").val(dataCell.C1);
        $("#tx_desc").val(dataCell.C2);
        $("#tx_fech_crea").val(dataCell.C5);
        $("#tx_fech_modif").val(dataCell.C6);

        $("#cb_estado option").each(function() {
            if ($(this).text() === dataCell.C7) {
                $("#cb_estado").val($(this).val());
            }
        });

        $("#cb_acc_rea option").each(function() {
            if ($(this).text() === dataCell.C4) {
                $("#cb_acc_rea").val($(this).val());
            }
        });
    }

    if (grid === 2) {

        $("#row1_pt_ii").html("<div class=\"row\"> <div class=\"col-xs-5\"> <label for=\"tx_desc\">Descripción:</label> </div> <div class=\"col-xs-7\"> <input id=\"tx_desc\" class=\"form-control\"> </div> </div>");
        $("#row2_pt_i").html("<div class=\"row\"> <div class=\"col-xs-4\"> <label for=\"cb_estado\">Estado:</label> </div> <div class=\"col-xs-8\"> <select class=\"form-control\" id=\"cb_estado\" name=\"cb_estado\"> </select> </div> </div>");
        $("#row2_pt_ii").html("<div class=\"row\"> <div class=\"col-xs-5\"> <label for=\"cb_acc_rea\">Acción:</label> </div> <div class=\"col-xs-7\"> <select class=\"form-control\" id=\"cb_acc_rea\" name=\"cb_acc_rea\"></select> </div> </div>");

        $("#row3").hide();
        $("#row_radios_situa").show();

        fn_estado();
        fn_acc_rea();

        $("#tx_codigo").val(dataCell.C1);
        $("#tx_desc").val(dataCell.C2);
        $("#tx_fech_crea").val(dataCell.C6);
        $("#tx_fech_modif").val(dataCell.C7);

        if (dataCell.C3 === "SI") {
            $('input[type=radio][name=opt_genera_carta][value=opt_1]').prop("checked", true);
        } else if (dataCell.C3 === "NO") {
            $('input[type=radio][name=opt_genera_carta][value=opt_2]').prop("checked", true);
        }

        if (dataCell.C4 === "SI") {
            $('input[type=radio][name=opt_camb_correct][value=opt_1]').prop("checked", true);
        } else if (dataCell.C4 === "NO") {
            $('input[type=radio][name=opt_camb_correct][value=opt_2]').prop("checked", true);
        }

        $("#cb_estado option").each(function() {
            if ($(this).text() === dataCell.C8) {
                $("#cb_estado").val($(this).val());
            }
        });

        $("#cb_acc_rea option").each(function() {
            if ($(this).text() === dataCell.C5) {
                $("#cb_acc_rea").val($(this).val());
            }
        });
    }

    if (grid === 3) {

        $("#row1_pt_ii").html("");
        $("#row2_pt_i").html("<div class=\"row\"> <div class=\"col-xs-4\"> <label for=\"tx_desc\">Descripción:</label> </div> <div class=\"col-xs-8\"> <input id=\"tx_desc\" class=\"form-control\"> </div> </div>");
        $("#row2_pt_ii").html("<div class=\"row\"> <div class=\"col-xs-5\"> <label for=\"cb_estado\">Estado:</label> </div> <div class=\"col-xs-7\"> <select class=\"form-control\" id=\"cb_estado\" name=\"cb_estado\"> </select> </div> </div>");
        $("#row3_pt_i").html("<div class=\"row\"> <div class=\"col-xs-6\"> <div class=\"row\"> <div class=\"col-xs-12\"> <label>Indica orden Improcedente:</label> </div> </div> </div> <div class=\"col-xs-6\"> <div class=\"row\"> <div class=\"col-xs-4\"><span class=\"radio-inline\"><input class=\"radio-inline\" type=\"radio\" id=\"opt_indq_ord_improc_si\" name=\"opt_indq_ord_improc\" value=\"opt_1\"><label for=\"opt_indq_ord_improc_si\">Si</label></span> </div> <div class=\"col-xs-4\"> <span class=\"radio-inline\"><input class=\"radio-inline\" type=\"radio\" id=\"opt_indq_ord_improc_no\" name=\"opt_indq_ord_improc\" value=\"opt_2\"><label for=\"opt_indq_ord_improc_no\">No</label></span> </div> </div> </div> </div>");
        $("#row3_pt_ii").html("<div class=\"row\"> <div class=\"col-xs-5\"> <label for=\"cb_acc_rea\">Acción:</label> </div> <div class=\"col-xs-7\"> <select class=\"form-control\" id=\"cb_acc_rea\" name=\"cb_acc_rea\"></select> </div> </div>");

        $("#row3").show();
        $("#row_radios_situa").hide();

        fn_estado();
        fn_acc_rea();

        $("#tx_codigo").val(dataCell.C1);
        $("#tx_desc").val(dataCell.C2);
        $("#tx_fech_crea").val(dataCell.C5);
        $("#tx_fech_modif").val(dataCell.C6);

        if (dataCell.C3 === "SI") {
            $('input[type=radio][name=opt_indq_ord_improc][value=opt_1]').prop("checked", true);
        } else if (dataCell.C3 === "NO") {
            $('input[type=radio][name=opt_indq_ord_improc][value=opt_2]').prop("checked", true);
        }

        $("#cb_estado option").each(function() {
            if ($(this).text() === dataCell.C7) {
                $("#cb_estado").val($(this).val());
            }
        });

        $("#cb_acc_rea option").each(function() {
            if ($(this).text() === dataCell.C4) {
                $("#cb_acc_rea").val($(this).val());
            }
        });

    }

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

function fn_cargar_combos() {

    fn_estado();
    fn_acc_rea();

}

function fn_hide() {

    $("#div_motiv_camb").hide();
    $("#div_situa_encon").hide();
    $("#div_acc_rea").hide();
    $("#div_relacion").hide();
}

function fn_limpiar() {

    $("#tx_desc").val("");
    $("#cb_estado").val("");
    $("#cb_acc_rea").val("");

    if ($("#div_motiv_camb").is(":visible")) {

        $('input[type=radio][name=opt_arch_palm]').prop("checked", false);
    }

    if ($("#div_situa_encon").is(":visible")) {

        $('input[type=radio][name=opt_genera_carta]').prop("checked", false);
        $('input[type=radio][name=opt_camb_correct]').prop("checked", false);
    }

    if ($("#div_acc_rea").is(":visible")) {

        $('input[type=radio][name=opt_indq_ord_improc]').prop("checked", false);
    }

}

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

