var stepMixin = (function () {

    var relativePath = "";

    var init = function (relativePath, toastr) {

        var screenComponentMixin = {
            methods: {
                next: function () {
                    this.$parent.$emit("next");
                },
                back: function () {
                    this.$parent.$emit("back");
                },
                startSpinner: function () {
                    this.hideSpinner(false);
                },
                stopSpinner: function () {
                    this.hideSpinner(true);
                },
                hideSpinner: function (value) {
                    this.$parent.$emit("hideSpinner", value);
                },
                http: function (method, relativeUrl, data, successCallback, errorCallback, completeCallback) {

                    relativeUrl = relativePath + relativeUrl;
                    var antiforgeryToken = $("input[name='__RequestVerificationToken']").val();
                    $.ajax({
                        url: relativeUrl,
                        type: method,
                        data: JSON.stringify(data),
                        headers: { 'RequestVerificationToken': antiforgeryToken },
                        contentType: 'application/json',
                        success: function (contents) {
                            if ($.isFunction(successCallback)) {
                                successCallback(contents);
                            }
                        },
                        error: function (xhr, status, error) {
                            if (($.isFunction(errorCallback))) {
                                errorCallback(xhr, status, error);
                            }
                        },
                        complete: function () {
                            if (($.isFunction(completeCallback))) {
                                completeCallback();
                            }
                        }
                    });
                },
                httpGet: function (relativeUrl, data, successCallback, errorCallback, completeCallback) {
                    this.http("GET", relativeUrl, data, successCallback, errorCallback, completeCallback)
                },
                httpPost: function (relativeUrl, data, successCallback, errorCallback, completeCallback) {
                    this.http("POST", relativeUrl, data, successCallback, errorCallback, completeCallback)
                },
                httpPut: function (relativeUrl, data, successCallback, errorCallback, completeCallback) {
                    this.http("PUT", relativeUrl, data, successCallback, errorCallback, completeCallback)
                },
                notifySuccess: function(message)
                {
                    if (message) {
                        message = "Gelukt!";
                    } 
                    toastr["success"](message);
                },
                notifySuccess: function (message, title) {
                    toastr["success"](message, "Gelukt!");
                },
                notifyError: function (message) {

                    if (message) {
                        message = "Fout!";
                    }
                    toastr["error"](message);
                },
                notifyError: function (message, title) {
                    toastr["error"](message, "Fout!");
                }
            }
        }

        return screenComponentMixin;
    }

    return {
        init : init
    }
})();

