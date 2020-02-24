var g_modulo = "Medidores y Equipos";
var g_tit = "Ingreso de ordenes de movimientos de medidor";
var $grid_principal;
var $grid_secundaria;
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

//  <-- Select -->

    fn_cent_operativo();
    fn_type_ident();
    fn_destino();
    fn_marca();
    fn_modelo();
    fn_motivo();

//  <-- Grids -->

    fn_set_grid_principal();
    fn_set_grid_secundaria();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    $("#co_agregar").html("<span class='glyphicon glyphicon-plus'></span> Agregar");
    $("#co_agregar_2").html("<span class='glyphicon glyphicon-plus'></span> Agregar");

    $("#co_control").prop("disabled", true);
    $("#co_alerta").prop("disabled", true);

    fn_load_select();
    $("#div_grid_secundaria").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_generar").on( "click", function () {

        if ($.trim($("#co_generar").text()) === "Generar") {

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_consultar"));
            $(window).scrollTop(0);
        }
    });

    $("#co_aceptar").on("click", function () {
        if ($.trim($("#co_aceptar").text()) === "Aceptar") {

            if ($("#cb_marca").val() === "") {
                fn_mensaje('#mensaje_agr','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona una Marca.</strong></div>',3000);
                $("#cb_marca").focus();
                return;
            }

            if ($("#cb_modelo").val() === "") {
                fn_mensaje('#mensaje_agr','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona un Modelo.</strong></div>',3000);
                $("#cb_modelo").focus();
                return;
            }

            if ($("#tx_medidor").val() === "") {
                fn_mensaje('#mensaje_agr','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indica un Medidor.</strong></div>',3000);
                $("#tx_medidor").focus();
                return;
            }

            if ($("#cb_motivo").val() === "") {
                fn_mensaje('#mensaje_agr','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona un Motivo.</strong></div>',3000);
                $("#cb_motivo").focus();
                return;
            }

            fn_mensaje_boostrap("Se agrego", g_tit, $("#co_aceptar"));
            $("#div_prin").slideDown();
            $("#div_agregar_bts").slideUp();
            $('#div_agregar_bts').modal('hide');
            $(window).scrollTop(0);
        }
    });

    $("#co_aceptar_2").on("click", function () {
        if ($.trim($("#co_aceptar_2").text()) === "Aceptar") {

            if ($("#cb_marca_masiv").val() === "") {
                fn_mensaje('#mensaje_agr_masiv','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona una Marca.</strong></div>',3000);
                $("#cb_marca_masiv").focus();
                return;
            }

            if ($("#cb_modelo_masiv").val() === "") {
                fn_mensaje('#mensaje_agr_masiv','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona un Modelo.</strong></div>',3000);
                $("#cb_modelo_masiv").focus();
                return;
            }

            if ($("#cb_motivo_masiv").val() === "") {
                fn_mensaje('#mensaje_agr_masiv','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona un Motivo.</strong></div>',3000);
                $("#cb_motivo_masiv").focus();
                return;
            }

            if ($("#tx_num_inicial").val() === "") {
                fn_mensaje('#mensaje_agr_masiv','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indica un Numero Inicial.</strong></div>',3000);
                $("#tx_num_inicial").focus();
                return;
            }

            if ($("#tx_num_final").val() === "") {
                fn_mensaje('#mensaje_agr_masiv','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor un Numero Final.</strong></div>',3000);
                $("#tx_num_final").focus();
                return;
            }

            if (parseInt($("#tx_num_inicial").val()) > parseInt($("#tx_num_final").val())) {
                fn_mensaje('#mensaje_agr_masiv','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, el Numero Final debe ser mayor o igual al Numero Inicial.</strong></div>',6000);
                $("#tx_num_inicial").focus();
                return;
            }

            fn_mensaje_boostrap("Se agrego", g_tit, $("#co_aceptar_2"));
            $("#div_prin").slideDown();
            $("#div_agregar_masiv_bts").slideUp();
            $('#div_agregar_masiv_bts').modal('hide');
            $(window).scrollTop(0);
        }
    });

    $("#co_agregar").on( "click", function () {
        fn_agregar(1);
    });

    $("#co_agregar_2").on( "click", function () {
        fn_agregar(2);
    });

    $("#tab_ing_indv").on("click", function (){

        fn_set_active("#tab_ing_indv", "#div_grid_principal");
        $grid_principal.pqGrid("refreshView");
    });

    $("#tab_ing_masiv").on("click", function (){

        fn_set_active("#tab_ing_masiv", "#div_grid_secundaria");
        $grid_secundaria.pqGrid("refreshView");

    });

    $("#co_limpiar").on("click", function () {
        fn_limpiar();
    });

    $("#co_confirm_yes").on( "click", function () {

        // GRID SECUNDARIA
        if ($("#div_grid_principal").is(":visible")) {
            $grid_principal.pqGrid("deleteRow", { rowIndx: rowIndxG });
        }

        // GRID PRINCIPAL
        if ($("#div_grid_secundaria").is(":visible")) {
            $grid_secundaria.pqGrid("deleteRow", { rowIndx: rowIndxG });
        }

        $('#dlg_confirm').modal('hide');

    });

    $("#co_confirm_no").on( "click", function () {

        $('#dlg_confirm').modal('hide');

    });

    $("select[id=cb_destino]").change(function(){

        if ($('select[id=cb_destino]').val() === "") {
            fn_load_select();
        }

        if ($('select[id=cb_destino]').val() === "1") {
            fn_load_select(1);
        }

        if ($('select[id=cb_destino]').val() === "2") {
            fn_load_select(2);
        }

        if ($('select[id=cb_destino]').val() === "3") {
            fn_load_select(3);
        }

        if ($('select[id=cb_destino]').val() === "4") {
            fn_load_select(4);
        }

    });

    $("#tx_uso_desde").blur(function () {

        if ($("#tx_uso_desde").val() < 0) {
            $("#tx_uso_desde").val("0");
        }
    });

    $("#tx_uso_hasta").blur(function () {

        if ($("#tx_uso_hasta").val() < 0) {
            $("#tx_uso_hasta").val("0");
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

    $("#co_cerrar").on("click", function (){ window.close(); });


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->

function fn_set_grid_principal() {

    // GRID PRINCIPAL

    var data =  [
        { C1: 'AIME METER', C2: 'AIMEI METER 5/8 TERMOPLOTICOS', C3: '110106214', C4: 'VERIFICACIÓN', C5: '' },
        { C1: 'AIME METER', C2: 'AIMEI METER 2/8 TERMOPLOTICOS', C3: '120106214', C4: 'VERIFICACIÓN', C5: '' },
        { C1: 'AIME METER', C2: 'AIMEI METER 3/4 TERMOPLOTICOS', C3: '145106214', C4: 'VERIFICACIÓN', C5: '' },
        { C1: 'AIME METER', C2: 'AIMEI METER 2/4 TERMOPLOTICOS', C3: '178106214', C4: 'VERIFICACIÓN', C5: '' },
        { C1: 'AIME METER', C2: 'AIMEI METER 6/9 TERMOPLOTICOS', C3: '196106214', C4: 'VERIFICACIÓN', C5: '' },
    ];

    var obj = {
        height: 340,
        showTop: true,
        showBottom:true,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible: true,
        editable: false,
        postRenderInterval: 0,
        selectionModel: { type: 'row', mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 100, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel: { theme: true },
        toolbar: {
            cls: "pq-toolbar-export btn-group-sm",
            items:[
                { type: "button", label: "Agregar", attr: "id=co_agregar",  cls: "btn btn-primary btn-sm" },
            ]
        },
    };

    obj.colModel = [
        { title: "Marca", width: 200, dataType: "string", dataIndx: "C1", halign: "center", align: "left", editable: false },
        { title: "Modelo", width: 300, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", editable: false },
        { title: "Medidor", width: 150, dataType: "strig", dataIndx: "C3", halign: "center", align: "center", editable: false },
        { title: "Motivo", width: 196, dataType: "strig", dataIndx: "C4", halign: "center", align: "center", editable: false },
        { title: "Fecha Creación", width: 125, dataType: "strig", dataIndx: "C6", halign: "center", align: "center", editable: false },
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

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

function fn_set_grid_secundaria() {

    // GRID SECUNDARIA

    var data =  [
        { C1: 'AIME METER', C2: 'AIMEI METER 2/4 TERMOPLOTICOS', C3: 'VERIFICACIÓN', C4: '20/01/2020', C5: '22/01/2020' },
    ];

    var obj = {
        height: 340,
        showTop: true,
        showBottom:true,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible:true,
        editable:false,
        postRenderInterval: 0,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 100, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{ theme: true },
        toolbar: {
            cls: "pq-toolbar-export btn-group-sm",
            items:[
                { type: "button", label: "Agregar", attr: "id=co_agregar_2",  cls: "btn btn-primary btn-sm" },
            ]
        },
    };

    obj.colModel = [
        { title: "Marca", width: 200, dataType: "string", dataIndx: "C1", halign: "center", align: "left", editable: false },
        { title: "Modelo", width: 300, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", editable: false },
        { title: "Motivo", width: 200, dataType: "strig", dataIndx: "C3", halign: "center", align: "center", editable: false },
        { title: "Inicio", width: 136, dataType: "strig", dataIndx: "C4", halign: "center", align: "center", editable: false },
        { title: "Fin", width: 135, dataType: "strig", dataIndx: "C5", halign: "center", align: "center", editable: false },
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

    $grid_secundaria = $("#div_grid_secundaria").pqGrid(obj);


}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Modales -->

function fn_agregar(modal) {

    if (modal === 1) {
        if ($("#div_grid_principal").is(":visible")) {
            $("#div_agregar_bts").modal({backdrop: "static",keyboard:false});
            $("#div_agregar_bts").on("shown.bs.modal", function () {
                $("#div_agregar_bts div.modal-footer button").focus();
            });
        }
    }

    if (modal === 2) {
        if ($("#div_grid_secundaria").is(":visible")) {
            $("#div_agregar_masiv_bts").modal({backdrop: "static",keyboard:false});
            $("#div_agregar_masiv_bts").on("shown.bs.modal", function () {
                $("#div_agregar_masiv_bts div.modal-footer button").focus();
            });
        }
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

function fn_cent_operativo(){

    $("#cb_cent_opera").html("<option value='' selected></option><option value='1'>PANAMÁ METRO</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_type_ident(){

    $("#cb_type_ident").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_destino(){

    $("#cb_destino").html("<option value='' selected></option><option value='1'>Laboratorio</option> <option value='2' >Area Destino</option>  <option value='3' >Almacen</option>  <option value='4'>Localidad</option>");
}

function fn_marca(){

    $("#cb_marca").html("<option value='' selected></option><option value='1'>AIME METER</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
    $("#cb_marca_masiv").html("<option value='' selected></option><option value='1'>AIME METER</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_modelo(){

    $("#cb_modelo").html("<option value='' selected></option><option value='1'>AIME METER 2/4 TERMOPLOTICOS</option> <option value='2' >AIME METER 2/8 TERMOPLOTICOS</option>  <option value='3' >AIME METER 3/4 TERMOPLOTICOS</option>  <option value='4'>AIME METER 5/8 TERMOPLOTICOS</option>  <option value='5'>AIME METER 6/9 TERMOPLOTICOS</option>");
    $("#cb_modelo_masiv").html("<option value='' selected></option><option value='1'>AIME METER 2/4 TERMOPLOTICOS</option> <option value='2' >AIME METER 2/8 TERMOPLOTICOS</option>  <option value='3' >AIME METER 3/4 TERMOPLOTICOS</option>  <option value='4'>AIME METER 5/8 TERMOPLOTICOS</option>  <option value='5'>AIME METER 6/9 TERMOPLOTICOS</option>");
}

function fn_motivo(){

    $("#cb_motivo").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
    $("#cb_motivo_masiv").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCIÓN 03</option>");
}

function fn_load_select(type) {

    $("#cb_destino_2").prop("disabled", false);

    if (type === undefined) {

        $("#cb_destino_2").prop("disabled", true);
    }

    if (type === 1) {

        $("#cb_destino_2").html("<option value='' selected></option><option value='1'>Laboratorio IDDAN</option>");
    }

    if (type === 2) {

        $("#cb_destino_2").html("<option value='' selected></option><option value='1'>24 DE DICIEMBRE</option> " +
            "<option value='2' >ALCALDE DÍAZ</option>" +
            "<option value='3' >AMELIA DENIS DE ICAZA</option>" +
            "<option value='4' >ANCÓN</option>" +
            "<option value='6' >ARNULFO ARIA</option>" +
            "<option value='7' >BELISARIO ARIAS</option>" +
            "<option value='8' >BELISARIO FRIAS</option>" +
            "<option value='9' >BELISARIO PORRAS</option>" +
            "<option value='10' >BELLA VISTA</option>" +
            "<option value='11' >BETANIA</option>" +
            "<option value='12' >CHILIBRE</option>" +
            "<option value='13' >CURUNDÚ</option>" +
            "<option value='14' >EL CHORRILLO</option>" +
            "<option value='15' >ERNESTO CORDOBA CAMPOS</option>" +
            "<option value='16' >JOSE DOMINGO ESPINAR</option>" +
            "<option value='17' >JUAN DIAZ</option>" +
            "<option value='18' >LA EXPOSICIÓN O CALIDONIA</option>" +
            "<option value='19' >LAS CUMBRES</option>" +
            "<option value='20' >LAS MAÑANITAS</option>" +
            "<option value='21' >MATEO ITURRALDE</option>" +
            "<option value='22' >OMAR TORRIJOS</option>" +
            "<option value='23' >PACORA</option>" +
            "<option value='24' >PARQUE LEFERVRE</option>" +
            "<option value='25' >PEDREGAL (PMA)</option>" +
            "<option value='26' >PUEBLO NUEVO</option>" +
            "<option value='27' >RIO ABAJO</option>" +
            "<option value='28' >RUFINA ALFARO</option>" +
            "<option value='29' >SAN FELIPE</option>" +
            "<option value='30' >SAN FRANCISCO</option>" +
            "<option value='31'>SAN MARTIN</option>");

    }

    if (type === 3) {

        $("#cb_destino_2").html("<option value='' selected></option><option value='1'>ALMACEN CENTRAL IDDAN</option> " +
            "<option value='2' >ALMACEN MEDIDORES</option>" +
            "<option value='3' >ALM-PANAMA METRO</option>" +
            "<option value='4' >ALM-ARRAIJAN</option>" +
            "<option value='6' >ALM-PANAMA OESTE</option>" +
            "<option value='7' >ALM-VERAGUAS</option>" +
            "<option value='8' >ALM-REPUBLICA DE PANAMA</option>" +
            "<option value='9' >ALM-BOCA DEL TORO</option>" +
            "<option value='10' >ALM-COLON</option>" +
            "<option value='11' >ALM-COCLE</option>" +
            "<option value='12' >ALM-CHIRIQUI</option>" +
            "<option value='13' >ALM-PANAMA ESTE Y DARIEN</option>" +
            "<option value='14' >ALM-HERRERA</option>");

    }

    if (type === 4) {
        $("#cb_destino_2").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option>  <option value='2'>OPCIÓN 02</option>  <option value='3'>OPCIÓN 03</option>");
    }

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_limpiar() {

}

function fn_set_active(tab, div) {

    $("#tab_ing_indv").removeClass("active");
    $("#tab_ing_masiv").removeClass("active");

    $("#div_grid_principal").hide();
    $("#div_grid_secundaria").hide();

    $(tab).addClass("active");
    $(div).show();

}

function fn_mensaje(id, mensaje, segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function () {$(id).html("");$(id).hide() }, segundos);
}


