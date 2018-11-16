(function(){
"use strict";
'use strict';

/* BEGIN Bootstrap Script */

var app = angular.module('viewCustom', ['angularLoad', 'externalSearch', 'ngtweet']);

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

app.component('prmAdvancedSearchAfter', {
  bindings: { parentCtrl: '<' },
  controller: function controller($scope) {
    var vm = this;

    delete vm.parentCtrl.language;
  }
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
    base: "https://docs.google.com/forms/d/e/1FAIpQLSfCFBhaHkh6kbWfP0nWXgZyjE3C4gCQ0iAZSlAz5xA9CyHjsA/viewform?usp=sf_link"
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

/**
 * ngTweet - Angular directives for better Twitter integration.
 *
 * @license
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Aru Sahni, http://arusahni.net
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
!function () {
  "use strict";
  angular.module("ngtweet", []).value("ngTweetLogVerbose", !0).value("twitterWidgetURL", "https://platform.twitter.com/widgets.js");
}(), function () {
  "use strict";
  function e(e, t) {
    var n = function n() {},
        i = function i(e) {
      return t === !0 ? e : n;
    };return { log: i(e.log), debug: i(e.debug), info: i(e.info), warn: e.warn, error: e.error };
  }e.$inject = ["$log", "ngTweetLogVerbose"], angular.module("ngtweet").factory("ngTweetLogger", e);
}(), function () {
  "use strict";
  function e(e, t) {
    function n(e, t) {
      this.timelineType = e, this.message = t;
    }function i(e, t) {
      if (!Array.isArray(e) || !Array.isArray(t)) return !0;if (e.length !== t.length) return !0;for (var n = 0, i = e.length; n < i; n++) {
        if (e[n] !== t[n]) return !0;
      }return !1;
    }function r(e) {
      function t(e) {
        return 1 === e.length ? '"' + e + '"' : '("' + e.join('" AND "') + '")';
      }return e.map(t).join(" OR ");
    }function o(e) {
      var t = { sourceType: e.sourceType };if (!l.hasOwnProperty(e.sourceType)) throw new n(e.sourceType, "unknown type");for (var i = l[e.sourceType], o = !1, u = 0, a = i.length; u < a; u++) {
        for (var c = i[u], d = {}, g = 0, s = c.length; g < s; g++) {
          angular.isDefined(e[c[g]]) && (d[c[g]] = e[c[g]]);
        }if (Object.keys(d).length === s) {
          angular.merge(t, d), o = !0;break;
        }
      }if (!o) throw new n(e.sourceType, "args: " + r(i));return t;
    }function u(n, r, u) {
      e.debug("Linking", n, r, u), n.id && !angular.isString(n.id) && e.warn("twitterTimelineId should probably be a string due to loss of precision.");try {
        n.twitterTimelineOptions = JSON.parse(u.twitterTimelineOptions);
      } catch (a) {
        n.$watch(function () {
          return n.$parent.$eval(u.twitterTimelineOptions);
        }, function (e, t) {
          n.twitterTimelineOptions = e;
        });
      }angular.isUndefined(n.twitterTimelineOptions) && (n.twitterTimelineOptions = {}), n.sourceType ? n.$watchGroup(c, function (u, a) {
        if (i(a, u) && angular.element(r[0]).empty(), u.every(function (e) {
          return !e;
        })) return void e.debug("Falsey args received. Not rendering the timeline.");var c;try {
          c = o(n);
        } catch (l) {
          return void e.error('Could not create new timeline: bad args for type "' + l.timelineType + '". Reason: ' + l.message);
        }t.createTimelineNew(c, r[0], n.twitterTimelineOptions).then(function (t) {
          e.debug("New Timeline Success!");
        })["catch"](function (t) {
          e.error("Could not create new timeline: ", t, r);
        });
      }) : angular.isDefined(n.id) || angular.isString(n.screenName) ? n.$watch("id", function (i, o) {
        null !== n.id && (void 0 !== o && i !== o && angular.element(r[0]).empty(), t.createTimeline(n.id, n.screenName, r[0], n.twitterTimelineOptions).then(function (t) {
          e.debug("Timeline Success!!!");
        })["catch"](function (t) {
          e.error("Could not create timeline: ", t, r);
        }));
      }) : t.load(r[0]);
    }var a = { id: "=?twitterTimelineId", screenName: "=?twitterTimelineScreenName", sourceType: "@?twitterTimelineType", userId: "=?twitterTimelineUserId", ownerScreenName: "=?twitterTimelineOwnerScreenName", slug: "=?twitterTimelineSlug", url: "=?twitterTimelineUrl" },
        c = Object.keys(a).reduce(function (e, t) {
      return "=" === a[t][0] && e.push(t), e;
    }, []),
        l = { profile: [["screenName"], ["userId"]], likes: [["screenName"], ["userId"]], collection: [["id"]], widget: [["id"]], list: [["id"], ["ownerScreenName", "slug"]], url: [["url"]] };return { restrict: "E", replace: !0, transclude: !0, scope: a, template: '<div class="ngtweet-wrapper" ng-transclude></div>', link: u };
  }e.$inject = ["ngTweetLogger", "TwitterWidgetFactory"], angular.module("ngtweet").directive("twitterTimeline", e);
}(), function () {
  "use strict";
  function e(e, t) {
    return { restrict: "E", replace: !0, transclude: !0, scope: { twitterWidgetId: "=", twitterWidgetOnRendered: "&", twitterWidgetOptions: "@" }, template: '<div class="ngtweet-wrapper" ng-transclude></div>', link: function link(n, i, r) {
        n.$watch("twitterWidgetId", function (o, u) {
          e.debug("Linking", i, r);var a = n.$eval(r.twitterWidgetOptions);void 0 !== u && o !== u && angular.element(i[0]).empty(), angular.isUndefined(n.twitterWidgetId) ? t.load(i[0]) : (angular.isString(n.twitterWidgetId) || e.warn("twitterWidgetId should probably be a string due to loss of precision."), t.createTweet(n.twitterWidgetId, i[0], a).then(function (t) {
            e.debug("Created tweet widget: ", n.twitterWidgetId, i), n.twitterWidgetOnRendered();
          })["catch"](function (t) {
            e.error("Could not create widget: ", t, i);
          }));
        });
      } };
  }e.$inject = ["ngTweetLogger", "TwitterWidgetFactory"], angular.module("ngtweet").directive("twitterWidget", e);
}(), function () {
  "use strict";
  function e(e, t, n, i, r, o) {
    function u() {
      o.twttr = function (e, t, n) {
        var r,
            u = e.getElementsByTagName(t)[0],
            a = o.twttr || {};if (!e.getElementById(n)) return r = e.createElement(t), r.id = n, r.src = i, u.parentNode.insertBefore(r, u), a._e = [], a.ready = function (e) {
          a._e.push(e);
        }, a;
      }(e[0], "script", "twitter-wjs");
    }function a() {
      return o.twttr && o.twttr.init;
    }function c() {
      return angular.isUndefined(f) ? (f = r.defer(), a() ? f.resolve(o.twttr) : (u(), o.twttr.ready(function (e) {
        n.debug("Twitter script ready"), e.events.bind("rendered", l), f.resolve(e);
      }), f.promise)) : f.promise;
    }function l(e) {
      n.debug("Tweet rendered", e.target.parentElement.attributes);
    }function d(e, t, i) {
      return c().then(function (o) {
        return n.debug("Creating Tweet", o, e, t, i), r.when(o.widgets.createTweet(e, t, i));
      });
    }function g(e, t, i, o) {
      return c().then(function (u) {
        return n.debug("Creating Timeline", e, t, o, i), angular.isString(t) && t.length > 0 && (o.screenName = t), r.when(u.widgets.createTimeline(e, i, o));
      });
    }function s(e, t, i) {
      return c().then(function (o) {
        return n.debug("Creating new Timeline", e, i, t), r.when(o.widgets.createTimeline(e, t, i));
      });
    }function w(e) {
      c().then(function (t) {
        n.debug("Wrapping", t, e), t.widgets.load(e);
      })["catch"](function (t) {
        n.error("Could not wrap element: ", t, e);
      });
    }var f;return { createTweet: d, createTimeline: g, createTimelineNew: s, initialize: c, load: w };
  }e.$inject = ["$document", "$http", "ngTweetLogger", "twitterWidgetURL", "$q", "$window"], angular.module("ngtweet").factory("TwitterWidgetFactory", e);
}(), function () {
  "use strict";
  function e(e, t) {
    return { restrict: "A", replace: !1, scope: !1, link: function link(n, i, r) {
        e.debug("Initializing"), t.initialize();
      } };
  }e.$inject = ["ngTweetLogger", "TwitterWidgetFactory"], angular.module("ngtweet").directive("twitterWidgetInitialize", e);
}(), function () {
  "use strict";
  function e(e) {
    e.decorator("ngTweetLogVerbose", ["$delegate", function (e) {
      return !1;
    }]);
  }e.$inject = ["$provide"], angular.module("ngtweet").config(e);
}();
// Analytics
(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments);
  }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-129269717-1');
ga('send', 'pageview');
ga('set', 'anonymizeIp', true);
})();