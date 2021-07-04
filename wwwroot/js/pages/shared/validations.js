var validation = (function () {

    var extendRequiredIfFieldFilled = function () {

        VeeValidate.extend("requiredIfFieldFilled",
            {
                params: ['target'],
                validate: (input, { target }) => {

                    var targetFilled = target !== undefined && target !== "null" && target !== "";
                    var inputFilled = input !== undefined && input !== "null" && input !== "";

                    var targetEmpty = target === undefined || target === "null" || target === "";
                    var inputEmpty = input === undefined || input === "null" || input === "";

                    if (targetFilled && inputFilled) {
                        return true;
                    } else if (targetEmpty && inputEmpty) {
                        return true;
                    }

                    return false;
                },
                message:
                    ""
            });
    };

    var isStatusValid = function (model, currentStatusId) {
        // Restricting the saving of Onboarding version when Contract status is Quote Declined = 7
        if (model.onboardingStatusId === 0 || model.onboardingStatusId === 7) {
            throw "Selecteer de juiste onboarding status";
        }
        // Status 2nd check declined is only available when status is complete
        if (model.onboardingStatusId === 6 && currentStatusId != 3) {
            throw "De status 'tweede controle afgekeurd' kan alleen worden gewijzigd vanuit status 'Compleet";
        }

        return true;
    }

    var isForeignDeclarationValid = function (model) {
        if (model.foreignDeclaration && model.foreignDeclarationId === 0) {
            throw "Selecteer de juiste buitenlandverklaring";
        }
        return true;
    }

    var isSaveDetailsValid = function (model, currentStatusId) {
        return isStatusValid(model, currentStatusId) && isForeignDeclarationValid(model);
    }

    var init = function () {

        Vue.component('ValidationObserver', VeeValidate.ValidationObserver);
        Vue.component("ValidationProvider", VeeValidate.ValidationProvider);
        extendRequiredIfFieldFilled();
    };

    return {
        init: init,
        isSaveDetailsValid: isSaveDetailsValid
    };

})();