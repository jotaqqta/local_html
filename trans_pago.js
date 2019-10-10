var g_modulo = "Cuadre para transmisión de pagos";
var g_tit = "Cuadre para transmisión de pagos";
var $grid_principal;
var $grid_2;
var sql_grid_prim = "";
var sql_grid_2 = "";
var sql_grid_3 = "";
var parameters = {};


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
    jQuery('#tx_cons').keypress(function (tecla){
        if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});
	
     //COMBOS
    fn_tipoconsulta();
    fn_tipofechas();
	fn_agencia();
    
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
	
    // INICIA CON EL CURSOR EN EL CAMPO FECHA
	
	$("._input_selector").inputmask("dd/mm/yyyy");
    
	//DEFINE LA GRILLA PRINCIPAL
	fn_setea_grid_principal();
    
	//DIBUJA LOS ICONOS DE LOS BOTONES     

    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
	$("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    
   
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//BOTONES-EVENTOS
    
    $("#co_filtro").on("click", fn_filtro);
    
    $("#co_cerrar_t").on("click", function(e){
        window.close(); 
    });
    $("#co_consultar").on("click", function() {
		
        if ($.trim($("#co_consultar").text()) == "Consultar") {
            if ($("#cb_tipocons").val() == "") {
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR TIPO DE CONSULTA!!!</strong></div>',3000);
                $("#cb_tipocons").focus();

                return;
            }
            if ($("#cb_tipofech").val() == ""){
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR TIPO DE FECHAS!!!</strong></div>',3000);
                $("#cb_tipofech").focus();
                
                return;
            }
            if ($("#cb_agencia").val() == "") {
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR AGENCIA!!!</strong></div>',3000);
                $("#cb_agencia").focus();

                return;
            }
            if ($("#tx_fechaproini").val() == "") {                
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR PROCESO INICIAL!!!</strong></div>',3000);
                $("#tx_fechaproini").focus();


                return;
            }
            if ($("#tx_fechaprofin").val() == "") {
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR PROCESO FINAL!!!</strong></div>',3000);
                $("#tx_fechaprofin").focus();

                return;
            }

            if ($("#tx_dia").val() == "") {
                fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR DIA!!!</strong></div>',3000);
                $("#tx_dia").focus();
                return;
            }
            			
            fn_mensaje_boostrap("Se genero", g_tit, $("#co_consultar"));
            fn_carga_grilla();
            $("#div_prin").slideDown();
			$("#div_filtro_bts").slideUp();
			$('#div_filtro_bts').modal('hide');	
            $(window).scrollTop(0);

        }
    })
	
	
	$("#co_cancel").on("click", function (e){
		$('#div_filtro_bts').modal('hide');	
    });
	
	$("#co_cerrar").on("click", function (e){
       window.close();
    });
 
//BOTONES ELIMINAR DE LAS GRILLAS
 
 
    $("#co_filtro").on("click", function(e){
 		fn_filtro();            
    }); 
 //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	$("._input_selector").inputmask("dd/mm/yyyy");

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//EXCEL    
	$("#co_excel").on("click", function (e) {
		
		fn_filtro();
		e.preventDefault();
        var col_model=$( "#div_grid_principal" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid_principal.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#tituloexcel").val(g_tit);
			$("#sql").val(sql_grid_prim);	
			$("#frm_Exel").submit();
			return;
		}	
    });    	 
	 
});
           
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal() {
	
	var obj = {
		height: "100%",
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		editable: false,
		editor: { type: "textbox", select: true, style: "outline:none;" },
		selectionModel: { type: 'cell' },
		numberCell: { show: true},
		title: "",
		showTitle: false,
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items:[
				{ type: "button", label: "Filtro",    attr: "id=co_filtro",  cls: "btn btn-primary" }, 
				{ type: "button", label: "Excel", attr:"id=co_excel", cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm"}               
				]
		},
		dataModel:{ data: [
			{ C1: '0001', C2: 'CONSUMO DE AGUA', C3: '1', C4: 1212121, C5: '1', C6: '1', C7: '1', C8: '1', C9: '0'},
			{ C1: '0002', C2: 'CONSUMO DE AGUA NO FACTURADO',C3: '2', C4: 455455, C5: '2', C6:'2', C7: "2", C8: '2', C9: '0'},
			{ C1: '0003', C2: 'SUBSIDIADO POR CASO SOCIAL', C3: '3', C4: 421212, C5: '3', C6: '3', C7: "3", C8: '3', C9: '0'}
			
        ] }
	};
	
    obj.colModel = [
		{ title: "Oficina", width:55, dataType: "number", dataIndx: "C1", halign: "center", align: "center" },
		{ title: "Fecha", width: 300, dataType: "string", dataIndx: "C2", halign: "center", align: "center"},
        { title: "Total Pagos",width: 60, dataType: "string", dataIndx: "C3", halign: "center", align: "center" },
		{ title: "Total Pagos Detalle", width: 70, dataType: "number", dataIndx: "C4", halign: "center", align: "center"},
        { title: "Total Lotes",width: 70, dataType: "string", dataIndx: "C5", halign: "center", align: "center" },
		{ title: "Total Depósitos", width: 70, dataType: "string", dataIndx: "C6", halign: "center", align: "center"},
        { title: "Total Entregas",width: 70, dataType: "string", dataIndx: "C7", halign: "center", align: "center" },
		{ title: "Total Planilla", width: 90, dataType: "string", dataIndx: "C8", halign: "center", align: "center"},
        { title: "Diferencia declarada", width: 90, dataType: "string", dataIndx: "C9", halign: "center", align: "center"} 
	];

	$grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid("refreshDataAndView");
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
function fn_filtro(){
	
     $("#div_filtro_bts").modal({backdrop: "static",keyboard:false});
	 $("#div_filtro_bts").on("shown.bs.modal", function () {
	 $("#div_filtro_bts div.modal-footer button").focus();
	 
			
	});
}


 
/////////////////////////////////FUNCIONES COMBOS///////////////////////////////////////////
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~	
function fn_tipoconsulta(){
    
    $("#cb_tipocons").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_tipofechas() {
    
    $("#cb_tipofech").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_agencia() {
    
    $("#cb_agencia").html("<option value='' selected></option><option value='1'>OPCION 01</option> <option value='2' >OPCION 02</option>  <option value='3' >OPCION 03</option>");
}
function fn_carga_grilla() {


}
function fn_gen() {
    alert('Se genero.');
}
function fn_gen(){
     alert('Se genero.');
}
function fn_limpiar(){
    $("#tx_cod").val("");
    $("#tx_desc").val("");
    $("#cb_unid_hab").val("0");
    $("#tx_cons").val("");
    $("#cb_subs").val("0");
    $("#cb_jub").val("0");
    $("#cb_prom").val("0");
    $("#cb_compe").val("0");

}
function fn_mensaje(id,mensaje,segundos)
{
$(id).show();
$(id).html(mensaje);
setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}

