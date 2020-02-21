/* global $ */
/* eslint-env jquery */
$('document').ready(function() {

    
    /* nav bar */
    $('.js--nav-icon').click(function() {
        var nav = $('.js--nav-list');
        var icon = $('.js--nav-icon i');
        nav.slideToggle(200);

        if (icon.hasClass('ion-md-menu')){
            icon.addClass('ion-md-close');
            icon.removeClass('ion-md-menu')
        } else {
            icon.addClass('ion-md-menu')
            icon.removeClass('ion-md-close')
        }
    
    })
    
});

