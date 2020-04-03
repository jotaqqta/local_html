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

    $(".number").inputmask({
        alias: "integer",
        placeholder: '',
        allowPlus: false,
        allowMinus: false
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

    fn_hide();
    fn_disable();
    $("#co_buzon").hide();
    $("#div_dat_gen").show();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $(".nav-tabs a").click(function(){

        $(this).tab('show');
        fn_hide();

        if (this.text === "Datos Generales") {
            $("#div_dat_gen").show();
        }

        if (this.text === "Observaciones") {
            $("#div_observaciones").show();
        }

    });

    $("#co_ingresar").on("click", function () {

        if (!$("input[type='radio'][name='opt_tipo_orden']").is(':checked')) {
            fn_mensaje_boostrap("Error, por favor selecciona un tipo de orden (Masiva o Individual).", g_tit, $("input[name=opt_tipo_orden]"));
            return;
        }

        if ($("input[type='radio'][name='opt_tipo_orden']:checked").val() === "opt_masiva") {

            if ($("#tx_sector").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica un Sector.", g_tit, $("#tx_sector"));
                return;
            }

            if ($("#tx_zona").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica una Zona.", g_tit, $("#tx_zona"));
                return;
            }

            if ($("#tx_correl_inicial").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica un Correlativo Inicial.", g_tit, $("#tx_correl_inicial"));
                return;
            }

            if ($("#tx_correl_final").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica un Correlativo Final.", g_tit, $("#tx_correl_final"));
                return;
            }
        }

        if ($("input[type='radio'][name='opt_tipo_orden']:checked").val() === "opt_individual") {

            if ($("#tx_nro_sumi").val() === "") {
                fn_mensaje_boostrap("Error, por favor indica un Número de Cliente.", g_tit, $("#tx_nro_sumi"));
                return;
            }
        }

        if ($("#tx_referencia").val() === "") {
            fn_check_nav("#tab_dat_gen", "#div_dat_gen");
            fn_mensaje_boostrap("Error, por favor indica una Referencia.", g_tit, $("#tx_referencia"));
            return;
        }

        if ($("#cb_canal_entrada").val() === "") {
            fn_check_nav("#tab_dat_gen", "#div_dat_gen");
            fn_mensaje_boostrap("Error, por favor selecciona un Canal de Entrada.", g_tit, $("#cb_canal_entrada"));
            return;
        }

        if ($("#cb_tipo_aten").val() === "") {
            fn_check_nav("#tab_dat_gen", "#div_dat_gen");
            fn_mensaje_boostrap("Error, por favor indica un Tipo de Atención.", g_tit, $("#cb_tipo_aten"));
            return;
        }

        if ($("#cb_motiv_client").val() === "") {
            fn_check_nav("#tab_dat_gen", "#div_dat_gen");
            fn_mensaje_boostrap("Error, por favor indica un Motivo Cliente.", g_tit, $("#cb_motiv_client"));
            return;
        }

        if ($("#cb_motiv_empresa").val() === "") {
            fn_check_nav("#tab_dat_gen", "#div_dat_gen");
            fn_mensaje_boostrap("Error, por favor indica un Motivo Empresa.", g_tit, $("#cb_motiv_empresa"));
            return;
        }

        if (!$("input[type='radio'][name='opt_dat_gen']").is(':checked')) {
            fn_check_nav("#tab_dat_gen", "#div_dat_gen");
            fn_mensaje_boostrap("Error, por favor selecciona un Buzón o un Rol.", g_tit, $("#cb_motiv_empresa"));
            return;
        }

        if ($("#tx_observaciones").val() === "") {
            fn_check_nav("#tab_observ", "#div_observaciones");
            fn_mensaje_boostrap("Error, por favor indica alguna Observación.", g_tit, $("#tx_observaciones"));
            return;
        }

        if ($("#tx_observaciones").val().length < 15) {
            fn_mensaje_boostrap("Error, por favor indica alguna Observación mas larga.", g_tit, $("#tx_observaciones"));
            return;
        }

    });

    $("#co_seleccionar").on("click", function () {

        if ($.trim($("#co_seleccionar").text() === "Seleccionar")) {
            if (grid_principal.Checkbox('checkBox').getCheckedNodes().length < 1) {
                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por selecciona un buzón.</strong></div>',3000);
                return;
            }

            $("#buzon_data").show();

            $("#buzon_i").html(grid_principal.Checkbox('checkBox').getCheckedNodes().map(function (ui) { return ui.C1; }));
            $("#buzon_ii").html(grid_principal.Checkbox('checkBox').getCheckedNodes().map(function (ui) { return ui.C2; }));

            $('#div_buzon_bts').modal('hide');
        }
    });

    $("input[type='radio'][name='opt_tipo_orden']").on("click", function () {

        fn_limpiar();
        fn_disable();

        if ($("input[type='radio'][name='opt_tipo_orden']:checked").val() === "opt_masiva") {
            $("#tx_sector").prop("disabled", false);
            $("#tx_zona").prop("disabled", false);
            $("#tx_correl_inicial").prop("disabled", false);
            $("#tx_correl_final").prop("disabled", false);
        } else {
            $("#tx_nro_sumi").prop("disabled", false);
            $("#tx_nombre").prop("disabled", false);
            $("#tx_ruta").prop("disabled", false);
            $("#tx_direccion").prop("disabled", false);
        }
    });

    $("input[type='radio'][name='opt_dat_gen']").on("click", function () {
        if ($("input[type='radio'][name='opt_dat_gen']:checked").val() === "opt_buzon") {
            $("#co_buzon").show();
        } else {
            $("#co_buzon").hide();
            $("#buzon_data").hide();
            $("#buzon_i").html("");
            $("#buzon_ii").html("");
            grid_principal.Checkbox('checkBox').unCheckAll();
        }
    });

    $("#co_enviar").on("click", function () {

        if ($.trim($("#co_enviar").text() === "Enviar")) {

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

    $("#co_cancel").on("click", function () {
        $('#div_buzon_bts').modal('hide');
    });

    $("#co_limpiar").on("click", fn_limpiar);

    $("#co_cancelar").on("click", function () {

        fn_limpiar();
        fn_disable(true);
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

    $grid_principal.pqGrid({
        refresh: function ( event, ui ) {
            if (load) {
                grid_principal = this;
            }
        }
    });

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

function fn_check_nav(nav, div) {

    if (!$(div).is(":visible")) {
        $(nav).tab('show');

        fn_hide();

        if (div === "#div_dat_gen") {
            $("#co_medidores").show();
            $("#co_direcc").show();
            $("#div_dat_client").show();
        }

        if (div === "#div_observaciones") {
            $("#div_observaciones").show();
        }
    }

}

function fn_cargar_combos() {

    fn_prioridad();

    fn_canal_entrada();
    fn_tipo_aten();
    fn_motiv_client();
    fn_motiv_empresa();

}

function fn_hide() {

    $("#buzon_data").hide();
    $("#div_dat_gen").hide();
    $("#div_observaciones").hide();

}

function fn_disable() {

    $("#tx_sector").prop("disabled", true);
    $("#tx_zona").prop("disabled", true);
    $("#tx_correl_inicial").prop("disabled", true);
    $("#tx_correl_final").prop("disabled", true);
    $("#tx_nro_sumi").prop("disabled", true);
    $("#tx_nombre").prop("disabled", true);
    $("#tx_ruta").prop("disabled", true);
    $("#tx_direccion").prop("disabled", true);

    $("#cb_tipo_aten").prop("disabled", true);
    $("#cb_motiv_client").prop("disabled", true);
    $("#cb_motiv_empresa").prop("disabled", true);

}

function fn_post_check() {

    if ($("#cb_motiv_empresa").val() !== "") {
        $("#cb_tipo_aten").prop("disabled", false);
        $("#cb_motiv_client").prop("disabled", false);
        $("#cb_motiv_empresa").prop("disabled", false);
    }

    if ($("#cb_motiv_client").val() !== "") {
        $("#cb_tipo_aten").prop("disabled", false);
        $("#cb_motiv_client").prop("disabled", false);

    }

    if ($("#cb_tipo_aten").val() !== "") {
        $("#cb_tipo_aten").prop("disabled", false);
    }

}

function fn_limpiar(zone) {

    if (zone === undefined) {
        $("#tx_sector").val("");
        $("#tx_zona").val("");
        $("#tx_correl_inicial").val("");
        $("#tx_correl_final").val("");
        $("#tx_nro_sumi").val("");
        $("#tx_nombre").val("");
        $("#tx_ruta").val("");
        $("#tx_direccion").val("");
    }

    if (zone === "all") {

        $("#tx_sector").val("");
        $("#tx_zona").val("");
        $("#tx_correl_inicial").val("");
        $("#tx_correl_final").val("");

        $("#tx_nro_sumi").val("");
        $("#tx_nombre").val("");
        $("#tx_ruta").val("");
        $("#tx_direccion").val("");

        $("#tx_referencia").val("");
        $("#cb_prioridad").val("");
        $("#cb_canal_entrada").val("");
        $("#cb_tipo_aten").val("");
        $("#cb_motiv_client").val("");
        $("#cb_motiv_empresa").val("");
        $("#tx_fech_venc").val("");

        $("input[name='opt_dat_gen']").prop(":checked", false);
        $("input[name='opt_tipo_orden']").prop(":checked", false);

        $("#tx_observaciones").val("");

    }

}

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

