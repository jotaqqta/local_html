var g_modulo = "Corte y Reposición";
var g_tit = "Anulación de Cargos Por Corte y Reposición";
var $grid_principal;
var sql_grid_prim = "";
var my_url = "anul_carg_cort_repo";
var rowIndxG;
var parameters = {};

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
    jQuery('#tx_cod').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_cons').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

// PARA ELIMINAR EL SUBMIT
    $("button").on("click", function () { return false; });
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

//DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();

    $("#space").hide();
    $("#co_cancelar").hide();


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_leer").on("click", function() {

        if ($.trim($("#co_leer").text()) === "Leer") {

            if ($("#tx_num_sumi").val() === "") {
                fn_mensaje('#mensaje_prin', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UN NUMERO DE SUMINISTRO!!! </strong></div>', 3000);
                $("#tx_num_sumi").focus();
                return;
            }

            if (!$.isNumeric($("#tx_num_sumi").val())) {
                fn_mensaje('#mensaje_prin', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!! </strong></div>', 3000);
                $("#tx_num_sumi").focus();
                return;
            }

            if ($("#tx_num_sumi").val().includes("e") || $("#tx_num_sumi").val().includes(".") || $("#tx_num_sumi").val().includes(",") || $("#tx_num_sumi").val().includes("-") || $("#tx_num_sumi").val().includes("+")) {
                fn_mensaje('#mensaje_prin', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!! </strong></div>', 3000);
                $("#tx_num_sumi").focus();
                return;
            }

            $("#co_leer").prop( "disabled", true);
            $("#tx_num_sumi").prop( "disabled", true);
            $("#co_cancelar").show();
            $("#co_cerrar").hide();
            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            $("#div_prin").slideDown();
            $("#div_new_bts").slideUp();
            $('#div_new_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });

    $("#co_cancelar").on("click", function () {
        $("#co_leer").prop( "disabled", false);
        $("#tx_num_sumi").prop( "disabled", false);
        $("#co_cancelar").hide();
        $("#co_cerrar").show();
    })

    $("#co_confirm_yes").on("click", function( ) {

        if ($("#tx_observacion").val() === "") {
            fn_mensaje('#mensaje_confirm', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UNA OBSERVACIÓN!!!</strong></div>', 3000);
            $("#tx_observacion").focus();
            return;
        }

        fn_mensaje_boostrap("Se elimino", g_tit, $("#co_guardar"));
        $("#div_prin").slideDown();
        $("#dlg_confirm").slideUp();
        $('#dlg_confirm').modal('hide');
        $(window).scrollTop(0);
    });

    $("#co_confirm_no").on("click", function () {
        $("#div_prin").slideDown();
        $("#dlg_confirm").slideUp();
        $('#dlg_confirm').modal('hide');
        $(window).scrollTop(0);
    });

    $("#co_confirm_yes").on( "click", function () {

        $grid_principal.pqGrid("deleteRow", { rowIndx: rowIndxG });

        /*HablaServidor(my_url, parameters, 'text', function() {
            fn_mensaje("EL MOVIMIENTO FUE ELIMINADO", g_titulo, $(""));
        });*/

        $('#dlg_confirm').modal('hide');

    });

    $("#co_confirm_no").on( "click", function () {

        $('#dlg_confirm').modal('hide');

    });

    $("#co_cerrar").on("click", function (){ window.close(); });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_setea_grid_principal() {

    var data =  [
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },
        { C1: '', C2: '', C3: '', C4: '', C5: '' },

    ];

    var obj = {
        height: "100%",
        showTop: true,
        showBottom:true,
        showTitle : false,
        title: "",
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible:true,
        editable:false,
        postRenderInterval: 0,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 100, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar: false,
    };

    obj.colModel = [
        { title: "Tipo de Orden", width: 225, dataType: "string", dataIndx: "C1", halign: "center", align: "left" },
        { title: "Numero de Orden", width: 180, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", },
        { title: "Situación Encontrada", width: 250, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
        { title: "Acción Realizada", width: 180, dataType: "string", dataIndx: "C4", halign: "center", align: "left" },
        { title: "Fecha Fin Orden", width: 180, dataType: "string", dataIndx: "C5", halign: "center", align: "left" },
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

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_borrar(rowIndx) {

    $("#confirm_msg").html("¿Estas seguro de que quieres eliminar la fila " + (rowIndx + 1) + "?");

    rowIndxG = rowIndx;

    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
    $("#dlg_confirm").on("shown.bs.modal", function () {
        $("#dlg_confirm div.modal-footer button").focus();
    });

}

function fn_carga_grilla() {

    var total_register;

    $grid_principal.pqGrid( "option", "dataModel", dataModel );
    $grid_principal.pqGrid( "refreshDataAndView" );
    $grid_principal.pqGrid( "option", "title", "Total Registros: " + total_register);

}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $("#space").show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
    setTimeout(function(){$("#space").html("");$("#space").hide(); }, segundos);
}

