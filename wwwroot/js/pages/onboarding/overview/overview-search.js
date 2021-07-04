var overviewSearchComponent = (function () {
    var init = function (screenComponentMixin) {
        return Vue.component("overview-search-component", {
            template: "#overview-search-component-template",
            props: ["viewModel"],
            mixins: [screenComponentMixin],
            data: function () {
                return {};
            },
            methods: {
                toggleFilter: function () {
                    this.viewModel.isFilterable = !this.viewModel.isFilterable;
                },
                search: function () {
                    this.viewModel.contractSearch = this.viewModel.textSearch;
                    this.viewModel.defaultPage = 1;
                    var url = this.$parent.getOverviewUrl(
                        this.viewModel.defaultPage,
                        this.viewModel.pageSize,
                        this.viewModel.contractSearch,
                        this.viewModel.columnSort,
                        this.viewModel.isDescending,
                        this.viewModel.dateFrom,
                        this.viewModel.dateTo
                    );
                    this.$parent.search(url);
                },
                clearFilters: function () {
                    this.clearTextSearch();
                    this.initDates();
                    this.viewModel.defaultPage = 1;
                    this.viewModel.status = {
                        accepted: true,
                        signed: true,
                        complete: false,
                        activated: false,
                        onHold: false,
                        secondCheckDeclined: true
                    };
                    var url = this.$parent.getOverviewUrl(
                        this.viewModel.defaultPage,
                        this.viewModel.pageSize,
                        this.viewModel.contractSearch,
                        this.viewModel.columnSort,
                        this.viewModel.isDescending,
                        this.viewModel.dateFrom,
                        this.viewModel.dateTo
                    );
                    this.$parent.search(url);
                },
                clearTextSearch: function () {
                    this.viewModel.textSearch = '';
                    this.viewModel.contractSearch = '';
                },
                searchFrom: function (value) {
                    this.viewModel.dateFrom = value;
                    this.search();
                },
                searchTo: function (value) {
                    this.viewModel.dateTo = value;
                    this.search();
                },
                initDates: function () {
                    this.viewModel.dateFrom = '01-01-2020';
                    this.viewModel.dateTo = moment().format('DD-MM-YYYY');
                }
            },
            mounted: function () {
                this.initDates();
            }
        });
    }

    return {
        init: init
    }
})();