var g_modulo = "Administrador de Ordenes Masivas";
var g_tit = "Administrador de Buzones por Tipo de Orden";
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
    fn_tip_ord();
    fn_estado();

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
		$('#div_filtro_new_edit_bts').modal('hide');
        if ($.trim($("#co_activar").text()) === "Activar") {
			fn_mensaje_boostrap("Se Activó", g_tit, $(""));
		}           
      	else
		{
			fn_mensaje_boostrap("Se Desactivó", g_tit, $(""));
		}
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
                $("#co_activar").show();


				$("#tx_rol_fun").val(dataCell.C1);
				$("#tx_rol_gen").val(dataCell.C2);
				$("#tx_equipo").val(dataCell.C3);
				$("#tx_oper").val(dataCell.C4);

                    if(dataCell.C5 == "A")
                       $("#co_activar").html("<span class='glyphicon glyphicon-chevron-down'></span> Desactivar");
                else
                    if(dataCell.C5 == "D")
                        $("#co_activar").html("<span class='glyphicon glyphicon-chevron-up'></span> Activar");


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
        { C1: 'REFA_NIV2', C2: 'BUZÓN', C3: ' ', C4: '0000', C5: 'D'},
        { C1: 'MMA', C2: 'BUZÓN', C3: ' ', C4: '1000', C5: 'A'},
        { C1: 'REFA_NIV1', C2: 'BUZÓN', C3: ' ', C4: '0000', C5: 'D'},
           
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
        { title: "Rol Función", width: 210, dataType: "strig", dataIndx: "C1", halign: "center", align: "center", },
        { title: "Rol Genérico", width: 210, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "Equipo", width: 210, dataType: "string", dataIndx: "C3", halign: "center", align: "left" },
        { title: "C. Oper. Área", width: 210, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Estado", width: 210, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },

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
function fn_tip_ord(){

    $("#cb_tip_orden").html("<option value='' selected></option><option value='1'>AJUSTES</option> <option value='2' >INSTALACIÓN</option>  <option value='3' >REAJUSTE</option> <option value='3' >REINSTALACIÓN</option> ");
    
}

function fn_estado(){
    $("#cb_estado").html("<option value='' selected></option><option value='1'>A</option> <option value='2' >D</option>");
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
	
    $("#tx_rol_fun").val("");
    $("#tx_rol_fun_2").val("");
    $("#tx_rol_gen").val("");
    $("#tx_rol_gen_2").val("");
    $("#tx_equipo").val("");
    $("#tx_equipo_2").val("");
    $("#tx_oper").val("");
    $("#tx_oper_2").val("");
    $("#cb_estado").val("");
   
}

////////////////////FUNCION GENERAL MENSAJES//////////////////////////////////////////////
function fn_val_general(){

	if ($("#tx_rol_fun").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ROL FUNCIÓN!!!</strong></div>',3000);
		$("#tx_rol_fun").focus();
		return true;
	}

	if ($("#tx_rol_gen").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ROL GENÉRICO!!!</strong></div>',3000);
		$("#tx_rol_gen").focus();
		return true;
	}

	if ($("#tx_equipo").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR EQUIPO</strong></div>', 3000);
		$("#tx_equipo").focus();
		return true;
	}
    if ($("#tx_oper").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR C. OPER. ÁREA</strong></div>', 3000);
        $("#tx_oper").focus();
        return true;
    }
    if ($("#cb_estado").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR ESTADO</strong></div>', 3000);
        $("#cb_estado").focus();
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



