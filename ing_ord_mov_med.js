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

    // COMBOS

    fn_regional();

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

    $("#tab_ing_indv").on("click", function (){

        fn_set_active("#tab_ing_indv", "#div_grid_principal");
        $grid_principal.pqGrid("refreshView");
    });

    $("#tab_ing_masiv").on("click", function (){

        fn_set_active("#tab_ing_masiv", "#div_grid_secundaria");
        $grid_secundaria.pqGrid("refreshView");

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

    $("#co_limpiar").on("click", function () {
        fn_limpiar();
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
        { title: "Motivo", width: 200, dataType: "strig", dataIndx: "C4", halign: "center", align: "center", editable: false },
        { title: "Inicio", width: 136, dataType: "strig", dataIndx: "C5", halign: "center", align: "center", editable: false },
        { title: "Fin", width: 135, dataType: "strig", dataIndx: "C6", halign: "center", align: "center", editable: false },
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

//                                  <-- Combos -->

function fn_regional(){

    $("#cb_destino").html("<option value='' selected></option><option value='1'>Laboratorio</option> <option value='2' >Area Destino</option>  <option value='3' >Almacen</option>  <option value='4'>Localidad</option>");
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


