/*
 * [y] hybris Platform
 *
 * Copyright (c) 2000-2014 hybris AG
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of hybris
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with hybris.
 */

'use strict';

/** Authorization manager.  */
angular.module('ds.auth')
    .factory('AuthDialogManager', ['$modal', '$location', 'settings', '$q',
        function($modal, $location, settings, $q){

            var authDialog, isOpened = false;


            function onDialogClosed(callback) {
                isOpened = false;

                if(callback){
                    callback();
                }
            }


            function openDialog(options) {
                var deferResult = $q.defer();
                // make sure only 1 instance exists in opened state
                if (authDialog && isOpened) {
                    authDialog.close();
                }
                authDialog = $modal.open(options);
                isOpened = true;
                authDialog.result.then(
                    // dialog closed
                    function(success) {
                        onDialogClosed();
                        deferResult.resolve(success);
                    },
                    // dialog dismissed
                    function(error) {
                        onDialogClosed();
                        deferResult.reject(error);
                    }
                );
                return deferResult.promise;
            }

            return {

                isOpened: function() {
                    return isOpened;
                },
                
                /**
                 * Creates and opens the authorization dialog for sign in/create account.
                 * Returns the promise returned by $modal.result (see angular bootstrap) - the success handler will
                 * be invoked if the the dialog was closed and the "reject" handler will be invoked if the dialog was
                 * dismissed.
                 */
                open: function(dialogConfig, options) {

                    var modalOpts = angular.extend({
                            templateUrl: './js/app/auth/templates/auth.html',
                            controller: 'AuthModalDialogCtrl'
                        }, dialogConfig || {});

                    if (options && options.required) {
                        modalOpts.keyboard = false;
                        modalOpts.backdrop = 'static';
                    }

                    return openDialog(modalOpts);

                },

                close: function() {
                    if (authDialog && isOpened) {
                        authDialog.close();
                        isOpened = false;
                    }
                },


                /** Shows the "reset password dialog. */
                showResetPassword: function(){
                   var modalOpts = {
                       templateUrl: './js/app/auth/templates/password-request-reset.html',
                       controller: 'PasswordResetCtrl'
                   };
                   return openDialog(modalOpts);
                },

                /** Shows the "check your email" dialog. */
                showCheckEmail: function(){
                    var modalOpts = {
                        templateUrl: './js/app/auth/templates/check-email.html',
                        controller: 'PasswordResetCtrl'
                    };
                    return openDialog(modalOpts);
                },

                /** Shows the "check your email" dialog. */
                showChangePassword: function(showBackDrop){
                    var modalOpts = {
                        templateUrl: './js/app/auth/templates/password-reset.html',
                        controller: 'PasswordResetCtrl',
                        size: 'lg',
                        backdrop: showBackDrop? true : false
                    };
                    return openDialog(modalOpts);
                },

                /** Shows the 'password changed successfully' dialog. */
                showPasswordChanged: function(){
                    var modalOpts = {
                        templateUrl: './js/app/auth/templates/pw-change-success.html',
                        controller: 'PasswordResetCtrl'
                    };
                    return openDialog(modalOpts);
                }


            };

        }
    ]);