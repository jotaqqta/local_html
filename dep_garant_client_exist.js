var g_modulo = "Cobranza";
var g_tit = "Deposito Garantia Cliente Existente";
var $grid_principal;
var $grid_mano_obra;
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

    //COMBOS


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
    fn_setea_grids();

    //DIBUJA LOS ICONOS DE LOS BOTONES

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $("#div_grid_mano_obra").hide();

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

    $("#co_leer").on( "click", function () {

        if ($.trim($("#co_leer").text() === "Leer")) {

            if ($("#tx_num_client").val() === "") {
                fn_mensaje('#mensaje_prin','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UN NÚMERO DE CLIENTE!!!</strong></div>',3000);
                $("#tx_num_client").focus();
                return;
            }

            if (!$.isNumeric($("#tx_num_client").val())) {
                fn_mensaje('#mensaje_prin','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR COMPROBAR EL VALOR INGRESADO!!!</strong></div>',3000);
                $("#tx_num_client").focus();
                return;
            }
        }

        fn_mensaje_boostrap("Se genéro", g_tit, $("#co_leer"));
        $(window).scrollTop(0);
    });

    $("#co_modificar").on("click", function() {

        if ($.trim($("#co_modificar").text()) === "Modificar") {

            if ($.trim($("#edit_title").text()) === "Editar Materiales") {
                if ($("#tx_codigo").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UN CÓDIGO!!!</strong></div>',3000);
                    $("#tx_codigo").focus();
                    return;
                }

                if ($("#tx_valor").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UN VALOR!!!</strong></div>',3000);
                    $("#tx_valor").focus();
                    return;
                }

                if ($("#tx_cantidad").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UNA CANTIDAD!!!</strong></div>',3000);
                    $("#tx_cantidad").focus();
                    return;
                }

                if ($("#tx_desc").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UNA DESCRIPCIÓN!!!</strong></div>',3000);
                    $("#tx_desc").focus();
                    return;
                }

                fn_mensaje_boostrap("Se modifico", g_tit, $("#co_modificar"));
                $("#div_prin").slideDown();
                $("#div_edit_bts").slideUp();
                $('#div_edit_bts').modal('hide');
                fn_carga_grilla();
                $(window).scrollTop(0);
            }

            if ($.trim($("#edit_title").text()) === "Editar Mano de Obra") {
                if ($("#tx_codigo").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INGRESAR UN CÓDIGO!!!</strong></div>',3000);
                    $("#tx_codigo").focus();
                    return;
                }

                if ($("#tx_valor").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UN VALOR!!!</strong></div>',3000);
                    $("#tx_valor").focus();
                    return;
                }

                if ($("#tx_cantidad").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UNA CANTIDAD!!!</strong></div>',3000);
                    $("#tx_cantidad").focus();
                    return;
                }

                if ($("#tx_desc").val() === "") {

                    fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR UNA DESCRIPCIÓN!!!</strong></div>',3000);
                    $("#tx_desc").focus();
                    return;
                }

                fn_mensaje_boostrap("Se modifico", g_tit, $("#co_modificar"));
                $("#div_prin").slideDown();
                $("#div_edit_bts").slideUp();
                $('#div_edit_bts').modal('hide');
                fn_carga_grilla();
                $(window).scrollTop(0);
            }

        }
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
        window.close();
    });

    $grid_principal.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData)
            {
                var dataCell = ui.rowData;
                fn_edit(dataCell, 1);
            }
        }
    });

    $grid_mano_obra.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData)
            {
                var dataCell = ui.rowData;
                fn_edit(dataCell, 2);
            }
        }
    });


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//EXCEL
    $("#co_excel").on("click", function (e) {

        fn_filtro();
        e.preventDefault();
        var col_model=$( "#div_grid_principal" ).pqGrid( "option", "colModel" );
        var cabecera = "";
        for (i = 0; i < col_model.length; i++){
            if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
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
function fn_setea_grids() {

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
        editable:false,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 100, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar: false,
    };

    obj.colModel = [
        { title: "Codigo", width: 268, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 269, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Valor", width: 268, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Cantidad", width: 269, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
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
        editable:false,
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar: false,
    };

    obj2.colModel = [
        { title: "Codigo", width: 268, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 269, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Valor", width: 268, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Cantidad", width: 269, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
    ];


    obj2.dataModel = { data: data2 };

    $grid_mano_obra = $("#div_grid_mano_obra").pqGrid(obj2);
    $grid_mano_obra.pqGrid( "refreshDataAndView" );

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~


function fn_edit(data, grilla){

    if (grilla === 1) {

        fn_limpiar();

        $("#tx_codigo").val(data.C1);
        $("#tx_desc").val(data.C2);
        $("#tx_valor").val(data.C3);
        $("#tx_cantidad").val(data.C4);

        $("#edit_title").html("Editar Materiales");

        $("#div_edit_bts").modal({backdrop: "static",keyboard:false});
        $("#div_edit_bts").on("shown.bs.modal", function () {
            $("#div_edit_bts div.modal-footer button").focus();

        });
    }

    if (grilla === 2) {

        fn_limpiar();

        $("#tx_codigo").val(data.C1);
        $("#tx_desc").val(data.C2);
        $("#tx_valor").val(data.C3);
        $("#tx_cantidad").val(data.C4);

        $("#edit_title").html("Editar Mano de Obra");

        $("#div_edit_bts").modal({backdrop: "static",keyboard:false});
        $("#div_edit_bts").on("shown.bs.modal", function () {
            $("#div_edit_bts div.modal-footer button").focus();

        });
    }
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
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
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

