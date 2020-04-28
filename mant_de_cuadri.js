var g_modulo = "Consuta de Cuadrillas";
var g_tit = "Mantenedor de Cuadrillas";
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
    fn_contratista();
    fn_actividad();
    fn_inspector();
    fn_estado();
    

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
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

///////////////////////////////////BOTONES-EVENTOS/////////////////////////////////
	$("#co_nuevo").prop("disabled", false);
	   


    $("#co_nuevo").on("click", fn_new);



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
	
    $("#co_limpiar").on("click", function () {
		fn_limpiar();
		return;
    });

	
    $("#co_cancel").on("click", function (){
        $('#div_filtro_new_edit_bts').modal('hide');
    });
   

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
                              

				$("#tx_cod_cuadri").val(dataCell.C1);
                $("#tx_nom_cuadri").val(dataCell.C2);
                $("#cb_emp_contra").val(dataCell.C3);
                $("#cb_activ").val(dataCell.C4);
                $("#cb_cod_insp").val(dataCell.C5);
                $("#cb_estado").val(dataCell.C6);
				$("#tx_rol_act").val(dataCell.C7);
				$("#tx_fe_ingre").val(dataCell.C8);
                $("#tx_fe_actual").val(dataCell.C9);
				
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
        { C1: 'GEN_G_EJEC', C2: 'CUADRILLA GENERICA EJECUCIÓN', C3: '1', C4: '1', C5: '1', C6: '1', C7: 'EJECUCIÓN', C8: '24/04/2020', C9: '24/04/2020' },
        { C1: 'GEN_G_INSP', C2: 'CUADRILLA GENERICA INSPECCIÓN', C3: '1000', C4: '2', C5: '2', C6: '2', C7: 'INSPECCIÓN', C8: '24/04/2020', C9: '24/04/2020' },
          
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
        { title: "Código", width: 300, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
        { title: "Nombre Cuadrilla", width: 300, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "Empresa Contratista", width: 250, dataType: "string", dataIndx: "C3", halign: "center", align: "center", hidden: "true" },
        { title: "Actividad", width: 150, dataType: "string", dataIndx: "C4", halign: "center", align: "center", hidden: "true" },
        { title: "Cod. Inspector", width: 150, dataType: "string", dataIndx: "C5", halign: "center", align: "center" , hidden: "true" },
        { title: "Estado", width: 150, dataType: "string", dataIndx: "C6", halign: "center", align: "center", hidden: "true" },
        { title: "Rol Actualizador", width: 150, dataType: "string", dataIndx: "C7", halign: "center", align: "center", hidden: "true" },
        { title: "Fecha Ingreso", width: 150, dataType: "string", dataIndx: "C8", halign: "center", align: "center", hidden: "true" },
        { title: "Fecha Actualización", width: 150, dataType: "string", dataIndx: "C9", halign: "center", align: "center", hidden: "true" },
        

    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

/////////////////////////////////FUNCIONES///////////////////////////////////////////
function fn_edit(dataCell){


}


function fn_new(){


    $("#tx_cod").prop( "disabled", false);
    $("#tx_descrip").prop( "disabled", false);
    $("#cb_tip_dato").prop( "disabled", false);
    $("#cb_objeto").prop( "disabled", false);
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
function fn_contratista(){
    $("#cb_emp_contra").html("<option value='' selected></option><option value='1'>IDAAN</option> <option value='1000' >IDAAN 1000</option> ");
    
}

function fn_actividad(){
    $("#cb_activ").html("<option value='' selected></option><option value='1'>EJECUCIÓN</option> <option value='2' >INSPECCIÓN</option>");
}

function fn_inspector(){
    $("#cb_cod_insp").html("<option value='' selected></option><option value='1'>123</option> <option value='2' >123</option> ");
    
}

function fn_estado(){
    $("#cb_estado").html("<option value='' selected></option><option value='1'>ACTIVADO</option> <option value='2' >DESACTIVADO</option>");
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
	
    $("#tx_cod_cuadri").val("");
    $("#tx_nom_cuadri").val("");
    $("#cb_emp_contra").val("");
    $("#cb_activ").val("");
    $("#cb_cod_insp").val("");
    $("#cb_estado").val("");
    $("#tx_rol_act").val("");
    $("#tx_fe_ingre").val("");
    $("#tx_fe_actual").val("");
   
}

////////////////////FUNCION GENERAL MENSAJES//////////////////////////////////////////////
function fn_val_general(){

	if ($("#tx_cod_cuadri").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR CÓDIGO CUADRILLA!!!</strong></div>',3000);
		$("#tx_cod_cuadri").focus();
		return true;
	}

	if ($("#tx_nom_cuadri").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR NOMBRE CUADRILLA!!!</strong></div>',3000);
		$("#tx_nom_cuadri").focus();
		return true;
	}

	if ($("#cb_emp_contra").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR EMPRESA CONTRATISTA!!!</strong></div>', 3000);
		$("#cb_emp_contra").focus();
		return true;
	}
    if ($("#cb_activ").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR ACTIVIDAD!!!</strong></div>', 3000);
        $("#cb_activ").focus();
        return true;
    }
    if ($("#cb_cod_insp").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR CÓDIGO INSPECTOR!!!</strong></div>', 3000);
        $("#cb_cod_insp").focus();
        return true;
    }
        if ($("#cb_estado").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR ESTADO!!!</strong></div>', 3000);
        $("#cb_estado").focus();
        return true;
    }
        if ($("#tx_rol_act").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ROL ACTUALIZADOR!!!</strong></div>', 3000);
        $("#tx_rol_act").focus();
        return true;
    }
    if ($("#tx_fe_ingre").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR FECHA INGRESO!!!</strong></div>', 3000);
        $("#tx_fe_ingre").focus();
        return true;
    }
    if ($("#tx_fe_actual").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR FECHA ACTUALIZACIÓN!!!</strong></div>', 3000);
        $("#tx_fe_actual").focus();
        return true;
    }
	return false;
}


//////////////////////////////////////////////////////////////////
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}



