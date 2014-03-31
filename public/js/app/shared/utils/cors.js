'use strict';

angular.module('hybris.bs&d.newborn.utils')

	.provider('CORSProvider', ['$httpProvider',
		function($httpProvider) {

			var CORSProvider = {
				
				enableCORS: function() {
					$httpProvider.defaults.useXDomain = true;
					delete $httpProvider.defaults.headers.common['X-Requested-With'];
				}

			};

			this.$get = [function() {
				return CORSProvider;
			}];
		}
	]);