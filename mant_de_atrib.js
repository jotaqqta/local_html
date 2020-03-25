var g_modulo = "Ordenes Genéricas";
var g_tit = "Mantención de Atributos";
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
    jQuery('#tx_cod').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_long').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });    
    
    //COMBOS
    fn_tipo_dato();
    fn_objeto();
    

    //FOOTER
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
	$("#co_nuevo").prop("disabled", false);

    //DIBUJA LOS ICONOS DE LOS BOTONES

    $("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

///////////////////////////////////BOTONES-EVENTOS/////////////////////////////////
	$("#co_nuevo").prop("disabled", false);
	
    $("#co_filtro").on("click", fn_filtro);

    $("#co_activar").on("click", function() {
        if ($.trim($("#co_activar").text()) === "Activar") {
			fn_mensaje_boostrap("Se Activó", g_tit, $(""));
		} else {
			fn_mensaje_boostrap("Se Desactivó", g_tit, $(""));
		}

        $('#div_filtro_new_edit_bts').modal('hide');
        $(window).scrollTop(0);

    });


    $("#co_nuevo").on("click", fn_new);

    $("#co_generar_fil").on("click", function() {
        if ($.trim($("#co_generar_fil").text()) === "Consultar") {
            if ($("#cb_tip_orden").val() === "") {
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR TIPO ORDEN!!!</strong></div>',3000);
                $("#cb_tip_orden").focus();
                return;
            }
			
			$("#co_nuevo").prop("disabled", false);
            $('#div_filtro__bts').modal('hide');
            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar_fil"));
            $(window).scrollTop(0);
        }
    });

	/////////////////////////////////BOTON GENERAR/////////////////////////////////
    $("#co_generar").on("click", function() {
        if ($.trim($("#co_generar").text()) === "Generar") {
            if (fn_val_general())
                return;       
            $('#div_filtro_new_edit_bts').modal('hide');
			fn_mensaje_boostrap("Se generó", g_tit, $(""));
            $(window).scrollTop(0);
        }

	/////////////////////////////////BOTON MODIFICAR/////////////////////////////////
        else{ 
            if (fn_val_general())
                return;                             
            $('#div_filtro_new_edit_bts').modal('hide');
            fn_mensaje_boostrap("Se modificó", g_tit, $(""));
            $(window).scrollTop(0);
             
        }
    });

	
    $("#co_cancel_fil").on("click", function (){
        $('#div_filtro__bts').modal('hide');
		if ($("#tx_path_unix").val() === "" || $("#tx_path_win").val() === "")
			$("#co_nuevo").prop("disabled", true);
    });

	
	$("#co_limpiar_fil").on("click", function () {
		fn_limpiar_filtro();
		return;
    });

	
    $("#co_limpiar").on("click", function () {
		fn_limpiar();
		return;
    });

	
    $("#co_cancel").on("click", function (){
        $('#div_filtro_new_edit_bts').modal('hide');
    });

	
    $("#co_confirm_yes").on( "click", function () {
        $grid_principal.pqGrid("deleteRow", { rowIndx: rowIndxG });
        $('#dlg_confirm').modal('hide');
    });

	
    $("#co_confirm_no").on( "click", function () {
        $('#dlg_confirm').modal('hide');
    });


    $("#co_cerrar").on("click", function (){ window.close(); });

/////////////////////////////////EVENTO DBL_CLICK DE LA GRILLA/////////////////////////////////
    $grid_principal.pqGrid({
        rowDblClick: function( event, ui ) {
            if (ui.rowData) {
                var dataCell = ui.rowData;
                $("#title_mod").html("Editar");
				$("#co_generar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Modificar");
                $("#co_activar").show();
                $("#co_limpiar").hide();
                $("#fecha_crea").show();
                $("#fecha_modif").show();               
                $("#tx_cod").prop( "disabled", true);
                $("#cb_tip_dato").prop( "disabled", true);
                $("#cb_objeto").prop( "disabled", true);
                $("#tx_rol_crea").prop( "disabled", true);              
                              

				$("#tx_cod").val(dataCell.C1);
                $("#tx_descrip").val(dataCell.C2);
                $("#cb_tip_dato").val(dataCell.C3);
                $("#cb_objeto").val(dataCell.C4);
                $("#tx_long").val(dataCell.C5);
                $("#tx_rol_crea").val(dataCell.C6);
				$("#tx_fe_crea").val(dataCell.C7);
				$("#tx_fe_modif").val(dataCell.C8);
				
				$("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
				$("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
				$("#div_filtro_new_edit_bts div.modal-footer button").focus();

				});
				
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


/////////////////////////////////GRILLA///////////////////////////////////////////
function fn_setea_grid_principal() {

    var data =  [
        { C1: '7', C2: 'CONSUMO', C3: '1', C4: '1', C5: '256', C6: 'CONSULTO',C7: '24/03/2020', C8: '', C9:'NUMBER'},
        { C1: '5', C2: 'NO. SEGURO SOCIAL', C3: '1', C4: '1', C5: '256', C6: 'CONSULTO',C7: '24/03/2020', C8: '', C9:'NUMBER'},
          
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
                { type: "button", label: "Excel",   attr:"id=co_excel",    cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",  attr: "id=co_cerrar",  cls: "btn btn-secondary btn-sm"},
                
            ]
        },
    };

    obj.colModel = [
        { title: "Código", width: 200, dataType: "string", dataIndx: "C1", halign: "center", align: "center", },
        { title: "Descripción", width: 200, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "Tipo", width: 200, dataType: "string", dataIndx: "C3", halign: "center", align: "center" , hidden: "true"},
        { title: "Tipo", width: 200, dataType: "string", dataIndx: "C9", halign: "center", align: "center" },
        { title: "Objeto", width: 150, dataType: "string", dataIndx: "C4", halign: "center", align: "center" , hidden: "true" },
        { title: "Longitud", width: 150, dataType: "string", dataIndx: "C5", halign: "center", align: "center", hidden: "true" },
        { title: "Rol Creación", width: 150, dataType: "string", dataIndx: "C6", halign: "center", align: "center", hidden: "true" },
        { title: "Fecha Creación", width: 150, dataType: "string", dataIndx: "C7", halign: "center", align: "center", hidden: "true" },
        { title: "Fecha Modificación", width: 150, dataType: "string", dataIndx: "C8", halign: "center", align: "center", hidden: "true" },
        

    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

/////////////////////////////////FUNCIONES///////////////////////////////////////////

function fn_filtro(){

    $("#title_mod").html("Filtrar");
    $("#co_generar").html("<span class='glyphicon glyphicon-ok'></span> Consultar");


    $("#div_filtro__bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro__bts").on("shown.bs.modal", function () {
    $("#div_filtro__bts div.modal-footer button").focus();
    });
}

function fn_edit(dataCell){


}

function fn_activar(){

}

function fn_new(){


    $("#tx_cod").prop( "disabled", false);
    $("#tx_descrip").prop( "disabled", false);
    $("#fecha_crea").hide();
    $("#fecha_modif").hide();
    
    fn_limpiar();
    $("#co_limpiar").show();
    $("#co_activar").hide();
    $("#title_mod").html("Generar nuevo");
    $("#co_generar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Generar");


    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
    $("#div_filtro_new_edit_bts div.modal-footer button").focus();

 
 
    });
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_tipo_dato(){
    $("#cb_tip_dato").html("<option value='' selected></option><option value='1'>NUMBER</option> <option value='2' >VARCHAR2</option> ");
    
}

function fn_objeto(){
    $("#cb_objeto").html("<option value='' selected></option><option value='1'>TEXT</option> <option value='2' >INTEGER</option>");
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

////////////////////FUNCION CARGA GRILLA//////////////////////////////////////////////

function fn_carga_grilla() {

    var total_register;

    $grid_principal.pqGrid( "option", "dataModel", dataModel );
    $grid_principal.pqGrid( "refreshDataAndView" );
    $grid_principal.pqGrid( "option", "title", "Total Registros: " + total_register);

}

////////////////////FUNCION LIMPIAR FILTRO MODAL EDITAR Y NUEVO//////////////////////////////////////////////


function fn_limpiar(){
	
    $("#tx_cod").val("");
    $("#tx_descrip").val("");
    $("#cb_tip_dato").val("");
    $("#cb_objeto").val("");
    $("#tx_long").val("");
    $("#tx_rol_crea").val("");
    $("#tx_fe_crea").val("");
    $("#tx_fe_modif").val("");
    
   
}

////////////////////FUNCION GENERAL MENSAJES//////////////////////////////////////////////
function fn_val_general(){

	if ($("#tx_cod").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR CÓDIGO!!!</strong></div>',3000);
		$("#tx_cod").focus();
		return true;
	}

	if ($("#tx_descrip").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR DESCRIPCIÓN!!!</strong></div>',3000);
		$("#tx_descrip").focus();
		return true;
	}

	if ($("#cb_tip_dato").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR TIPO DE DATO</strong></div>', 3000);
		$("#cb_tip_dato").focus();
		return true;
	}
    if ($("#cb_objeto").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR OBJETO</strong></div>', 3000);
        $("#cb_objeto").focus();
        return true;
    }
    if ($("#tx_long").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR LONGITUD</strong></div>', 3000);
        $("#tx_long").focus();
        return true;
    }
        if ($("#tx_rol_crea").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ROL CREACIÓN</strong></div>', 3000);
        $("#tx_rol_crea").focus();
        return true;
    }
        if ($("#tx_fe_crea").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR FECHA CREACIÓN</strong></div>', 3000);
        $("#tx_fe_crea").focus();
        return true;
    }
	return false;
}

////////////////////FUNCION LIMPIAR FILTRO MODAL FILTRO//////////////////////////////////////////////
//function fn_limpiar_filtro(){
//   $("#cb_sistema").val("");
//   $("#cb_regional").val("");
    
//}

//////////////////////////////////////////////////////////////////
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}



