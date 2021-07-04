var onboardingDetailsPage = (function () {

    var createVue = function (viewModel, screenComponentMixin) {
        return new Vue({
            el: '#v-onboarding-details',
            mixins: [screenComponentMixin],
            component: {
                "documents": documentsComponent.init(screenComponentMixin),
                "comments": commentsComponent.init(screenComponentMixin),
                "spinner": spinner.init()
            },
            data: {
                model: viewModel
            },
            methods: {
                getDetailsUrl: function() {
                    return "api/details/" + this.model.contractFid;
                },
                getVersionsLookupUrl: function () {
                    return "api/lookups/versions?contractFid=" + this.model.contractFid;
                },
                getStatusesLookupUrl: function() {
                    return "api/lookups/onboarding-statuses";
                },
                getForeignDeclarationsLookupUrl: function () {
                    return "api/lookups/foreign-declarations";
                },
                getSaveDetailsUrl: function () {
                    return "api/details";
                },
                setOnboardingId: function (onboardingId) {
                    this.model.onboardingId = onboardingId;
                    this.$refs.comments.getComments();
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