var g_modulo = "Configuraci&oacute;n Base del Sistema";
var g_tit = "Administrador Mano de Obra";
var $grid_principal;
var sql_grid_prim = "";
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
    jQuery('#tx_id_rela').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });    
    jQuery('#tx_valor').keypress(function (tecla) {
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    //COMBOS

    fn_estado();


 
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

            filtro = [ $("#cb_tipo_motiv").val(), $("#cb_ind_pago").val() ];

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_new_edit_bts").slideUp();
            $('#div_filtro_new_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }

        if ($.trim($("#co_generar").text()) === "Generar") {

            if ($("#tx_id_rela").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ID DE RELACI&Oacute;N!!!</strong></div>',3000);
                $("#tx_id_rela").focus();
                return;
            }

            if ($("#tx_nemo").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR NEMOT&Eacute;CNICO!!!</strong></div>',3000);
                $("#tx_nemo").focus();
                return;
            }

            if ($("#tx_valor").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR UN VALOR!!!</strong></div>',3000);
                $("#tx_valor").focus();
                return;
            }

            if ($("#cb_estado").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ESTADO!!!</strong></div>',3000);
                $("#cb_estado").focus();
                return;
            }

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_new_edit_bts").slideUp();
            $('#div_filtro_new_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }

        // Modificar
        if ($.trim($("#co_generar").text()) === "Modificar") {

            if ($("#tx_nemo").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR Nemot&eacute;cnico!!!</strong></div>',3000);
                $("#tx_nemo").focus();
                return;
            }
            if ($("#tx_valor").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR VALOR!!!</strong></div>',3000);
                $("#tx_valor").focus();
                return;
            }
            if ($("#cb_estado").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ESTADO!!!</strong></div>',3000);
                $("#cb_estado").focus();
                return;
            }

            fn_mensaje_boostrap("Se modifico", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_new_edit_bts").slideUp();
            $('#div_filtro_new_edit_bts').modal('hide');
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
            $("#tx_id_rela").prop("disabled",true);
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
        { C1: '20052', C2: 'Acoplador de Bronce', C3: '1000', C4: 'Excelente' },
        { C1: '20008', C2: 'Adapter Hembra PVC', C3: '2000', C4: 'Excelente' },
        { C1: '20070', C2: 'Cajilla Metalica con Accesorios', C3: '3000', C4: 'Bueno' },
        { C1: '20062', C2: 'Codo Adapter', C3: '4000', C4: 'Regular' },
        { C1: '20061', C2: 'Codo con Rosca', C3: '5000', C4: 'Bueno' },       
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
                { type: "button", label: "Nuevo",  attr: "id=co_nuevo",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Filtro",  attr: "id=co_filtro",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Excel",   attr:"id=co_excel",    cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",  attr: "id=co_cerrar",  cls: "btn btn-secondary btn-sm"},
            ]
        },
    };

    obj.colModel = [
        { title: "Id Relaci&oacute;n", width: 154, dataType: "strig", dataIndx: "C1", halign: "center", align: "center", },
        { title: "Nemot&eacute;cnico", width: 400, dataType: "string", dataIndx: "C2", halign: "center", align: "left" },
        { title: "Valor", width: 400, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
        { title: "Estado", width: 154, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_filtro(){

    $("#tx_id_rela").prop("disabled",false);

    fn_limpiar();

    $("#tx_id_rela").val(filtro[0]);
    $("#cb_ind_pago").val(filtro[1]);

    $("#title_mod").html("Filtrar");
    $("#co_generar").html("<span class='glyphicon glyphicon-ok'></span> Consultar");


    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
        $("#div_filtro_new_edit_bts div.modal-footer button").focus();


    });
}

function fn_edit(dataCell){

    $("#title_mod").html("Editar");
    $("#co_generar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");

    if (!$("#row_id_rela").is( "visible") && !$("#row_nemo").is( "visible")) {
        $("#row_nemo").show();
    }

    $("#tx_id_rela").val(dataCell.C1);
    $("#tx_nemo").val(dataCell.C2);
    $("#tx_valor").val(dataCell.C3);
    

    $("#tx_valor option").each(function()
    {
        if ($(this).text() === dataCell.C2) {
            $("#tx_valor").val($(this).val());
        }
    });

    $("#cb_estado option").each(function()
    {
        if ($(this).text() === dataCell.C4) {
            $("#cb_estado").val($(this).val());
        }
    });

    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
        $("#div_filtro_new_edit_bts div.modal-footer button").focus();

    });

}

function fn_new(){
    $("#tx_id_rela").prop("disabled",false); 

    fn_limpiar();

    $("#title_mod").html("Generar nuevo");
    $("#co_generar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Generar");

    if (!$("#row_id_rela").is( "visible") && !$("#row_nemo").is( "visible")) {
        $("#row_id_rela").show();
        $("#row_nemo").show();

    }

    $("#tx_valor").val($("#tx_valor :selected").text());
    $("#cb_estado").val($("#cb_estado :selected").text());

    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
        $("#div_filtro_new_edit_bts div.modal-footer button").focus();

    });
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_estado(){

    $("#cb_estado").html("<option value='' selected></option><option value='1'>Excelente</option> <option value='2' >Bueno</option>  <option value='3' >Regular</option> <option value='3' >Malo</option> ");
    //$("#cb_tipo_motiv_edit").html("<option value='' selected></option><option value='1'>Corte</option> <option value='2' >Reposición</option>  <option value='3' >OPCION 03</option> ");
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

    $("#tx_id_rela").val("");
    $("#tx_nemo").val("");
    $("#tx_valor").val("");
    $("#cb_estado").val("");
}


function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

