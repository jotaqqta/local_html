var g_modulo = "Corte y Reposición";
var g_tit = "Analisis de Corte";
var $grid_principal;
var $grid_mano_obra;
var $grid_pre_dep;
var sql_grid_prim = "";
var sql_grid_2 = "";
var sql_grid_3 = "";
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
    jQuery('#tx_cod').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_cons').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    //COMBOS


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

    //DEFINE LAS GRILLAS
    fn_setea_grids_principales();

    //DIBUJA LOS ICONOS DE LOS BOTONES

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $("#space").hide();
    $("#co_cancelar").hide();
    fn_ocultar();
    fn_remove_active();
    fn_set_active("#tab_ana_parametros", "#div_grid_parametros")

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#tab_ana_parametros").on("click", function () {


        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_ana_parametros", "#div_grid_parametros")

    });

    $("#tab_ana_notificacipon").on("click", function () {

        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_ana_notificacipon", "#div_grid_notificacion")

    });

    $("#tab_ana_corte").on("click", function () {

        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_ana_corte", "#div_grid_corte")

    });

    $("#co_leer").on("click", function () {

        if ($.trim($("#co_leer").text() === "Leer")) {

            if ($("#tx_num_client").val() === "") {
                fn_mensaje_boostrap("FAVOR INDICAR UN NÚMERO DE CLIENTE", g_tit, $("#tx_num_client"));
                return;
            }

            if (!$.isNumeric($("#tx_num_client").val())) {
                fn_mensaje_boostrap("FAVOR COMPROBAR EL VALOR INGRESADO", g_tit, $("#tx_num_client"));
                return;
            }

            if ($("#tx_num_client").val().includes("e") || $("#tx_num_client").val().includes(".") || $("#tx_num_client").val().includes(",") || $("#tx_num_client").val().includes("-") || $("#tx_num_client").val().includes("+")) {
                fn_mensaje_boostrap("FAVOR COMPROBAR EL VALOR INGRESADO", g_tit, $("#tx_num_client"));
                return;
            }
        }

        $("#co_leer").prop( "disabled", true);
        $("#tx_num_client").prop( "disabled", true);
        $("#co_cancelar").show();
        $("#co_cerrar").hide();

        fn_mensaje_boostrap("Se genéro", g_tit, $("#co_leer"));
        $(window).scrollTop(0);
    });

    $("#co_cancelar").on("click", function () {

        $("#co_leer").prop( "disabled", false);
        $("#tx_num_client").prop( "disabled", false);
        $("#co_cancelar").hide();
        $("#co_cerrar").show();
        fn_limpiar()
    });

    $("#co_cerrar").on("click", function () {
        window.close();
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_setea_grids_principales() {

    // Setea grilla Parametros

    var data =  [
        { C1: 'PRIMERA INSTANCIA', C2: '0', C3: '0', C4: '2' },
        { C1: 'PRIMERA INSTANCIA', C2: '250', C3: '2', C4: '4' },
        { C1: 'PRIMERA INSTANCIA', C2: '465', C3: '7', C4: '8' },
        { C1: 'PRIMERA INSTANCIA', C2: '960', C3: '4', C4: '5' },

    ];

    var obj = {
        height: "320",
        showTop: true,
        showBottom:true,
        showTitle : false,
        title: "",
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible:true,
        editable:false,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 100, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar: false,
    };

    obj.colModel = [
        { title: "Instancia", width: 268, dataType: "string", dataIndx: "C1", halign: "center", align: "left" },
        { title: "Deuda", width: 269, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "Antigüedad", width: 268, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Antigüedad 2", width: 269, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_parametros").pqGrid(obj);

    // Setea grilla Notificación

    var data2 =  [
        { C1: '006', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '185454', C4: '45' },

    ];

    var obj2 = {
        height: "320",
        showTop: true,
        showBottom:true,
        showTitle : false,
        title: "",
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible:true,
        editable:false,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar: false,
    };

    obj2.colModel = [
        { title: "Fecha Notificación", width: 179, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Instancia Corte", width: 179, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Deuda", width: 179, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Valor Corte", width: 179, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Valor Repo", width: 179, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Instancia Anterior", width: 179, dataType: "string", dataIndx: "C6", halign: "center", align: "left" },

    ];


    obj2.dataModel = { data: data2 };

    $grid_mano_obra = $("#div_grid_notificacion").pqGrid(obj2);

    // Setea grilla Corte

    var data3 =  [
        { C1: '006', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '185454', C4: '45' },

    ];

    var obj3 = {
        height: "320",
        showTop: true,
        showBottom:true,
        showTitle : false,
        title: "",
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible:true,
        editable:false,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar: false,
    };

    obj3.colModel = [
        { title: "Número de Orden", width: 119, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Fecha Acción", width: 119, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Descripción", width: 119, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Motivo", width: 119, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Evento", width: 119, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Situación", width: 119, dataType: "string", dataIndx: "C6", halign: "center", align: "left" },
        { title: "Acción", width: 119, dataType: "string", dataIndx: "C7", halign: "center", align: "left" },
        { title: "Contratista", width: 119, dataType: "string", dataIndx: "C8", halign: "center", align: "left" },
        { title: "Ejecutor", width: 119, dataType: "string", dataIndx: "C9", halign: "center", align: "left" },

    ];


    obj3.dataModel = { data: data2 };

    $grid_mano_obra = $("#div_grid_corte").pqGrid(obj3);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_set_active(tab, div_grilla) {
    $(tab).addClass("active");
    $(div_grilla).show();

}

function fn_remove_active() {

    if ($("#tab_ana_parametros").hasClass("active")) {
        $("#tab_ana_parametros").removeClass("active")
    }

    if ($("#tab_ana_notificacipon").hasClass("active")) {
        $("#tab_ana_notificacipon").removeClass("active")
    }

    if ($("#tab_ana_corte").hasClass("active")) {
        $("#tab_ana_corte").removeClass("active")
    }

}

function fn_ocultar() {

    if ($("#div_grid_parametros").is(":visible")) {
        $("#div_grid_parametros").hide();
    }

    if ($("#div_grid_notificacion").is(":visible")) {
        $("#div_grid_notificacion").hide();
    }

    if ($("#div_grid_corte").is(":visible")) {
        $("#div_grid_corte").hide();
    }

}

function fn_carga_grilla() {

    var total_register;

    $grid_principal.pqGrid( "option", "dataModel", dataModel );
    $grid_principal.pqGrid( "refreshDataAndView" );
    $grid_principal.pqGrid( "option", "title", "Total Registros: " + total_register);

}

function fn_limpiar() {

    $("#tx_num_client").val("");
    $("#tx_nom_client").val("");
    $("#tx_direc_client").val("");
    $("#tx_cent_opera").val("");
    $("#tx_state_corte").val("");
    $("#tx_inst_corte").val("");
    $("#tx_state_notif").val("");
    $("#tx_fech_notif").val("");
    $("#tx_state_sumin").val("");
    $("#tx_ind_auto").val("");
    $("#tx_ind_conv").val("");
    $("#tx_fech_afec_cort").val("");
    $("#tx_ind_rest_cort").val("");
    $("#tx_ind_susp").val("");
}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $("#space").show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
    setTimeout(function(){$("#space").html("");$("#space").hide(); }, segundos);
}

