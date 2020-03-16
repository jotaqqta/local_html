var g_modulo = "Medidores y Equipos";
var g_tit = "Mantención de Tablas de Parametros Generales de Medidores";
var $grid_principal;
var $grid_codigo;

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

    fn_set_grid_principal();

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

    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $("#div_event_corte").show();
    $("#co_inactivar").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#tab_motiv_camb").on( "click", function () {

        $("#tab_motiv_camb").tab('show');

    });

    $("#tab_situa_encon").on( "click", function () {

        $("#tab_situa_encon").tab('show');

    });

    $("#tab_acc_real").on( "click", function () {

        $("#tab_acc_real").tab('show');

    });

    $("#tab_relacion").on( "click", function () {

        $("#tab_relacion").tab('show');

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

            if ($("#cb_estado").val() === "") {
                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona un estado.</strong></div>',3000);
                $("#cb_estado").focus();
                return;
            }

            if (!$('input[type=radio][name=opt_arch_palm]').is(":checked")) {
                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indique si cuenta con Archivos Palm (Si o No).</strong></div>',3000);
                $("#opt_arch_palm_si").focus();
                return;
            }

            fn_mensaje_boostrap("Se Modifico", g_tit, $("#co_modificar"));
            $('#div_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });

    $("#co_cancel_edit").on("click", function () {
        $('#div_edit_bts').modal('hide');
    });

    $("#co_confirm_yes").on( "click", function () {
        $('#dlg_confirm').modal('hide');

        if ($("div_event_situa_acc").is(":visible")) {
            fn_inactivar(true);
        } else {
            fn_eliminar(true);
        }
    });

    $("#co_confirm_no").on( "click", function () {
        $('#dlg_confirm').modal('hide');

        if ($("div_event_situa_acc").is(":visible")) {
            fn_inactivar(false);
        } else {
            fn_eliminar(false);
        }
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;


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

                $("#div_edit_bts").modal({backdrop: "static",keyboard:false});
                $("#div_edit_bts").on("shown.bs.modal", function () {
                    $("#div_edit_bts div.modal-footer button").focus();

                });

            }
        }
    });

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

    $("#co_excel").on("click", function (e) {

        fn_filtro();
        e.preventDefault();
        var col_model=$( "#div_grid_principal" ).pqGrid( "option", "colModel" );
        var cabecera = "";
        for (i = 0; i < col_model.length; i++){
            if(col_model[i].hidden !== true) cabecera += "<th>"+col_model[i].title+ "</th>";
        }
        $("#excel_cabecera").val(cabecera);
        var element =$grid_principal.pqGrid("option","dataModel.data");
        if (element)
            a= element.length;
        else
            a = 0;
        if(a > 0){
            $("#tituloexcel").val(g_tit);
            $("#sql").val(sql_grid_prim);
            $("#frm_Exel").submit();
            return;
        }
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->


function fn_set_grid_principal() {

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
        showBottom: false,
        collapsible: true,
        roundCorners: true,
        columnBorders: true,
        numberCell: {show: false},
        scrollModel: {theme: true},
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 50, type: "local", rPPOptions: [50, 100, 200]},
        toolbar: {
            cls: "pq-toolbar-export btn-group-sm",
            items:[
                { type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"}
            ]
        },
    };

    obj.colModel = [
        { title: "Código", width: 65, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 295, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", filter: { crules: [{ condition: 'contain' }] } },
        { title: "Archivo Paml", width: 100, dataType: "strig", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Acción", width: 232, dataType: "strig", dataIndx: "C4", halign: "center", align: "left" },
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

    $grid_principal = $("#div_grid_motiv_camb").pqGrid(obj);
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

function fn_cargar_combos() {

    fn_estado();
    fn_acc_rea();

}

function fn_confirmar(type) {

    if (type === 1) {
        $("#msg_confirm").html("¿Estas seguro de eliminar este Registro?")
    } else if (type === 2) {
        $("#msg_confirm").html("¿Estas seguro de inactivar este Registro?")
    } else {
        $("#msg_confirm").html("No se encontro el mensaje solicitado.")
    }

    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
    $("#dlg_confirm").on("shown.bs.modal", function () {
        $("#dlg_confirm div.modal-footer button").focus();
    });
}

function fn_eliminar(confirm) {

    // Acion de borrar
    if (confirm) {

        // TAB 1
        if ($("#div_event_corte").is(":visible")) {

            fn_mensaje_boostrap("Se ha eliminado el registro", g_tit, $("#co_eliminar"));


        }

        // TAB 2
        if ($("#div_situa_encon").is(":visible")) {

            fn_mensaje_boostrap("Se ha eliminado el registro", g_tit, $("#co_eliminar"));


        }

        // TAB 3
        if ($("#div_acc_real").is(":visible")) {

            fn_mensaje_boostrap("Se ha eliminado el registro", g_tit, $("#co_eliminar"));


        }

    }
}

function fn_inactivar(confirm) {

    if (confirm) {

        fn_mensaje_boostrap("Se ha inactivado el registro", g_tit, $("#co_inactivar"));

    }

}

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

