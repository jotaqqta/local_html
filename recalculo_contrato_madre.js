	var titulo = "Recálculo de Contratos Madres";
	var DatoOriginal = [];
	var url = "amodfac_0017cAjax.asp";
	var $grid_principal;
	var sql_grid_prim = "";
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	$(document).keydown(function(e) {
	
		if (e.keyCode === 8) {
			var element = e.target.nodeName.toLowerCase();
			if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
				return false;
			}
		}
	});
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	$(document).ready(function()
	{
				
		$(document).prop('title', titulo);
		$(".tit1").html(titulo);
		document.body.scroll = "yes";
    	$("#div_header").load("syn_globales/header.htm", function() {
			$("#div_mod0").html("Módulo de Facturación");
			$("#div_tit0").html(titulo);	
		});
	
		$("#div_footer").load("/syn_globales/footer.htm");
	
		/*
		$("#tx_empresa").val(SYNSegCodEmpresa);
		$("#tx_rol").val(SYNSegRol);
		$("#tx_rolfun").val(SYNSegRolFuncion);
		$("#tx_ip").val(SYNSegIP);
		*/
		
		$("#tx_cliente").on("keypress", fn_solonumeros);
		$("#tx_uni_h").on("keypress", fn_solonumeros);
		$("#tx_empleado").on("keypress", fn_solonumeros);
		$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
		$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
		fn_setea_grid_principal();
		$("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
		
		$("#co_leer").on("click", function(e)
		{			
			fn_leer();
				
		});
	//	$("#co_modif").on("click", fn_modificar);
		
		$("#co_cancelar").click(function(){
		
			if ($.trim($("#co_cancelar").text())=="Cerrar")
			{
				window.close();
			}
			else
			{
				Limpia_Campos();
				$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");
				$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
				$("#tx_cliente").val("");
				$("#tx_cliente").focus();
			}
		});
	
		$("#tx_cliente").bind("keydown",function(e){
			if(e.keyCode == 13){
				tab = true;
				fn_leer();
				return false;
			}
		 });
			
		//$("#co_cancelar" ).text("Cerrar");		
		$("#tx_nombre").attr("disabled", true);
		$("#tx_direccion").attr("disabled", true);
		$("#tx_estado").attr("disabled", true);
		$("#tx_conex").attr("disabled", true);
		$("#tx_ruta").attr("disabled", true);
		$("#tx_sucursal").attr("disabled", true);
		$("#tx_tarifa").attr("disabled", true);
		$("#tx_act").attr("disabled", true);
		$("#tx_regional").attr("disabled", true);	
		
		
	});
	
	//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
	function Limpia_Campos()
	{
		
	}

	 //~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
	function fn_solonumeros() 
	{
		if ((event.keyCode < 48) || (event.keyCode > 57)) 
		 event.returnValue = false;
	}
	
	function fn_setea_grid_principal()
	{     
		var data =  [
			  { C1: 'N', C2: '345838', C3: '01-200-2040', C4: 'DH-14225643', C5:'M3', C6:'223',
			   C7:'090/E', C8:'1000', C9:'1',C10:'10000', C11:'37.85', C12:'10000', C13:'37.85', C14:'1', C15:'S'},
			 { C1: 'N', C2: '23234', C3: '01-200-2045', C4: 'DH-14225643', C5:'M3', C6:'223',
			   C7:'090/E', C8:'1000', C9:'1',C10:'10000', C11:'37.85', C12:'10000', C13:'37.85', C14:'1', C15:'S'},{ C1: 'N', C2: '64532', C3: '01-200-2076', C4: 'DH-14225643', C5:'M3', C6:'223',
			   C7:'090/E', C8:'1000', C9:'1',C10:'10000', C11:'37.85', C12:'10000', C13:'37.85', C14:'1', C15:'S'},
			 ]
		var obj = {  
				height: 540,
				width: "100%",
				showTop: true,
				showBottom:true,
				showTitle : false,
				title: "Resumen Historico de Clientes Medidos por Ciclo y Ruta",
				roundCorners: true,
				rowBorders: true,
				columnBorders: true,
				collapsible:true,
				editable:false,
				selectionModel: { type: 'row',mode:'single'},
				numberCell: { show: true },
				pageModel: { rPP: 200, type: "local", rPPOptions: [100, 200, 500]},
				scrollModel:{theme:true},
				toolbar:
			   {
				   cls: "pq-toolbar-export",
				   items:
				   [
					   { type: "button", label: " Excel"        ,  attr:"id=co_excel"       , cls:"btn btn-primary"},
				   ]
			   }
			};

			obj.colModel = [		
				{ title: "Dudoso"  , width: 100, dataType: "string", dataIndx: "C1" , halign:"center",align:"center"},
				{ title: "Nro Suministro", width: 100, dataType: "string", dataIndx: "C2" , halign:"center", align:"center"},
				{ title: "Ruta", width: 100, dataType: "string",   dataIndx: "C3" , halign:"center", align:"center"},
				{ title: "Medidor", width: 140, dataType: "string", dataIndx: "C4" , halign:"center", align:"left"},
				{ title: "Tipo Medida", width: 140, dataType: "string", dataIndx: "C5" , halign:"center", align:"center"},
				{ title: "Tarifa", width: 140, dataType: "string", dataIndx: "C6" , halign:"center", align:"center"},
				{ title: "LecFac", width: 140, dataType: "string",  dataIndx: "C7" , halign:"center", align:"center"},
				{ title: "Cons Promedio", width: 140, dataType: "string", dataIndx: "C8" , halign:"center", align:"center"},
				{ title: "TRep", width: 140, dataType: "string", dataIndx: "C9" , halign:"center", align:"center"},
				{ title: "Cons Individual", width: 160, dataType: "string", dataIndx: "C10" , halign:"center", align:"right"},
				{ title: "Cons Remarcador", width: 160, dataType: "string",  dataIndx: "C11", halign:"center", align:"right"},
				{ title: "Cons Fact Galones", width: 160, dataType: "string", dataIndx: "C12", halign:"center", align:"right"},
				{ title: "Cons Facturado", width: 160, dataType: "string", dataIndx: "C13", halign:"center", align:"right"},
				{ title: "Unidades Hab.", width: 160, dataType: "string", dataIndx: "C14", halign:"center", align:"right"} ,
				{ title: "C/sumin", width: 160, dataType: "string", dataIndx: "C15", halign:"center", align:"right"} 
			];
		obj.dataModel = { data: data };	

		$grid_principal = $("#div_grid_principal").pqGrid(obj);
		$grid_principal.pqGrid( "refreshDataAndView" );
}

	function fn_leer(){
		if ($.trim($("#co_leer").text()) == "Leer")
			{
				$("#co_leer").html("<span class='glyphicon glyphicon-floppy-disk'></span> Recálculo");
				$("#co_cancelar").html("<span class='glyphicon glyphicon-remove'></span> Cancelar");
			}
	}
	