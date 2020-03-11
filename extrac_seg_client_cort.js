var g_modulo = "Corte y Reposición";
var g_tit = "Extractor de Seguimiento Clientes a Corte";
var $grid_principal;
var $grid_secundaria;
var grid_principal;
var grid_secundaria;
var update = false;

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

$(document).keydown(function (e) {

    if (e.keyCode === 8) {
        var element = e.target.nodeName.toLowerCase();
        if ((element !== 'input' && element !== 'textarea') || $(e.target).attr("readonly")) {
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
    // Raiz
    $("#div_header").load("syn_globales/header.htm", function () {
        $("#div_mod0").html(g_modulo);
        $("#div_tit0").html(g_tit);
    });

    // COMBOS


    fn_set_grid();
    fn_radio_change();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_ingresar").on("click", function () {

        if ($.trim($("#co_ingresar").text() === "Ingresar")) {

            fn_mensaje_boostrap("Se ingreso.", g_tit, $("#co_ingresar"));
        }

    });

    $('input[type=radio][name=opt_sector]').change(function() {

        fn_radio_change(this.value);
    });

    $("#co_flch_right").on("click", function () {

        update = true;

        $grid_principal.pqGrid("refreshView");
        $grid_secundaria.pqGrid("refreshView");

        update = false;

        var checked_prin = [];  // Rows checked tabla derecha
        var row_id_second = [];  // ID de las Rows de la tabla izquierda

        var data_grid_second = grid_secundaria.getData();

        var Checked = grid_principal.Checkbox('checkBox').getCheckedNodes();
        var ids = grid_principal.SelectRow().getSelection().map(function(rowList){
            return rowList.rowIndx
        });

        for (var i = 0; i < Checked.length; i++) {

            checked_prin.push(parseInt(Checked[i].C1));
        }

        if (data_grid_second.length > 0) {

            for (var j = 0; j < data_grid_second.length; j++) {

                row_id_second.push(parseInt(data_grid_second[j].C1))
            }

            for (var y = 0; y < checked_prin.length; y++) {

                if (!row_id_second.includes(checked_prin[y])) {
                    $grid_secundaria.pqGrid( "addRow", { rowData: { C1: Checked[y].C1, C2: Checked[y].C2 }, checkEditable: false } );

                    grid_principal.addClass( {rowIndx: ids[y], cls: 'pq-hide'} );
                }
            }

        } else {
            for (var x = 0; x < checked_prin.length; x++) {
                $grid_secundaria.pqGrid( "addRow", { rowData: { C1: Checked[x].C1, C2: Checked[x].C2 }, checkEditable: false } );

                grid_principal.addClass( {rowIndx: ids[x], cls: 'pq-hide'} );
            }
        }

        var rowToHide = grid_principal.getRowsByClass( { cls : 'pq-hide' } );

        for (var k = 0; k < rowToHide.length; k++) {
            rowToHide[k].rowData.pq_hidden = true;
        }

        grid_principal.Checkbox('checkBox').unCheckAll();

        $grid_principal.pqGrid("refreshView");

    });

    $("#co_flch_left").on("click", function () {

        var checked_second = [];
        var rowsToUnHide = [];
        rowDelete = [];

        var Checked = grid_secundaria.Checkbox('checkBox').getCheckedNodes();
        var rowsWithHide = grid_principal.getRowsByClass( { cls : 'pq-hide' } );
        var ids = grid_secundaria.SelectRow().getSelection().map(function(rowList){
            return rowList.rowIndx
        });

        for (var i = 0; i < Checked.length; i++) {

            checked_second.push(parseInt((Checked[i].C1)));
        }

        for (var x = 0; x < rowsWithHide.length; x++) {

            rowsToUnHide.push(parseInt(rowsWithHide[x].rowData.C1))
        }

        if (checked_second.length === 1) {
            for (var y = 0; y < rowsToUnHide.length; y++) {
                if (rowsToUnHide[y] === checked_second[0]) {
                    if (parseInt(rowsWithHide[y].rowData.C1) === checked_second[0]) {
                        rowsWithHide[y].rowData.pq_hidden = false;
                        grid_principal.removeClass( {rowIndx: rowsWithHide[y].rowIndx, cls: 'pq-hide'} );
                        grid_secundaria.addClass( {rowIndx: ids[0], cls: 'pq-delete'} );

                    }
                }
            }
        } else {
            for (var m = 0; m <= checked_second.length; m++) {
                for (var z = 0; z < rowsToUnHide.length; z++) {
                    if (rowsToUnHide[z] === checked_second[m]) {
                        if (parseInt(rowsWithHide[z].rowData.C1) === checked_second[m]) {
                            rowsWithHide[z].rowData.pq_hidden = false;
                            grid_principal.removeClass( {rowIndx: rowsWithHide[z].rowIndx, cls: 'pq-hide'} );
                            grid_secundaria.addClass( {rowIndx: ids[m], cls: 'pq-delete'} );
                        }
                    }
                }
            }
        }

        var rows = [];

        var rowsToDelete = grid_secundaria.getRowsByClass( {cls: "pq-delete"} );

        if (rowsToDelete.length <= 1) {
            $grid_secundaria.pqGrid("deleteRow", { rowIndx: rowsToDelete[0].rowIndx });
        } else {
            for (var d = 0; d < rowsToDelete.length; d++) {
                rows.push({ rowIndx: rowsToDelete[d].rowIndx})
            }

            $grid_secundaria.pqGrid("deleteRow", { rowList: rows });
        }


        grid_secundaria.Checkbox('checkBox').unCheckAll();

        $grid_principal.pqGrid("refreshView");
        $grid_secundaria.pqGrid("refreshView");

    });

    $("#co_cancelar").on("click", function () {

    });

    $("#co_cerrar").on("click", function (){ window.close(); });

    $grid_principal.pqGrid( {
        refresh: function () {
            if (update) {
                grid_principal = this;
            }
        }
    });

    $grid_secundaria.pqGrid( {
        refresh: function () {
            if (update) {
                grid_secundaria = this;
            }
        }
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->

function fn_set_grid() {

    // GRID PRINCIPAL

    var data =  [
        { C1: '1', C2: 'CON ARANDELA CIEGA' },
        { C1: '2', C2: 'CASA DEMOLIDA CON SUMINISTRO' },
        { C1: '3', C2: 'CXO HABITADA' },
        { C1: '4', C2: 'CON BYPASS' },
        { C1: '5', C2: 'NO LOCALISE LA CONEXIÓN' },
        { C1: '6', C2: 'CXO DESHABITADA' },
        { C1: '7', C2: 'CON CONEXIÓN CLANDESTINA' },
    ];

    var obj = {
        height: 219,
        showtop: true,
        showBottom: false,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible: true,
        scrollModel: {theme: true},
        numberCell: {show: false},
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 500, type: "local", rPPOptions: [500, 1000, 2000]},
        toolbar: false,
    };

    obj.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: false,
            cb: {
                all: true,
                select: true,
                header: false,
            }
        },
        { title: "id", width: 30, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false, hidden: true },
        { title: "Descripción", width: 359, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", editable: false },
    ];

    obj.dataModel = { data: data };

    $grid_principal = $("#div_grid_principal").pqGrid(obj);

    // GRID SECUNDARIA

    var obj2 = {
        height: 219,
        showtop: true,
        showBottom: false,
        showTitle: false,
        roundCorners: true,
        rowBorders: true,
        columnBorders: true,
        collapsible: true,
        scrollModel: {theme: true},
        numberCell: {show: false},
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 500, type: "local", rPPOptions: [500, 1000, 2000]},
        toolbar: false,
    };

    obj2.colModel = [
        { dataIndx: "checkBox", maxWidth: 30, minWidth: 30, align: "center", resizable: false, title: "", dataType: 'bool', editable: true,
            type: 'checkBoxSelection', cls: 'ui-state-default', sortable: false, editor: false,
            cb: {
                all: true,
                select: true,
                header: false,
            }
        },
        { title: "id", width: 30, dataType: "string", dataIndx: "C1", halign: "center", align: "center", editable: false, hidden: true },
        { title: "Descripción", width: 359, dataType: "strig", dataIndx: "C2", halign: "center", align: "left", editable: false },
    ];

    $grid_secundaria = $("#div_grid_secundaria").pqGrid(obj2);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Combos -->

function fn_inst_cort(){

}

function fn_motivo(){

}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_radio_change(value) {

    $("#tx_sector_inicial").val("");
    $("#tx_sector_final").val("");

    $("#div_radio_sector").hide();

    if (value === "opt_2") {
        $("#div_radio_sector").show();
    }
}

function fn_limpiar() {


}

function fn_mensaje(id,mensaje,segundos) {

    $(id).show();
    $(id).html(mensaje);
    setTimeout(function(){$(id).html("");$(id).hide(); }, segundos);
}


