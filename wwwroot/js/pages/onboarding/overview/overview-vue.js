var onboardingOverviewPage = (function () {

    var createVue = function (viewModel, screenComponentMixin) {
        return new Vue({
            el: '#v-onboarding-overview',
            mixins: [screenComponentMixin],
            component: {
                "overviewSearch": overviewSearchComponent.init(screenComponentMixin),
                "overviewTable": overviewTableComponent.init(screenComponentMixin),
                "spinner": spinner.init(),
                "datePicker": datePicker.init()
            },
            data: {
                model: viewModel
            },
            methods: {
                getOverviewUrl: function (page, limit, textSearch, columnSort, isDescending, dateFrom, dateTo) {
                    var baseUrl = "api/overviews?page=" + page + "&limit=" + limit;
                    var contractSearch = "&contractSearch=" + textSearch;
                    var filterStatuses = "&filterStatuses=" + (viewModel.status.accepted === true ? "accepted;" : "") +
                        (viewModel.status.signed === true ? "signed;" : "") +
                        (viewModel.status.complete === true ? "complete;" : "") +
                        (viewModel.status.activated === true ? "activated" : "") +
                        (viewModel.status.onHold === true ? "onHold;" : "") +
                        (viewModel.status.secondCheckDeclined === true ? "secondCheckDeclined;" : "") +
                        (viewModel.status.quoteDeclined === true ? "quoteDeclined;" : "");
                    var columnSorting = "&columnSort=" + columnSort;
                    var isDescendingSort = "&isDescending=" + isDescending;
                    var dateFrom = "&dateFrom=" + dateFrom;
                    var dateTo = "&dateTo=" + dateTo;

                    return viewModel.relativePath + baseUrl + contractSearch + filterStatuses + columnSorting + isDescendingSort + dateFrom + dateTo;
                },
                search: function(url) {
                    this.$refs.table.reload(url);
                }
            },
            created: function () {
                var self = this;
                this.$on("hideSpinner", function (value) { self.model.hideSpinner = value; });
                $('#page-title').html('Onboarding');
            }
        });
    };

    return {
        createVue: createVue
    };
})();