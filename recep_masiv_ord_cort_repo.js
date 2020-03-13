var g_modulo = "Corte y Reposición";
var g_tit = "Recepción Masiva de ordenes de Corte y Reposición";
var $grid_principal;
var grid_principal;
var update = false;
var files = new FormData();
var rowIndxG;
var file;

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

    $("#div_mod0").html(g_modulo);
    $("#div_tit0").html(g_tit);

    $(".number").inputmask("integer");
    $(".number_float").inputmask("decimal",{
        radixPoint:".",
        groupSeparator: ",",
        digits: 2,
        autoUnmask: true,
        autoGroup: true
    });

    fn_regional();

    fn_set_grid_principal();

    // Footer  // Raiz
    $("#div_footer").load("syn_globales/footer.htm");
    $("#excel_archivo").val("tablas_generales.xls");
    $("#tx_empresa").val("1");
    $("#tx_rol").val("SYNERGIA");
    $("#tx_ip").val("127.0.0.1");

    $("#co_agregar").prop("disabled", true);

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                              <-- Buttons - Listeners -->

    $("#co_transferir").on("click", function () {

        if ($.trim($("#co_transferir").text() === "Transferir")) {

            if ($("#cb_regional").val() === "") {
                fn_mensaje_boostrap("Error, por favor seleccione una Regional.", g_tit, $("#cb_regional"));
                return;
            }

            var data = $grid_principal.pqGrid("option", "dataModel.data");

            if (data.length < 1) {
                fn_mensaje_boostrap("Error, por favor ingrese un archivo (Debe seleccionar almenos 1).", g_tit, $("#input_file"));
                return;
            }

            fn_mensaje_boostrap("Se transfirio", g_tit, $(""));

        }
    });

    $("#input_file").change( function (event) {

        if ($.inArray($('#input_file').val().split('.').pop().toLowerCase(), ['pl']) === -1) {
            if ($("#input_file").val() !== "") {
                fn_mensaje_boostrap("Error, solo se admiten archivos con extensión .pl", g_tit, $("#input_file"));
                $("#input_file").val("");
                $("#co_agregar").prop("disabled", true);
            }
        } else {
            $("#co_agregar").prop("disabled", false);
            file = event.target.files;
        }
    });

    $("#co_agregar").on("click", function () {

        update = true;

        $grid_principal.pqGrid("refreshView");

        update = false;

        var data_grid = grid_principal.getData();
        var name_file = $("#input_file").val().split("\\").pop();

        if (data_grid.length <= 0) {
            files.append("files-01", file[0], file[0].name);
            $grid_principal.pqGrid( "addRow", { rowData: { C1: name_file.split('.').shift() }, checkEditable: false } );
            $("#input_file").val("");
            $("#co_agregar").prop("disabled", true);
        } else {
            for (var i = 0; i < data_grid.length; i++) {
                if (name_file.split('.').shift() === data_grid[i].C1) {
                    fn_mensaje_boostrap("Error, este archivo ya se encuentra agregado.", g_tit, $("#input_file"));
                    $("#input_file").val("");
                    return;
                }
            }

            var key;

            for (var entradas of files.entries()) {
                key = entradas[0].split('-').pop();
            }

            files.append("files-0" + (parseInt(key) + 1), file[0], file[0].name);
            $grid_principal.pqGrid( "addRow", { rowData: { C1: name_file.split('.').shift() }, checkEditable: false } );
            $("#input_file").val("");
            $("#co_agregar").prop("disabled", true);
        }
    });

    $("#co_confirm_yes").on( "click", function () {

        var rowData = $grid_principal.pqGrid("getRowData", {rowIndx: rowIndxG});

        for (var vals of files.entries()) {

            var fileName = vals[1].name;
            var rowDataName = rowData.C1 + ".pl";

            if (fileName === rowDataName) {
                files.delete(vals[0]);
            }
        }

        $grid_principal.pqGrid("deleteRow", { rowIndx: rowIndxG });

        $('#dlg_confirm').modal('hide');

    });

    $("#co_confirm_no").on( "click", function () {

        $('#dlg_confirm').modal('hide');

    });

    $("#co_cerrar").on("click", function (){ window.close(); });

    $grid_principal.pqGrid( {
        refresh: function () {
            if (update) {
                grid_principal = this;
            }
        }
    });

});

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Grids -->

function fn_set_grid_principal() {

    var obj = {
        height: '100%',
        showtop: true,
        editable: false,
        showTitle: false,
        rowBorders: true,
        showBottom: false,
        collapsible: true,
        roundCorners: true,
        columnBorders: true,
        postRenderInterval: 0,
        numberCell: {show: false},
        scrollModel: {theme: true},
        selectionModel: {type: 'row', mode: 'block'},
        pageModel: {rPP: 500, type: "local", rPPOptions: [500, 1000, 2000]},
        toolbar: false,
    };

    obj.colModel = [
        { title: "Archivo", width: 797, dataType: "strig", dataIndx: "C1", halign: "center", align: "left" },
        { title: "Eliminar", width: 58, dataType: "string", halign: "center", align: "center", editable: false, sortable: false,
            render: function () {
                return "<button class='btn btn-sm btn-primary' id='co_cerrar_prin' type='button'><span class='glyphicon glyphicon-trash'></span></button>";
            },
            postRender: function (ui) {

                var rowIndx = ui.rowIndx;

                var $grid = this;
                    $grid = $grid.getCell(ui);

                $grid.find("button")
                    .on("click", function () {

                        fn_borrar(rowIndx);

                    });

            }
        },
    ];


    $grid_principal = $("#div_grid_principal").pqGrid(obj);
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Combos -->

function fn_regional() {

    $("#cb_regional").html("<option value='' selected></option><option value='1'>PANAMÁ SUR</option> <option value='2' >PANAMÁ NORTE</option>  <option value='3' >PANAMÁ METRO</option>");
}

//~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*~*

//                                  <-- Functions -->

function fn_borrar(rowIndx) {

    $("#confirm_msg").html("¿Estas seguro de que quieres eliminar la fila " + (rowIndx + 1) + "?");

    rowIndxG = rowIndx;

    $("#dlg_confirm").modal({backdrop: "static",keyboard:false});
    $("#dlg_confirm").on("shown.bs.modal", function () {
        $("#dlg_confirm div.modal-footer button").focus();
    });

}
