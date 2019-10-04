var g_modulo="Facturación Clientes - Lecturas y Consumos";
var g_titulo="Consulta Historica de Eventos de Cambio de Medidor";
var parameters={};
var my_url="reasigna_ajuste.asp";
var $grid;
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
$(document).keydown(function(e) {

	if (e.keyCode === 8 ) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});

$(document).ready(function(){
    
    // PARA ELIMINAR EL SUBMIT
	$("button").on("click", function(){return false;});
    //INGRESA LOS TITULOS
    document.title = g_titulo ;
	document.body.scroll = "yes";
    $("#div_header").load("/syn_globales/header.htm", function() {
		$("#div_mod0").html(g_modulo);
		$("#div_tit0").html(g_titulo);	
	});
		

	$("#tx_num").focus();
	$("#tx_num").focus();
	jQuery('#tx_num').keypress(function(tecla) {
        if(tecla.charCode < 48 || tecla.charCode > 57) return false;
    });
	
	$("#tx_num").on("keydown", function(event) {
        var tecla =  event.which || event.keyCode;
        if(tecla==13)
        {
			if(!$("#tx_num").prop("readonly"))
			{	
				$("#co_leer").trigger( "click" );
				return false;
			}
        }
    });
	//Footer
	$("#div_footer").load("/syn_globales/footer.htm");
  //DEFINE LA GRILLA PRINCIPAL
    fn_setea_grid_principal();
    //DIBUJA LOS ICONOS DE LOS BOTONES     
    
  //DIBUJA LOS ICONOS DE LOS BOTONES     
    $("#co_filtro").html("<span class='glyphicon glyphicon-search'></span> Filtros");
    $("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
    $("#co_volver_2").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_volver_3").html("<span class='glyphicon glyphicon-chevron-left'></span> Volver");
    $("#co_cerrar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");    
    $("#co_leer").on("click", function(){
		//Validación de informacion
     if ($.trim($("#co_leer").text())=="Leer"){
			if( $("#tx_num").val() == ""){
				fn_mensaje_boostrap("DIGITE EL NÚMERO DE SUMINISTRO", g_titulo, $("#tx_num"));
				return;
                
			}else{

            	fn_leer()
            	$("#tx_num").prop("disabled",true);
            	$("#tx_num").focus();                
            }
			$("#co_leer").html("<span class='glyphicon glyphicon-floppy-disk'></span> Actualizar");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-log-out'></span> Cancelar");
			//fn_carga_orden();
          }
    });
    $("#co_leer").on("click", function(){
    if ($.trim($("#co_leer").text())=="Actualizar"){
    fn_carga_orden();
    
    }
    });
    
	$("#tx_num").bind("keydown",function(e){
		if(e.keyCode == 13){
			tab = true;
			fn_leer();
			return false;
		}
	 });

	$("#co_cancelar").on("click",function(){
		if ($.trim($("#co_cancelar").text())=="Cancelar"){
			$("#co_leer").html("<span class='glyphicon glyphicon-search'></span> Leer");
			$("#co_cancelar").html("<span class='glyphicon glyphicon-off'></span> Cerrar");			     
			fn_limpiar();    
			return;
		}
		else
			window.close();
    });
//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
$("._input_selector").inputmask("dd/mm/yyyy");

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{ 
    var data = [
    { C1:'RCARVAJAL', C2: '01/03/2019', C3:'CORECCION', C4:97985, C5:7985, C6: 'SE CAMBIA LECTURA'},
    ];
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
				{ type: "button", label: "Excel", attr:"id=co_excel2", cls:"btn btn-primary btn-sm"}
				
            ]
        }
        };
		obj.colModel = [
            { title: "Funcionario",  resizable: false, width: 140, dataType: "number", dataIndx: "C1",halign:"center", align:"right" },
            { title: "Fecha", width: 160, dataType: "string", dataIndx: "C2",halign:"center", align:"right" },
            { title: "Tipo", width: 240, dataType: "number", dataIndx: "C3",halign:"center", align:"right" },
            { title: "Dato Anterior", width: 120, dataType: "number", dataIndx: "C4",halign:"center", align:"right" },
            { title: "Dato Actual",width: 120, dataType: "number", dataIndx: "C5",halign:"center", align:"right"},
            { title: "Observación",width: 500, dataType: "number", dataIndx: "C6",halign:"center", align:"right"}, 
        ];
		
		obj.dataModel = { data: data };
		$grid = $("#div_grid_dos").pqGrid(obj);
}

    
});


function fn_carga_orden()
{
	fn_mensaje_boostrap("Se cargo", g_titulo, $("#co_leer"));
				return;
}


//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_leer(){
	if ($.trim($("#co_leer").text()) == "Leer")
	{   
	    $("#tx_nom").val("Maria");
	    $("#tx_cenoper").val("");
	    $("#tx_dir").val("Cra 12a no 32 a este");
        $('#tx_loc').val("Panamá Metro");
	    $("#tx_est").val("Activo");
	    $("#tx_ruta").val("8000-01-244");
	    $("#tx_tarif").val("Residencial");
	    $("#tx_fec").val(12042019);


	}
}




function fn_limpiar(){
	$("#tx_num").val("")
	$("#tx_nom").val("");
	$("#tx_cenoper").val("");
	$("#tx_dir").val("");
	$('#tx_loc').val("");
	$("#tx_est").val("");
	$("#tx_ruta").val("");
	$("#tx_tarif").val("");
	$("#tx_fec").val("");
    $("#tx_num").prop("disabled",false);
	$("#tx_num").focus();
}
	