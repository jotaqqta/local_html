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
	$("#co_nuevo").prop("disabled", true);
	
    $("#co_filtro").on("click", fn_filtro);

    $("#co_nuevo").on("click", fn_new);

    $("#co_generar_fil").on("click", function() {
        if ($.trim($("#co_generar_fil").text()) === "Consultar") {
            if ($("#cb_sistema").val() === "") {
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR SISTEMA!!!</strong></div>',3000);
                $("#cb_sistema").focus();
                return;
            }

            if ($("#cb_regional").val() === "") {
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR REGIONAL!!!</strong></div>',3000);
                $("#cb_regional").focus();
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
        if ($.trim($("#co_generar").text()) === "Modificar") {
            
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

				$("#tx_sistema").val(dataCell.C1);
				$("#tx_regional").val(dataCell.C2);
				$("#tx_path_unix").val(dataCell.C3);
				$("#tx_path_win").val(dataCell.C4);
				$("#tx_tipo_path").val(dataCell.C5);
				$("#LpGvBa41").val(dataCell.C5);

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
        { title: "Regional", width: 210, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
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

function fn_new(){

    fn_limpiar();
    $("#co_limpiar").show();
    $("#title_mod").html("Generar nuevo");
    $("#co_generar").html("<span class='glyphicon glyphicon-floppy-disk'></span> Generar");

    $("#div_filtro_new_edit_bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro_new_edit_bts").on("shown.bs.modal", function () {
    $("#div_filtro_new_edit_bts div.modal-footer button").focus();

    $("#tx_sistema").val($("#cb_sistema option:selected").text());
    $("#tx_regional").val($("#cb_regional option:selected").text());
 
    });
}

/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_combos(){

    $("#cb_sistema").html("<option value='' selected></option><option value='1'>FACTURACION 1</option> <option value='2' >FACTURACION 2</option>  <option value='3' >FACTURACION 3</option> <option value='3' >FACTURACION 4</option> ");
    $("#cb_regional").html("<option value='' selected></option><option value='1'>PANAMA METRO 1</option> <option value='2' >PANAMA METRO 2</option>  <option value='3' >PANAMA METRO 3</option> <option value='3' >PANAMA METRO 4</option> ");
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
	
    $("#tx_path_unix").val("");
    $("#tx_path_win").val("");
    $("#tx_tipo_path").val("");
   
}

////////////////////FUNCION GENERAL MENSAJES//////////////////////////////////////////////
function fn_val_general(){

	if ($("#tx_path_unix").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR PATH UNIX!!!</strong></div>',3000);
		$("#tx_path_unix").focus();
		return true;
	}

	if ($("#tx_path_win").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR DIGITAR PATH WINDOWS!!!</strong></div>',3000);
		$("#tx_path_win").focus();
		return true;
	}

	if ($("#tx_tipo_path").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR TIPO PATH</strong></div>', 3000);
		$("#tx_tipo_path").focus();
		return true;
	}
	return false;
}

////////////////////FUNCION LIMPIAR FILTRO MODAL FILTRO//////////////////////////////////////////////
function fn_limpiar_filtro(){
   $("#cb_sistema").val("");
   $("#cb_regional").val("");
    
}

//////////////////////////////////////////////////////////////////
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}



