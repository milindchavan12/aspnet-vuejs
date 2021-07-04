var overviewController = (function () {

    var onboardingOverviewVue = null;

    var init = function (relativePath, toastr) {

        var viewModel = {
            hideSpinner: true,
            isFilterable: false,
            textSearch: '',
            contractSearch: '',
            dateFrom: '',
            dateTo: '',
            status: {
                accepted: true,
                signed: true,
                complete: false,
                activated: false,
                onHold: false,
                secondCheckDeclined: true,
                quoteDeclined: false 
            },
            defaultPage: 1,
            columnSort: 'StatusUpdatedOn',
            isDescending: false,
            pageSize: 15,
            pages: [15, 50, 100, 500],
            relativePath: relativePath
        }

        var commonMixin = stepMixin.init(relativePath, toastr);
        onboardingOverviewVue = onboardingOverviewPage.createVue(viewModel, commonMixin);
    }

    return {
        onboardingOverviewVue: onboardingOverviewVue,
        init: init
    }
})();