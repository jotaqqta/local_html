var g_modulo = "Órdenes Genéricas";
var g_tit = "Emisión de Órdenes Genéricas";
var $grid_principal;
var grid_principal;
var load = false;

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

    $(".number").inputmask("integer");

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

    fn_hide();
    $("#co_leer").show();
    $("#co_medidores").show();
    $("#co_direcc").show();
    $("#buzon_space").hide();
    $("#div_dat_client").show();
    fn_disable_enable(true);

    $("#co_buzon").prop("disabled", true);
    $("#cb_tipo_aten").prop("disabled", true);
    $("#cb_motiv_client").prop("disabled", true);
    $("#cb_motiv_empresa").prop("disabled", true);

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $(".nav-tabs a").click(function(){

        $(this).tab('show');
        fn_hide();

        if (this.text === "Datos Cliente") {
            $("#co_leer").show();
            $("#co_medidores").show();
            $("#co_direcc").show();
            $("#div_dat_client").show();
        }

        if (this.text === "Datos Órden Genérica") {
            $("#co_buzon").show();
            $("#div_dat_ord_gen").show();
        }

        if (this.text === "Observaciones") {
            $("#div_observaciones").show();
        }

    });

    $("#co_enviar").on("click", function () {

        if ($.trim($("#co_enviar").text() === "Enviar")) {

            if ($("#cb_prioridad").val() === "") {
                fn_mensaje_boostrap("Error, por favor selecciona una Prioridad.", g_tit, $("#cb_prioridad"));
                return;
            }

            if ($("#tx_ref").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica una Referencia.", g_tit, $("#tx_ref"));
                return;
            }

            if ($("#tx_nro_sumi").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica un Número de Suministro.", g_tit, $("#tx_nro_sumi"));
                return;
            }

            if ($("#cb_canal_entrada").val() === "") {
                fn_mensaje_boostrap("Error, por favor selecciona un Canal de Entrada.", g_tit, $("#cb_canal_entrada"));
                return;
            }

            if ($("#cb_tipo_aten").val() === "") {
                fn_mensaje_boostrap("Error, por favor selecciona un Tipo de Atención.", g_tit, $("#cb_tipo_aten"));
                return;
            }

            if ($("#cb_motiv_client").val() === "") {
                fn_mensaje_boostrap("Error, por favor selecciona un Motivo Cliente.", g_tit, $("#cb_motiv_client"));
                return;
            }

            if ($("#cb_motiv_empresa").val() === "") {
                fn_mensaje_boostrap("Error, por favor selecciona un Motivo Empresa.", g_tit, $("#cb_motiv_empresa"));
                return;
            }

            if ($("#chk_buzon").is(":checked")) {
                if (grid_principal === undefined) {
                    fn_mensaje_boostrap("Error, por favor selecciona un Buzón.", g_tit, $("#co_buzon"));
                    return;
                } else {
                    if (grid_principal.Checkbox('checkBox').getCheckedNodes().length < 1) {
                        fn_mensaje_boostrap("Error, por favor selecciona un Buzón.", g_tit, $("#co_buzon"));
                        return;
                    }
                }
            }

            if ($("#tx_observaciones_env").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica alguna Observación de Envío.", g_tit, $("#tx_observaciones_env"));
                return;
            }

            if ($("#tx_observaciones_env").val().length < 15) {
                fn_mensaje_boostrap("Error, por favor indica alguna Observación de Envío mas larga.", g_tit, $("#tx_observaciones_env"));
                return;
            }

            if ($("#tx_observaciones_resp").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica alguna Observación de Respuesta.", g_tit, $("#tx_observaciones_resp"));
                return;
            }

            if ($("#tx_observaciones_resp").val().length < 15) {
                fn_mensaje_boostrap("Error, por favor indica alguna Observación de Respuesta mas larga.", g_tit, $("#tx_observaciones_resp"));
                return;
            }

            if ($("#tx_observaciones").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica alguna Observación.", g_tit, $("#tx_observaciones"));
                return;
            }

            if ($("#tx_observaciones").val().length < 15) {
                fn_mensaje_boostrap("Error, por favor indica alguna Observación mas larga.", g_tit, $("#tx_observaciones"));
                return;
            }

            fn_mensaje_boostrap("Se envío.", g_tit, $(""));
            // fn_limpiar() Limpiar todos los datos
            // fn_disable_enable(true); Desactivar todos los campos y resetear ventana
        }
    });

    $("#co_leer").on("click", function () {

        if ($.trim($("#co_leer").text() === "Leer")) {
            if ($("#tx_nro_sumi").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica un Numero de Suministro.", g_tit, $("#tx_nro_sumi"));
                return;
            }

            fn_disable_enable(false);
            fn_mensaje_boostrap("Se genero.", g_tit, $("#tx_nro_sumi"));
        }
    });

    $("#co_seleccionar").on("click", function () {

        if ($.trim($("#co_seleccionar").text() === "Seleccionar")) {
            if (grid_principal.Checkbox('checkBox').getCheckedNodes().length < 1) {
                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por selecciona un buzón.</strong></div>',3000);
                return;
            }

            $("#buzon_space").show();

            $("#div_buzon_i").html(grid_principal.Checkbox('checkBox').getCheckedNodes().map(function (ui) { return ui.C1; }));
            $("#div_buzon_ii").html(grid_principal.Checkbox('checkBox').getCheckedNodes().map(function (ui) { return ui.C2; }));

            $('#div_buzon_bts').modal('hide');
        }
    });

    $("#chk_buzon").on("change", function () {
        if ($(this).is(":checked")) {
            $("#co_buzon").prop("disabled", false);
        } else {
            $("#buzon_space").hide();

            $("#div_buzon_i").html("");
            $("#div_buzon_ii").html("");

            $("#co_buzon").prop("disabled", true);

            grid_principal.Checkbox('checkBox').unCheckAll();
        }
    });

    $("#cb_canal_entrada").on("change", function () {

        if ($(this).val() !== "") {
            $("#cb_tipo_aten").prop("disabled", false);
            $("#cb_tipo_aten").val("");
        } else {
            $("#cb_tipo_aten").val("");
            $("#cb_tipo_aten").prop("disabled", true);

            $("#cb_motiv_client").val("");
            $("#cb_motiv_client").prop("disabled", true);

            $("#cb_motiv_empresa").val("");
            $("#cb_motiv_empresa").prop("disabled", true);
        }
    });

    $("#cb_tipo_aten").on("change", function () {

        if ($(this).val() !== "") {
            $("#cb_motiv_client").prop("disabled", false);
            $("#cb_motiv_client").val("");
        } else {
            $("#cb_motiv_client").val("");
            $("#cb_motiv_client").prop("disabled", true);

            $("#cb_motiv_empresa").val("");
            $("#cb_motiv_empresa").prop("disabled", true);
        }
    });

    $("#cb_motiv_client").on("change", function () {

        if ($(this).val() !== "") {
            $("#cb_motiv_empresa").prop("disabled", false);
            $("#cb_motiv_empresa").val("");
        } else {
            $("#cb_motiv_empresa").val("");
            $("#cb_motiv_empresa").prop("disabled", true);
        }
    });

    $("#co_buzon").on("click", function () {
        $("#div_buzon_bts").modal({backdrop: "static",keyboard:false});
        $("#div_buzon_bts").on("shown.bs.modal", function () {
            $("#div_buzon_bts div.modal-footer button").focus();
        });

        setTimeout(function() {

            load = true;

            $grid_principal.pqGrid("refreshView");

            load = false;

        }, 400);
    });

    $("#tx_nro_sumi").blur( function () {
        if ($(this).val() < 0) {
            $("#tx_nro_sumi").val("0");
        }
    });

    $("#co_limpiar").on("click", fn_limpiar);

    $("#co_cancel").on("click", function () {
        $('#div_buzon_bts').modal('hide');
    });

    $("#co_cancelar").on("click", function () {

        fn_limpiar();
        fn_disable_enable(true);
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

    $grid_principal.pqGrid({
        refresh: function ( event, ui ) {
            if (load) {
                grid_principal = this;
            }
        }
    })

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->

function fn_set_grid_principal() {

    // GRID MOTIVO CAMBIO

    var data =  [
        { C1: 'MEDIDOR 400', C2: 'BUZÓN MEDIDOR 4000' },
    ];

    var obj = {
        height: 225,
        showtop: true,
        filterModel: {
            on: true,
            mode: "AND",
            header: true,
        },
        rowBorders: true,
        showTitle: false,
        showBottom: false,
        collapsible: true,
        roundCorners: true,
        columnBorders: true,
        numberCell: { show: false },
        scrollModel: { theme: true },
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 500, type: "local", rPPOptions: [500, 1000, 2000]},
        toolbar: false,
    };

    obj.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                maxCheck: 1,
                select: true
            }
        },
        { title: "Buzón", width: 265, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 553, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", editable: false, filter: { crules: [{ condition: 'contain' }] } },
    ];

    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_buzon").pqGrid(obj);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

//                                  <-- Combos -->

function fn_localidad() {

    $("#cb_localidad").html("<option value='' selected></option>  <option value='1'>OPCIÓN 01</option> <option value='2'>OPCIÓN 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_prioridad() {

    $("#cb_prioridad").html("<option value='' selected></option>  <option value='1'>OPCIÓN 01</option> <option value='2'>OPCIÓN 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_canal_entrada() {

    $("#cb_canal_entrada").html("<option value='' selected></option>  <option value='1'>OPCIÓN 01</option> <option value='2'>OPCIÓN 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_tipo_aten() {

    $("#cb_tipo_aten").html("<option value='' selected></option>  <option value='1'>OPCIÓN 01</option> <option value='2'>OPCIÓN 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_motiv_client() {

    $("#cb_motiv_client").html("<option value='' selected></option>  <option value='1'>OPCIÓN 01</option> <option value='2'>OPCIÓN 02</option>  <option value='3'>OPCION 03</option>")
}

function fn_motiv_empresa() {

    $("#cb_motiv_empresa").html("<option value='' selected></option>  <option value='1'>OPCIÓN 01</option> <option value='2'>OPCIÓN 02</option>  <option value='3'>OPCION 03</option>")
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_cargar_combos() {

    fn_localidad();
    fn_prioridad();

    fn_canal_entrada();
    fn_tipo_aten();
    fn_motiv_client();
    fn_motiv_empresa();

}

function fn_hide() {

    $("#co_leer").hide();
    $("#co_medidores").hide();
    $("#co_buzon").hide();
    $("#co_direcc").hide();

    $("#div_dat_client").hide();
    $("#div_dat_ord_gen").hide();
    $("#div_observaciones").hide();

    $("#cb_localidad").prop("disabled", true);
}

function fn_disable_enable(action) {

    $("#co_enviar").prop("disabled", action);
    $("#co_direcc").prop("disabled", action);
    $("#co_imprimir").prop("disabled", action);
    $("#co_medidores").prop("disabled", action);

    $("#tx_ref").prop("disabled", action);
    $("#cb_prioridad").prop("disabled", action);

    $("#chk_buzon").prop("disabled", action);
    $("#cb_canal_entrada").prop("disabled", action);
    $("#tx_observaciones").prop("disabled", action);
    $("#tx_observaciones_env").prop("disabled", action);
    $("#tx_observaciones_resp").prop("disabled", action);

    if (action) {
        $("#co_leer").prop("disabled", false);
        $("#tx_nro_sumi").prop("disabled", false);
        $("#co_cerrar").show();
        $("#co_cancelar").hide();
    } else {
        $("#co_leer").prop("disabled", true);
        $("#tx_nro_sumi").prop("disabled", true);
        $("#co_cerrar").hide();
        $("#co_cancelar").show();
    }

}

function fn_limpiar() {

    $("#tx_ref").val("");
    $("#cb_prioridad").val("");

    $("#tx_rut").val("");
    $("#tx_tel").val("");
    $("#tx_ruta").val("");
    $("#tx_mail").val("");
    $("#tx_nombre").val("");
    $("#tx_direcc").val("");
    $("#tx_nro_sumi").val("");
    $("#tx_tiene_doc").val("");

    $("#tx_fech_venc").val("");
    $("#cb_tipo_aten").val("");
    $("#cb_motiv_client").val("");
    $("#cb_canal_entrada").val("");
    $("#cb_motiv_empresa").val("");
    $("#cb_tipo_aten").prop("disabled", true);
    $("#cb_motiv_client").prop("disabled", true);
    $("#cb_motiv_empresa").prop("disabled", true);

    $("#chk_buzon").prop("checked", false);

    if (grid_principal !== undefined) {

        grid_principal.Checkbox('checkBox').unCheckAll();

        $("#div_buzon_i").html("");
        $("#div_buzon_ii").html("");
    }

    $("#tx_observaciones").val("");

    $("#tx_observaciones_env").val("");
    $("#tx_observaciones_resp").val("");

}

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

