$(function () {

        var obj = {
            width: 800,
            height: 400,
            showTop: false,
            showBottom: false,
            editable: false,
            selectionModel: { type: 'cell'}
        };
        obj.colModel = [
        { title: "ShipCountry", width: 100, dataIndx:"ShipCountry" },
        { title: "Customer Name", width: 130, dataIndx:"ContactName" },
        { title: "Order ID", width: 100, dataIndx:"OrderID",  dataType:"integer" },
		{ title: "Order Date", width: "100", dataIndx:"OrderDate", dataType:"date" },
		{ title: "Required Date", width: 100 , dataIndx:"RequiredDate",  dataType:"date"},
		{ title: "Shipped Date", width: 100, dataIndx:"ShippedDate",  dataType:"date" },
		{ title: "Shipping Via", width: 100, dataIndx:"ShipVia" },
        { title: "Freight", width: 100, align: "right", dataType:"float", dataIndx:"Freight" },
        { title: "Shipping Name", width: 160, dataIndx:"ShipName" },
        { title: "Shipping Address", width: 200, dataIndx:"ShipAddress" },
        { title: "Shipping City", width: 100, dataIndx:"ShipCity" },
        { title: "Shipping Region", width: 130,dataIndx:"ShipRegion" },
        { title: "Shipping Postal Code", width: 130, dataIndx:"ShipPostalCode" }
		];
        obj.dataModel = {
            location: "remote", 
            sorting: "local",
            url:"/Content/orders.json",             
            sortIndx: ["ShipCountry", "ContactName", "ShipVia" ],
            sortDir: ["up", "down", "up"],
            //sortIndx: "ShipCountry",
            //sortDir: "up"
        }
        obj.pageModel={type:'local'};
        //cellSelect callback.
        obj.cellSelect = function (evt, ui) {
            if (ui.rowData) {
                var rowIndx = ui.rowIndx,
                    colIndx = ui.colIndx,
                    dataIndx = ui.dataIndx,
                    cellData = ui.rowData[dataIndx];
                $("#select_cell_display_div").html("Cell selected rowIndx: " + rowIndx + ", colIndx: " + colIndx + ", dataIndx: " + dataIndx + ", value: " + cellData);
            }
        }
        //fill the drop downs upon creation of pqGrid.
        obj.load = function (evt, ui) {
            var $select_row = $(".select-row");
            $select_row.empty();            
            var colModel = ui.colModel
                data=ui.dataModel.data;
            for (var i = 0; i < data.length; i++) {
                $select_row.append("<option>" + i + "</option>");
            }
            var $select_col = $(".select-column");
            $select_col.empty();
            for (var i = 0; i < colModel.length; i++) {
                var column = colModel[i];
                if (!ui.colModel[i].hidden) {
                    $select_col.append("<option>" + column.dataIndx + "</option>");
                }
            }            
            $(".select-column, .select-row").bind("change", function (evt) {
                //debugger;
                var rowIndx = parseInt($select_row.val()),
                    dataIndx = $select_col.val();
                $("#grid_cell_selection").pqGrid("setSelection", null);
                $("#grid_cell_selection").pqGrid("setSelection", { rowIndx: rowIndx, dataIndx: dataIndx });
            });
        }
        $("#grid_cell_selection").pqGrid(obj);

    });
