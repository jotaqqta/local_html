
var g_modulo="Configuración Base del Sistema";
var g_titulo="Asignación de Roles a Equipos de Trabajo";

$(document).ready(function() {

// PARA ELIMINAR EL SUBMIT
$("button").on("click", function(){return false;});

//Invocar la cabecera de la pagina
$("#div_header").load("header.htm", function() {
	$("#div_mod0").html(g_modulo);
	$("#div_tit0").html(g_titulo);	
});
	
// SE COLOCAN LOS TITULOS
$("#div_mod1").html(g_modulo);
$("#div_tit1").html(g_titulo);
$("#div_mod2").html(g_modulo);
$("#div_tit2").html(g_titulo);

// CREACIÓN DEL PARAMQUERY
var data = [
        { c1: 'RCARVAJAL', c2: 'RAÚL CARVAJAL', c3: 'OPERACIONES COMERCIALES'},
        { c1: 'ARODRIGUEZ2', c2: 'ANA RODRIGUEZ', c3: 'OPERACIONES COMERCIALES'},
        { c1: 'ARAMIREZ', c2: 'ANYELO RAMIREZ', c3: 'OPERACIONES COMERCAIELS'},
    ];
var obj = {
            width: '100%',
            height: 360,
            showTop: true,
			showBottom:false,
            showHeader: true,
            roundCorners: true,
            rowBorders: true,
            columnBorders: true,
			editable:false,
            selectionModel: { type: 'cell' },
            numberCell: { show: false },
            title: "Roles Asignados al Equipo",
			pageModel: {type:"local"},
        	scrollModel:{autoFit:true, theme:true},
			toolbar:
           {
               cls: "pq-toolbar-export",
               items:
               [
                   { type: "button", label: " Agregar Rol",  attr:"id=co_rol", cls:"btn btn-primary btn-sm glyphicon glyphicon-plus"},
               ]
           }
        };
		
		
		obj.colModel = [
            { title: "Rol",  resizable: false, width: 120, dataType: "string", dataIndx: "c1" },
            { title: "Nombre", width: 230, dataType: "string", dataIndx: "c2" },
            { title: "Área Comercial", width: 250, dataType: "string", dataIndx: "c3" },
            { title: "Eliminar",width: 90, dataType: "string", align: "center", editable: false, minWidth: 100, sortable: false,
				render: function (ui) {
					return "<button class='btn btn-primary btn-sm'>Eliminar</button>";
				}
			}
        ];
		
		obj.dataModel = { data: data };

var grid = pq.grid("#div_grid", obj);

//EVENTO CLICK PARA AGREGAR ROL AL EQUIPO

$("#co_rol").on("click", function (e) {
	 
	 $("#div_prim").slideUp();
	 $("#div_rol").slideDown();
	 $("#tx_rol").focus();
    
});


$("#co_volver").on("click", function(){
	$("#div_prim").slideDown();
	$("#div_rol").slideUp();
	$("#div_grid").pqGrid( "option", "width", 'auto' );
});

    
    //pruebas con salto de linea
    $("#tx_desc").html("Oficina: xxxx <br> Caja: yyyy <br> Cajero: xyxyxy <br> Valor: 9999");
	$("#cb_tipo_equipo").val();
	
	//fn_mensaje_boostrap("Debe elegir un Tipo de Identidad", g_tit, $("#"));  //sin objeto
	//fn_mensaje_boostrap("Debe elegir un Tipo de Identidad", g_tit, $("#cb_tipo_doc")); //con objeto
});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
 function fn_mensaje(p_mensaje, p_titulo, $p_objeto)
{
    $("#lb_mensaje").html(p_mensaje);
        
    $( "#dialog-message" ).dialog({
        title:p_titulo,
        modal: true,
        buttons: [{
			id:"co_menj_ok",
			text : "Ok",
            click: function() {
				$( this ).dialog( "close" );
				$p_objeto.focus();
            }
        }],
		open: function( event, ui ) {$("#co_menj_ok").focus();}
    });
	
	$("#dialog-message").dialog("open");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*	
function fn_mensaje_boostrap(p_mensaje, p_titulo, $p_objeto)
{
    $("#lb_mensaje").html(p_mensaje);
        
    $( "#dialog-message" ).dialog({
        title:p_titulo,
        modal: true,
        buttons: [{
			id:"co_menj_ok",
			text : "Ok",
            click: function() {
				$( this ).dialog( "close" );
				$p_objeto.focus();
            }
        }],
		open: function( event, ui ) {$("#co_menj_ok").focus();}
    });
	
}