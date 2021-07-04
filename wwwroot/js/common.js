//Functions to load first

    addFallbackIE();

//Functions to load on document ready

    $(document).ready(function(){
        $('[data-toggle="popover"]').popover(popoverSettings);
        $('.container').removeClass('hideOnLoad');
        $('.loadingSpinner').addClass('hideSpinner');
        if($('section.productsPage').length > 0)
            $('nav.bottomBar .navTitle h2').addClass('atProducts');
    });

//Global variables

    var popoverSettings = {
            viewport: {
                selector: 'body',
                padding: 7
            },
            trigger: 'hover',
            placement: 'auto top',
            html: true,
            container: 'body',
            animation: false,
            delay: {
                show: 50,
                hide: 100
            }
        },
        scrollingLinesRight = 125,
        scrollingLinesLeft = -120,
        isClientAgent = (isClientAgent ? isClientAgent : false);

//Functions

    //General functions

        //Shows or hides the spinner
        function toggleSpinner(){
            $('.loadingSpinner').toggleClass('showSpinner hideSpinner');
        }

        //Flickering navbars fix for IE
        (function fixIEFlickeringScroll(){
            if(navigator.userAgent.match(/Trident\/7\./)) {
                $('body').on('mousewheel', function () {
                    event.preventDefault();
                    window.scrollTo(0, window.pageYOffset - event.wheelDelta);
                });
            }
        })();

        //A prototype function to capitalize any string "String".capitalize();
        String.prototype.capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        //Add SVG image without animation for Internet Explorer
        function addFallbackIE(){
            var myNav = navigator.userAgent.toLowerCase();
            if (myNav.indexOf('msie') != -1 || myNav.indexOf('trident') != -1){
                $('.alternativeIECheck').css({'display':'block'});
                $('.successCreatedSvg:not(.alternativeIECheck)').css({'display':'none'});
            }
        }

        /* Takes a value and text element as parameter and animates from 0 to value
            Parameters:
              pValueToRoll: (decimal) The max value to roll it to
              pTextElement: Text element to do the animation
              pDecimalValues: (int) The amount of decimals to have 1, 2, 3
              pCurrencyAddition: (string) String to have in front of the rolled number
              pDuration: (int) Time it takes to roll the number
              pEasing: (string) Easing name of animation
              pLastRollingValue: (decimal or int) If needed to animate from existing number to the desired one
        */
        function animateRollNumber(pValueToRoll, pTextElement, pDecimalValues, pCurrencyAddition, pDuration, pEasing, pLastRollingValue){
            var payoutFrequency = pTextElement.find('span');
            pTextElement.prop('Counter', pLastRollingValue).animate({
                Counter: pValueToRoll
            },{
                duration: pDuration,
                easing: pEasing,
                step: function(value) {
                    pTextElement.text(accounting.formatMoney(value, pCurrencyAddition, pDecimalValues, '.', ',')).append(payoutFrequency);
                }
            });
        }

        /* Scroll to a parameter dom element
           Parameters:
             pElement: The dom element to be scrolled
        */
        function scrollToElement(pElement) {
            $('html, body').stop().animate({
                scrollTop: pElement.offset().top - 215
            }, 350);
        }
