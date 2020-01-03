var g_modulo = "Corte y Reposición";
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

    fn_tipo_motiv();
    fn_ind_pago();

    // INICIA CON EL CURSOR EN EL CAMPO FECHA
    $("._input_selector").inputmask("dd/mm/yyyy");
    $("#tx_ciclo").inputmask({mask:"99", rightAlign: false, placeholder: ""});

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

    //$("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_filtro").on("click", fn_filtro);

    //$("#co_nuevo").on("click", fn_new);

    $("#co_generar").on("click", function() {

        if ($.trim($("#co_generar").text()) == "Consultar") {

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_bts").slideUp();
            $('#div_filtro_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });

    /*$("#co_generar_edit").on("click", function() {

        // Generar nuevo
        if ($.trim($("#co_generar").text()) == "Generar") {

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_bts").slideUp();
            $('#div_filtro_bts').modal('hide');
            $(window).scrollTop(0);

        }

        // Modificar
        if ($.trim($("#co_generar").text()) == "Guardad") {

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_bts").slideUp();
            $('#div_filtro_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });*/

    $("#co_limpiar").on("click", function () {
        if ($.trim($("#co_limpiar").text()) == "Limpiar") {
            fn_limpiar();
            return;
        }
        else
            window.close();
    });

    /*$("#co_limpiar_edit").on("click", function () {
        if ($.trim($("#co_limpiar_edit").text()) == "Limpiar") {
            fn_limpiar_second();
            return;
        }
        else
            window.close();
    });*/

    $("#co_cancel").on("click", function (){
        $('#div_filtro_bts').modal('hide');
    });

    /*$("#co_cancel_edit").on("click", function (){
        $('#div_edit_new_bts').modal('hide');
    });*/

    $("#co_cerrar").on("click", function (){ window.close(); });

    //EVENTO DBL_CLICK DE LA GRILLA
    /*$grid_principal.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
                fn_edit(dataCell);
            }
        }
    });*/

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
        { C1: '1', C2: 'Corte', C3: 'MOROSIDAD', C4: 'S' },
        { C1: '2', C2: 'Corte', C3: 'INCUMPLIMIENTO DE CONVENIO', C4: 'S' },
        { C1: '3', C2: 'Corte', C3: 'SOLICITUD INTERESADO', C4: 'N' },
        { C1: '4', C2: 'Corte', C3: 'OPOSICION AL CORTE NORMAL', C4: 'S' },
        { C1: '5', C2: 'Corte', C3: 'AUTORREPOSICION', C4: 'S' },
        { C1: '51', C2: 'Corte', C3: 'SEGUIMIENTO A CORTE 1', C4: 'S' },
        { C1: '52', C2: 'Corte', C3: 'SEGUIMIENTO A CORTE 2', C4: 'S' },
        { C1: '53', C2: 'Corte', C3: 'CONEXION ILEGAL', C4: 'S' },
        { C1: '54', C2: 'Corte', C3: 'CHEQUE DEVUELTO', C4: 'S' },
        { C1: '55', C2: 'Corte', C3: 'SOLICITUD DE UNIDAD GESTORA', C4: 'S' },
        { C1: '6', C2: 'Reposición', C3: 'DEUDA CANCELADA', C4: 'S' },
        { C1: '7', C2: 'Reposición', C3: 'CONVENIO', C4: 'S' },
        { C1: '8', C2: 'Reposición', C3: 'REFACTURACION', C4: 'S' },
        { C1: '89', C2: 'Reposición', C3: 'REPO NO JUSTIFICADA', C4: 'S' },
        { C1: '9', C2: 'Reposición', C3: 'EXCEPCION', C4: 'S' },
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
                { type: "button", label: "Filtro",  attr: "id=co_filtro",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Excel",   attr:"id=co_excel",    cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",  attr: "id=co_cerrar",  cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Código Motivo", width: 154, dataType: "strig", dataIndx: "C1", halign: "center", align: "center", },
        { title: "Tipo", width: 400, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Descripción", width: 400, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
        { title: "Ind Pago", width: 154, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
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

/*function fn_edit(dataCell){

    $("#title_mod_new").html("Editar");
    $("#co_generar_edit").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");

    $("#tx_cod_motiv_edit").val(dataCell.C1);
    $("#tx_desc_edit").val(dataCell.C3);

    $("#cb_tipo_motiv_edit option").each(function()
    {
        if ($(this).text() === dataCell.C2) {
            $("#cb_tipo_motiv_edit").val($(this).val());
        }
    });

    $("#cb_ind_pago_edit option").each(function()
    {
        if ($(this).text() === dataCell.C4) {
            $("#cb_ind_pago_edit").val($(this).val());
        }
    });

    $("#div_edit_new_bts").modal({backdrop: "static",keyboard:false});
    $("#div_edit_new_bts").on("shown.bs.modal", function () {
        $("#div_edit_new_bts div.modal-footer button").focus();

    });

}

function fn_new(){

    fn_limpiar_second();

    $("#title_mod_new").html("Generar nuevo");
    $("#co_generar_edit").html("<span class='glyphicon glyphicon-floppy-disk'></span> Guardar");

    $("#tx_mot_client").val($("#cb_mot_client :selected").text());
    $("#tx_mot_emp").val($("#cb_mot_emp :selected").text());

    $("#div_edit_new_bts").modal({backdrop: "static",keyboard:false});
    $("#div_edit_new_bts").on("shown.bs.modal", function () {
        $("#div_edit_new_bts div.modal-footer button").focus();

    });
}*/

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_tipo_motiv(){

    $("#cb_tipo_motiv").html("<option value='' selected></option><option value='1'>Corte</option> <option value='2' >Reposición</option>  <option value='3' >OPCION 03</option> ");
    //$("#cb_tipo_motiv_edit").html("<option value='' selected></option><option value='1'>Corte</option> <option value='2' >Reposición</option>  <option value='3' >OPCION 03</option> ");
}
function fn_ind_pago(){

    $("#cb_ind_pago").html("<option value='' selected></option><option value='1'>S</option> <option id='2'>N</option>");
    //$("#cb_ind_pago_edit").html("<option value='' selected></option><option value='1'>S</option> <option id='2'>N</option>");
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

    $("#tx_cod_motiv").val("");
    $("#tx_desc").val("");
    $("#cb_tipo_motiv").val("");
    $("#cb_ind_pago").val("");
}

/*function fn_limpiar_second() {
    $("#tx_cod_motiv_edit").val("");
    $("#tx_desc_edit").val("");
    $("#cb_tipo_motiv_edit").val("");
    $("#cb_ind_pago_edit").val("");
}*/

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

