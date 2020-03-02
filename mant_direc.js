var g_modulo = "Configuraci&oacute;n Base del Sistema";
var g_tit = "Mantenedor de Productos";
var $grid_principal;
var sql_grid_prim = "";
var rowIndxG;
var parameters = {};
var filtro = {};


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
    jQuery('#tx_codigo').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });    
    

    //COMBOS

    fn_combos();


 
    // INICIA CON EL CURSOR EN EL CAMPO FECHA
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

    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();

    //DIBUJA LOS ICONOS DE LOS BOTONES

    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//BOTONES-EVENTOS

    $("#co_filtro").on("click", fn_filtro);

    $("#co_nuevo").on("click", fn_new);

    $("#co_generar").on("click", function() {

        if ($.trim($("#co_generar").text()) === "Consultar") {

            //filtro = [ $("#cb_agrup").val()];

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_new_edit_bts").slideUp();
            $('#div_filtro_new_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }

        if ($.trim($("#co_generar").text()) === "Generar") {

                        if ($("#cb_sistema").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR SISTEMA!!!</strong></div>',3000);
                $("#cb_sistema").focus();
                return;
            }

            if ($("#cb_cen_ope").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR CENTRO OPERATIVO!!!</strong></div>',3000);
                $("#cb_cen_ope").focus();
                return;
            }

            if ($("#tx_path_unix").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR PATH UNIX!!!</strong></div>',3000);
                $("#tx_path_unix").focus();
                return;
            }

            if ($("#tx_path_win").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR DIGITAR PATH WINDOWS!!!</strong></div>',3000);
                $("#tx_path_win").focus();
                return;
            }

            if ($("#tx_tipo_path").val() === "") {
               
                    fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR TIPO PATH</strong></div>', 3000);
                    $("#tx_tipo_path").focus();
                    return;
                }
            

            //if ($("#tx_fe_modif").val() !== "") {
             //   if (fn_validar_fecha($("#tx_fe_modif").val()) === false) {
            //        fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA DE MODIFICACI&Oacute;N!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
            //        $("#tx_fe_modif").focus();
             //       return;
             //   }
            //}

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_new_edit_bts").slideUp();
            $('#div_filtro_new_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }

        // Modificar
        if ($.trim($("#co_generar").text()) === "Modificar") {

            if ($("#cb_sistema").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR SISTEMA!!!</strong></div>',3000);
                $("#cb_sistema").focus();
                return;
            }

            if ($("#cb_cen_ope").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR CENTRO OPERATIVO!!!</strong></div>',3000);
                $("#cb_cen_ope").focus();
                return;
            }

            if ($("#tx_path_unix").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR PATH UNIX!!!</strong></div>',3000);
                $("#tx_path_unix").focus();
                return;
            }

            if ($("#tx_path_win").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR DIGITAR PATH WINDOWS!!!</strong></div>',3000);
                $("#tx_path_win").focus();
                return;
            }

            if ($("#tx_tipo_path").val() === "") {
               
                    fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR TIPO PATH</strong></div>', 3000);
                    $("#tx_tipo_path").focus();
                    return;
                }
            

            //if ($("#tx_fe_modif").val() !== "") {
             //   if (fn_validar_fecha($("#tx_fe_modif").val()) === false) {
            //        fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA DE MODIFICACI&Oacute;N!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
            //        $("#tx_fe_modif").focus();
             //       return;
             //   }
            //}

           
            fn_mensaje_boostrap("Se modifico", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_new_edit_bts").slideUp();
            $('#div_filtro_new_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }
    });

    $("#co_cancel_fil").on("click", function (){
        $('#div_filtro__bts').modal('hide');
        fn_limpiar();
    });

        $("#co_limpiar_fil").on("click", function () {
        if ($.trim($("#co_limpiar_fil").text()) == "Limpiar") {
            fn_limpiar();
            return;
        }
        else
            window.close();
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
        $('#div_filtro_new_edit_bts').modal('hide');
        fn_limpiar();
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


    $("#co_cerrar").on("click", function (){ window.close(); });

    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
                fn_edit(dataCell);

            $("#tx_sistema").prop("disabled",true);
            $("#tx_cen_ope").prop("disabled",true);
            $("#co_limpiar").hide();       
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
        { C1: 'FACTURACION 1', C2: 'PANAMA METRO 1', C3: 'ACOPBRO', C4: 'path', C5: 'pathw'},
        { C1: 'FACTURACION 2', C2: 'PANAMA METRO 2', C3: 'ADAPHE', C4: 'path', C5: 'pathw'},
        { C1: 'FACTURACION 3', C2: 'PANAMA METRO 3', C3: 'CAJMET', C4: 'path', C5: 'pathw'},
           
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
                { type: "button", label: "Nuevo",  attr: "id=co_nuevo",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Filtro",  attr: "id=co_filtro",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Excel",   attr:"id=co_excel",    cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",  attr: "id=co_cerrar",  cls: "btn btn-secondary btn-sm"},
                
            ]
        },
    };

    obj.colModel = [
        { title: "Sistema", width: 210, dataType: "strig", dataIndx: "C1", halign: "center", align: "center", },
        { title: "Centro Operativo", width: 210, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "PATH UNIX", width: 210, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
        { title: "PATH WIN", width: 210, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "TIPO Path", width: 210, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
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

                        fn_eliminar(rowIndx);

                    });

            }
        },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_filtro(){
	
    $("#combos").show();
    $("#cb_sistema").prop("disabled",false);
    $("#cb_cen_ope").prop("disabled",false);
    $("#tx_path_unix").hide();
    $("#tx_path_win").hide();
    $("#tx_tipo_path").hide();


    fn_limpiar()
    $("#co_limpiar_fil").show();

    //$("#row_nom").hide();
    //$("#row_descrip").hide();
    //$("#row_fe_crea").hide();
    //$("#row_fe_modif").hide();


    //$("#tx_codigo").val(filtro[0]);
    //$("#cb_agrup").val(filtro[1]);
    //$("#cb_estado").val(filtro[2]);


    $("#title_mod").html("Filtrar");
    $("#co_generar").html("<span class='glyphicon glyphicon-ok'></span> Consultar");


    $("#div_filtro__bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro__bts").on("shown.bs.modal", function () {
    $("#div_filtro__bts div.modal-footer button").focus();


    });
}

function fn_edit(dataCell){

    $("#title_mod").html("Editar");
    $("#co_generar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");

    $("#combos").hide();
    $("#tx_sistema").val(dataCell.C1);
    $("#tx_cen_ope").val(dataCell.C2);
    $("#tx_path_unix").val(dataCell.C3);
    $("#tx_path_win").val(dataCell.C4);
    $("#tx_tipo_path").val(dataCell.C5);
    

    $("#row_nom").show();
    $("#row_descrip").show();
    $("#row_fe_crea").show();
    $("#row_fe_modif").show();

    

    //$("#tx_codigo option").each(function()
    //{
    //    if ($(this).text() === dataCell.C1) {
    //        $("#tx_codigo").val($(this).val());
    //    }
    //});

    //$("#cb_sistema").each(function()
    //{
    //    if ($(this).text() === dataCell.C1) {
    //        $("#cb_sistema").val($(this).val());
    //    }
    //});

    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
       $("#div_filtro_new_edit_bts div.modal-footer button").focus();

    });

}

function fn_new(){
    $("#cb_sistema").prop("disabled",true);
    $("#cb_cen_ope").prop("disabled",true); 
    $("#combos").show();
    
    $("#tx_path_unix").show();
    $("#tx_path_win").show();
    $("#tx_tipo_path").show();


    fn_limpiar();
    $("#co_limpiar").show();

    //$("#row_nom").show();
    //$("#row_descrip").show();
    //$("#row_fe_crea").show();
    //$("#row_fe_modif").show();

    $("#title_mod").html("Generar nuevo");
    $("#co_generar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Generar");

    //if (!$("#row_cod").is( "visible") && !$("#row_agrup").is( "visible")) {
    //    $("#row_cod").show();
    //    $("#row_agrup").show();      

    //}

    //$("#tx_nombre").val($("#tx_nombre :selected").text());
    //$("#tx_descrip").val($("#cb_estado :selected").text());
    //$("#tx_fe_crea").val($("#cb_estado :selected").text());
    //$("#tx_fe_modif").val($("#cb_estado :selected").text());
    //$("#cb_estado").val($("#cb_estado :selected").text());

    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
    $("#div_filtro_new_edit_bts div.modal-footer button").focus();

    });
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_combos(){

    $("#cb_sistema").html("<option value='' selected></option><option value='1'>FACTURACION 1</option> <option value='2' >FACTURACION 2</option>  <option value='3' >FACTURACION 3</option> <option value='3' >FACTURACION 4</option> ");
    $("#cb_cen_ope").html("<option value='' selected></option><option value='1'>PANAMA METRO 1</option> <option value='2' >PANAMA METRO 2</option>  <option value='3' >PANAMA METRO 3</option> <option value='3' >PANAMA METRO 4</option> ");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_eliminar(rowIndx) {

    $("#confirm_msg").html("¿Estas seguro de que quieres eliminar la fila " + (rowIndx + 1) + "?");

    rowIndxG = rowIndx;

    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
    $("#dlg_confirm").on("shown.bs.modal", function () {
        $("#dlg_confirm div.modal-footer button").focus();
    });

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
    $("#cb_cen_ope").val("");
    $("#tx_sistema").val("");
    $("#tx_cen_ope").val("");
    $("#tx_path_unix").val("");
    $("#tx_path_win").val("");
    $("#tx_tipo_path").val("");
   
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
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

