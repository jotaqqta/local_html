var g_modulo = "Corte y Reposición";
var g_tit = "Mantención de Cargos Para corte y Reposición";
var $grid_principal;
var sql_grid_prim = "";
var my_url = "mant_carg_cort_CORT";
var filtro = {};
var parameters = {};
var edit;

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

    fn_regional();
    fn_evento();
    fn_tiene_med();
    fn_diametro();
    fn_cargo();

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

    $("#co_nuevo").on("click", fn_new);

    $("#co_consultar").on("click", function() {

        if ($.trim($("#co_consultar").text()) === "Consultar") {

            filtro = [ $("#cb_regional").val(), $("#cb_evento").val(), $("#cb_tiene_med").val(), $("#cb_diametro").val(), $("#cb_cargo").val() ];

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_consultar"));
            //fn_carga_grilla();
            $("#div_prin").slideDown();
            $("#div_filtro_new_edit_bts").slideUp();
            $('#div_filtro_new_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }

        // Generar nuevo
        if ($.trim($("#co_consultar").text()) === "Guardar") {

            if ($("#cb_regional").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UNA REGIONAL!!!</strong></div>',3000);
                $("#cb_regional").focus();
                return;
            }

            if ($("#cb_evento").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN EVENTO!!!</strong></div>',3000);
                $("#cb_evento").focus();
                return;
            }

            if ($("#cb_tiene_med").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR INDICAR SI TIENE MEDIDOR!!!</strong></div>',3000);
                $("#cb_tiene_med").focus();
                return;
            }

            if ($("#cb_diametro").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN DIAMETRO!!!</strong></div>',3000);
                $("#cb_diametro").focus();
                return;
            }

            if ($("#cb_cargo").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN CARGO!!!</strong></div>',3000);
                $("#cb_cargo").focus();
                return;
            }

            if ($("#tx_valor").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN VALOR!!!</strong></div>',3000);
                $("#tx_valor").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            $("#div_prin").slideDown();
            $("#div_filtro_new_edit_bts").slideUp();
            $('#div_filtro_new_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }

        // Modificar
        if ($.trim($("#co_consultar").text()) === "Modificar") {

            if ($("#tx_valor").val() === "") {

                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0;" role="alert"><strong>FAVOR SELECCIONAR UN VALOR!!!</strong></div>',3000);
                $("#tx_valor").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_guardar"));
            $("#div_prin").slideDown();
            $("#div_filtro_new_edit_bts").slideUp();
            $('#div_filtro_new_edit_bts').modal('hide');
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
        $('#div_filtro_new_edit_bts').modal('hide');
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
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'N', C4: '1 1/2 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '57.46' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'N', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'N', C4: '5/8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '10.72' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'N', C4: '3/4 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '28.07' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'N', C4: '1 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '65.6' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'N', C4: '2 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '95.37' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'N', C4: '3 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '168.47' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'N', C4: '4 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.15' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'N', C4: '6 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '10.72' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'S', C4: '5/8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '14.03' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'S', C4: '3/4 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '28.07' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'S', C4: '1 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '65.6' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'S', C4: '1 1/2 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '95.37' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'S', C4: '2 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '168.47' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'S', C4: '3 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'S', C4: '4 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'S', C4: '6 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'S', C4: '8 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16' },
        { C1: 'PANAMÁ METRO', C2: 'CORT', C3: 'S', C4: '10 "', C5: '0108', C6: 'CORTE SERVICIO AGUA POTABLE', C7: '269.16' },
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
                { type: "button", label: "Nuevo",    attr: "id=co_nuevo",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Filtro",    attr: "id=co_filtro",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Regional", width: 250, dataType: "strig", dataIndx: "C1", halign: "center", align: "left", },
        { title: "Evento", width: 100, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "Medidor", width: 65, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Diametro", width: 83, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Cod. Cargo", width: 80, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "Descripción Cargo", width: 370, dataType: "string", dataIndx: "C6", halign: "center", align: "left" },
        { title: "Valor", width: 85, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },
        { title: "Eliminar", width: 58, dataType: "string", halign: "center", align: "center", editable: false, sortable: false,
            render: function () {
                return "<button class='btn btn-sm btn-primary' id='co_cerrar_prin' type='button'><span class='glyphicon glyphicon-trash'></span></button>";
            },
            postRender: function (ui) {

                var rowIndx = ui.rowIndx,
                    $grid = this,
                    $grid = $grid.getCell(ui);

                $grid.find("button")
                    .on("click", function () {

                        $grid_principal.addClass({ rowIndx: ui.rowIndx, cls: 'pq-row-delete' });

                        var ans = window.confirm("¿Estas seguro de que quieres eliminar la fila " + (rowIndx + 1) + "?");
                        $grid_principal.removeClass({ rowIndx: rowIndx, cls: 'pq-row-delete' });
                        if (ans) {
                            $grid_principal.pqGrid("deleteRow", { rowIndx: rowIndx });
                        }

                        /*HablaServidor(my_url, parameters, 'text', function() {
                            fn_mensaje("EL MOVIMIENTO FUE ELIMINADO", g_titulo, $(""));
                        });*/
                    });
            }
        },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_filtro() {

    edit = false;


    $("#title_fil_mod_new").html("Editar Cargo Para corte y Reposición");
    $("#co_consultar").html("<span class='glyphicon glyphicon-ok'></span> Consultar");

    fn_limpiar();

    $("#div_tx_valor").hide();
    $("#cb_regional").prop( "disabled", false );
    $("#cb_evento").prop( "disabled", false );
    $("#cb_tiene_med").prop( "disabled", false );
    $("#cb_diametro").prop( "disabled", false );
    $("#cb_cargo").prop( "disabled", false );

    $("#cb_regional").val(filtro[0]);
    $("#cb_evento").val(filtro[1]);
    $("#cb_tiene_med").val(filtro[2]);
    $("#cb_diametro").val(filtro[3]);
    $("#cb_cargo").val(filtro[4]);

    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
        $("#div_filtro_new_edit_bts div.modal-footer button").focus();

    });
}

function fn_edit(dataCell) {

    edit = true;

    fn_limpiar();

    $("#title_fil_mod_new").html("Editar Cargo Para corte y Reposición");
    $("#co_consultar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");

    $("#cb_regional option").each(function()
    {
        if ($(this).text() === dataCell.C1) {
            $("#cb_regional").val($(this).val());
        }
    });

    $("#cb_evento option").each(function()
    {
        if ($(this).text() === dataCell.C2) {
            $("#cb_evento").val($(this).val());
        }
    });

    $("#cb_tiene_med option").each(function()
    {
        if ($(this).text() === dataCell.C3) {
            $("#cb_tiene_med").val($(this).val());
        }
    });

    $("#cb_diametro option").each(function()
    {
        if ($(this).text() === dataCell.C4) {
            $("#cb_diametro").val($(this).val());
        }
    });

    $("#div_tx_valor").show();
    $("#tx_valor").val(dataCell.C7);

    $("#cb_regional").prop( "disabled", true );
    $("#cb_evento").prop( "disabled", true );
    $("#cb_tiene_med").prop( "disabled", true );
    $("#cb_diametro").prop( "disabled", true );
    $("#cb_cargo").prop( "disabled", true );

    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
        $("#div_filtro_new_edit_bts div.modal-footer button").focus();

    });
}

function fn_new() {

    edit = false;

    fn_limpiar();

    $("#title_fil_mod_new").html("Generar nuevo Cargo Para corte y Reposición");
    $("#co_consultar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Guardar");

    $("#div_tx_valor").show();
    $("#cb_regional").prop( "disabled", false );
    $("#cb_evento").prop( "disabled", false );
    $("#cb_tiene_med").prop( "disabled", false );
    $("#cb_diametro").prop( "disabled", false );
    $("#cb_cargo").prop( "disabled", false );

    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
        $("#div_filtro_new_edit_bts div.modal-footer button").focus();

    });
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////

function fn_regional(){

    $("#cb_regional").html("<option value='' selected></option><option value='1'>PANAMÁ METRO</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");

}

function fn_evento(){

    $("#cb_evento").html("<option value='' selected></option><option value='1'>CORT</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");

}

function fn_tiene_med(){

    $("#cb_tiene_med").html("<option value='' selected></option><option value='1'>S</option> <option value='2' >N</option>  <option value='3' >OPCION 03</option>");

}

function fn_diametro(){

    $("#cb_diametro").html("<option value='' selected></option><option value='1'>1 \"</option> <option value='2' >1 1/2 \"</option> <option value='3'>2 \"</option>  <option value='4'>3/4 \"</option>  <option value='5'>4 \"</option>  <option value='6'>5/8 \"</option>  <option value='7'>6 \"</option>  <option value='8'>8 \"</option>  <option value='9'>10 \"</option>");

}

function fn_cargo() {

    $("#cb_cargo").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");

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

    if (edit) {
        $("#tx_valor").val("");
    } else {
        $("#cb_regional").val("");
        $("#cb_evento").val("");
        $("#cb_tiene_med").val("");
        $("#cb_diametro").val("");
        $("#cb_cargo").val("");
        $("#tx_valor").val("");
    }


}

function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

