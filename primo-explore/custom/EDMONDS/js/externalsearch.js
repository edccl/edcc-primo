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
    "img": "https://www.oclc.org/content/dam/oclc/logos/worldcat/worldcat-logo.png",
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
  