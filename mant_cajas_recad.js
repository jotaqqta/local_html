var g_modulo = "Módulo de Recaudación";
var g_tit = "Mantenimiento de Cajas de Recaudo";
var $grid_principal;
var sql_grid_prim = "";
var my_url = "mant_cajas_recad";
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

    fn_agencia();

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


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_filtro").on("click", fn_filtro);

    $("#co_nuevo").on("click", function () {

        fn_nuevo_edit("new", undefined);
    });

    $("#co_generar").on("click", function() {

        if ($.trim($("#co_generar").text()) === "Generar") {

            if ($("#cb_agencia").val() === "") {
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor selecciona una Agencia.</strong></div>',3000);
                $("#cb_agencia").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_bts").slideUp();
            $('#div_filtro_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });

    $("#co_guardar_new_edit").on("click", function () {

        if (fn_modal_activo()) {

            if ($.trim($("#co_guardar_new_edit").text()) === "Modificar") {

                if ($("#tx_nom_caja").val() === "") {
                    fn_mensaje('#mensaje_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indique un Nombre de Caja.</strong></div>',3000);
                    $("#tx_nom_caja").focus();
                    return;
                }

                fn_mensaje_boostrap("Se modifico", g_tit, $("#co_generar"));
                $("#div_prin").slideDown();
                $("#div_new_edit_bts").slideUp();
                $('#div_new_edit_bts').modal('hide');
                $(window).scrollTop(0);
            }
        } else {

            if ($.trim($("#co_guardar_new_edit").text()) === "Guardar") {

                if ($("#tx_nom_caja").val() === "") {
                    fn_mensaje('#mensaje_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>Error, por favor indique un Nombre de Caja.</strong></div>',3000);
                    $("#tx_nom_caja").focus();
                    return;
                }

                fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
                $("#div_prin").slideDown();
                $("#div_new_edit_bts").slideUp();
                $('#div_new_edit_bts').modal('hide');
                $(window).scrollTop(0);
            }
        }
    });

    $("#co_estado").on("click", function () {

        if ($.trim($("#co_estado").text()) === "Activar") {

            // DO SOMETHING

            $("#div_prin").slideDown();
            $("#div_new_edit_bts").slideUp();
            $('#div_new_edit_bts').modal('hide');
            $(window).scrollTop(0);
        } else if ($.trim($("#co_estado").text()) === "Desactivar") {

            // DO SOMETHING

            $("#div_prin").slideDown();
            $("#div_new_edit_bts").slideUp();
            $('#div_new_edit_bts').modal('hide');
            $(window).scrollTop(0);
        }

    });

    $("#co_limpiar").on("click", function () {
        if ($.trim($("#co_limpiar").text()) === "Limpiar") {
            fn_limpiar(1);
        }
    });

    $("#co_cancel").on("click", function (){
        $('#div_filtro_bts').modal('hide');
    });

    $("#co_cancel_new_edit").on("click", function (){
        $('#div_new_edit_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function (){ window.close(); });

    $grid_principal.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;

                fn_nuevo_edit("edit", dataCell);

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
            if(col_model[i].hidden !== true) cabecera += "<th>"+col_model[i].title+ "</th>";
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
        { C1: '0007', C2: 'CAJA1-ARRAIJAN', C3: 'ACTIVO', },
        { C1: '0008', C2: 'CAJA2-ARRAIJAN', C3: 'INACTIVO', },
        { C1: '0009', C2: 'CAJA3-ARRAIJAN', C3: 'ACTIVO', },
        { C1: '0010', C2: 'CAJA4-ARRAIJAN', C3: 'INACTIVO', },
        { C1: '0011', C2: 'CAJA5-ARRAIJAN', C3: 'ACTIVO', },
        { C1: '0012', C2: 'CAJA6-ARRAIJAN', C3: 'INACTIVO', },
        { C1: '0013', C2: 'CAJA7-ARRAIJAN', C3: 'ACTIVO', },
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
        toolbar: {
            cls: "pq-toolbar-export btn-group-sm",
            items:[
                { type: "button", label: "Filtro",    attr: "id=co_filtro",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Nuevo",    attr: "id=co_nuevo",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Código", width: 140, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Nombre", width: 800, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", },
        { title: "Estado", width: 150, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_filtro(){

    fn_limpiar(1);

    $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_bts").on("shown.bs.modal", function () {
        $("#div_filtro_bts div.modal-footer button").focus();

    });
}

function fn_nuevo_edit(type, dataCell){

    if (type === "new") {

        fn_limpiar(2);

        $("#co_estado").hide();
        $("#title_mod_new_edit").html("Nueva Caja");
        $("#co_guardar_new_edit").html("<span class='glyphicon glyphicon-floppy-disk'></span> Guardar");
    }

    if (type === "edit") {

        fn_limpiar(3);

        $("#title_mod_new_edit").html("Editar Caja");
        $("#tx_cod_caja").val(dataCell.C1);
        $("#tx_nom_caja").val(dataCell.C2);
        $("#co_guardar_new_edit").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");

        if (dataCell.C3 === "ACTIVO") {
            $("#co_estado").show();
            $("#co_estado").html("<span class='glyphicon glyphicon-arrow-down'></span> Desactivar");
        } else {
            $("#co_estado").show();
            $("#co_estado").html("<span class='glyphicon glyphicon-arrow-up'></span> Activar");
        }
    }

    $("#div_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_new_edit_bts").on("shown.bs.modal", function () {
        $("#div_new_edit_bts div.modal-footer button").focus();

    });
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////

function fn_agencia(){

    $("#cb_agencia").html("<option value='' selected></option><option value='1'>OPCIÓN 01</option> <option value='2' >OPCIÓN 02</option>  <option value='3' >OPCION 03</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_carga_grilla() {

    var total_register;

    $grid_principal.pqGrid( "option", "dataModel", dataModel );
    $grid_principal.pqGrid( "refreshDataAndView" );
    $grid_principal.pqGrid( "option", "title", "Total Registros: " + total_register);

}

function fn_modal_activo() {

    return $("#co_estado").is(":visible");
}

// Limpiar Filtro
function fn_limpiar(type){

    if (type === 1) {
        $("#cb_agencia").val("");
    }

    if (type === 2) {
        $("#tx_cod_caja").val("");
        $("#tx_nom_caja").val("");
    }

    if (type === 3) {
        $("#tx_nom_caja").val("");
    }
}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

