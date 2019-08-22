var g_modulo="Módulo de Aseo";
var g_tit="Inclusión Cargos de Aseo por Cliente";
var $grid;
var DatoOriginal = [];
var grilla_prin = [];
var my_url = "inc_cargo_aseo.asp";
var cuo_ini_cal, nro_cuo_cal, vlr_cuo_cal;
var val_rol;

$(document).ready(function() {

	document.body.scroll = "yes";
    // SE COLOCAN LOS TITULOS
    $("#div_mod0").html(g_modulo);
    $("#div_tit0").html(g_tit);
	document.title = g_tit;
	$("#tituloexcel").val("Historial de Convenios del Cliente");
	$("#excel_archivo").val("historial_convenios.xls");
	$("#Rol").val(fn_get_param("Rol"));

	$("#tx_empresa").val(fn_get_param("Empresa"));
	$("#tx_rol").val(fn_get_param("Rol"));
	$("#tx_rolfun").val(fn_get_param("rolfun"));
	$("#tx_ip").val(fn_get_param("ip"));
	
	fn_setea_grid_principal();
	
	$("#co_excel").html("<span class='glyphicon glyphicon-save'></span> Excel");
	
	//Eventos
    $("#co_leer").on("click", fn_leer_cliente);
    
    $("#tx_cliente").on("keydown", function(event) {
        var tecla =  event.which || event.keyCode;
        if(tecla==13)
        {
			if(!$("#tx_cliente").prop("readonly"))  //Readonly se deshabilita el enter
			{	
				$("#co_leer").trigger( "click" );
				return false;
			}
        }
    });
	
    $("#co_cancelar").on("click", function (e) {
        if($.trim($("#co_cancelar").text()) == "Cancelar"){
			fn_limpiar();
		}   
        else
            window.close();   
    });
	
    $("#co_confirmar").click(function(){
		if( fn_valida_guardar() ){
            fn_guardar();    
        }
    });
	
	$("#co_cargo").on("click", function (){
		fn_modal_ingreso();
    });  
	
	$("#co_cargo").html("<span class='glyphicon glyphicon-plus'></span> Agregar");
    $(window).scrollTop(0);
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
//Evita el retroceso con el backspace
$(document).keydown(function(e) {
	if (e.keyCode === 8 ) {
		var element = e.target.nodeName.toLowerCase();
		if ((element != 'input' && element != 'textarea') || $(e.target).attr("readonly")) {
			return false;
		}
	}
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_setea_grid_principal()
{   
	var data = [
            { "C5":"RCARVAJAL", "C6":"NINGUNO","C2": "45.80", "C1": 'Exxon Mobil', "C3": '1', "C4": '01/02/2018' },
            { "C5":"RCARVAJAL", "C6":"NINGUNO","C2": "45.80", "C1": 'Wal-Mart Stores', "C3": '1', "C4": '01/02/2018'},
		    { "C5":"RCARVAJAL", "C6":"NINGUNO","C2": "45.80", "C1": 'Royal Dutch Shell', "C3": '1', "C4": '01/02/2018'},
		    { "C5":"RCARVAJAL", "C6":"NINGUNO","C2": "45.80", "C1": 'BP', "C3": '1', "C4": '01/02/2018'},
		    { "C5":"RCARVAJAL", "C6":"NINGUNO","C2": "45.80", "C1": 'General Motors', "C3": '1', "C4": '01/02/2018'},
		    { "C5":"RCARVAJAL", "C6":"NINGUNO","C2": "45.80", "C1": 'Chevron', "C3": '1', "C4": '01/02/2018'},
		    { "C5":"RCARVAJAL", "C6":"NINGUNO","C2": "45.80", "C1": 'DaimlerChrysler', "C3": '1', "C4": '01/02/2018'},
		    { "C5":"RCARVAJAL", "C6":"NINGUNO","C2": "45.80", "C1": 'Toyota Motor', "C3": '1', "C4": '01/02/2018' },
		    { "C5":"RCARVAJAL", "C6":"NINGUNO","C2": "45.80", "C1": 'Ford Motor', "C3": '1', "C4": '01/02/2018'},
		    { "C5":"RCARVAJAL", "C6":"NINGUNO","C2": "45.00", "C1": 'ConocoPhillips', "C3": '1', "C4": '01/02/2018'},
		    { "C5":"RCARVAJAL", "C6":"NINGUNO","C2": "45.01", "C1": 'General Electric', "C3": '1', "C4": '01/02/2018'}
		];
	
	
	grilla_prin = [
        { title: "Descripción", width: 260, dataType: "string", dataIndx: "C1", halign:"center", align:"left" },
        { title: "Valor", width: 100, dataType: "string", dataIndx: "C2", halign:"center", align:"center"},
        { title: "Cuotas", width: 100, dataType: "string", dataIndx: "C3", halign:"center", align:"center" },
        { title: "Fecha Ingreso", width: 200, dataType: "string", dataIndx: "C4", halign:"center", align:"center" },
        { title: "Rol", width: 150, dataType: "string", dataIndx: "C5", halign:"center", align:"right" },
        { title: "Observación", width: 300, dataType: "string", dataIndx: "C6", halign:"center", align:"center" },
		{ title: "Eliminar",width: 90, dataType: "string", align: "center", editable: false, minWidth: 100, sortable: false,
				render: function (ui) {
					return "<button name='co_borra' class='btn btn-primary btn-sm'>Eliminar</button>";
				}
			}
    ];
	
    var obj = {
            height: 400,
            width: "100%",
            showTop: true,
			showBottom:true,
            showTitle : false,
            roundCorners: true,
			colModel: grilla_prin,
            rowBorders: true,
            columnBorders: true,
            collapsible:false,
			editable:false,
            selectionModel: { type: 'row',mode:'single'},
            numberCell: { show: true },
			pageModel: { rPP: 20, type: "local", rPPOptions: [20, 50, 100]},
        	scrollModel:{theme:true},
            dataModel: { data: data },
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Agregar", attr:"id=co_cargo", cls:"btn btn-primary btn-sm"},    
               ]
           },
		   refresh: function () {
               $("#div_grid > div.pq-grid-center > div.pq-grid-cont-outer > div > div > table > tbody").find("button.btn.btn-primary.btn-sm").button()
               .bind("click", function (evt) {
                   var $tr = $(this).closest("tr");
                   var obj = $grid.pqGrid("getRowIndx", { $tr: $tr });
                   var rowIndx = obj.rowIndx;
                   $grid.pqGrid("addClass", { rowIndx: rowIndx, cls: 'pq-row-delete' });

					var DM = $grid.pqGrid("option", "dataModel");
					var datos = DM.data;
					var row = datos[rowIndx];

					var parameters = {
								"func":"fn_borrar",
								"p_ip":$("#tx_ip").val(),
								"p_rol":$("#tx_rol").val(),
								"p_equipo":$("#cb_equipo").val(),
								"p_rol_equipo":row.C1,
								"Empresa":$("#tx_empresa").val()
							};
							
					HablaServidor(my_url, parameters, 'text', function(text) 
					{
						$grid.pqGrid("deleteRow", { rowIndx: rowIndx });
						fn_mensaje("EL MOVIMIENTO FUE ELIMINADO", g_titulo, $(""));
					});
					return false;

            });
           }/////////////
        };
		
	var data = [ ];
    $grid = $("#div_grid").pqGrid(obj);
	$grid.pqGrid( "scrollRow", { rowIndxPage: 21 } );		
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_leer_cliente()
{
	
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*
function fn_modal_ingreso()
{
	$("#dlg_ingreso").modal({backdrop: "static",keyboard:false});
    //$("#tx_tit_guardar").text("Datos del Solicitante");
    $("#dlg_ingreso").on("shown.bs.modal", function () {
        $("#cb_movi").focus();
    });
}
