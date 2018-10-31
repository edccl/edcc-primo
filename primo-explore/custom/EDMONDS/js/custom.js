(function(){
"use strict";
'use strict';

/* BEGIN Bootstrap Script */

var app = angular.module('viewCustom', ['angularLoad', 'externalSearch']);

/* END Bootstrap Script */

// Add Google Scholar and Worldcat search in facet pane 

angular.module('externalSearch', []).value('searchTargets', []).component('prmFacetAfter', {
  bindings: { parentCtrl: '<' },
  controller: ['externalSearchService', function (externalSearchService) {
    externalSearchService.controller = this.parentCtrl;
    externalSearchService.addExtSearch();
  }]
}).component('prmPageNavMenuAfter', {
  controller: ['externalSearchService', function (externalSearchService) {
    if (externalSearchService.controller) externalSearchService.addExtSearch();
  }]
}).component('prmFacetExactAfter', {
  bindings: { parentCtrl: '<' },
  template: '\n      <div ng-if="name === \'External Search\'">\n          <div ng-hide="$ctrl.parentCtrl.facetGroup.facetGroupCollapsed">\n              <div class="section-content animate-max-height-variable">\n                  <div class="md-chips md-chips-wrap">\n                      <div ng-repeat="target in targets" aria-live="polite" class="md-chip animate-opacity-and-scale facet-element-marker-local4">\n                          <div class="md-chip-content layout-row" role="button" tabindex="0">\n                              <strong dir="auto" title="{{ target.name }}">\n                                  <a ng-href="{{ target.url + target.mapping(queries, filters) }}" target="_blank">\n                                      <img ng-src="{{ target.img }}" width="22" height="22" alt="{{ target.alt }}" style="vertical-align:middle;"> {{ target.name }}\n                                  </a>\n                              </strong>\n                          </div>\n                      </div>\n                  </div>\n              </div>\n          </div>\n      </div>',
  controller: ['$scope', '$location', 'searchTargets', function ($scope, $location, searchTargets) {
    $scope.name = this.parentCtrl.facetGroup.name;
    $scope.targets = searchTargets;
    var query = $location.search().query;
    var filter = $location.search().pfilter;
    $scope.queries = Array.isArray(query) ? query : query ? [query] : false;
    $scope.filters = Array.isArray(filter) ? filter : filter ? [filter] : false;
  }]
}).factory('externalSearchService', function () {
  return {
    get controller() {
      return this.prmFacetCtrl || false;
    },
    set controller(controller) {
      this.prmFacetCtrl = controller;
    },
    addExtSearch: function addExtSearch() {
      var xx = this;
      var checkExist = setInterval(function () {

        if (xx.prmFacetCtrl.facetService.results[0] && xx.prmFacetCtrl.facetService.results[0].name != "External Search") {
          if (xx.prmFacetCtrl.facetService.results.name !== 'External Search') {
            xx.prmFacetCtrl.facetService.results.unshift({
              name: 'External Search',
              displayedType: 'exact',
              limitCount: 0,
              facetGroupCollapsed: false,
              values: undefined
            });
          }
          clearInterval(checkExist);
        }
      }, 100);
    }
  };
});
app.value('searchTargets', [{
  "name": "Worldcat",
  "url": "https://www.worldcat.org/search?",
  "img": "custom/EDMONDS/img/worldcat.png",
  "alt": "Worldcat Logo",
  mapping: function mapping(queries, filters) {
    var query_mappings = {
      'any': 'kw',
      'title': 'ti',
      'creator': 'au',
      'subject': 'su',
      'isbn': 'bn',
      'issn': 'n2'
    };
    try {
      return 'q=' + queries.map(function (part) {
        var terms = part.split(',');
        var type = query_mappings[terms[0]] || 'kw';
        var string = terms[2] || '';
        var join = terms[3] || '';
        return type + ':' + string + ' ' + join + ' ';
      }).join('');
    } catch (e) {
      return '';
    }
  }
}, {
  "name": "Google Scholar",
  "url": "https://scholar.google.com/scholar?q=",
  "img": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png",
  "alt": "Google Scholar Logo",
  mapping: function mapping(queries, filters) {
    try {
      return queries.map(function (part) {
        return part.split(",")[2] || "";
      }).join(' ');
    } catch (e) {
      return '';
    }
  }
}]);
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