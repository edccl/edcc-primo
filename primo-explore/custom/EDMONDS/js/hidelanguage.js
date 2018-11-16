app.component('prmAdvancedSearchAfter', {
    bindings: { parentCtrl: '<'},
               controller: function($scope){
                    var vm = this;
               
        delete vm.parentCtrl.language;
               
               }
});