var g_modulo = "Cobranza";
var g_tit = "Deposito Garantia Cliente Existente";
var $grid_principal;
var $grid_mano_obra;
var $grid_pre_dep;
var rowIndx = [];
var rowIndx2 = [];
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
    jQuery('#tx_cod').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_cons').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    $("._input_selector").inputmask("dd/mm/yyyy");

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

    //DEFINE LAS GRILLAS
    fn_setea_grids_principales();
    fn_setea_grid_secundaria();

    $("#div_grid_mano_obra").hide();
    fn_ocultar_botones();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#tab_dep_materiales").on( "click", function () {


        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_dep_materiales", "#div_grid_materiales")

    });

    $("#tab_dep_mano_obra").on( "click", function () {

        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_dep_mano_obra", "#div_grid_mano_obra")

    });
    
    $("#co_grabar").on( "click", function () {
        
        if ($.trim($("#co_grabar").text() === "Grabar")) {

            if ($("#tx_mont_dep_gart").val() === "") {

                fn_mensaje('#mensaje_depo','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UN MONTO!!!</strong></div>',3000);
                $("#tx_mont_dep_gart").focus();
                return;
            }

            if ($("#tx_fech_firm").val() === "") {

                fn_mensaje('#mensaje_depo','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UNA FECHA!!!</strong></div>',3000);
                $("#tx_fech_firm").focus();
                return;
            }

            if ($("#tx_fech_ini_conts").val() === "") {

                fn_mensaje('#mensaje_depo','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UNA FECHA!!!</strong></div>',3000);
                $("#tx_fech_ini_conts").focus();
                return;
            }

            if ($("#tx_fech_fin_conts").val() === "") {

                fn_mensaje('#mensaje_depo','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UNA FECHA!!!</strong></div>',3000);
                $("#tx_fech_fin_conts").focus();
                return;
            }

            if ($("#tx_conts").val() === "") {

                fn_mensaje('#mensaje_depo','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR RELLENAR EL CAMPO!!!</strong></div>',3000);
                $("#tx_conts").focus();
                return;
            }

            if ($("#tx_fech_firm").val() !== "") {
                if (fn_validar_fecha($("#tx_fech_firm").val()) === false) {
                    fn_mensaje('#mensaje_depo', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fech_ini_conts").focus();
                    return;
                }
            }

            if ($("#tx_fech_ini_conts").val() !== "") {
                if (fn_validar_fecha($("#tx_fech_ini_conts").val()) === false) {
                    fn_mensaje('#mensaje_depo', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fech_ini_conts").focus();
                    return;
                }
            }

            if ($("#tx_fech_fin_conts").val() !== "") {
                if (fn_validar_fecha($("#tx_fech_fin_conts").val()) === false) {
                    fn_mensaje('#mensaje_depo', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fech_fin_conts").focus();
                    return;
                }
            }

            if ($("#tx_fech_ini_conts").val() !== "" && $("#tx_fech_fin_conts").val() !== "") {

                if (fn_fecha($("#tx_fech_ini_conts").val(), $("#tx_fech_fin_conts").val()) === false) {
                    fn_mensaje('#mensaje_depo', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR VALIDAR EL RANGO DE TIEMPO INGRESADO!!!</strong></div>', 3000);
                    $("#tx_fech_ini_conts").focus();
                    return;
                }
            }

            fn_mensaje_boostrap("Se modifico", g_tit, $("#co_modificar"));
            $("#div_prin").slideDown();
            $("#div_depo_bts").slideUp();
            $('#div_depo_bts').modal('hide');
            $(window).scrollTop(0);
            
        }
    });

    $("#co_leer").on( "click", function () {

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

        $("#co_cerrar").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
        $("#co_cerrar").removeClass("btn-secundary");

        $("#tx_num_client").prop("disabled", true);

        fn_mostrar();
        fn_mensaje_boostrap("Se genéro", g_tit, $("#co_leer"));
        $(window).scrollTop(0);
    });

    $("#co_dep_garan").on("click", function () {
        $("#div_depo_bts").modal({backdrop: "static", keyboard: false});
        $("#div_depo_bts").on("shown.bs.modal", function () {
            $("#div_depo_bts div.modal-footer button").focus();

        });
    });

    $("#co_con_pd").on("click", function () {
        $("#div_con_bts").modal({backdrop: "static",keyboard:false});
        $("#div_con_bts").on("shown.bs.modal", function () {
            $("#div_con_bts div.modal-footer button").focus();
        });

        setTimeout(function() {

            $grid_pre_dep.pqGrid("refreshView");

        }, 400);

    });

    $("#co_limpiar").on("click", function () {
        if ($.trim($("#co_limpiar").text()) === "Limpiar") {
            fn_limpiar();
        }
        else
            window.close();
    });

    $("#co_cancel").on("click", function (){
        $('#div_edit_bts').modal('hide');
    });

    $("#co_cerrar_con").on("click", function (){
        $('#div_con_bts').modal('hide');
    });
    
    $("#co_cerrar_dep").on("click", function (){
        $('#div_depo_bts').modal('hide');
    });

    $("#co_salir").on("click", function (){
        $('#div_total_bts').modal('hide');
    });

    $("#co_volver").on("click", function () {
        $("#div_second").hide();
        $("#div_prin").show();
        $("#ra").hide();
        fn_remove_active();
        //$grid_principal.pqGrid( "refreshDataAndView" );
        $(window).scrollTop(0);
    });

    $("#co_cerrar").on("click", function (){

        if ($.trim($("#co_cerrar").text()) === "Cancelar") {

            $("#tx_num_client").prop("disabled", false);
            fn_limpiar_prin();
            fn_ocultar_botones();
            $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

        }

        if ($.trim($("#co_cerrar").text()) === "Cerrar") {

            window.close();
        }
    });

    $grid_principal.pqGrid({
        beforeCheck: function( event, ui ) {
            if (ui.check) {
                rowIndx.push(ui.rowIndx);

            } else {

                if (rowIndx.includes(ui.rowIndx)) {
                    var pos = rowIndx.indexOf(ui.rowIndx);
                    rowIndx.splice(pos, 1);
                }

                if (rowIndx.length <= 0 && rowIndx2.length <= 0) {
                    $("#co_gen_pre").prop( "disabled", true);
                }
            }
        }
    });

    $grid_mano_obra.pqGrid({
        beforeCheck: function( event, ui ) {
            if (ui.check) {
                rowIndx2.push(ui.rowIndx);

            } else {

                if (rowIndx2.includes(ui.rowIndx)) {
                    var pos = rowIndx2.indexOf(ui.rowIndx);
                    rowIndx2.splice(pos, 1);
                }

                if (rowIndx.length <= 0 && rowIndx2.length <= 0) {
                    $("#co_gen_pre").prop( "disabled", true);
                }
            }
        }
    });

    $grid_principal.pqGrid({
        cellSave: function( event, ui ) {

            var dataCell = ui.rowData;

            $("#co_gen_pre").prop( "disabled", false);


            // FUNCION Y CODIGO PARA ENVIAR DATOS Y GUARDARLOS EN EL BACKEND
        }
    });

    $grid_mano_obra.pqGrid({
        cellSave: function( event, ui ) {

            var dataCell = ui.rowData;

            $("#co_gen_pre").prop( "disabled", false);


            // FUNCION Y CODIGO PARA ENVIAR DATOS Y GUARDARLOS EN EL BACKEND
        }
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_setea_grids_principales() {

    // Setea grilla Materiales

    var data =  [
        { C1: '001', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '574482', C4: '56' },
        { C1: '002', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '456348', C4: '12' },
        { C1: '003', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '456744', C4: '78' },
        { C1: '004', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '421574', C4: '35' },
        { C1: '005', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '123854', C4: '98' },
        { C1: '006', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '185454', C4: '45' },
        { C1: '007', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '121751', C4: '123' },
        { C1: '008', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '752456', C4: '453' },
        { C1: '009', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '752456', C4: '453' },

    ];

    var obj = {
        height: "280",
        showTop: true,
        showBottom:true,
        showTitle : false,
        title: "",
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible:true,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 100, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar: false,
    };

    obj.colModel = [
        { dataIndx: "CH1", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: false,
                header: false,
            }
        },
        { title: "Codigo", width: 150, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 500, dataType: "string", dataIndx: "C2", halign: "center", align: "left", editable: false },
        { title: "Valor", width: 150, dataType: "string", dataIndx: "C3", halign: "center", align: "center", editable: false },
        { title: "Cantidad", width: 244, dataType: "float", dataIndx: "C4", halign: "center", align: "center", editable: function(ui) {
            return rowIndx.includes(ui.rowIndx);
            },
        },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_materiales").pqGrid(obj);

    // Setea grilla mano de obra

    var data2 =  [
        { C1: '006', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '185454', C4: '45' },
        { C1: '007', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '121751', C4: '123' },
        { C1: '008', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '752456', C4: '453' },
        { C1: '009', C2: 'DESCRIPCIÓN DE EJEMPLO', C3: '752456', C4: '453' },
    ];

    var obj2 = {
        height: "280",
        showTop: true,
        showBottom:true,
        showTitle : false,
        title: "",
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible:true,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar: false,
    };

    obj2.colModel = [
        { dataIndx: "CH1", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: true,
            cb: {
                all: false,
                header: false,
            }
        },
        { title: "Codigo", width: 150, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
        { title: "Descripción", width: 500, dataType: "string", dataIndx: "C2", halign: "center", align: "left", editable: false },
        { title: "Valor", width: 150, dataType: "string", dataIndx: "C3", halign: "center", align: "center", editable: false },
        { title: "Cantidad", width: 244, dataType: "float", dataIndx: "C4", halign: "center", align: "center", editable: function(ui) {
                return rowIndx2.includes(ui.rowIndx);
            },
        },
    ];

    obj2.dataModel = { data: data2 };

    $grid_mano_obra = $("#div_grid_mano_obra").pqGrid(obj2);

}

function fn_setea_grid_secundaria() {

    // Setea grilla modal presupuestos y depositos

    var obj = {
        height: '100%',
        showTop: true,
        showBottom: true,
        showHeader: true,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        editable: false,
        editor: { type: "textbox", select: true, style: "outline:none;" },
        selectionModel: { type: 'cell' },
        numberCell: { show: true},
        title: "Mantenedor de Tablas Generales",
        pageModel: { type: "local" },
        scrollModel: { theme: true },
        toolbar: false,
        dataModel:{ data: [
                { C1: '', C2: '',   C3: '', C4: '', C5: '', C6: '', C7: '' },
                { C1: '', C2: '',   C3: '', C4: '', C5: '', C6: '', C7: '' },
                { C1: '', C2: '',   C3: '', C4: '', C5: '', C6: '', C7: '' },
                { C1: '', C2: '',   C3: '', C4: '', C5: '', C6: '', C7: '' },
                { C1: '', C2: '',   C3: '', C4: '', C5: '', C6: '', C7: '' },
                { C1: '', C2: '',   C3: '', C4: '', C5: '', C6: '', C7: '' },
                { C1: '', C2: '',   C3: '', C4: '', C5: '', C6: '', C7: '' },
                { C1: '', C2: '',   C3: '', C4: '', C5: '', C6: '', C7: '' },
                { C1: '', C2: '',   C3: '', C4: '', C5: '', C6: '', C7: '' },
            ] }
    };

    obj.colModel = [
        { title: "Número de Presupuesto", width: 170, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Fecha Presupuesto", width: 130, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Número Deposito", width: 120, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Monto Deposito", width: 120, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Construcción", width: 120, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Fecha Inicio", width: 100, dataType: "string", dataIndx: "C6", halign: "center", align: "center" },
        { title: "Fecha Fin", width: 100, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },
    ];

    $grid_pre_dep = $("#div_grid_pre_dep").pqGrid(obj);
    $grid_pre_dep.pqGrid("refreshDataAndView");

}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////

function fn_validar_fecha(value){
    var real, info;
    if (/^(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}$/.test(value)) {
        info = value.split(/\//);
        var fecha = new Date(info[2], info[1]-1, info[0]);
        if ( Object.prototype.toString.call(fecha) === '[object Date]' ){
            real = fecha.toISOString().substr(0,10).split('-');
            if (info[0] === real[2] && info[1] === real[1] && info[2] === real[0]) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }
    else {
        return false;
    }
}

function fn_fecha(valor, valor2) {

    var fecha = valor.split("/");
    fecha.reverse();
    Date.parse(fecha);

    var fecha2 = valor2.split("/");
    fecha2.reverse();
    Date.parse(fecha2);

    if (fecha <= fecha2) {
        return true;
    } else {
        return false;
    }


}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_set_active(tab, div_grilla) {
    $(tab).addClass("active");
    $(div_grilla).show();

}

function fn_remove_active() {

    if ($("#tab_dep_materiales").hasClass("active")) {
        $("#tab_dep_materiales").removeClass("active")
    }

    if ($("#tab_dep_mano_obra").hasClass("active")) {
        $("#tab_dep_mano_obra").removeClass("active")
    }

}

function fn_mostrar() {
    $("#co_con_pd").show();
    $("#co_dep_garan").show();
    $("#co_gen_pre").show();

}

function fn_ocultar() {

    if ($("#div_grid_materiales").is(":visible")) {
        $("#div_grid_materiales").hide();
    }

    if ($("#div_grid_mano_obra").is(":visible")) {
        $("#div_grid_mano_obra").hide();
    }

}

function fn_carga_grilla() {

    var total_register;

    $grid_principal.pqGrid( "option", "dataModel", dataModel );
    $grid_principal.pqGrid( "refreshDataAndView" );
    $grid_principal.pqGrid( "option", "title", "Total Registros: " + total_register);

}

// Limpiar Filtro
function fn_limpiar(){

    $("#tx_codigo").val("");
    $("#tx_desc").val("");
    $("#tx_valor").val("");
    $("#tx_cantidad").val("");

}

function fn_limpiar_prin() {

    $("#tx_num_client").val("");
    $("#tx_nom_client").val("");
    $("#tx_direc_client").val("");
    $("#tx_info_add_client").val("");
    $("#tx_ruta").val("");
    $("#tx_tarifa").val("");
    $("#tx_regional").val("");
    $("#tx_provincia").val("");
    $("#tx_distrito").val("");
    $("#tx_corregimiento").val("");
    $("#tx_state_client").val("");
    $("#tx_state_conex").val("");
}

function fn_ocultar_botones() {

    $("#co_con_pd").hide();
    $("#co_dep_garan").hide();
    $("#co_gen_pre").hide();
    $("#co_gen_pre").prop( "disabled", true);
}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

