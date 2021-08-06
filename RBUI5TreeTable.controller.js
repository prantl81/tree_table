sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/mvc/Controller",   //define as we can't require the MVC controller
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat",
    "sap/m/ToolbarSpacer",
    "sap/ui/table/library",
    "sap/ui/thirdparty/jquery",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/FilterType",
    "sap/ui/core/Element"
 ], function(Log, Controller, Sorter, JSONModel, MessageToast, DateFormat, ToolbarSpacer, library, jQuery, Filter, FilterOperator, FilterType, Element) {
    "use strict";




return Controller.extend("com.evosight.sacwidgets.redbull.RBUI5TreeTable", {

                   onInit: function() {

                       if (that_._designMode) {
                           //In design mode show demo data
                           var oData =
                             { "spl": [
                                     {"name":"Level One - 1", "spl": [
                                         {"name": "Level Two - 1", "spl": [
                                           {"name": "Level Three - 1", "spl_flag": "X "},
                                           {"name": "Level Three - 2", "spl_flag": ""  },
                                           {"name": "Level Three - 3", "spl_flag": "X" }
                                         ]},
                                         {"name": "Level Two - 2", "spl": [
                                           {"name": "Level Three - 4", "spl_flag": ""  },
                                           {"name": "Level Three - 5", "spl_flag": "X" }
                                         ]},
                                         {"name": "Level Two - 3", "spl": [
                                           {"name": "Level Three - 6", "spl_flag": "X" },
                                           {"name": "Level Three - 7", "spl_flag": "X" },
                                           {"name": "Level Three - 8", "spl_flag": "" },
                                           {"name": "Level Three - 9", "spl_flag": "" }
                                         ]},
                                         {"name": "Level Two - 4", "spl": [
                                           {"name": "Level Three - 10", "spl_flag": "" },
                                           {"name": "Level Three - 11", "spl_flag": "" }
                                         ]}
                                     ]},
                                     {"name":"Level One - 2", "spl": [
                                       {"name": "Level Two - 5", "spl": [
                                            {"name": "Level Three - 12", "spl_flag": "X" },
                                            {"name": "Level Three - 13", "spl_flag": "X" }
                                         ]},
                                         {"name": "Level Two - 6", "spl": [
                                           {"name": "Level Three - 14", "spl_flag": "X" },
                                           {"name": "Level Three - 15", "spl_flag": "X" }
                                         ]}
                                     ]}
                           ]};
                        } else {
                            // not design mode -> we do not pass example data
                            var oData = { "spl": []};
                        }


                        var oModel = new JSONModel(oData);
                        this.getView().setModel(oModel);



                   },

                   onBeforeRendering: function() {
                         window.globVar_UI5_Table = this.byId('TreeTable');
                         var oTreeTable = this.byId("TreeTable");
                         oTreeTable.expandToLevel(1);
                   },

                   onSearch : function () {
                        var oView = this.getView(),
                        sValue = oView.byId("searchField").getValue(),
                        oFilter = new Filter("name", FilterOperator.Contains, sValue);
                        oView.byId("TreeTable").getBinding("rows").filter(oFilter, FilterType.Application);
                        oView.byId("TreeTable").getBinding("rows").expandToLevel(3);
                        },
                   onSuggest: function(event) {
                          var sValue = event.getParameter("suggestValue"),
                            aFilters = [];
                            if (sValue) {
                               aFilters.push(new Filter({
                                  filters: [
                                      new Filter("rows", FilterOperator.Contains, sValue.toUpperCase()),
                                           ],
                                        and: false
                              }));
                           }
                             var oSource = event.getSource();
                             var oBinding = oSource.getBinding('suggestionItems');
                             oBinding.filter(aFilters);
                             oBinding.attachEventOnce('dataReceived', function() {
                             oSource.suggest();
                             });

                            },


                   onButtonPress: function(oEvent) {
                       // _password = oView.byId("passwordInput").getValue();
                       that._firePropertiesChanged();

                       this.settings = {};
                       this.settings.rowDetails = "";

                       that.dispatchEvent(new CustomEvent("onStart", {
                           detail: {
                               settings: this.settings
                           }
                       }));
                   },

                  handleVisibleRowChange: function(oEvent) {

                   },

                   onCollapseLevelChange: function(oEvent) {
                      var level = oEvent.mParameters.item.mProperties.text;
                      var oTreeTable = this.byId("TreeTable");
                      oTreeTable.collapseAll();

                          switch(level){
                                          case "1":
                                                  break;
                                          case "2":
                                                  oTreeTable.expandToLevel(1);
                                                  break;
                                          case "3":
                                                  oTreeTable.expandToLevel(2);
                                                  break;
                                        }

                   },

                   onCheckBoxSelect: function(oEvent) {
                       let checkBoxContext = oEvent.getSource().getBindingContext().getObject();
                       that.dispatchEvent(new CustomEvent("onCheckBoxChange_UI5_event", { detail: { checkBoxContext } } ));
                   },

                   onFilter: function(oEvent){

                   },

                   //Filter
                   onSelection: function(oEvent){

                   }






               });



}
);
