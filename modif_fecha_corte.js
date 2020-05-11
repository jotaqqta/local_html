var g_modulo = "Corte y Reposición";
var g_tit = "Modificación Fecha Corte";

var $grid_principal;
var parameters = {};
var vCon = 0;

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
	$("#co_modif").html("<span class='glyphicon glyphicon-pencil'></span> Modificar");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	$("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");     
	$("#co_volver").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
	$("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtro");
	
		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //FUNCIONES DE CAMPOS
    fn_sector();
    //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

    // FUNCION PARA VALIDAR QUE SE HAYA SELECCIONADO UN REGISTRO EN LA GRILLA EN EL CHECK BOX
    $("#tx_vda_chk").val("false");
    
    $grid_principal.pqGrid({
        check: function( event, ui ) {
            if (ui.rowData) {
                
                var dataCell = ui.rowData;
               
                $("#tx_vda_chk").val(dataCell.C6);

                if($("#tx_vda_chk").val() == "true"){
                    vCon = vCon + 1;
                   //alert(vCon);
                }else{
                    vCon = vCon - 1;
                    //alert(vCon);
                }                
            }
        }
    });  

   
 
		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
    //BOTONES-EVENTOS
	
    $("#co_modif").on("click", fn_modif);   
	    
    
    $("#co_volver").on("click", function (e) {
        window.close();
    });

    $("#co_filtro").on("click", fn_filtro);
 	
 	/////////////////////////////////BOTON GENERAR/////////////////////////////////
    $("#co_aceptar").on("click", function() {
        if ($.trim($("#co_aceptar").text()) === "Aceptar") {
            if (fn_val_general())
                return;       
            $('#div_atrib_bts').modal('hide');
			fn_mensaje_boostrap("Se generó", g_tit, $(""));
            $(window).scrollTop(0);
        }

	/////////////////////////////////BOTON MODIFICAR/////////////////////////////////
        else{ 
            if (fn_val_general())
                return;                             
            $('#div_mant_bts').modal('hide');
            fn_mensaje_boostrap("Se generó", g_tit, $(""));
            $(window).scrollTop(0);
             
        }
    });

    $("#co_confirm_yes").on( "click", function () {
        $grid_principal.pqGrid("deleteRow", { rowIndx: rowIndxG });
        $('#dlg_confirm').modal('hide');
    });

	
    $("#co_confirm_no").on( "click", function () {
        $('#dlg_confirm').modal('hide');
    });
    
	

	//BOTONES CERRAR DE LOS MODALES
    $("#co_cancel").on("click", function (e) {
		$('#div_mant_bts').modal('hide');		
	});

    
    $("#co_cancel_modif").on("click", function (e) {
		$('#div_atrib_bts').modal('hide');
	});
    

  
		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	//BOTONES 

    	    
	$("#co_aceptar_modif").on("click", function () {
			
		if ($("#tx_cort_nueva").val() == ""){
			fn_mensaje('#mensaje_filtro_modif','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR FECHA NUEVA!!!</strong></div>',3000);
				$("#tx_cort_nueva").focus();
		return true;
	        
		};	

			fn_mensaje_boostrap("Se modificó", g_tit, $(""));
            $(window).scrollTop(0);
	});

		
   
    $("#co_cancel").on("click", function (){
        $('#div_mant_bts').modal('hide');
    });

		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
		//EXCEL    
	$("#co_excel").on("click", function (e) {
		
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
			$("#frm_Exel").submit();
			return;
		}	
    });  
  

});		
           
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~///////////////GRILLAS///////////////~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~
// GRID PRINCIPAL
function fn_setea_grid_principal() {

	var data =  [
         { C1: '414958', C2: '200502570', C3: '28/05/2019', C4: '29/03/2019', C5: '0'},
		 { C1: '447293', C2: '200560670', C3: '28/05/2019', C4: '29/03/2019', C5: '0'},  
                   
    ];

	var obj = {
		height: "240",
		showTop: true,
		showBottom: true,
		showHeader: true,
		roundCorners: true,
		rowBorders: true,
		columnBorders: true,
		postRenderInterval: -1,
		editable: true,
		editor: { type: "textbox", select: true, style: "outline:none;" },		
		selectionModel: { type: 'cell'},
		numberCell: { show: true },
		title: "Modificación Fecha Corte Clientes Convenio Atrasado",
		pageModel: { type: "local", },
		scrollModel: { theme: true },
		toolbar:{
			cls: "pq-toolbar-export",
			items: [
				{ type: "button", label: "Nuevo",  attr: "id=co_modif",  cls: "btn btn-primary btn-sm" },                
                { type: "button", label: "Filtro",   attr:"id=co_filtro",    cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Excel",   attr:"id=co_excel",    cls:"btn btn-primary btn-sm"},
                { type: "button", label: "Cerrar",  attr: "id=co_cerrar",  cls: "btn btn-secondary btn-sm"},
			]
		},
	};

	obj.colModel = [
		{ title: "", width: 50, type: 'checkBoxSelection',dataType: "bool",dataIndx: "C6",align:"center", editor: false, cb: {select: true} },
		{ title: "No. Cliente", width: 150, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false },
		{ title: "Ruta", width: 150, dataType: "string", dataIndx: "C2", halign: "center", align: "center", editable: false },
		{ title: "Fecha Corte", width: 150, dataType: "string", dataIndx: "C3", halign: "center", align: "center", editable: false },
		{ title: "Fecha Vencimiento", width: 150, dataType: "string", dataIndx: "C4", halign: "center", align: "center", editable: false },
		{ title: "Antigüedad Deuda", width: 150, dataType: "string", dataIndx: "C5", halign: "center", align: "center", editable: false },
		{ title: "Quitar", width: 110, dataType: "string", halign: "center", align: "center", editable: false, sortable: false,
			render: function () {
				return "<button class='btn btn-sm btn-primary' id='co_cerrar_prin' type='button'><span class='glyphicon glyphicon-trash'></span></button>";
			},
			postRender: function (ui) {				
				var rowIndx = ui.rowIndx;
				var $grid = this;
				$grid = $grid.getCell(ui);
				$grid.find("button").on("click", function () {
					
					fn_borrar(rowIndx);
				});
			}
		}
	];
	obj.dataModel = { data: data };

	$grid_principal = $("#div_grid_principal").pqGrid(obj);
	

}
	
		/////////////////////////////////FUNCIONES///////////////////////////////////////////

		function fn_filtro(){

	    $("#title_mod").html("Filtrar");
	   		
		fn_limpiar();	    

	    $("#div_mant_bts").modal({backdrop: "static",keyboard:false});
	    $("#div_mant_bts").on("shown.bs.modal", function () {
	    $("#div_mant_bts div.modal-footer button").focus();
	    });
	}

		function fn_borrar(rowIndx) {

	    $("#confirm_msg").html("¿Estas seguro de que quieres eliminar la fila " + (rowIndx + 1) + "?");

	    rowIndxG = rowIndx;

	    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
	    $("#dlg_confirm").on("shown.bs.modal", function () {
	        $("#dlg_confirm div.modal-footer button").focus();
	    });

	}

		//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
		function fn_modif() {
		
			if (vCon == 0){				
				fn_mensaje_boostrap("FAVOR SELECCIONAR UN REGISTRO!!!", g_tit, $(""));
				return;
			}
			else
			{
				if (vCon > 1){
					fn_mensaje_boostrap("NO PUEDE SELECCIONAR MÁS DE UN REGISTRO!!!", g_tit, $(""));
				}
				else
				{
					if (vCon == 1){						
						$("#div_atrib_bts").modal({backdrop: "static",keyboard:false});
						$("#div_atrib_bts").on("shown.bs.modal", function () {
							$grid_principal.pqGrid("refreshDataAndView");


						});
					}	
				}
			}			
		}

////////////////////FUNCION GENERAL MENSAJES//////////////////////////////////////////////
        function fn_val_general(){

    if ($("#cb_sector").val() === "") {
		fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR SELECCIONAR SECTOR!!!</strong></div>',3000);
		$("#cb_sector").focus();
		return true;
	}

	if ($("#tx_cort_actual").val() === "") {
		fn_mensaje('#mensaje_filtro','<div class="alert alert-danger" style="text-align:left;font-size:12px;margin-bottom: 0px;" role="alert"><strong>FAVOR DIGITAR FECHA CORTE ACTUAL!!!</strong></div>',3000);
		$("#tx_cort_actual").focus();
		return true;
	}
		
	return false;
    }


	function fn_carga_grilla() {
		
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
	function fn_sector() {
		$("#cb_sector").html("<option value='' selected></option><option value='1'>CICLO 20</option> <option value='2' >CICLO 21</option>");
	}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	

	function fn_mensaje(id,mensaje,segundos) {

	    $(id).show();
	    $(id).html(mensaje);
	    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
	}
