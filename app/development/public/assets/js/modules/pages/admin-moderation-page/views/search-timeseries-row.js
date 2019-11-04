"use strict";

define(function(require){

    /** Global dependencies **/
    var App = require("app");
    var Backbone = require("backbone");
    var BossView = require("bossview");
    var Marionette = require("marionette");
    var Moment = require("moment");
    var Bootstrap = require("bootstrap");

    var Template = require("text!./search-timeseries-row.html");
    var DenyUploadConfirmationModal = require("modules/modals/deny-upload-confirmation-modal/modal");

    /** Define module **/
    App.module("AdminModerationPage", function(Module, Application, Backbone) {

        /** Define module view **/
        Module.SearchTimeseriesRow = Backbone.Marionette.ItemView.extend({

            tagName: "tr",

            ui: {
                "deleteCheckbox": "[data-delete-checkbox]",
                "error": ".error-text",
                "keepButton": "[data-keep]",
                "removeButton": "[data-remove]"
            },

            events: {
                "click @ui.keepButton": "keepTimeseries",
                "click @ui.removeButton": "removeTimeseries"
            },

            /**
             *  Returns a rendered template.
             *
             * @param serializedModel
             * @returns {Function}
             */
            template: function(serializedModel){
                return _.template(Template, serializedModel);
            },

            templateHelpers: function () {
                var that = this;
                return {
                    getDownloadLink: function () {
                        return that.model.downloadUrl();
                    },
                    humanFileSize: that.humanFileSize
                }
            },

            initialize: function (options) {
                Backbone.Marionette.BossView.prototype.initialize.call(this, options);

                this.modalChannel = Backbone.Radio.channel("modals");
            },

            onRender: function () {
                this.$el.find('[data-tooltip]').each(function (index, td) {
                    $(td).tooltip({
                      title: $(td).text()  
                    })
                });
            },

            humanFileSize: function (bytes, si) {
                var thresh = si ? 1000 : 1024;
                if(Math.abs(bytes) < thresh) {
                    return bytes + ' B';
                }
                var units = si
                    ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
                    : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
                var u = -1;
                do {
                    bytes /= thresh;
                    ++u;
                } while(Math.abs(bytes) >= thresh && u < units.length - 1);
                return bytes.toFixed(1)+' '+units[u];
            },

            removeTimeseries: function () {
                var that = this;

                var confirmationModal = new App.Modals.DenyUploadConfirmation.Modal();
                App.showModal(confirmationModal);

                this.modalChannel.off('modalSuccess').once('modalSuccess', function (e) {
                    var deferred = that.model.remove(e.reason);
                });
            },

            keepTimeseries: function () {
                var deferred = this.model.keep();
                return deferred;
            }

        });

    });

});