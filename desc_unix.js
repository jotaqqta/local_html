var g_modulo = "Administrador Central";
var g_tit = "Relación Tarifa Cargo";
var $grid_principal;
var grid_principal;
var load = false;

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

//  <-- Combos -->

    fn_sistema();
    fn_tipo_archiv();

//  <-- Grids -->

    fn_set_grid_principal();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

//  <-- Buttons Icons -->

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_descargar").html("<span class='glyphicon glyphicon-save'></span> Descargar");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $("#cb_tipo_archiv").prop("disabled", true);

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_filtro").on("click", function() {

        $("#cb_sistema").val("");
        $("#cb_tipo_archiv").val("");

        $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
        $("#div_filtro_bts").on("shown.bs.modal", function () {
            $("#div_filtro_bts div.modal-footer button").focus();
        });
    });

    $("#co_aceptar").on( "click", function () {

        if ($.trim($("#co_aceptar").text()) === "Aceptar") {

            if ($("#cb_sistema").val() === "") {
                fn_mensaje('#mensaje_new','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona un Sistema.</strong></div>',3000);
                $("#cb_sistema").focus();
                return;
            }

            if ($("#cb_tipo_archiv").val() === "") {
                fn_mensaje('#mensaje_new','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona un Tipo de Archivo.</strong></div>',3000);
                $("#cb_tipo_archiv").focus();
                return;
            }

            load = true;

            $grid_principal.pqGrid("refreshView");

            load = false;

            fn_mensaje_boostrap("Se genero", g_tit, $(""));
        }

        $('#div_filtro_bts').modal('hide');
    });

    $("#cb_sistema").on("change", function () {

        $("#cb_tipo_archiv").val("");

        if ($("#cb_sistema").val() !== "") {
            $("#cb_tipo_archiv").prop("disabled", false);
        } else {
            $("#cb_tipo_archiv").prop("disabled", true);
        }
    });

    $("#co_descargar").on("click", function () {

        if (grid_principal !== undefined) {
            var selection = grid_principal.SelectRow().getSelection();
        } else {
            fn_mensaje_boostrap("Error, por favor selecciona un filtro.", g_tit, $("#co_filtro"));
            return;
        }

        if (selection.length < 1) {
            fn_mensaje_boostrap("Error, por favor selecciona al menos una fila.", g_tit, $(""));
            return;
        }

        fn_mensaje_boostrap("Evento boton descargar", g_tit, $(""));
    });

    $("#co_cancel").on("click", function (){
        $('#div_filtro_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function () {
        window.close();
    });

    $grid_principal.pqGrid({
        refresh: function (event, ui) {
            if (load) {
                grid_principal = this;
            }
        }
    })

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->

function fn_set_grid_principal() {

    var data =  [
        { C1: 'FACRO204_20200323_20100101.xls', C2: '2020/03/23', C3: '50022', C4: 'https://www.miserver.com/files/50022' },
        { C1: 'Morosidad_Corpo_Mes_2019_20200106.xls', C2: '2020/01/26', C3: '675705', C4: 'https://www.miserver.com/files/12345' },
        { C1: 'Morosidad_Corporativos_20200106.xls', C2: '2020/01/06', C3: '1570228', C4: 'https://www.miserver.com/files/54678' },
        { C1: 'Morosidad_Corporativos_20200103.xls', C2: '2020/01/03', C3: '1387330', C4: 'https://www.miserver.com/files/35467' },
        { C1: 'MORCO_MES_2019_20200102.xls', C2: '2020/01/02', C3: '675705', C4: 'https://www.miserver.com/files/45631' },
    ];

    var obj = {
        height: "100%",
        showtop: true,
        showTitle: false,
        showBottom: true,
        numberCell: { show: true},
        rowBorders: true,
        filterModel: {
            on: true,
            mode: "AND",
            header: true,
        },
        collapsible: true,
        scrollModel: { theme: true},
        roundCorners: true,
        columnBorders: true,
        selectionModel: { type: 'row',mode:'box'},
        pageModel: {rPP: 100, type: "local", rPPOptions: [50, 100, 200, 500]},
        toolbar: {
            cls: "pq-toolbar-export btn-group-sm",
            items: [
                {type: "button", label: "Filtro", attr: "id=co_filtro", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Descargar", attr: "id=co_descargar", cls: "btn btn-primary btn-sm"},
                {type: "button", label: "Cerrar", attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: false,
            cb: {
                all: true,
                select: true,
                header: false,
                maxCheck: 1
            }
        },
        { title: "Nombre", width: 860, dataType: "string", dataIndx: "C1", halign: "center", align: "left", editable: false, filter: { crules: [{ condition: 'contain' }] } },
        { title: "Fecha", width: 100, dataType: "strig", dataIndx: "C2", halign: "center", align: "center", editable: false, filter: { crules: [{ condition: 'contain' }] } },
        { title: "Tamaño", width: 100, dataType: "strig", dataIndx: "C3", halign: "center", align: "center", editable: false },
        { title: "URL", width: 100, dataType: "strig", dataIndx: "C4", halign: "center", align: "center", hidden: true, editable: false },
    ];

    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*


//                                  <-- Combos -->

function fn_sistema(){

    $("#cb_sistema").html("<option value='' selected></option><option value='1'>FACTURACIÓN</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCION 03</option>");
}

function fn_tipo_archiv(){

    $("#cb_tipo_archiv").html("<option value='' selected></option><option value='1'>INFORMES DE CUENTAS DE GOBIERNO</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCION 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_mensaje(id, mensaje, segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function () {$(id).html("");$(id).hide() }, segundos);
}


