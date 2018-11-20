app.component('prmAdvancedSearchAfter', {
    bindings: { parentCtrl: '<'},
        controller: 'prmAdvancedSearchAfterController'
});

app.controller('prmAdvancedSearchAfterController', function ($scope, $http) {
    var vm = this;
    delete vm.parentCtrl.language;
        setInterval(function(){
            var scopeElement = document.getElementsByClassName('advanced-search-tabs padded-container layout-wrap layout-align-space-between-center layout-row')[0];
            if (scopeElement){
                scopeElement.addEventListener("click", function(){document.getElementsByClassName('md-primary md-primoExplore-theme md-checked')[0].click(); });
                delete vm.parentCtrl.language;
            }
        }, 1)
});     