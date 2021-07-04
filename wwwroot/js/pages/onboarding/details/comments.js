var commentsComponent = (function () {
    var init = function (screenComponentMixin) {

        var comments = [
            {
                comment: '',
                createdBy: ''
            }];
        var comment = {
            text: '',
            max: 4000
        };

        return Vue.component("details-comments-component", {
            template: "#details-comments-component-template",
            props: ["viewModel"],
            mixins: [screenComponentMixin],
            data: function () {
                return {
                    commentUrl: "api/comments/",
                    comments: comments,
                    comment: comment
                };
            },
            filters: {
                formatDate: function (value) {
                    if (value) {
                        return moment(String(value)).format('DD-MM-YYYY');
                    }
                }
            },
            methods: {
                getComments: function () {
                    this.httpGet(this.commentUrl + this.viewModel.onboardingId.toString(), comments, this.getCommentsResponse, this.notifyError, this.completed);
                },
                getCommentsResponse: function (response) {
                    this.comments = response;
                },
                saveComment: function () {
                    var self = this;
                    self.$refs.observer.validate().then((isValid) => {
                        if (isValid) {
                            this.httpPost(this.commentUrl + this.viewModel.onboardingId.toString(),
                                { "comment": this.comment.text },
                                this.saveCommentSuccess,
                                this.notifyError,
                                null);
                        } else {
                            this.notifyError('Geen opmerking ingevuld');
                        }
                    });
                },
                saveCommentSuccess: function (response) {
                    this.comment.text = '';
                    this.notifySuccess("Opmerking is toegevoegd!");
                    this.getComments();
                },
                completed: function () {
                    this.stopSpinner();
                }
            }
        });
    }

    return {
        init: init
    }
})();