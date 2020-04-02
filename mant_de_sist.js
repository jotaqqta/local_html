var g_modulo = "Tratamiento de Ordenes Masivas";
var g_tit = "Mantenci&oacute;n de sistemas";

var $grid_principal;
var $grid_2;
var $grid_3;

var sql_grid_prim = "";
var sql_grid_2    = "";
var sql_grid_3    = "";


var parameters = {};
//var Filtros = [];
//var dataReg = [];


//var url = "adm_tablas_gen.asp";


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
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
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).ready(function () {

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
	
	//Se cargan las variables que vienen desde el server
	/*$("#tx_empresa").val(SYNSegCodEmpresa);
	$("#tx_rol").val(SYNSegRol);
	$("#tx_ip").val(SYNSegIP);
	$("#tx_rolfun").val(SYNSegRolFuncion);
	*/
    $("#tx_empresa").val("1");
	$("#tx_rol").val("SYNERGIA");
	$("#tx_ip").val("127.0.0.1");
	
    // INICIA CON EL CURSOR EN EL CAMPO FECHA
	
	$("._input_selector").inputmask("dd/mm/yyyy");
    
	//DEFINE LA GRILLA PRINCIPAL
	fn_setea_grid_principal();
	//DIBUJA LOS ICONOS DE LOS BOTONES     
	$("#co_nuevo").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
	$("#co_editar").html("<span class='glyphicon glyphicon-pencil'></span> Modificar");
	//$("#co_eliminar").html("<span class='glyphicon glyphicon glyphicon-minus'></span> Eliminar");

    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
    
	$("#co_nuevo2").html("<span class='glyphicon glyphicon-plus'></span> Nuevo");
	//$("#co_editar2").html("<span class='glyphicon glyphicon-pencil'></span> Modificar");
	//$("#co_eliminar2").html("<span class='glyphicon glyphicon glyphicon-minus'></span> Eliminar");

    $("#co_excel2").html("<span class='glyphicon glyphicon-save'></span> Excel");
    //$("#co_volver2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    
    
	$("#co_volver").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //FUNCIONES DE CAMPOS
    fn_estado();
    //fn_lect();
 
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
	
    $("#co_nuevo").on("click", fn_new);
	
    $("#co_editar").on("click", function (e) {
		fn_modal(2);
	});
	
    $("#co_nuevo2").on("click", function (e) {
		fn_modal2(1);
	});
	
    
    
    $("#co_volver").on("click", function (e) {
        window.close(); 
    }); 
 
	
	/*$("#co_act").on("click", function (e) {
		fn_actualizar();
	});*/
	//BOTONES ELIMINAR DE LAS GRILLAS
    $("#co_eliminar").on("click", function (e) {
		 
		//alert(dataReg.C1 +  "-" +  dataReg.C2);
		
		$("#dlg_confirmamod").modal({backdrop: "static",keyboard:false});					
		$("#dlg_confirmamod").on("shown.bs.modal", function () {
			$("#co_confirmamod_no").focus();
				});
    	
	});
    
    $("#co_eliminar2").on("click", function (e) {
		 
		//alert(dataReg.C1 +  "-" +  dataReg.C2);
		
		$("#dlg_confirmamod2").modal({backdrop: "static",keyboard:false});					
		$("#dlg_confirmamod2").on("shown.bs.modal", function () {
			$("#co_confirmamod2_no").focus();
				});
    	
	});
    
    
	//BOTONES CERRAR DE LOS MODALES
    $("#co_close").on("click", function (e) {
		$('#div_modal').modal('hide');
		fn_limpia_modal();
	});
    
    $("#co_close2").on("click", function (e) {
		$('#div_modal2').modal('hide');
		fn_limpia_modal2();
	});
    

         
    
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

    $("#co_volver").on("click", function (e) {
		$("#div_prin").show();
		$("#div_tabla").hide();
		fn_limpiar();
		//$grid_principal.pqGrid( "refreshDataAndView" );
		$(window).scrollTop(0);
    });//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	$("._input_selector").inputmask("dd/mm/yyyy");

	/*jQuery('#tx_lec_ant').keypress(function (tecla) {
		if (tecla.charCode < 48 || tecla.charCode > 57) return false;
	});*/
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES
    
    //BOTONES-FILTRO
	$("#co_modif").on("click", function () {
		//Validacin de informacion
		//if ($.trim($("#co_aceptar").text()) == "Aceptar") {
			
			if ($("#tx_cod_sist").val() ==""){
				fn_mensaje_boostrap("FAVOR DIGITAR CODIGO SISTEMA", g_tit, $("#cb_regional"));
				fn_lim_fil_reg();
				
                return false;
                
			};
			
            if ($("#cb_estado").val()==""){
				fn_mensaje_boostrap("FAVOR SELECCIONAR ESTADO", g_tit, $("#cb_ciclo"));
                 fn_lim_fil_ci();
                 return false;
			};
            
			if ($("#tx_cen_op_1").val()==""){
				fn_mensaje_boostrap("FAVOR DIGITAR CENTRO OPERATIVO CLIENTE", g_tit, $("#cb_ruta"));
				return false;
			}
			
			if ($("#tx_cen_op_usu_1").val()==""){
				fn_mensaje_boostrap("FAVOR DIGITAR CENTRO OPERATIVO USUARIO", g_tit, $("#cb_ruta"));
				return false;
			}

			if ($("#tx_fecha_crea").val()==""){
				fn_mensaje_boostrap("FAVOR DIGITAR FECHA CREACIÓN", g_tit, $("#cb_ruta"));
				return false;
			}

			if ($("#tx_fecha_modif").val()==""){
				fn_mensaje_boostrap("FAVOR DIGITAR FECHA MODIFICACIÓN", g_tit, $("#cb_ruta"));
				return false;
			}

            fn_carga_grilla();
            $('#div_modal').modal('hide');
            //fn_lim_filtro(); 
                
            
        //}
	});
    
	$("#co_limpiar").on("click", function () {
		if ($.trim($("#co_limpiar").text()) == "Limpiar") {
		    fn_limpia_modal();
			return;
		}
		else
			window.close();
	});


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	
	$("#div_modal").draggable({
        handle: ".modal-header"
    });
	
    $("#div_modal2").draggable({
        handle: ".modal-header"
    });
	
    //Filtros = [];

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
			
    
    $("#co_excel2").on("click", function (e) {
		e.preventDefault();
		fn_filtro_2();
        var col_model=$( "#div_grid_sec" ).pqGrid( "option", "colModel" );
		var cabecera = "";
		for (i=0; i< col_model.length; i++){
			if(col_model[i].hidden != true) cabecera += "<th>"+col_model[i].title+ "</th>";
		}
		$("#excel_cabecera").val(cabecera);
		var element =$grid_2.pqGrid("option","dataModel.data");
		if (element)
			a= element.length;
		else 
			a= 0;
		if(a>0){
			$("#tituloexcel").val(g_tit);
			$("#sql").val(sql_grid_dos);	
			$("#frm_Exel").submit();
			return;
	    }	
    });

    //EVENTO DBL_CLICK DE LA GRILLA
    $grid_principal.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) {
					var dataCell = ui.rowData;
					//g_cliente_selec = dataCell.c2;
					$("#div_prin").hide();
                    $("#div_tabla").show();

                    $("#tx_cod_sist").val(dataCell.C1);
                    $("#tx_cod_sist_2").val(dataCell.C2);
                    $("#cb_estado").val(dataCell.C3);
                    $("#tx_cen_op_1").val(dataCell.C4);
                    $("#tx_cen_op_2").val(dataCell.C5);
                    $("#tx_cen_op_usu_1").val(dataCell.C6);
                    $("#tx_cen_op_usu_2").val(dataCell.C7);
                    $("#tx_fecha_crea").val(dataCell.C8);
                    $("#tx_fecha_modif").val(dataCell.C9);					
				}
			}
	});
	
	//EVENTO DBL_CLICK DE LA GRILLA CICLO - RUTA
    /*$grid_2.pqGrid({
		rowDblClick: function( event, ui ) {
			if (ui.rowData) 
				{
					var dataCell = ui.rowData;
					//g_cliente_selec = dataCell.c2;
					$("#tx_codigo").val(dataCell.c1);
                    $("#tx_descod").val(dataCell.c2);
                    $("#tx_val1").val(dataCell.c3);
                    $("#tx_val2").val(dataCell.c4);
                    $("#tx_fecing").val(dataCell.c5);
                    $("#tx_fecmod").val(dataCell.c6);
                    //$("#div_tabla").hide();
    				//$("#div_ter").show();
					//ruta_fil = dataCell.C4;
                    //fn_grilla_tres();
                    $("#div_modal2").modal({ backdrop: "static", keyboard: false });
                    $("#div_modal2").on("shown.bs.modal", function () {
                        $("#div_modal2 div.modal-footer button").focus();

				      });
                }
        }
    });*/

	    	 
	 
});
           
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal() {
	
	var obj = {
		height: 540,
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
		pageModel: { type: "local" },
		scrollModel: { theme: true },
		toolbar:
		{
			cls: "pq-toolbar-export",
			items:[
				{ type: "button", label: "Nuevo",    attr: "id=co_nuevo",  cls: "btn btn-primary" },				
                { type: "button", label: "Excel",    attr: "id=co_excel",  cls: "btn btn-primary btn-sm" },       
                { type: "button", label: "Cerrar",   attr: "id=co_cerrar", cls: "btn btn-secondary btn-sm" }               
				]
		},
        editModel: {
            clicksToEdit: 1,
            keyUpDown: true,
            pressToEdit: true,
            cellBorderWidth: 0
        },
		dataModel:{ data: [
             { C1: 'AIC', C2: 'ATENCIÓN INTEGRAL DE CLIENTE', C3: '1', C4: 'AGR1', C5: 'AGRUPACIÓN1', C6: 'AGTE', C7: 'AGRUPACION TOTAL EMPRESA', C8: '01/04/2020', C9: '01/04/2020' }, 
                        
        ] }
	};
	
    obj.colModel = [
		{ title: "Sistema",   width: 100, dataType: "string", dataIndx: "C1", halign: "center", align: "center" },
		{ title: "Descripción", width: 350, dataType: "string", dataIndx: "C2", halign: "center",  align:"center" },
		{ title: "Estado", width: 100, dataType: "string", dataIndx: "C3", halign: "center", align: "center", hidden: "true" },
		{ title: "Centro Operativo Cliente", width: 100, dataType: "string", dataIndx: "C4", halign: "center", align: "center", hidden: "true" },
		{ title: "Centro Operativo Cliente", width: 100, dataType: "string", dataIndx: "C5", halign: "center", align: "center", hidden: "true" },
		{ title: "Centro Operativo Usuario", width: 80, dataType: "number", dataIndx: "C6", halign: "center", align: "right", hidden: "true" },
		{ title: "Centro Operativo Usuario", width: 80, dataType: "number", dataIndx: "C7", halign: "center", align: "right", hidden: "true" },
		{ title: "Fecha Creación", width: 80, dataType: "number", dataIndx: "C8", halign: "center", align: "right", hidden: "true" },
		{ title: "Fecha Modificación", width: 80, dataType: "number", dataIndx: "C9", halign: "center", align: "right", hidden: "true" },
 
	];

	$grid_principal = $("#div_grid_principal").pqGrid(obj);
	$grid_principal.pqGrid("refreshDataAndView");
    
    /*GRILLA 2*************************************************************/
    
    //Setea grid2
	/*data =  [
	  { c1: '01', c2: 'PARAMETRO TABLA 1', c3: 'D', c4: '8', c5:'80'},
      { c1: '02', c2: 'PARAMETRO TABLA 2', c3: 'A', c4: '18', c5:'80'},
      { c1: '03', c2: 'PARAMETRO TABLA 3', c3: 'A', c4: '28', c5:'80'},
      { c1: '04', c2: 'PARAMETRO TABLA 4', c3: 'A', c4: '38', c5:'80'},
      { c1: '05', c2: 'PARAMETRO TABLA 5', c3: 'A', c4: '48', c5:'80'},
	 ]
    var obj2 = {
        height: "100%",
        showTop: true,
        showHeader: true,
        roundCorners: true,
        rowBorders: true,
		fillHandle: "",
        columnBorders: true,
        editable:false,
        selectionModel: { type: "row", mode:"single"},
        showTitle:true,
        collapsible:false,
        numberCell: { show: false },
        title: "Detalle",
		pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
        scrollModel:{theme:true},
        toolbar:
        {
            cls: "pq-toolbar-export",
            items:
            [
				{ type: "button", label: "Nuevo",  attr: "id=co_nuevo2", cls: "btn btn-primary" },
				{ type: "button", label: "Excel",  attr:"id=co_excel2",  cls:"btn btn-primary btn-sm"},
				{ type: "button", label: "Volver", attr:"id=co_volver2", cls:"btn btn-default btn-sm"}
            ]
        }
    };
	
	obj2.colModel = [
        { title: "Código", width: 100, dataType: "string", dataIndx: "c1", halign:"center", align:"center"},
        { title: "Descricpión", width: 300, dataType: "string", dataIndx: "c2", halign:"center", align:"left" },
        { title: "Estado", width: 100, dataType: "string", dataIndx: "c3", halign:"center", align:"center" },
        { title: "Valor 1", width: 100, dataType: "string", dataIndx: "c4", halign:"center", align:"left" },
        { title: "Valor 2", width: 140, dataType: "number", dataIndx: "c5", halign:"center", align:"right" },
        { title: "Eliminar",width: 80, dataType: "string", align: "center", editable: false, minWidth: 100, sortable: false,
					render: function (ui) {
						//return "<button class='btn btn-primary glyphicon glyphicon-remove btn_grid'><span class=''></span>Eliminar</button>";
						return "<button name='co_borra2' class='btn btn-primary btn-sm'>Eliminar</button>";
					}
				}
    ];
	
	obj2.dataModel = { data: data };
    $grid_2 = $("#div_grid_sec").pqGrid(obj2);
	//$grid_2.pqGrid( "option", "dataModel.data", [] );
    $grid_2.pqGrid( "refreshDataAndView" );
	//$grid_2.pqGrid( "scrollRow", { rowIndxPage: 10 } );*/

}

//***********************************************************
function fn_actualiza_datos(clave1, lectura1, cliente, medidor, tipomed, marca, modelo, clave2, lectura2){
	
		//alert(clave1+'||'+ lectura1+'||'+ cliente+'||'+ medidor+'||'+ tipomed+'||'+ marca+'||'+ modelo)
	flag = 0;
	parameters = 
    {
		"func"       :"fn_actualiza_datos",
		"empresa"    :$("#tx_empresa").val(),
		"RolFun"     :$("#tx_rolfun").val(),
		"rol"        :$("#tx_rol").val(),
		"ip"         :$("#tx_ip").val(),
				
				
		"p_clavelec" : clave1,
        "p_lecterr"  : lectura1,
		"p_clavelec2" : clave2,
        "p_lecterr2"  : lectura2,
		
		"p_cliente"  : cliente,
        "p_medidor"  : medidor,
        
		"p_tipomed"  : tipomed,
		"p_marca"    : marca,
		"p_modelo"   : modelo,
        
		"p_lector"   : $("#cb_lector").val(),
        "p_fecha"    : $("#fec_lect").val(),
        
    };
	
	
	HablaServidor(url,parameters,"text", function(text) 
	{
		if(text == ""){
			//fn_mensaje_boostrap("ACCIN REALIZADA", g_titulo, $(""));
			//$grid_principal.pqGrid( "refreshDataAndView" );
						
		}
		else
			fn_mensaje_boostrap(text, g_tit, $(""));

	});

    
		  
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_filtro()
{
	parameters = 
    {
		"func":"fn_grid_principal",
		"empresa":$("#tx_empresa").val(),
		/*"p_sistema":$("#cb_regional").val(),
        "p_ciclo":$("#cb_ciclo").val(),
        "p_ruta":$("#cb_ruta").val(),
        "p_lector":$("#cb_lector").val(),
        "p_fecha":$("#fec_lect").val(),*/
        
    };
	/*Filtros = [];
	if ($("#cb_regional").val()!='' ) {Filtros.push('Regional = '+$("#cb_regional :selected").text()); }
	if ($("#cb_ciclo").val()!='' ) {Filtros.push('Ciclo = '+$("#cb_ciclo:selected").text());  }
	if ($("#cb_ruta").val()!='' ) {	Filtros.push('Ruta = '+$("#cb_ruta:selected").text());  }
	if ($("#cb_lector").val()!='' ) {Filtros.push('Lector = '+$("#cb_lector:selected").text());}
	if ($("#fec_lect").val()!=''  ) {Filtros.push('Fecha Lectura Terreno = '+$("#fec_lect").val() );}
	$("#filtro").val(Filtros);*/
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_new() {
	

	$("#div_prin").hide();
    $("#div_tabla").show();
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_modal2(num) {
	
    $("#tx_nuevo2").val(num);
    
    fn_limpia_modal2();
	
	$("#div_modal2").modal({ backdrop: "static", keyboard: false });
	$("#div_modal2").on("shown.bs.modal", function () {
		$("#div_modal2 div.modal-footer button").focus();

	});
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_modal() 
{
	$("#cb_sistema").val("");
	$("#tx_nomtabla").val("");
	$("#tx_desc").val("");
	$("#cb_modif").val("");	
}

function fn_limpiar(){
	
    $("#tx_cod_sist").val("");
    $("#tx_cod_sist_2").val("");
    $("#cb_estado").val("");
    $("#tx_cen_op_1").val("");
    $("#tx_cen_op_2").val("");
    $("#tx_cen_op_usu_1").val("");
    $("#tx_cen_op_usu_2").val("");
    $("#tx_fecha_crea").val("");
    $("#tx_fecha_modif").val("");
    
   
}
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_limpia_modal2() 
{
	$("#tx_val1").val("");
	$("#tx_val1").val("");
	$("#tx_descod").val("");
	$("#tx_codigo").val("");
    $("#tx_fecing").val("");
	$("#tx_fecmod").val("");
}
	
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_carga_grilla() {
	
	fn_filtro();
	var total_register;
   
    var dataModel = 
    {
        location: "remote",
        sorting: "local",
        dataType: "json",
        method: "POST",
        sortDir: ["up", "down"],
		async:false,
        url: url+"?"+jQuery.param( parameters ),
        getData: function (dataJSON) 
        {
			total_register = $.trim(dataJSON.totalRecords);
			var data = dataJSON.data;
			sql_grid_prim = dataJSON.sql;
			
			if(total_register>=1)
			{
				$("#co_excel").attr("disabled", false);
			}
            return { data: dataJSON.data};
        },
        error: function(jqErr, err_stat, err_str) // ERROR EN EL ASP
        {
			fn_mensaje_boostrap(jqErr.responseText, g_tit, $("") );
        }
    }
	
	$grid_principal.pqGrid( "option", "dataModel", dataModel );				
    $grid_principal.pqGrid( "refreshDataAndView" );
	$grid_principal.pqGrid( "option", "title", "Total Registros: "+total_register);
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*//FUNCIONES MODAL -  combos
function fn_estado() {
      /*
    	$("#cb_regional").html("");
		$("#cb_ciclo").html("");
	    $("#cb_ruta").html("");
	
		parameters = 
			{
				"func":"fn_regional",
				"empresa":$("#tx_empresa").val(),
				//"rol":$("#tx_rol").val()
			};
		
		HablaServidor(url,parameters,'text', function(text) 
			{
				if(text != "")
					$("#cb_regional").html(text);
			});
*/

	$("#cb_estado").html("<option value='' selected></option><option value='1'>ACTIVADO</option> <option value='2' >INACTIVO</option>");
}

//*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

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
		}else{
		return false;
		}
	}
	else {
	return false;
	}
}

