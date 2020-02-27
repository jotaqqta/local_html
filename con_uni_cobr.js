var g_modulo = "Cobranza";
var g_tit = "Consulta Universos de Cobranza";
var $grid_principal;
var $grid_regional;
var $grid_campana;
var $grid_estado;
var sql_grid_prim = "";
var sql_grid_2 = "";
var sql_grid_3 = "";
var parameters = {};


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
    jQuery('#tx_cod').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_cons').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    //COMBOS
    fn_campana();

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

    //DEFINE LAS GRILLAS SECUNDARIAS
    fn_setea_grids_secundarias();

    //DIBUJA LOS ICONOS DE LOS BOTONES

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $("#div_second").hide();
    $("#ra").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    //              <-- TABS -->

    $("#tab_uni_regional").on( "click", function () {


        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_uni_regional", "#div_grid_regional")

    });

    $("#tab_uni_campaña").on( "click", function () {

        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_uni_campaña", "#div_grid_campaña")

    });

    $("#tab_uni_estado").on( "click", function () {

        fn_ocultar();
        fn_remove_active();
        fn_set_active("#tab_uni_estado", "#div_grid_estado")

    });

    $("#co_consultar").on("click", function() {

        if ($.trim($("#co_consultar").text()) === "Consultar") {

            if ($("#cb_campana").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UNA CAMPAÑA!!!</strong></div>',3000);
                $("#cb_campana").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_consultar"));
            $("#div_prin").slideDown();
            $("#div_filtro_bts").slideUp();
            $('#div_filtro_bts').modal('hide');
            fn_carga_grilla();
            $(window).scrollTop(0);

        }
    });

    $("#co_filtro").on("click", fn_filtro);

    $("#co_limpiar").on("click", function () {
        if ($.trim($("#co_limpiar").text()) == "Limpiar") {
            fn_limpiar();
            return;
        }
        else
            window.close();
    });

    $("#co_cancel").on("click", function (){
        $('#div_filtro_bts').modal('hide');
    });

    $("#co_salir").on("click", function (){
        $('#div_total_bts').modal('hide');
    });

    $("#co_volver").on("click", function (e) {
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

    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData)
            {
                var dataCell = ui.rowData;
                $("#div_prin").hide();
                $("#div_second").show();
                $("#ra").show();
                fn_ocultar();
                fn_set_active("#tab_uni_regional", "#div_grid_regional")
                $grid_motivos.pqGrid("refreshView");
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

    $("#co_excel_2").on("click", function (e) {

        if ($("#tab_uni_regional").is(":visible")) {
            e.preventDefault();
            var col_model=$( "#div_grid_regional" ).pqGrid( "option", "colModel" );
            var cabecera = "";
            for (i = 0; i < col_model.length; i++){
                if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
            }
            $("#excel_cabecera").val(cabecera);
            var element =$grid_regional.pqGrid("option","dataModel.data");
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
        }

        if ($("#tab_uni_campaña").is(":visible")) {
            e.preventDefault();
            var col_model=$( "#div_grid_campaña" ).pqGrid( "option", "colModel" );
            var cabecera = "";
            for (i = 0; i < col_model.length; i++){
                if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
            }
            $("#excel_cabecera").val(cabecera);
            var element =$grid_campana.pqGrid("option","dataModel.data");
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
        }

        if ($("#tab_uni_estado").is(":visible")) {
            e.preventDefault();
            var col_model=$( "#div_grid_estado" ).pqGrid( "option", "colModel" );
            var cabecera = "";
            for (i = 0; i < col_model.length; i++){
                if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
            }
            $("#excel_cabecera").val(cabecera);
            var element =$grid_estado.pqGrid("option","dataModel.data");
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
        }
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_setea_grid_principal() {

    var data =  [
         { C1: 'TEXTO DE EJEMPLO', C2: '100', C3: '25000000' },
         { C1: 'TEXTO DE EJEMPLO', C2: '100', C3: '25000000' },
         { C1: 'TEXTO DE EJEMPLO', C2: '100', C3: '35000000' },
         { C1: 'TEXTO DE EJEMPLO', C2: '100', C3: '28941000' },
         { C1: 'TEXTO DE EJEMPLO', C2: '100', C3: '25000000' },
         { C1: 'TEXTO DE EJEMPLO', C2: '100', C3: '25005000' },
         { C1: 'TEXTO DE EJEMPLO', C2: '100', C3: '25070000' },
         { C1: 'TEXTO DE EJEMPLO', C2: '250', C3: '25790000' },
         { C1: 'TEXTO DE EJEMPLO', C2: '300', C3: '25790000' },
         { C1: 'TEXTO DE EJEMPLO', C2: '400', C3: '25790000' },
         { C1: 'TEXTO DE EJEMPLO', C2: '950', C3: '25790000' },
         { C1: 'TEXTO DE EJEMPLO', C2: '840', C3: '25790000' }

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
        selectionModel: { type: 'row',mode:'single'},
        numberCell: { show: true },
        pageModel: { rPP: 100, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        summaryData: calcularTotal(1, data),
        toolbar: {
            cls: "pq-toolbar-export",
            items:[
                { type: "button", label: "Filtro",    attr: "id=co_filtro",  cls: "btn btn-primary" },
                { type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"}
            ]
        },
    };

    obj.colModel = [
        { title: "Estado de Cobranza", width: 369, dataType: "string", dataIndx: "C1", halign: "center", align: "left" },
        { title: "Cantidad Suministros", width: 369, dataType: "string", dataIndx: "C2", halign: "center", align: "center", summary: { type: "sum" }},
        { title: "Monto de Deuda", width: 369, dataType: "string", dataIndx: "C3", halign: "center", align: "center", summary: { type: "sum" } },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

function fn_setea_grids_secundarias() {

    //Setea grilla Regional

    var data2 =  [
        { C1: '', C2: '', C3: '' },
        { C1: '', C2: '', C3: '' },
        { C1: '', C2: '', C3: '' },
    ];

    var obj2 = {
        height: "500",
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
        summaryData: calcularTotal(2, data2),
        toolbar: false,
    };

    obj2.colModel = [
        { title: "Regional", width: 364, dataType: "string", dataIndx: "C1", halign: "center", align: "left" },
        { title: "Cantidad Suministros", width: 364, dataType: "string", dataIndx: "C2", halign: "center", align: "center"},
        { title: "Monto de Deuda", width: 364, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
    ];


    obj2.dataModel = { data: data2 };

    $grid_regional = $("#div_grid_regional").pqGrid(obj2);
    $grid_regional.pqGrid( "refreshDataAndView" );

    //Setea grilla 2 Campaña

    var data3 =  [
        { C1: '', C2: '', C3: '', C4: "" },
        { C1: '', C2: '', C3: '', C4: "" },
        { C1: '', C2: '', C3: '', C4: "" },
    ];

    var obj3 = {
        height: "500",
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
        { title: "Campaña", width: 273, dataType: "string", dataIndx: "C1", halign: "center", align: "left" },
        { title: "Cantidad Suministros", width: 273, dataType: "string", dataIndx: "C2", halign: "center", align: "center"},
        { title: "Deuda Inicial", width: 273, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Deuda Final", width: 273, dataType: "string", dataIndx: "C4", halign: "center", align: "center"},
    ];


    obj3.dataModel = { data: data3 };

    $grid_campana = $("#div_grid_campaña").pqGrid(obj3);
    $grid_campana.pqGrid( "refreshDataAndView" );

    //Setea grilla 3 Estado

    var data4 =  [
        { C1: '', C2: '', C3: '', C4: '', C5: '', C6: '', C7: '', C8: ''},
        { C1: '', C2: '', C3: '', C4: '', C5: '', C6: '', C7: '', C8: ''},
        { C1: '', C2: '', C3: '', C4: '', C5: '', C6: '', C7: '', C8: ''},
    ];

    var obj4 = {
        height: "500",
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

    obj4.colModel = [
        { title: "Codigo Campaña", width: 120, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Descripción", width: 302, dataType: "string", dataIndx: "C2", halign: "center", align: "left"},
        { title: "Rol", width: 100, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Fecha Inicio", width: 90, dataType: "string", dataIndx: "C4", halign: "center", align: "center"},
        { title: "Fecha Fin", width: 90, dataType: "string", dataIndx: "C5", halign: "center", align: "center"},
        { title: "Deuda Inicial", width: 100, dataType: "string", dataIndx: "C6", halign: "center", align: "center"},
        { title: "Deuda Final", width: 90, dataType: "string", dataIndx: "C7", halign: "center", align: "center"},
        { title: "Cantidad de Suministros", width: 200, dataType: "string", dataIndx: "C8", halign: "center", align: "center"},
    ];


    obj4.dataModel = { data: data4 };

    $grid_estado = $("#div_grid_estado").pqGrid(obj4);
    $grid_estado.pqGrid( "refreshDataAndView" );

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~


function calcularTotal(grid, datos) {
    var suministrosTotal = 0,
        deudaTotal = 0,
        data,
        totalData;

    // Grilla principal
    if (grid === 1) {
        data = $grid_principal? $grid_principal.option('dataModel.data'): datos;

        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            suministrosTotal += (row["C2"] * 1);
            deudaTotal += (row["C3"] * 1);
        }

        totalData = { C1: "Total:", C2: suministrosTotal, C3: deudaTotal};
    }

    // Grilla Regional
    if (grid === 2) {
        data = $grid_regional? $grid_regional.option('dataModel.data'): datos;

        for (var i = 0; i < data.length; i++) {
            var row = data[i];
            suministrosTotal += (row["C2"] * 1);
            deudaTotal += (row["C3"] * 1);
        }

        totalData = { C1: "Total:", C2: suministrosTotal, C3: deudaTotal};
    }

    return [totalData];
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_filtro(){

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();


    });
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_campana(){

    $("#cb_campana").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}

function fn_set_active(tab, div_grilla) {
    $(tab).addClass("active");
    $(div_grilla).show();

}

function fn_remove_active() {

    if ($("#tab_uni_regional").hasClass("active")) {
        $("#tab_uni_regional").removeClass("active")
    }

    if ($("#tab_uni_campaña").hasClass("active")) {
        $("#tab_uni_campaña").removeClass("active")
    }

    if ($("#tab_uni_estado").hasClass("active")) {
        $("#tab_uni_estado").removeClass("active")
    }
}

function fn_ocultar() {

    if ($("#div_grid_regional").is(":visible")) {
        $("#div_grid_regional").hide();
    }

    if ($("#div_grid_campaña").is(":visible")) {
        $("#div_grid_campaña").hide();
    }

    if ($("#div_grid_estado").is(":visible")) {
        $("#div_grid_estado").hide();
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

    $("#cb_campana").val("");
}
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

