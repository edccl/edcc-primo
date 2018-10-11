(function(){
"use strict";
'use strict';

/* BEGIN Bootstrap Script */

var app = angular.module('viewCustom', ['angularLoad']);

/* END Bootstrap Script */

// Add Google Scholar and Worldcat search in facet pane 
app.component('prmFacetExactAfter', {
    bindings: { parentCtrl: '<' },
    controller: function controller($scope) {
        console.log($scope.$parent.$ctrl.facetGroup.name);
        if ($scope.$parent.$ctrl.facetGroup.name == "tlevel") {
            this.class = "WC_show";
        } else {
            this.class = "WC_hide";
        }
        try {
            this.query = this.parentCtrl.facetService.$location.$$search.query.split(",")[2];
        } catch (e) {
            this.query = "";
        }
    },
    template: '<div class="{{$ctrl.class}}"><div aria-label="Search in Worldcat" class="section-title md-button md-primoExplore-theme md-ink-ripple layout-fill" style="" ><div class="layout-align-start-center layout-row"><h3 class="section-title-header"><span title="External Search" translate="External Search"></span></h3></div><div class="md-ripple-container"></div></div><div aria-hidden="false" class="section-content animate-max-height-variable" style=""><div class="md-chips md-chips-wrap"><div aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4"><div class="md-chip-content layout-row" role="button" tabindex="0"><strong dir="auto" title="Search Worldcat" ><a href="https://www.worldcat.org/search?qt=worldcat_org_all&q={{$ctrl.query}}" target="_blank"><img src="custom/EDMONDS/img/worldcat.png" width="22" height="22" alt="worldcat-logo" style="vertical-align:middle;"> Search Worldcat</a></strong></div></div><div aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4"><div class="md-chip-content layout-row" role="button" tabindex="0"><strong dir="auto" title="Search Google Scholar" ><a href="https://scholar.google.com/scholar?q={{$ctrl.query}}" target="_blank"> <img src="custom/EDMONDS/img/gscholar.png" width="22" height="22" alt="google-scholar-logo" style="vertical-align:middle;"> Google Scholar</a></strong></div></div></div></div>'
});

// Add Clickable Logo
app.controller('prmLogoAfterController', [function () {
    var vm = this;
    vm.getIconLink = getIconLink;
    function getIconLink() {
        return vm.parentCtrl.iconLink;
    }
}]);

app.component('prmLogoAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmLogoAfterController',
    template: '<div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner">' + '<a href="http://www.edcc.edu/library/">' + '<img class="logo-image" alt="{{::(&apos;nui.header.LogoAlt&apos; | translate)}}" ng-src="{{$ctrl.getIconLink()}}"/></a></div>'
});
// Add chat widget to header 
app.component('prmSearchBookmarkFilterAfter', {
    bindings: {},
    template: '<div class="chat"><a ng-href="https://www.questionpoint.org/crs/servlet/org.oclc.admin.BuildForm?&page=frame&institution=13164&type=2&language=1" target="_blank" aria-label="Chat Help">Chat Help</a></div>'
});

/* Add Report Problem Banner to Full Display
app.constant('reportProblemOptions', {
    message: "Having trouble accessing a resource?",
    button: "Report a Problem",
    base: "https://library.oregonstate.edu/submit-problem?"
  });
  angular.module('reportProblem', []).component('prmActionListAfter', {
    template: '\n    <div ng-if="show" class="bar filter-bar layout-align-center-center layout-row margin-top-medium" layout="row" layout-align="center center">\n        <span class="margin-right-small">{{ message }}</span>\n        <a ng-href="{{ link }}" target="_blank">\n            <button class="button-with-icon zero-margin md-button md-button-raised md-primoExplore-theme md-ink-ripple" type="button" aria-label="Report a Problem" style="color: #5c92bd;">\n                <prm-icon icon-type="svg" svg-icon-set="primo-ui" icon-definition="open-in-new"></prm-icon>\n                <span style="text-transform: none; font-size: 16px;">{{ button }}</span>\n                <div class="md-ripple-container"></div>\n            </button>\n        </a>\n    </div>\n    ',
      controller: ['$scope', '$location', '$httpParamSerializer', 'reportProblemOptions',
        function ($scope, $location, $httpParamSerializer, reportProblemOptions) {
          $scope.message = reportProblemOptions.message
          $scope.button = reportProblemOptions.button
          $scope.show = $location.path() === '/fulldisplay' || $location.path() === '/openurl'
          $scope.link = reportProblemOptions.base + $location.url()
    }]
  });
  */
// Show search scopes by default on basic searches
app.component('prmSearchBarAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'SearchBarAfterController'
});

app.controller('SearchBarAfterController', ['angularLoad', function (angularLoad) {
    var vm = this;
    vm.parentCtrl.showTabsAndScopes = true;
}]);

/* Analytics
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'NEED NEW CODE');
  ga('send', 'pageview');
  ga('set', 'anonymizeIp', true);
  */
})();