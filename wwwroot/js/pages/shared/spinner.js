var spinner = (function () {

    var init = function () {
        return Vue.component("loading-spinner", {
            template: "#v-loading-spinner-template",
            props: ["hideSpinner"]
        });
    }

    return {
        init: init
    }
})();