var overviewTableComponent = (function () {

    var init = function (screenComponentMixin) {
        return Vue.component("overview-table-component", {
            template: "#overview-table-component-template",
            props: ["viewModel"],
            mixins: [screenComponentMixin],
            data: function () {
                return {
                    overviewTable: null
                };
            },
            methods: {
                getOverview: function () {
                    var self = this;
                    var url = this.$parent.getOverviewUrl(this.viewModel.defaultPage, this.viewModel.pageSize, '', this.viewModel.columnSort, this.viewModel.isDescending, this.viewModel.dateFrom, this.viewModel.dateTo);

                    self.overviewTable = $('#tbl-contract-overview').DataTable({
                        ordering: true,
                        searching: false,
                        lengthChange: true,
                        paging: false,
                        info: false,
                        processing: true,
                        serverSide: true,
                        ajax: {
                            type: "GET",
                            url: url,
                            dataSrc: function (data) {
                                self.displayPagination(data.totalRecords);
                                return data.data;
                            }
                        },
                        order: [[5, "asc"]],
                        columns: [
                            { data: "contractName", name: "contractName" },
                            {
                                data: "contractFid",
                                name: "contractFid",
                                "fnCreatedCell": function (nTd, sData, oData, iRow, iCol) {
                                    $(nTd).html("<a href=" + self.getDetailUrl(oData.contractFid) +
                                        ">" +
                                        oData.contractFid +
                                        "</a>");
                                }
                            },
                            { data: "advisingType", name: "advisingType" },
                            { data: "internalContactPerson", name: "internalContactPerson" },
                            { data: "status", name: "status" },
                            { data: "statusUpdatedOn", name: "statusUpdatedOn" }
                        ],
                        columnDefs: [
                            {
                                targets: 5,
                                render: $.fn.dataTable.render.moment('YYYY-MM-DDTHH:mm:ss', 'DD-MM-YYYY')
                            }
                        ],
                        createdRow: function (row, data, dataIndex) {
                            // Set the data-status attribute, and add a class
                            $(row).find('td:eq(0)').attr('cy-data', 'onboarding-data-contract-name');
                            $(row).find('td:eq(1)').attr('cy-data', 'onboarding-data-contract-number');
                            $(row).find('td:eq(2)').attr('cy-data', 'onboarding-data-advice-type');
                            $(row).find('td:eq(3)').attr('cy-data', 'onboarding-data-internal-contract-person');
                            $(row).find('td:eq(4)').attr('cy-data', 'onboarding-data-status');
                            $(row).find('td:eq(5)').attr('cy-data', 'onboarding-data-last-update');
                        }
                    });

                    $('#tbl-contract-overview tbody').on('click', 'tr', function () {
                        var aData = self.overviewTable.row(this).data();
                        document.location.href = self.viewModel.relativePath + "Details/" + aData.contractFid;
                    });

                    $.fn.dataTable.ext.errMode = 'none';

                    $('#tbl-contract-overview').on('error.dt', function (e, settings, techNote, message) {
                        if (self.isError === false) {
                            self.notifyError("Er is een fout opgetreden bij het ophalen van overview. Laad de pagina opnieuw!");
                            self.isError = true;
                        }
                    });
                },
                displayPagination: function (totalRecords) {
                    var self = this;
                    var to = this.viewModel.defaultPage * self.viewModel.pageSize;
                    var from = (to - self.viewModel.pageSize) + 1;

                    if (totalRecords === 0)
                        from = 0;

                    if (totalRecords < to)
                        to = totalRecords;

                    $('#show-entries').text('Showing ' + from + ' to ' + to + ' of ' + totalRecords + ' entries');

                    self.pageSelection = $('#page-selection').bootpag({
                        page: this.viewModel.defaultPage,
                        total: Math.ceil(totalRecords / self.viewModel.pageSize),
                        maxVisible: 5,
                        next: 'Next',
                        prev: 'Previous',
                    }).on("page",
                        function (event, num) {
                            self.startSpinner();
                            self.viewModel.defaultPage = num;
                            var url = self.$parent.getOverviewUrl(self.viewModel.defaultPage, self.viewModel.pageSize, self.viewModel.contractSearch, self.viewModel.columnSort, self.viewModel.isDescending, self.viewModel.dateFrom, self.viewModel.dateTo);
                            self.overviewTable.ajax.url(url).load();
                        });
                    this.stopSpinner();
                },
                paging: function () {
                    this.viewModel.defaultPage = 1;
                    var url = this.$parent.getOverviewUrl(this.viewModel.defaultPage, this.viewModel.pageSize, this.viewModel.contractSearch, this.viewModel.columnSort, this.viewModel.isDescending, this.viewModel.dateFrom, this.viewModel.dateTo);
                    this.reload(url);
                },
                reload: function (url) {
                    var self = this;
                    self.overviewTable.ajax.url(url).load();
                    self.displayPagination();
                },
                getDetailUrl: function (contractFid) {
                    return this.viewModel.relativePath + "details/" + contractFid;
                },
                toggleSorting: function (column) {
                    this.viewModel.defaultPage = 1;
                    if (this.viewModel.columnSort === column) {
                        this.viewModel.isDescending = !this.viewModel.isDescending;
                    }
                    this.viewModel.columnSort = column;
                    var url = this.$parent.getOverviewUrl(this.viewModel.defaultPage, this.viewModel.pageSize, this.viewModel.contractSearch, this.viewModel.columnSort, this.viewModel.isDescending, this.viewModel.dateFrom, this.viewModel.dateTo);
                    this.reload(url);
                }
            },
            mounted: function () {
                this.startSpinner();

                this.getOverview();
            }
        });
    }

    return {
        init: init
    }
})();