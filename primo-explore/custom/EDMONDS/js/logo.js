// Add Clickable Logo
app.controller('prmLogoAfterController', [function () {
    var vm = this;
    vm.getIconLink = getIconLink;
    function getIconLink() {
                    return vm.parentCtrl.iconLink;
                    }
}]);
    
app.component('prmLogoAfter',{
    bindings: {parentCtrl: '<'},
    controller: 'prmLogoAfterController',
    template: '<div class="product-logo product-logo-local" layout="row" layout-align="start center" layout-fill id="banner" tabindex="0" role="banner">' +
    '<a href="http://www.edcc.edu/library/">' +
    '<img class="logo-image" alt="{{::(&apos;nui.header.LogoAlt&apos; | translate)}}" ng-src="{{$ctrl.getIconLink()}}"/></a></div>'
});