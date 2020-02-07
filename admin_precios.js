var g_modulo = "Administrador Tarifario";
var g_tit = "Actualización de Precios";
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
    jQuery('#tx_codigo').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });    
    

    //COMBOS

    fn_estado();


 
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

            filtro = [ $("#cb_agrup").val()];

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_new_edit_bts").slideUp();
            $('#div_filtro_new_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }

        if ($.trim($("#co_generar").text()) === "Generar") {

            if ($("#tx_cod_val").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR C&Oacute;DIGO VALOR!!!</strong></div>',3000);
                $("#tx_cod_val").focus();
                return;
            }

            if ($("#tx_fe_apli").val() !== "") {
                if (fn_validar_fecha($("#tx_fe_apli").val()) === false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA DE CREACI&Oacute;N!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fe_apli").focus();
                    return;
                }
            }

            if ($("#tx_fe_modif").val() !== "") {
                if (fn_validar_fecha($("#tx_fe_modif").val()) === false) {
                    fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA DE MODIFICACI&Oacute;N!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
                    $("#tx_fe_modif").focus();
                    return;
                }
            }

            if ($("#tx_valor").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR VALOR!!!</strong></div>',3000);
                $("#tx_valor").focus();
                return;
            }
   
            /*if ($("#optradio").val() === "") {

                fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ESTADO!!!</strong></div>',3000);
                $("#optradio").focus();
                return;
            }*/

            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar"));
            $("#div_prin").slideDown();
            $("#div_filtro_new_edit_bts").slideUp();
            $('#div_filtro_new_edit_bts').modal('hide');
            $(window).scrollTop(0);

        }

        // Modificar
        if ($.trim($("#co_generar").text()) === "Modificar") {

            if ($.trim($("#co_generar").text()) === "Generar") {

				if ($("#tx_cod_val").val() === "") {

					fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR C&Oacute;DIGO VALOR!!!</strong></div>',3000);
					$("#tx_cod_val").focus();
					return;
				}

				if ($("#tx_fe_apli").val() !== "") {
					if (fn_validar_fecha($("#tx_fe_apli").val()) === false) {
						fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA DE CREACI&Oacute;N!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
						$("#tx_fe_apli").focus();
						return;
					}
				}

				if ($("#tx_fe_modif").val() !== "") {
					if (fn_validar_fecha($("#tx_fe_modif").val()) === false) {
						fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR VALIDAR EL FORMATO DE LA FECHA DE MODIFICACI&Oacute;N!!! RECUERDE QUE ES DD/MM/YYYY</strong></div>', 3000);
						$("#tx_fe_modif").focus();
						return;
					}
				}

				if ($("#tx_valor").val() === "") {

					fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR VALOR!!!</strong></div>',3000);
					$("#tx_valor").focus();
					return;
				}

				/*if ($("#optradio").val() === "") {

					fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ESTADO!!!</strong></div>',3000);
					$("#optradio").focus();
					return;
				}*/

				fn_mensaje_boostrap("Se modifico", g_tit, $("#co_generar"));
				$("#div_prin").slideDown();
				$("#div_filtro_new_edit_bts").slideUp();
				$('#div_filtro_new_edit_bts').modal('hide');
				$(window).scrollTop(0);

        	}
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
            $("#tx_cod_val").prop("disabled",true);
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
        { C1: '07/02/2020', C2: '07/02/2020', C3: '0.0005', C4: 'S'},
        { C1: '07/02/2020', C2: '07/02/2020', C3: '0.0006', C4: 'S'},
        { C1: '07/02/2020', C2: '07/02/2020', C3: '0.0007', C4: 'S'},
           
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
        { title: "Fecha Aplicaci&oacute;n", width: 100, dataType: "strig", dataIndx: "C1", halign: "center", align: "center", },
        { title: "Fecha Aactualizaci&oacute;n", width: 100, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "Valor", width: 300, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
        { title: "Con Tramo", width: 300, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },       
    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~

function fn_filtro(){

    $("#tx_codigo").prop("disabled",false);

    fn_limpiar()
    $("#co_limpiar").show();

    $("#row_nom").hide();
    $("#row_descrip").hide();
    $("#row_fe_crea").hide();
    $("#row_fe_modif").hide();


    $("#tx_codigo").val(filtro[0]);
    $("#cb_agrup").val(filtro[1]);
    $("#cb_estado").val(filtro[2]);


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

    if (!$("#row_cod").is( "visible") && !$("#row_agrup").is( "visible")) {
        $("#row_agrup").show();
    }

    $("#tx_codigo").val(dataCell.C1);
    $("#cb_agrup").val(dataCell.C2);
    $("#tx_nombre").val(dataCell.C3);
    $("#tx_descrip").val(dataCell.C4);
    $("#tx_fe_crea").val(dataCell.C5);
    $("#tx_fe_modif").val(dataCell.C6);
    $("#cb_estado").val(dataCell.C7);

    $("#row_nom").show();
    $("#row_descrip").show();
    $("#row_fe_crea").show();
    $("#row_fe_modif").show();

    

    $("#tx_codigo option").each(function()
    {
        if ($(this).text() === dataCell.C1) {
            $("#tx_codigo").val($(this).val());
        }
    });

    $("#cb_estado option").each(function()
    {
        if ($(this).text() === dataCell.C7) {
            $("#cb_estado").val($(this).val());
        }
    });

    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
        $("#div_filtro_new_edit_bts div.modal-footer button").focus();

    });

}

function fn_new(){
    $("#tx_codigo").prop("disabled",false); 

    fn_limpiar();
    $("#co_limpiar").show();

     $("#row_nom").show();
    $("#row_descrip").show();
    $("#row_fe_crea").show();
    $("#row_fe_modif").show();

    $("#title_mod").html("Generar nuevo");
    $("#co_generar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Generar");

    if (!$("#row_cod").is( "visible") && !$("#row_agrup").is( "visible")) {
        $("#row_cod").show();
        $("#row_agrup").show();      

    }

    $("#tx_nombre").val($("#tx_nombre :selected").text());
    $("#tx_descrip").val($("#cb_estado :selected").text());
    $("#tx_fe_crea").val($("#cb_estado :selected").text());
    $("#tx_fe_modif").val($("#cb_estado :selected").text());
    $("#cb_estado").val($("#cb_estado :selected").text());

    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
        $("#div_filtro_new_edit_bts div.modal-footer button").focus();

    });
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_estado(){

    $("#cb_agrup").html("<option value='' selected></option><option value='1'>1</option> <option value='2' >2</option>  <option value='3' >3</option> <option value='3' >4</option> ");
    $("#cb_estado").html("<option value='' selected></option><option value='1'>Excelente</option> <option value='2' >Bueno</option>  <option value='3' >Regular</option> <option value='3' >Malo</option> ");
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

    $("#tx_codigo").val("");
    $("#cb_agrup").val("");
    $("#tx_nombre").val("");
    $("#tx_descrip").val("");
    $("#tx_fe_crea").val("");
    $("#tx_fe_modif").val("");
    $("#cb_estado").val("");
}


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

