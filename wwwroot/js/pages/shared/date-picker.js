var datePicker = (function () {

    var init = function () {
        Vue.component('date-picker', {
            template: '<input type="text" class="datepicker" tabindex="7" v-bind:value="value" />',
            props: ['dateFormat', 'value'],
            mounted: function () {
                var self = this;
                $(this.$el).datepicker({
                    dateFormat: this.dateFormat,
                    onSelect: function (date) {
                        self.$emit('update-date', date);
                    },
                    onClose: function (date) {
                        self.$emit('update-date', date);
                    }
                });
            },
            beforeDestroy: function () {
                $(this.$el).datepicker('hide').datepicker('destroy');
            }
        });
    }

    return {
        init: init
    }
})();