var g_modulo = "Atención Integral de Clientes";
var g_tit = "Actualización de Documentos";
var $grid_principal;
var sql_grid_prim = "";
var my_url = "act_tipo_doc";
var rowIndxG;
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

    fn_sistema();

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

    $("#div_second").hide();

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_nuevo").on("click", fn_nuevo);

    $("#co_cerrar_t").on("click", function(){
        window.close();
    });


    $("#co_guardar").on("click", function() {

        // Generar nuevo
        if ($.trim($("#co_guardar").text()) === "Guardar") {
            if ($("#cb_sistema").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UNA SISTEMA!!!</strong></div>',3000);
                $("#cb_sistema").focus();
                return;
            }
            if ($("#tx_tipo_doc").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR PONER UN TIPO DE DOCUMENTO!!!</strong></div>',3000);
                $("#tx_tipo_doc").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            $("#div_prin").slideDown();
            $("#div_nuevo_bts").slideUp();
            $('#div_nuevo_bts').modal('hide');
            $(window).scrollTop(0);

        }

        // Editar
        if ($.trim($("#co_guardar").text()) === "Modificar") {
            if ($("#cb_sistema").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UNA SISTEMA!!!</strong></div>',3000);
                $("#cb_sistema").focus();
                return;
            }
            if ($("#tx_tipo_doc").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR PONER UN TIPO DE DOCUMENTO!!!</strong></div>',3000);
                $("#tx_tipo_doc").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            $("#div_prin").slideDown();
            $("#div_nuevo_bts").slideUp();
            $('#div_nuevo_bts').modal('hide');
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
        if ($.trim($("#co_limpiar").text()) === "Limpiar") {
            fn_limpiar();
        }
        else
            window.close();
    });

    $("#co_cancel").on("click", function (){
        $('#div_nuevo_bts').modal('hide');
    });

    $("#co_cerrar").on("click", function (){        window.close();
    });

    $("#co_confirm_yes").on( "click", function () {

        $grid_principal.pqGrid("deleteRow", { rowIndx: rowIndxG });

        /*HablaServidor(my_url, parameters, 'text', function() {
            fn_mensaje("EL MOVIMIENTO FUE ELIMINADO", g_titulo, $(""));
        });*/

        $('#dlg_confirm').modal('hide');

    });

    $("#co_confirm_no").on( "click", function () {

        $('#dlg_confirm').modal('hide');

    });

    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData)
            {
                var dataCell = ui.rowData;

                fn_edit(dataCell);

                //regional_fil = dataCell.C2;
                //ciclo_fil = dataCell.C3;
                //fn_grilla_dos();
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
        { C1: 'MODULO ATENCIÓN INTEGRAL CLIENTE', C2: 'AVISO CORTE'},
        { C1: 'MODULO ATENCIÓN INTEGRAL CLIENTE', C2: 'CARTA'},
        { C1: 'MODULO ATENCIÓN INTEGRAL CLIENTE', C2: 'COPIA CEDULA'}
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
            cls: "pq-toolbar-export",
            items:[
                { type: "button", label: "Nuevo",    attr: "id=co_nuevo",  cls: "btn btn-primary" },
                { type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Sistema", width:525, dataType: "string", dataIndx: "C1", halign: "center", align: "left" },
        { title: "Descripción", width: 525, dataType: "string", dataIndx: "C2", halign: "center", align: "left"},
        { title: "Eliminar", width: 58, dataType: "string", halign: "center", align: "center", editable: false, sortable: false,
            render: function () {
                return "<button class='btn btn-sm btn-primary' id='co_cerrar_prin' type='button'><span class='glyphicon glyphicon-trash'></span></button>";
            },
            postRender: function (ui) {

                var rowIndx = ui.rowIndx;

                var $grid = this,
                    $grid = $grid.getCell(ui);

                $grid.find("button")
                    .on("click", function () {

                        fn_borrar(rowIndx);

                    });

            }
        },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_nuevo(){

    fn_limpiar();

    $("#title_mod_new").html("Generar nuevo documento");
    $("#co_guardar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Guardar");

    $("#div_nuevo_bts").modal({backdrop: "static",keyboard:false});
    $("#div_nuevo_bts").on("shown.bs.modal", function () {
        $("#div_nuevo_bts div.modal-footer button").focus();

    });
}

function fn_edit(dataCell){

    $("#title_mod_new").html("Editar documento");
    $("#co_guardar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");

    $("#tx_tipo_doc").val(dataCell.C2);

    $("#cb_sistema option").each(function()
    {
        if ($(this).text() === dataCell.C1) {
            $("#cb_sistema").val($(this).val());
        }
    });

    $("#div_nuevo_bts").modal({backdrop: "static",keyboard:false});
    $("#div_nuevo_bts").on("shown.bs.modal", function () {
        $("#div_nuevo_bts div.modal-footer button").focus();

    });
}

function fn_borrar(rowIndx) {

    $("#confirm_msg").html("¿Estas seguro de que quieres eliminar la fila " + (rowIndx + 1) + "?");

    rowIndxG = rowIndx;

    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
    $("#dlg_confirm").on("shown.bs.modal", function () {
        $("#dlg_confirm div.modal-footer button").focus();
    });

}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_sistema(){

    $("#cb_sistema").html("<option value='' selected></option><option value='1'>MODULO ATENCIÓN INTEGRAL CLIENTE</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
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

    $("#cb_sistema").val("");
    $("#tx_tipo_doc").val("");
}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

