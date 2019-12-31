var g_modulo = "Atención Integral de Clientes";
var g_tit = "Relación Motivos Formularios";
var $grid_principal;
var sql_grid_prim = "";
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

    fn_mot_cliente();
    fn_mot_empresa();

    fn_tipo_orden();
    fn_buzon();
    fn_tipo_form();

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

    //DIBUJA LOS ICONOS DE LOS BOTONES

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $('#co_nuevo').prop( "disabled", true );


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_filtro").on("click", fn_filtro);

    $("#co_nuevo").on("click", fn_new);

    $("#co_consultar").on("click", function() {

        if ($.trim($("#co_consultar").text()) == "Consultar") {

            if ($("#cb_mot_client").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO CLIENTE!!!</strong></div>',3000);
                $("#cb_mot_client").focus();
                return;
            }
            if ($("#cb_mot_emp").val() == "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO EMPRESA!!!</strong></div>',3000);
                $("#cb_mot_emp").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_consultar"));
            //fn_carga_grilla();
            $("#div_prin").slideDown();
            $("#div_filtro_bts").slideUp();
            $('#div_filtro_bts').modal('hide');
            $('#co_nuevo').prop( "disabled", false );
            $("#tx_mot_client_n").val($("#cb_mot_client :selected").text());
            $("#tx_mot_emp_n").val($("#cb_mot_emp :selected").text());
            $(window).scrollTop(0);

        }
    });

    $("#co_guardar_second").on("click", function() {

        // Generar nuevo
        if ($.trim($("#co_guardar_second").text()) == "Guardar") {

            if ($("#cb_tipo_orden").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE ORDEN!!!</strong></div>',3000);
                $("#cb_tipo_orden").focus();
                return;
            }

            if ($("#cb_buzon").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN BUZON!!!</strong></div>',3000);
                $("#cb_buzon").focus();
                return;
            }

            if ($("#cb_tipo_form").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE FORMULARIO!!!</strong></div>',3000);
                $("#cb_tipo_form").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            $("#div_prin").slideDown();
            $("#div_edit_bts").slideUp();
            $('#div_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }

        // Editar
        if ($.trim($("#co_guardar_second").text()) == "Modificar") {

            if ($("#cb_tipo_orden").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE ORDEN!!!</strong></div>',3000);
                $("#cb_tipo_orden").focus();
                return;
            }

            if ($("#cb_buzon").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN BUZON!!!</strong></div>',3000);
                $("#cb_buzon").focus();
                return;
            }

            if ($("#cb_tipo_form").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE FORMULARIO!!!</strong></div>',3000);
                $("#cb_tipo_form").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            $("#div_prin").slideDown();
            $("#div_edit_bts").slideUp();
            $('#div_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });


    $("#co_limpiar").on("click", function () {
        if ($.trim($("#co_limpiar").text()) == "Limpiar") {
            fn_limpiar();
            return;
        }
        else
            window.close();
    });

    $("#co_limpiar_second").on("click", function () {
        if ($.trim($("#co_limpiar_second").text()) == "Limpiar") {
            fn_limpiar_second();
            return;
        }
        else
            window.close();
    });

    $("#co_cancel").on("click", function (){
        $('#div_filtro_bts').modal('hide');
    });

    $("#co_cancel_second").on("click", function (){
        $('#div_edit_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;

                fn_edit(dataCell);
                $("#tx_mot_client").val($("#cb_mot_client :selected").text());
                $("#tx_mot_emp").val($("#cb_mot_emp :selected").text());

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
function fn_setea_grid_principal() {

    var data =  [
        { C1: 'Daños', C2: 'Medidor', C3: 'Solicitud Generica', C4: 'Buzon Medidor 7000', C5: 'Formulario Basico' },
        { C1: 'Daños', C2: 'Medidor', C3: 'Solicitud Generica', C4: 'Buzon Medidor 8000', C5: 'Formulario Basico' },
        { C1: 'Daños', C2: 'Medidor', C3: 'Solicitud Generica', C4: 'Buzon Medidor 8200', C5: 'Formulario Basico' },
        { C1: 'Daños', C2: 'Medidor', C3: 'Solicitud Generica', C4: 'Buzon Medidor 9000', C5: 'Formulario Basico' },
        { C1: 'Daños', C2: 'Medidor', C3: 'Solicitud Generica', C4: 'Buzon Medidor 1000', C5: 'Formulario Basico' },
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
                { type: "button", label: "Nuevo",    attr: "id=co_nuevo",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Filtro",    attr: "id=co_filtro",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Motivo Cliente", width:222, dataType: "strig", dataIndx: "C1", halign: "center", align: "left", },
        { title: "Motivo Empresa", width:221, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Tipo Orden", width: 221, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
        { title: "Buzon", width: 223, dataType: "string", dataIndx: "C4", halign: "center", align: "left" },
        { title: "Tipo Formulario", width: 221, dataType: "string", dataIndx: "C5", halign: "center", align: "left" },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_filtro(){

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();

    });
}

function fn_edit(dataCell){

    $("#title_mod_new").html("Editar Motivo Formulario");
    $("#co_guardar_second").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");


    $("#cb_tipo_orden option").each(function()
    {
        if ($(this).text() === dataCell.C3) {
            $("#cb_tipo_orden").val($(this).val());
        }
    });

    $("#cb_buzon option").each(function()
    {
        if ($(this).text() === dataCell.C4) {
            $("#cb_buzon").val($(this).val());
        }
    });

    $("#cb_tipo_form option").each(function()
    {
        if ($(this).text() === dataCell.C5) {
            $("#cb_tipo_form").val($(this).val());
        }
    });

    $("#div_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_edit_bts").on("shown.bs.modal", function () {
        $("#div_edit_bts div.modal-footer button").focus();

    });
}

function fn_new(){

    fn_limpiar_second();

    $("#title_mod_new").html("Generar nuevo Motivo Formulario");
    $("#co_guardar_second").html("<span class='glyphicon glyphicon-floppy-disk'></span> Guardar");

    $("#tx_mot_client").val($("#cb_mot_client :selected").text());
    $("#tx_mot_emp").val($("#cb_mot_emp :selected").text());

    $("#div_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_edit_bts").on("shown.bs.modal", function () {
        $("#div_edit_bts div.modal-footer button").focus();

    });
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_mot_cliente(){

    $("#cb_mot_client").html("<option value='' selected></option><option value='1'>DAÑOS</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_mot_empresa(){

    $("#cb_mot_emp").html("<option value='' selected></option><option value='1'>MEDIDOR</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}

function fn_tipo_orden(){

    $("#cb_tipo_orden").html("<option value='' selected></option><option value='1'>Orden Genérica</option> <option value='2' >Solicitud Generica</option>  <option value='3' >OPCION 03</option>");
}

function fn_buzon(){

    $("#cb_buzon").html("<option value='' selected></option><option value='1'>Buzon Medidor 7000</option> <option value='2' >Buzon Medidor 8000</option>  <option value='3' >Buzon Medidor 8200</option> <option value='3' >Buzon Medidor 9000</option> <option value='3' >Buzon Medidor 1000</option>");
}

function fn_tipo_form(){

    $("#cb_tipo_form").html("<option value='' selected></option><option value='1'>Formulario Basico</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_carga_grilla() {

    var total_register;

    $grid_principal.pqGrid( "option", "dataModel", dataModel );
    $grid_principal.pqGrid( "refreshDataAndView" );
    $grid_principal.pqGrid( "option", "title", "Total Registros: " + total_register);

}

// Limpiar Filtro
function fn_limpiar(){

    $("#cb_mot_client").val("");
    $("#cb_mot_emp").val("");
}

function fn_limpiar_second(){

    $("#cb_tipo_orden").val("");
    $("#cb_buzon").val("");
    $("#cb_tipo_form").val("");
}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

