var g_modulo = "Tratamiento de Ordenes Masivas";
var g_tit = "Administrador de Horarios";
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
    jQuery('#tx_hora_ini').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_min_ini').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_hora_fin').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
    jQuery('#tx_min_fin').keypress(function (tecla){
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
            if ($("#cb_sistema").val() === "") {
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR SISTEMA!!!</strong></div>',3000);
                $("#cb_sistema").focus();
                return;
            }
			
            $('#div_filtro__bts').modal('hide');
            fn_mensaje_boostrap("Se genero", g_tit, $("#co_generar_fil"));
            $(window).scrollTop(0);
        }
    });

	/////////////////////////////////BOTON MODIFICAR/////////////////////////////////
    $("#co_modif").on("click", function() {
        if ($.trim($("#co_modif").text()) === "Generar") {

            if (fn_val_general())
                return;   

            $('#div_filtro_new_edit_bts').modal('hide');
			fn_mensaje_boostrap("Se generó", g_tit, $(""));
            $(window).scrollTop(0);
        }	
    else
        {
        if (fn_val_general())
                return;                             
            $('#div_filtro_new_edit_bts').modal('hide');
            fn_mensaje_boostrap("Se modificó", g_tit, $(""));
            $(window).scrollTop(0);
        }
    });

	/////////////////////////////////BOTON CANCELAR FILTRO/////////////////////////////////

    $("#co_cancel_fil").on("click", function (){
        $('#div_filtro__bts').modal('hide');
		if ($("#tx_path_unix").val() === "" || $("#tx_path_win").val() === "");
    });

	/////////////////////////////////BOTON LIMPIAR FILTRO/////////////////////////////////
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
                $("#title_mod").html("Editar");


				$("#tx_hora_ini").val(dataCell.C2);
				$("#tx_min_ini").val(dataCell.C3);
				$("#tx_hora_fin").val(dataCell.C4);
				$("#tx_min_fin").val(dataCell.C5);
              

               
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
        { C1: 'LUNES', C2: '08', C3: '30', C4: '18', C5: '30'},
        { C1: 'MARTES', C2: '08', C3: '30', C4: '18', C5: '30'},
      
           
    ];

    var obj = {
        height: "100%",
        showTop: true,
        showBottom:true,
        showTitle : true,
        title: "Mantenedor de Horarios",
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
        { title: "Días", width: 150, dataType: "strig", dataIndx: "C1", halign: "center", align: "center", },
        { title: "Hrs. Ini", width: 150, dataType: "string", dataIndx: "C2", halign: "center", align: "center" },
        { title: "Min. Ini", width: 150, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
        { title: "Hrs. Fin", width: 150, dataType: "string", dataIndx: "C4", halign: "center", align: "center" },
        { title: "Min. Fin", width: 150, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
       

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
function fn_sistema(){

    $("#cb_sistema").html("<option value='' selected></option><option value='1'>ATENCIÓN INTEGRAL CLIENTE</option> ");
    
}

////////////////////FUNCION CARGA GRILLA//////////////////////////////////////////////

function fn_carga_grilla() {

    var total_register;

    $grid_principal.pqGrid( "option", "dataModel", dataModel );
    $grid_principal.pqGrid( "refreshDataAndView" );
    $grid_principal.pqGrid( "option", "title", "Total Registros: " + total_register);

}

////////////////////FUNCION GENERAL MENSAJES//////////////////////////////////////////////
    function fn_val_general(){

	if ($("#tx_hora_ini").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR HORA INICIAL!!!</strong></div>',3000);
		$("#tx_hora_ini").focus();
		return true;
	}
	if ($("#tx_min_ini").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR MINUTO INICIAL!!!</strong></div>',3000);
		$("#tx_min_ini").focus();
		return true;
	}
	if ($("#tx_hora_fin").val() === "") {
		fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR HORA FINAL!!!</strong></div>', 3000);
		$("#tx_hora_fin").focus();
		return true;
	}
    if ($("#tx_min_fin").val() === "") {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR MINUTO FINAL!!!</strong></div>', 3000);
        $("#tx_min_fin").focus();
        return true;
    }
    if ($("#tx_hora_ini").val() > 23) {
        fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR HORA INICIAL ENTRE 00 Y 23 HORAS!!!</strong></div>',3000);
        $("#tx_hora_ini").focus();
        return true;
    }
    if ($("#tx_min_ini").val() > 59) {
        fn_mensaje('#mensaje_filtro_new_edit','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ENTRE 00 Y 59 MINUTOS!!!</strong></div>',3000);
        $("#tx_min_ini").focus();
        return true;
    }
    if ($("#tx_hora_fin").val() > 23) {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ENTRE 00 Y 23 HORAS!!!</strong></div>', 3000);
        $("#tx_hora_fin").focus();
        return true;
    }
    if ($("#tx_min_fin").val() > 59) {
        fn_mensaje('#mensaje_filtro_new_edit', '<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR ENTRE 00 Y 59 MINUTOS!!!</strong></div>', 3000);
        $("#tx_min_fin").focus();
        return true;
    }
	   return false;
    }

   $("#tx_hora_ini").blur(function () {
        if ($("#tx_hora_ini").val() >= 24) {
            $("#tx_hora_ini").val("23");
        }
    });

    $("#tx_min_ini").blur(function () {
        if ($("#tx_min_ini").val() >= 60) {
            $("#tx_min_ini").val("59");
        }
    });

    $("#tx_hora_fin").blur(function () {
        if ($("#tx_hora_fin").val() >= 24) {
            $("#tx_hora_fin").val("23");
        }
    });

    $("#tx_min_fin").blur(function () {
        if ($("#tx_min_fin").val() >= 60) {
            $("#tx_min_fin").val("59");
        }
    });

//////////////////////////////////////////////////////////////////
function fn_mensaje(id,mensaje,segundos)
{
    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}



