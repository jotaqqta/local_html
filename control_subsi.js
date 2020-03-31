var g_modulo = "Subsidios";
var g_tit = "Control de Subsidios";
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
    jQuery('#tx_ano').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_mes').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_subsid').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });

    
    //COMBOS
    fn_cen_oper();
    

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
    $("#tx_mes").inputmask({
        alias: "mm/yyyy",placeholder: '',
    });

    
    //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();

    //DIBUJA LOS ICONOS DE LOS BOTONES

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");

///////////////////////////////////BOTONES-EVENTOS/////////////////////////////////
	
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



    $("#co_generar_fil").on("click", function() {
        if ($.trim($("#co_generar_fil").text()) === "Aceptar") {
            
            if (fn_val_general())
                return;   

			
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
		if ($("#tx_path_unix").val() === "" || $("#tx_path_win").val() === "");
    });

	
	$("#co_limpiar_fil").on("click", function () {
		fn_limpiar_filtro();
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
                $("#title_mod").html("Consultar");


				$("#tx_centro_op").val(dataCell.C1);
				$("#tx_cant_sub_ejec").val(dataCell.C2);
				$("#tx_cant_sub_pend").val(dataCell.C3);
				$("#tx_total_cant_sub").val(dataCell.C4);
                $("#tx_sub_ejec").val(dataCell.C5);
                $("#tx_sub_pend").val(dataCell.C6);
                $("#tx_total_sub").val(dataCell.C7);

               
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
        { C1: '8000', C2: '110,906', C3: '3,349', C4: '114,255', C5: '-1,009,676.16', C6: '-1,971.90', C7: '-1.011,648'},
      
           
    ];

    var obj = {
        height: "100%",
        showTop: true,
        showBottom:true,
        showTitle : true,
        title: "Control Mensual Subsidios",
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
                { type: "button", label: "Filtro",  attr: "id=co_filtro",  cls: "btn btn-primary btn-sm" },
                { type: "button", label: "Excel",   attr:"id=co_excel",    cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",  attr: "id=co_cerrar",  cls: "btn btn-secondary btn-sm"},
                
            ]
        },
    };

    obj.colModel = [
        { title: "Centro Op.", width: 150, dataType: "strig", dataIndx: "C1", halign: "center", align: "center", },
        { title: "Cant. Sub. Ejec.", width: 150, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "Cant. Sub. Pend.", width: 150, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Total Cant. Sub.", width: 150, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "$ Sub. Ejec.", width: 150, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
        { title: "$ Sub. Pend.", width: 150, dataType: "string", dataIndx: "C6", halign: "center", align: "center" },
        { title: "$ Total Sub.", width: 150, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },

    ];
    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

}

/////////////////////////////////FUNCIONES///////////////////////////////////////////

function fn_filtro(){

    $("#title_mod").html("Filtro");
    $("#co_generar").html("<span class='glyphicon glyphicon-ok'></span> Consultar");


    $("#div_filtro__bts").modal({backdrop: "static",keyboard:false});
    $("#div_filtro__bts").on("shown.bs.modal", function () {
    $("#div_filtro__bts div.modal-footer button").focus();
    });
}


/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
function fn_cen_oper(){

    $("#cb_cen_oper").html("<option value='' selected></option><option value='1'>PANAMA METRO</option> <option value='2' >PANAMA METRO</option> ");
    
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

////////////////////FUNCION LIMPIAR MODAL EDITAR Y NUEVO//////////////////////////////////////////////


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

	if ($("#cb_cen_oper").val() === "") {
		fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR CEN. OPER.!!!</strong></div>',3000);
		$("#cb_cen_oper").focus();
		return true;
	}

	if ($("#tx_subsid").val() === "") {
		fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR SUBSIDIADOR!!!</strong></div>',3000);
		$("#tx_subsid").focus();
		return true;
	}

	if ($("#tx_ano").val() === "") {
		fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR A&Ntilde;O</strong></div>', 3000);
		$("#tx_ano").focus();
		return true;
	}
    if ($("#tx_mes").val() === "") {
        fn_mensaje('#mensaje_filtro', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR MES!!!</strong></div>', 3000);
        $("#tx_mes").focus();
        return true;
    }
	return false;
}

////////////////////FUNCION LIMPIAR FILTRO MODAL FILTRO//////////////////////////////////////////////
function fn_limpiar_filtro(){
   $("#cb_cen_oper").val("");
   $("#tx_subsid").val("");
   $("#tx_ano").val("");
   $("#tx_mes").val("");
    
}

//////////////////////////////////////////////////////////////////
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}



