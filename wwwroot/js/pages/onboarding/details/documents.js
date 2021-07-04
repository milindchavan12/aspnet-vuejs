var documentsComponent = (function () {
    var init = function (screenComponentMixin) {
        return Vue.component("details-documents-component", {
            template: "#details-documents-component-template",
            props: ["viewModel"],
            mixins: [screenComponentMixin],
            data: function () {
                return {
                    model: '',
                    versionsLookup: '',
                    onboardingStatusesLookup: '',
                    foreignDeclarationsLookup: '',
                    selectedVersionId: '',
                    currentStatusId: '',
                    editDisabled: ''
                };
            },
            filters: {
                formatDate: function (value) {
                    if (value) {
                        return moment(String(value)).format('DD-MM-YYYY');
                    }
                },
                formatRequiredDecision: function (isRequired) {
                    if (isRequired != undefined) {
                        return isRequired === true ? "Ja" : "Nee";
                    } else {
                        return "";
                    }
                }
            },
            computed: {
                isCommercialDecisionDisabled: function () {
                    return this.editDisabled || !this.model.isCommercialDecisionRequired;
                },
                isBackserviceDisabled: function () {
                    return this.editDisabled || !this.model.isBackserviceRequired;
                },
                isBackserviceDisclaimerDisabled: function () {
                    return this.editDisabled || !this.model.isBackserviceRequired || (this.model.advisingType === 'advies');
                },
                isAdvisingTypeDisabled: function () {
                    return this.editDisabled || (this.model.advisingType === 'advies');
                }
            },
            methods: {
                getDetails: function () {
                    var url = this.$parent.getDetailsUrl();
                    this.httpGet(url, null, this.getDetailsResponse, this.notifyError, this.completed);
                },
                getDetailsResponse: function (response) {
                    this.model = response;
                    this.currentStatusId = this.model.onboardingStatusId;
                    this.$parent.setOnboardingId(this.model.onboardingId);
                    $('#page-title').html(this.model.contractName + ' : ' + this.model.contractFid);
                    this.getOnboardingStatusesLookup();
                    this.getForeignDeclarationsLookup();
                    this.getVersionsLookup();
                },
                getOnboardingStatusesLookup: function () {
                    var url = this.$parent.getStatusesLookupUrl();
                    this.httpGet(url, this.model, this.getOnboardingStatusesLookupResponse, this.notifyError, null);
                },
                getOnboardingStatusesLookupResponse: function (response) {
                    this.onboardingStatusesLookup = response;
                },
                getForeignDeclarationsLookup: function () {
                    var url = this.$parent.getForeignDeclarationsLookupUrl();
                    this.httpGet(url, this.model, this.getForeignDeclarationsLookupResponse, this.notifyError, null);
                },
                getForeignDeclarationsLookupResponse: function (response) {
                    this.foreignDeclarationsLookup = response;
                },
                getVersionsLookup: function () {
                    var url = this.$parent.getVersionsLookupUrl();
                    this.httpGet(url, this.model, this.getVersionsLookupResponse, this.notifyError, this.completed);
                },
                getVersionsLookupResponse: function (response) {
                    this.versionsLookup = response;
                    this.selectedVersionId = this.versionsLookup[0].onboardingVersionId;
                    this.isPageEditable();
                },
                getVersionDetails: function () {
                    this.startSpinner();
                    var url = this.$parent.getDetailsUrl();
                    this.httpGet(url + "?onboardingVersionId=" + this.selectedVersionId, event, this.getVersionDetailsResponse, this.notifyError, this.completed);
                    this.isPageEditable();
                },
                getVersionDetailsResponse: function (response) {
                    this.model = response;
                },
                saveDetails: function () {
                    this.startSpinner();
                    var url = this.$parent.getSaveDetailsUrl();

                    try {
                        var isValid = validation.isSaveDetailsValid(this.model, this.currentStatusId);
                        if (isValid) {
                            this.httpPut(url, this.model, this.saveDetailsSuccess, this.saveDetailsError, null);
                        }  
                    }
                    catch (err) {
                        this.notifyError("Er is een fout opgetreden : <br/><br/> " + err);                       
                    }
                    this.completed();        
                },
                saveDetailsSuccess: function (response) {
                    if (response.success === true) {
                        this.notifySuccess("Details zijn opgeslagen!");
                        this.getDetails();
                    } else {
                        this.saveDetailsError(response);
                    }
                },
                saveDetailsError: function (response) {
                    if (response != undefined) {
                        var errors = $.map(response.errors, function (val, index) {
                            return val.errorMessage;
                        }).join("<br/> - ");

                        var status = this.onboardingStatusesLookup.find((o) => o.key === this.model.onboardingStatusId);
                        this.notifyError("Het is niet mogelijk om de status op " +
                            status.value +
                            " te zetten. Het volgende document mist nog: <br/><br/> - " + errors);
                    } else {
                        this.notifyError("Er is een fout opgetreden bij het opslaan van details!");
                    }
                },
                isPageEditable: function () {
                    var self = this;
                    var isStatusInProcess = self.isStatusProcessed();
                    var selectedVersion = this.versionsLookup.find((o) => o.onboardingVersionId === this.selectedVersionId);
                    this.editDisabled = !(this.versionsLookup[0].validFrom === selectedVersion.validFrom) || isStatusInProcess;
                    return this.editDisabled;
                },
                isStatusProcessed: function () {
                    // The Onboarding version can not be created when Contract is in Quote Declined (7) status
                    return (this.currentStatusId === 7) ? true : false;
                },
                completed: function () {
                    this.stopSpinner();
                }
            },
            created: function () {
                this.startSpinner();
                this.getDetails();
            }
        });
    }

    return {
        init: init
    }
})();