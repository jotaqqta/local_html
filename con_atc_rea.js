var g_modulo = "Atención Integral de Clientes";
var g_tit = "Consulta de Atenciones Realizadas";
var $grid_principal;
var $grid_motivos;
var $grid_ordenes;
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
    fn_regional();
    fn_canalcomu();
    fn_tipoaten();
    fn_mot_cliente();
    fn_mot_empresa();
    fn_fecha();
    fn_rango();
    fn_hasta();
    fn_desde();
    fn_estado();
    fn_plazos();
    fn_limpiar();

    // Ocultar combos
    fn_ocultar();

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
    $("#co_volver").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_excel_2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_excel_3").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    // Setea valores predeterminados del filtro

    $(function() {
        $("#cb_fecha").val('1');
        $("#cb_plazos").val('1');
        $("#cb_canalcomu").val('1');
        $("#cb_tipoaten").val('1');
    });

    $("#div_second").hide();
    $("#ra").hide();
    $("#co_excel_3").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_filtro").on("click", fn_filtro);

    $("#co_cerrar_t").on("click", function(e){
        window.close();
    });



    $("select[id=cb_fecha]").change(function(){

        if ($('select[id=cb_fecha]').val() === "1" || $('select[id=cb_fecha]').val() === "0") {
            fn_ocultar()
        } else {
            fn_mostrar()
        }

    });

    $("#co_consultar").on("click", function() {

        if ($.trim($("#co_consultar").text()) == "Consultar") {
            if ($("#cb_regional").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UNA REGIONAL!!!</strong></div>',3000);
                $("#cb_regional").focus();
                return;
            }
            if ($("#cb_tipoaten").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE ATENCIÓN!!!</strong></div>',3000);
                $("#cb_tipoaten").focus();
                return;
            }
            if ($("#cb_canalcomu").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN CANAL DE COMUNICACIÓN!!!</strong></div>',3000);
                $("#cb_canalcomu").focus();
                return;
            }
            if ($("#cb_mot_cliente").val() == ""){

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO DEL CLIENTE!!!</strong></div>',3000);
                $("#cb_mot_cliente").focus();
                return;
            }
            if ($("#cb_mot_empresa").val() == ""){

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO DE LA EMPRESA!!!</strong></div>',3000);
                $("#cb_mot_empresa").focus();
                return;
            }
            if ($("#cb_fecha").val() == ""){
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UNA FECHA!!!</strong></div>',3000);
                $("#cb_fecha").focus();
                return;
            }
            if ($("#cb_rango").val() == "" && $("#cb_rango").is(":visible")){
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN RANGO DE FECHAS!!!</strong></div>',3000);
                $("#cb_rango").focus();
                return;
            }
            if ($("#cb_desde").val() == "" && $("#cb_rango").is(":visible")){
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN VALOR DE INICIO!!!</strong></div>',3000);
                $("#cb_desde").focus();
                return;
            }
            if ($("#cb_hasta").val() == "" && $("#cb_rango").is(":visible")){
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN VALOR DE FIN!!!</strong></div>',3000);
                $("#cb_hasta").focus();
                return;
            }
            if ($("#cb_estado").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN ESTADO!!!</strong></div>',3000);
                $("#cb_estado").focus();
                return;
            }
            if ($("#cb_plazos").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN PLAZO!!!</strong></div>',3000);
                $("#cb_plazos").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_consultar"));
            fn_carga_grilla();
            $("#div_prin").slideDown();
            $("#div_second").slideDown();
            $("#div_filtro_bts").slideUp();
            $('#div_filtro_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });

    $("#tab_motivos").on("click", function (){

        fn_remove_active();
        fn_ocular_grillas();
        fn_set_active("#tab_motivos", "#div_grid_motivos");
        $("#co_excel_2").show();
        $grid_motivos.pqGrid("refreshView");

    });
    $("#tab_ordenes").on("click", function (){

        fn_remove_active();
        fn_ocular_grillas();
        fn_set_active("#tab_ordenes", "#div_grid_ordenes");
        $("#div_grid_ordenes_css").show();
        $("#co_excel_3").show();
        $grid_ordenes.pqGrid("refreshView");

    });
    $("#tab_clientes").on("click", function (){

        fn_remove_active();
        fn_ocular_grillas();
        fn_set_active("#tab_clientes", "#div_con_clientes");

    });

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

    $("#co_cerrar").on("click", function (){
        window.close();
    });

    $("#co_volver").on("click", function (e) {
        $("#div_prin").show();
        $("#div_second").hide();
        $("#ra").hide();
        fn_remove_active();
        $("#tab_motivos").addClass("active");
        //$grid_principal.pqGrid( "refreshDataAndView" );
        $(window).scrollTop(0);
    });

    //BOTON FILTRO GRILLA PRINCIPAL


    $("#co_filtro").on("click", function(){
        fn_filtro();
    });

    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData)
            {
                var dataCell = ui.rowData;
                fn_ocular_grillas();
                $("#div_second").show();
                $("#ra").show();
                $("#div_grid_motivos").show();
                $("#co_excel_2").show();
                $("#div_prin").hide();
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

        e.preventDefault();
        var col_model=$( "#div_grid_motivos" ).pqGrid( "option", "colModel" );
        var cabecera = "";
        for (i = 0; i < col_model.length; i++){
            if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
        }
        $("#excel_cabecera").val(cabecera);
        var element =$grid_motivos.pqGrid("option","dataModel.data");
        if (element)
            a= element.length;
        else
            a = 0;
        if(a > 0){
            $("#tituloexcel").val(g_tit);
            $("#sql").val(sql_grid_2);
            $("#frm_Exel").submit();
            return;
        }
    });

    $("#co_excel_3").on("click", function (e) {

        e.preventDefault();
        var col_model=$( "#div_grid_ordenes" ).pqGrid( "option", "colModel" );
        var cabecera = "";
        for (i = 0; i < col_model.length; i++){
            if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
        }
        $("#excel_cabecera").val(cabecera);
        var element =$grid_ordenes.pqGrid("option","dataModel.data");
        if (element)
            a= element.length;
        else
            a = 0;
        if(a > 0){
            $("#tituloexcel").val(g_tit);
            $("#sql").val(sql_grid_3);
            $("#frm_Exel").submit();
            return;
        }
    });

});



//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_setea_grid_principal() {

    var data =  [
        { C1: 'Normal', C2: '00/00/0000', C3: '31/12/2019', C4: '31/12/2019', C5: '(8000) PANAMÁ METRO', C6: 'TEXTO', C7: 'CIERRE', C8: '17/12/2019', C9: 15, C10: "Texto de Ejemplo", C11: "Texto de Ejemplo", C12: "Soporte", C13: "Prioritaria", C14: "INTERNA"},
        { C1: 'Prioritaria', C2: '12/02/2015',C3: '31/12/2049', C4: '31/12/2019', C5: '(6000) PANAMÁ SUR', C6:'TEXTO', C7: "CIERRE", C8: '17/12/2019', C9: 20, C10: "Texto de Ejemplo", C11: "Texto de Ejemplo", C12: "Soporte", C13: "Prioritaria", C14: "INTERNA"},
        { C1: 'Alta', C2: '15/05/2019', C3: '31/12/2019', C4: '31/12/2019', C5: '(7000) PANAMÁ NORTE', C6: 'TEXTO', C7: "CIERRE", C8: '17/12/2019', C9: 30, C10: "Texto de Ejemplo", C11: "Texto de Ejemplo", C12: "Soporte", C13: "Prioritaria", C14: "INTERNA" },
    ];

    var data2 = [
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios D', C3: 'Requerimiento Rapido', C4: 'Personal', C5: '24/10/2019 13:23:09', C6: '24/10/2019 13:23:09', C7: '', C8: '', C9: '', C10: '', C11: ''}
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
        { title: "Atención", width:65, dataType: "number", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Inicio", width: 80, dataType: "string", dataIndx: "C2", halign: "center", align: "center"},
        { title: "Vencimiento Empresa",width: 85, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Vencimiento ASEP", width: 85, dataType: "number", dataIndx: "C4", halign: "center", align: "center"},
        { title: "Regional",width: 200, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Rol Resp.", width: 100, dataType: "string", dataIndx: "C6", halign: "center", align: "center"},
        { title: "Rol Cierre",width: 100, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },
        { title: "Cierre", width: 80, dataType: "string", dataIndx: "C8", halign: "center", align: "center"},
        { title: "Nro. Suministro", width: 75, dataType: "string", dataIndx: "C9", halign: "center", align: "center"},
        { title: "Motivo Cliente", width: 200, dataType: "string", dataIndx: "C10", halign: "center", align: "left"},
        { title: "Motivo Empresa", width: 200, dataType: "string", dataIndx: "C11", halign: "center", align: "left"},
        { title: "Area", width: 120, dataType: "string", dataIndx: "C12", halign: "center", align: "center"},
        { title: "Tipo de Atención", width: 90, dataType: "string", dataIndx: "C13", halign: "center", align: "center"},
        { title: "Canal de Comunicación", width: 100, dataType: "string", dataIndx: "C14", halign: "center", align: "center"}
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

function fn_setea_grids_secundarias() {

    //Setea grilla Motivos

    var data2 =  [
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios D', C3: 'Requerimiento Rapido', C4: 'Personal', C5: '24/10/2019 13:23:09', C6: '24/10/2019 13:23:09', C7: '', C8: '', C9: '', C10: "", C11: ""},
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios D', C3: 'Requerimiento Rapido', C4: 'Personal', C5: '24/10/2019 13:23:09', C6: '24/10/2019 13:23:09', C7: '', C8: '', C9: '', C10: "", C11: ""},
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios D', C3: 'Requerimiento Rapido', C4: 'Personal', C5: '24/10/2019 13:23:09', C6: '24/10/2019 13:23:09', C7: '', C8: '', C9: '', C10: "", C11: ""},
    ];

    var obj2 = {
        height: "300",
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
        { title: "Motivo Cliente", width: 200, dataType: "string", dataIndx: "C1", halign: "center", align: "left" },
        { title: "Motivo Empresa", width: 200, dataType: "string", dataIndx: "C2", halign: "center", align: "left"},
        { title: "Tipo de Atención", width: 120, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Canal de Comunicación", width: 100, dataType: "string", dataIndx: "C4", halign: "center", align: "center"},
        { title: "Vencimiento Empresa",width: 140, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Vencimiento ASEP", width: 140, dataType: "string", dataIndx: "C6", halign: "center", align: "center"},
        { title: "Respuesta",width: 100, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },
        { title: "Motivo Ente", width: 80, dataType: "string", dataIndx: "C8", halign: "center", align: "center"},
        { title: "Fecha Respuesta", width: 75, dataType: "string", dataIndx: "C9", halign: "center", align: "center"},
        { title: "Rol Cierre", width: 200, dataType: "string", dataIndx: "C10", halign: "center", align: "left"},
        { title: "Causa", width: 200, dataType: "string", dataIndx: "C11", halign: "center", align: "left"},
    ];


    obj2.dataModel = { data: data2 };

    $grid_motivos = $("#div_grid_motivos").pqGrid(obj2);
    $grid_motivos.pqGrid( "refreshDataAndView" );

    //Setea grilla 2 Ordenes

    var data3 =  [
        { C1: '', C2: '', C3: '', C4: "", C5: "", C6: ""},
        { C1: '', C2: '', C3: '', C4: "", C5: "", C6: ""},
        { C1: '', C2: '', C3: '', C4: "", C5: "", C6: ""},
    ];

    var obj3 = {
        height: "300",
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
        { title: "Tipo de Orden", width: 200, dataType: "string", dataIndx: "C1", halign: "center", align: "left" },
        { title: "Numero de Orden", width: 200, dataType: "string", dataIndx: "C2", halign: "center", align: "left"},
        { title: "Rol Actual", width: 120, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Rol Emisor", width: 100, dataType: "string", dataIndx: "C4", halign: "center", align: "center"},
        { title: "Fecha",width: 140, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Fecha Finalización", width: 140, dataType: "string", dataIndx: "C6", halign: "center", align: "center"},
    ];


    obj3.dataModel = { data: data3 };

    $grid_ordenes = $("#div_grid_ordenes").pqGrid(obj3);
    $grid_ordenes.pqGrid( "refreshDataAndView" );

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
function fn_regional(){

    $("#cb_regional").html("<option value='' selected></option><option value='1'>(6000) PANAMÁ SUR</option> <option value='2' >(7000) PANAMÁ NORTE</option>  <option value='3' >(8000) PANAMÁ METRO</option>");
}
function fn_tipoaten() {

    $("#cb_tipoaten").html("<option value='' selected></option>Todos<option value='1'>Todos</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_canalcomu() {

    $("#cb_canalcomu").html("<option value='' selected></option><option value='1'>Todos</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_mot_cliente(){

    $("#cb_mot_cliente").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 03</option>  <option value='3' >OPCION 03</option>");
}
function fn_mot_empresa(){

    $("#cb_mot_empresa").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_fecha() {

    $("#cb_fecha").html("<option value='0' selected></option>Todos<option value='1' selected='selected'>Todas</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_rango() {

    $("#cb_rango").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_desde() {

    $("#cb_desde").html("<option value='' selected></option><option value='1' >OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_hasta() {

    $("#cb_hasta").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_estado() {

    $("#cb_estado").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}

function fn_plazos() {

    $("#cb_plazos").html("<option value='' selected></option>Todos<option value='1'>Todos</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}

function fn_ocultar() {
    $("#fecha_filtro").hide();
    $("#fecha_filtro1").hide();
    $("#fecha_filtro2").hide();
}

function fn_mostrar() {
    $("#fecha_filtro").show();
    $("#fecha_filtro1").show();
    $("#fecha_filtro2").show();
}

function fn_set_active(tab, grilla) {
    $(tab).addClass("active");
    $(grilla).show();

}

function fn_remove_active() {
    $("#tab_motivos").removeClass("active");
    $("#tab_ordenes").removeClass("active");
    $("#tab_clientes").removeClass("active");

}

function fn_ocular_grillas() {

    $("#div_grid_motivos").hide();
    $("#div_grid_ordenes").hide();
    $("#div_grid_ordenes_css").hide();
    $("#div_con_clientes").hide();
    $("#co_excel_2").hide();
    $("#co_excel_3").hide();

}


function fn_carga_grilla() {

    fn_filtro();
    var total_register;

    alert("");
    $grid_principal.pqGrid( "option", "dataModel", dataModel );
    $grid_principal.pqGrid( "refreshDataAndView" );
    $grid_principal.pqGrid( "option", "title", "Total Registros: " + total_register);

}

// Limpiar Filtro
function fn_limpiar(){
    $("#cb_regional").val("");
    $("#chk_retenidas").prop("checked", false);
    $("#cb_tipoaten").val("");
    $("#cb_canalcomu").val("");
    $("#cb_mot_cliente").val("");
    $("#cb_mot_empresa").val("");
    $("#cb_fecha").val("");
    $("#cb_rango").val("");
    $("#cb_desde").val("");
    $("#cb_hasta").val("");
    $("#cb_estado").val("");
    $("#cb_plazos").val("");
    fn_ocultar()
}
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

