var g_modulo = "Atención Integral de Clientes";
var g_tit = "Relación Motivos Ordenes";
var $grid_principal;
var sql_grid_prim = "";
var my_url = "rel_mot_ord";
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

    fn_canal_comu();
    fn_tipo_aten();
    fn_tipo_ord();
    fn_ind_eje();

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

            if ($("#cb_canal_comu").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN CANAL DE COMUNICACIÓN!!!</strong></div>',3000);
                $("#cb_canal_comu").focus();
                return;
            }

            if ($("#cb_tipo_aten").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE ATENCIÓN!!!</strong></div>',3000);
                $("#cb_tipo_aten").focus();
                return;
            }

            if ($("#cb_tipo_ord").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE ORDEN!!!</strong></div>',3000);
                $("#cb_tipo_ord").focus();
                return;
            }

            if ($("#cb_ind_eje").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN INDICADOR DE EJECUCIÓN!!!</strong></div>',3000);
                $("#cb_ind_eje").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            $("#div_prin").slideDown();
            $("#div_edit_bts").slideUp();
            $('#div_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }

        // Modificar
        if ($.trim($("#co_guardar_second").text()) == "Modificar") {

            if ($("#cb_canal_comu").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN CANAL DE COMUNICACIÓN!!!</strong></div>',3000);
                $("#cb_canal_comu").focus();
                return;
            }

            if ($("#cb_tipo_aten").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE ATENCIÓN!!!</strong></div>',3000);
                $("#cb_tipo_aten").focus();
                return;
            }

            if ($("#cb_tipo_ord").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN TIPO DE ORDEN!!!</strong></div>',3000);
                $("#cb_tipo_ord").focus();
                return;
            }

            if ($("#cb_ind_eje").val() == "") {

                fn_mensaje('#mensaje_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR UN INDICADOR DE EJECUCIÓN!!!</strong></div>',3000);
                $("#cb_ind_eje").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            $("#div_prin").slideDown();
            $("#div_edit_bts").slideUp();
            $('#div_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });

    $("#co_borrard").on("click", function( ) {

        $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
        $("#dlg_confirm").on("shown.bs.modal", function () {
            $("#dlg_confirm div.modal-footer button").focus();

        });
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
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios de Pago', C3: 'Escrito', C4: 'Reclamo', C5: 'Convenios', C6: 'Ambas' },
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios de Pago', C3: 'Escrito', C4: 'Requerimiento', C5: 'Convenios', C6: 'Ambas' },
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios de Pago', C3: 'Personal', C4: 'Reclamo', C5: 'Convenios', C6: 'Ambas' },
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios de Pago', C3: 'Personal', C4: 'Requerimiento', C5: 'Convenios', C6: 'Ambas' },
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios de Pago', C3: 'Personal', C4: 'Requerimiento Rapido', C5: 'Convenios', C6: 'Ambas' },
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios de Pago', C3: 'Teléfono', C4: 'Reclamo', C5: 'Convenios', C6: 'Ambas' },
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios de Pago', C3: 'Teléfono', C4: 'Requerimiento', C5: 'Convenios', C6: 'Ambas' },
        { C1: 'Convenios de Pago', C2: 'Solicitud de Convenios de Pago', C3: 'Teléfono', C4: 'Requerimiento', C5: 'Convenios', C6: 'Ambas' },
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
        refresh: function () {
            $("#div_grid_principal > div.pq-grid-center-o > div.pq-grid-center > div.pq-body-outer > div.pq-grid-cont > div.pq-cont-inner > div.pq-table-right > div.pq-grid-row > div.pq-grid-cell").find("button.btn.btn-primary.btn-sm").button()
                .bind("click", function (evt) {
                    var $tr = $(this).closest("tr");
                    var obj = $grid_principal.pqGrid("getRowIndx", { $tr: $tr });
                    var rowIndx = obj.rowIndx;
                    $grid_principal.pqGrid("addClass", { rowIndx: rowIndx, cls: 'pq-row-delete' });

                    var DM = $grid_principal.pqGrid("option", "dataModel");
                    var datos = DM.data;
                    var row = datos[rowIndx];

                    var parameters = {
                        "func":"fn_borrar",
                        "p_ip":$("#tx_ip").val(),
                        "p_rol":$("#tx_rol").val(),
                        "p_equipo":$("#cb_equipo").val(),
                        //"p_rol_equipo":row.C2,
                        "Empresa":$("#tx_empresa").val()
                    };

                    alert("DEBUG: ¡Evento \"Borrar\" funcionando!");

                    HablaServidor(my_url, parameters, 'text', function(text)
                    {
                        $grid_principal.pqGrid("deleteRow", { rowIndx: rowIndx });
                        fn_mensaje("EL MOVIMIENTO FUE ELIMINADO", g_titulo, $(""));
                    });
                    return false;

                });
        }
    };

    obj.colModel = [
        { title: "Motivo Cliente", width:200, dataType: "strig", dataIndx: "C1", halign: "center", align: "left", },
        { title: "Motivo Empresa", width:250, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Canal de Comunicación", width: 100, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
        { title: "Tipo de Atención", width: 150, dataType: "string", dataIndx: "C4", halign: "center", align: "left" },
        { title: "Tipo orden", width: 150, dataType: "string", dataIndx: "C5", halign: "center", align: "left" },
        { title: "Indicador de Ejecución", width: 150, dataType: "string", dataIndx: "C6", halign: "center", align: "left" },
        { title: "",  width: 108, dataType: "string", align: "center", editable: false, sortable: false,
            render: function (ui) {
                return "<button class='btn btn-sm btn-primary' id='co_cerrar_prin' type='button'><span class='glyphicon glyphicon-trash'></span> Eliminar</button>";
            },
        },
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

    $("#title_mod_new").html("Editar Motivo Orden");
    $("#co_guardar_second").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");

    $("#cb_canal_comu option").each(function()
    {
        if ($(this).text() === dataCell.C3) {
            $("#cb_canal_comu").val($(this).val());
        }
    });

    $("#cb_tipo_aten option").each(function()
    {
        if ($(this).text() === dataCell.C4) {
            $("#cb_tipo_aten").val($(this).val());
        }
    });

    $("#cb_tipo_ord option").each(function()
    {
        if ($(this).text() === dataCell.C5) {
            $("#cb_tipo_ord").val($(this).val());
        }
    });

    $("#cb_ind_eje option").each(function()
    {
        if ($(this).text() === dataCell.C6) {
            $("#cb_ind_eje").val($(this).val());
        }
    });

    $("#div_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_edit_bts").on("shown.bs.modal", function () {
        $("#div_edit_bts div.modal-footer button").focus();

    });
}

function fn_new(){

    fn_limpiar_second();

    $("#title_mod_new").html("Generar nuevo Motivo Orden");
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

    $("#cb_mot_client").html("<option value='' selected></option><option value='1'>CONVENIOS DE PAGO</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_mot_empresa(){

    $("#cb_mot_emp").html("<option value='' selected></option><option value='1'>Solicitud de convenios de Pago</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}

function fn_canal_comu(){

    $("#cb_canal_comu").html("<option value='' selected></option><option value='1'>Escrito</option> <option value='2' >Personal</option>  <option value='3' >Teléfono</option>");
}

function fn_tipo_aten(){

    $("#cb_tipo_aten").html("<option value='' selected></option><option value='1'>Reclamo</option> <option value='2' >Requerimiento</option>  <option value='3' >Requerimiento Rapido</option>");
}

function fn_tipo_ord(){

    $("#cb_tipo_ord").html("<option value='' selected></option><option value='1'>Convenios</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}

function fn_ind_eje(){

    $("#cb_ind_eje").html("<option value='' selected></option><option value='1'>Ambas</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
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

    $("#cb_canal_comu").val("");
    $("#cb_tipo_aten").val("");
    $("#cb_tipo_ord").val("");
    $("#cb_ind_eje").val("");
}


function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

