var detailsController = (function () {

    var detailsVue = null;

    var init = function (contractFid, relativePath, toastr) {

        var viewModel = {
            hideSpinner: true,
            contractFid: contractFid,
            onboardingId: 0
        };

        validation.init();

        var commonMixin = stepMixin.init(relativePath, toastr);
        detailsVue = onboardingDetailsPage.createVue(viewModel, commonMixin);
    }

    return {
        detailsVue: detailsVue,
        init: init
    }
})();