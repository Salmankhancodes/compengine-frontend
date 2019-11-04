"use strict";

define(function(require){

    /** Global dependencies **/
    var App = require("app");
    var Backbone = require("backbone");
    var BossView = require("bossview");
    var Marionette = require("marionette");

    /** Local dependencies **/
    var BulkUploadedFileBatchCollection = require("../models/bulk-uploaded-file-batch-collection");
    var BulkUploadRequestRow = require("./bulk-uploaded-file-row");
    var Footer = require("modules/common/views/footer/footer");
    var Navigation = require("modules/common/views/navigation/navigation");
    var NoDataView = require("modules/common/views/no-data/no-data");

    var Template = require("text!./admin-bulk-uploaded-files-page.html");

    /** Define module **/
    App.module("AdminBulkUploadedFiles", function(Module, Application, Backbone) {

        /** Define module view **/
        Module.View = Backbone.Marionette.BossView.extend({

            /**
             *  Subviews
             */
            subViews: {
                footer: App.Common.Footer.View,
                navigation: App.Common.Navigation.View
            },

            /**
             *  Containers for the sub views
             */
            subViewContainers: {
                footer: "#footer-container",
                navigation: "#navigation-container",
                table: "#bulk-uploaded-files-table",
                noData: "#bulk-upload-empty"
            },

            /**
             *  Listen to the events propagated from the subviews
             */
            subViewEvents: {
                "navigation render": "onXNavigationRender"
            },

            events: {
                'click [data-sort]': 'onClickSort',
                'input @ui.searchBox': 'onClickSearch'
            },

            ui: {
                'searchBox': '#search-box'
            },

            initialize: function (options) {
                var that = this;
                Backbone.Marionette.BossView.prototype.initialize.call(this, options);

                var collection = new Module.Models.BulkUploadedFileBatchCollection();
                var deferred = collection.fetch();
                this.collection = collection;

                this.subViews.table = function () {
                    return new Backbone.Marionette.CollectionView({
                        tagName: "tbody",
                        childView: Module.BulkUploadedFileRow,
                        collection: collection
                    });
                };

                this.subViews.noData = function () {
                    return new App.NoData.View({
                        message: 'There are no new bulk uploads.'
                    });
                };

                deferred.done(function() {
                    if (collection.length === 0) {
                        that.$el.find("#bulk-uploaded-files-table").hide();
                        that.$el.find("#bulk-upload-empty").show();
                    } else {
                        that.$el.find("#bulk-upload-empty").hide();
                        that.$el.find("#bulk-uploaded-files-table").show();
                    }
                });

                deferred.always(function() {
                    App.hidePageLoader();
                });
            },

            templateHelpers: function () {
                return {
                    sortingBy: this.collection.searchMeta.get('sortByField'),
                    sortDirection: this.collection.searchMeta.get('sortByDirection'),
                    searchText: this.collection.searchMeta.get('searchText')
                }
            },

            /**
             *  Set active state on navigation once it has rendered.
             */
            onXNavigationRender: function() {
                this.navigation.setNavigationItemAsActive("admin-bulk-uploaded-files");
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

            onClickSort: function (e) {
                var sortByField = $(e.target).data('sort');
                this.collection.sortByToggle(sortByField);
                this.render();
            },

            onClickSearch: function () {
                var searchText = this.ui.searchBox.val();
                this.collection.search(searchText);
                this.table.render();
            },

        });

    });

});