var g_modulo = "Atención Integral de Clientes";
var g_tit = "Relación Motivo Cliente - Motivo Empresa - Tipo de Atención";
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
    fn_tipo_atencion();

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

    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

    $("#co_limpiar_second").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_nuevo").on("click", fn_new);

    $("#co_guardar").on("click", function() {

        // Generar nuevo
        if ($.trim($("#co_guardar").text()) == "Guardar") {

            if ($("#cb_mot_client").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO CLIENTE!!!</strong></div>',3000);
                $("#cb_mot_client").focus();
                return;
            }

            if ($("#cb_mot_emp").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN MOTIVO EMPRESA!!!</strong></div>',3000);
                $("#cb_mot_emp").focus();
                return;
            }

            if ($("#cb_tipo_atencion").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE ATENCIÓN!!!</strong></div>',3000);
                $("#cb_tipo_atencion").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
        }

        if ($.trim($("#co_guardar").text()) == "Modificar") {
            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
        }

        $("#div_prin").slideDown();
        $("#div_edit_new_bts").slideUp();
        $('#div_edit_new_bts').modal('hide');
        $(window).scrollTop(0);
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
        $('#div_edit_new_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
                fn_edit(dataCell);
            }
        }
    });


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//EXCEL
    $("#co_excel").on("click", function (e) {

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
        { C1: 'ASUNTOS LEGALES', C2: 'COBRO DEUDA', C3: 'RECLAMO', C4: 'S', C5: 'N' },
        { C1: 'ASUNTOS LEGALES', C2: 'COBRO DEUDA', C3: 'REQUERIMIENTO', C4: 'S', C5: 'N' },
        { C1: 'SEGUIMIENTO', C2: 'ORDEN GENERICA DE SOLICITUD DEL CLIENTE', C3: 'CONSULTA', C4: 'S', C5: 'N' },
        { C1: 'ASUNTOS LEGALES', C2: 'ORDEN GENERICA DE SOLICITUD DEL CLIENTE', C3: 'REQUERIMIENTO RAPIDO', C4: 'S', C5: 'N' },
        { C1: 'SEGUIMIENTO', C2: 'ORDEN GENERICA DE SOLICITUD DEL CLIENTE', C3: 'REQUERIMIENTO RAPIDO', C4: 'S', C5: 'N' },
        { C1: 'SEGUIMIENTO', C2: 'ORDEN GENERICA DE SOLICITUD DEL CLIENTE', C3: 'RECLAMO', C4: 'S', C5: 'N' },
        { C1: 'ASUNTOS LEGALES', C2: 'ORDEN GENERICA DE SOLICITUD DEL CLIENTE', C3: 'REQUERIMIENTO RAPIDO', C4: 'S', C5: 'N' },
        { C1: 'SEGUIMIENTO', C2: 'COBRO DEUDA', C3: 'REQUERIMIENTO ', C4: 'S', C5: 'N' },
        { C1: 'SEGUIMIENTO', C2: 'COBRO DEUDA', C3: 'REQUERIMIENTO RAPIDO', C4: 'S', C5: 'N' },
        { C1: 'SEGUIMIENTO', C2: 'COBRO DEUDA', C3: 'REQUERIMIENTO RAPIDO', C4: 'S', C5: 'N' },
        { C1: 'ASUNTOS LEGALES', C2: 'ORDEN GENERICA DE SOLICITUD DEL CLIENTE', C3: 'REQUERIMIENTO', C4: 'S', C5: 'N' },
        { C1: 'ASUNTOS LEGALES', C2: 'ORDEN GENERICA DE SOLICITUD DEL CLIENTE', C3: 'RECLAMO', C4: 'S', C5: 'N' },
        { C1: 'ASUNTOS LEGALES', C2: 'ORDEN GENERICA DE SOLICITUD DEL CLIENTE', C3: 'REQUERIMIENTO', C4: 'S', C5: 'N' },
        { C1: 'SEGUIMIENTO', C2: 'ORDEN GENERICA DE SOLICITUD DEL CLIENTE', C3: 'CONSULTA', C4: 'S', C5: 'N' },
        { C1: 'SEGUIMIENTO', C2: 'ORDEN GENERICA DE SOLICITUD DEL CLIENTE', C3: 'REQUERIMIENTO RAPIDO', C4: 'S', C5: 'N' },
        { C1: 'ASUNTOS LEGALES', C2: 'COBRO DEUDA', C3: 'REQUERIMIENTO RAPIDO', C4: 'S', C5: 'N' },
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
                { type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Motivo Cliente", width:310, dataType: "strig", dataIndx: "C1", halign: "center", align: "left", },
        { title: "Motivo Empresa", width:310, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Tipo Atención", width: 310, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
        { title: "Requiere Suministro", width: 88, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Nueva Venta ", width: 90, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_edit(dataCell){

    $("#title_mod_new").html("Editar");
    $("#co_guardar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");

    $('#cb_mot_client').prop( "disabled", true );
    $('#cb_mot_emp').prop( "disabled", true );
    $('#cb_tipo_atencion').prop( "disabled", true );

    $("#co_limpiar").hide();
    $("#co_limpiar_second").show();

    if (dataCell.C4 === "S") {
        $("#chk_req_sum").prop("checked", true);
    } else {
        $("#chk_req_sum").prop("checked", false);
    }

    if (dataCell.C5 === "S") {
        $("#chk_new_venta").prop("checked", true);
    } else {
        $("#chk_new_venta").prop("checked", false);
    }

    $("#cb_mot_client option").each(function()
    {
        if ($(this).text() === dataCell.C1) {
            $("#cb_mot_client").val($(this).val());
        }
    });

    $("#cb_mot_emp option").each(function()
    {
        if ($(this).text() === dataCell.C2) {
            $("#cb_mot_emp").val($(this).val());
        }
    });

    $("#cb_tipo_atencion option").each(function()
    {
        if ($(this).text() === dataCell.C3) {
            $("#cb_tipo_atencion").val($(this).val());
        }
    });

    $("#div_edit_new_bts").modal({backdrop: "static",keyboard:false});
    $("#div_edit_new_bts").on("shown.bs.modal", function () {
        $("#div_edit_new_bts div.modal-footer button").focus();

    });

}

function fn_new(){

    fn_limpiar();

    $('#cb_mot_client').prop( "disabled", false );
    $('#cb_mot_emp').prop( "disabled", false );
    $('#cb_tipo_atencion').prop( "disabled", false );

    $("#title_mod_new").html("Generar nuevo");
    $("#co_guardar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Guardar");

    $("#tx_mot_client").val($("#cb_mot_client :selected").text());
    $("#tx_mot_emp").val($("#cb_mot_emp :selected").text());

    $("#div_edit_new_bts").modal({backdrop: "static",keyboard:false});
    $("#div_edit_new_bts").on("shown.bs.modal", function () {
        $("#div_edit_new_bts div.modal-footer button").focus();

    });
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_mot_cliente(){

    $("#cb_mot_client").html("<option value='' selected></option><option value='1'>ASUNTOS LEGALES</option> <option value='2' >SEGUIMIENTO</option>  <option value='3' >OPCION 03</option>");
}
function fn_mot_empresa(){

    $("#cb_mot_emp").html("<option value='' selected></option><option value='1'>COBRO DEUDA</option> <option value='2' >ORDEN GENERICA DE SOLICITUD DEL CLIENTE</option>  <option value='3' >OPCION 03</option>");
}

function fn_tipo_atencion(){

    $("#cb_tipo_atencion").html("<option value='' selected></option><option value='1'>RECLAMO</option> <option value='2' >REQUERIMIENTO</option>  <option value='3' >CONSULTA</option>  <option value='4' >REQUERIMIENTO RAPIDO</option>");
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
    $("#cb_tipo_atencion").val("");
    $("#chk_req_sum").prop("checked", false);
    $("#chk_new_venta").prop("checked", false);
}

function fn_limpiar_second(){

    $("#chk_req_sum").prop("checked", false);
    $("#chk_new_venta").prop("checked", false);
}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

