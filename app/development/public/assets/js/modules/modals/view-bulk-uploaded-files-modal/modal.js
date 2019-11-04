/**
 *  Upload Filesize Exceeded Modal
 *
 * @module modals/dropzone-error-modal
 * @memberof Modals
 * @see Modals
 */
define(function(require){

    /** Global dependencies **/
    var App = require("app");
    var Backbone = require("backbone");
    var BossView = require("bossview");
    var Marionette = require("marionette");

    /** Modal dependencies **/
    /** Modal dependencies **/
    var BaseModal = require("modules/modals/base-modal/base-modal");
    var ManagedView = require("modules/common/views/managed-view/managed-view");
    var BulkUploadRequest = require("modules/common/models/bulk-upload-request");

    /** Template **/
    var Template = require("text!./modal.html");

    /** Define module **/
    App.module("Modals.ViewBulkUploadedFiles", function(Module, Application, Backbone) {

        /**
         *  Module view, Inherits ManagedView
         *
         * @protected
         * @see ManagedView
         */
        Module.Body = App.Common.Views.ManagedView.View.extend({

            /**
             *  Returns a rendered template.
             *
             * @param serializedModel {Object} An object with data for the template to render
             * @returns {Function} Rendered template
             */
            template: function(serializedModel){
                return _.template(Template, serializedModel);
            },

            // templateHelpers: function () {}

            initialize: function(options) {
                App.Common.Views.ManagedView.View.prototype.initialize.call(this, options);
                this.model = options.modal.model;
            },

            /**
             *  Setup the event listeners for the modal radio channel
             *
             * @private
             */
            __setupModalRadioEvents: function() {
                this.modalChannel = Backbone.Radio.channel("modals");

                /**
                 * Add response to modal's request.
                 */
                this.modalChannel.reply("shouldModalBePrevented", function() {
                    return true;
                });
            }

        });

        Module.Modal = App.Modals.BaseModal.Modal.extend({

            /**
             *  The body view for the modal
             *
             * @protected
             */
            bodyView: Module.Body,

            title: "Viewing files in batch",

            width: "700px"

        });

    });

});
