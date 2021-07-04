//Functions to load first

    initSideMenu();

//Global variables

    var dropdownMenuFlag = false,
        scrollTopValue = 0,
        headerHeightValue = $('nav.topBar').outerHeight();

//Functions

    //Header functions

        //Open dropdownMenu
        function openDropdownMenu(){
            dropdownMenuFlag = true;
            $('.dropdownButton').removeClass('closed').addClass('opened');
            $('.dropdownWrapper').css({'z-index':'30'});
            if($('.openActionsBadge').hasClass('pulsing'))
                $('.openActionsBadge').removeClass('pulsing')
            setTimeout(function(){
                $('.dropdownContent li').each(function(count, element){
                    setTimeout(function(){
                       $(element).addClass('visibleItem').removeClass('hiddenMenuItem');
                   }, 20 * count);
                });
            }, 40);
            $('.dropdownContent').slideDown(300, function(){
                setTimeout(function(){
                    $('.dropdownContent li').removeClass('menuItemInitState');
                    dropdownMenuFlag = false;
                }, 150);
            });
        }

        //Close dropdownMenu
        function closeDropdownMenu(){
            dropdownMenuFlag = true;
            $('.dropdownButton').removeClass('opened').addClass('closed');
            $($('.dropdownContent li').get().reverse()).each(function(count, element){
                setTimeout(function(){
                   $(element).removeClass('visibleItem').addClass('hiddenItem');
               }, 50 * count);
            });
            setTimeout(function(){
                $('.dropdownContent').slideUp(300, function(){
                    setTimeout(function(){
                        $('.dropdownContent li').removeClass('hiddenItem').addClass('menuItemInitState');
                        $('.dropdownButton').removeClass('closed');
                        $('.dropdownWrapper').css({'z-index':'auto'});
                        dropdownMenuFlag = false;
                    }, 150);
                });
            }, 400);
        }

        //Initialize sideMenu
        function initSideMenu(){
            $('.sideMenuOpenButton').sidr({
                name: 'sidr-menu',
                source: '.dropdownContent',
                displace: false,
                side: 'right',
                timing: 'ease-in-out'
            });
        }

        //Checks browser time and greets user
        (function timeGreeting(){
            var date = new Date(),
                time = date.getHours(),
                greeting = 'Goedendag';

            if((time >= 6 && time < 12) || (time >= 0 && time < 6))
                greeting = 'Goedemorgen';

            if(time >= 12 && time < 18)
                greeting = 'Goedemiddag';

            if(time >= 18 && time < 24)
                greeting = 'Goedenavond';

            if(time >= 0 && time < 6)
                greeting = 'Goedemorgen';

            $('.timeGreeting, .sidr-class-timeGreeting').html(greeting);
        })();

        //Show sub menu header button
        function showSubHeaderMenuButton(){
            if($('section.myDocuments').length > 0){
                $('.rightActionButton').css({'display' : 'inline-block'});
                if($(window).width() < 770){
                    if($('.leftMenuButton:visible').length == 0){
                        $('.leftMenuButton').show();
                        $('.textWrapper').toggleClass('hasMenuButton');
                    }
                }else{
                    $('.leftMenuButton').hide();
                    $('.textWrapper').removeClass('hasMenuButton');
                    $('.leftMenu.mobile').removeClass('opened');
                }
            }
        }

        //Collapses header when scrolling down
        function collapseHeader(){
            if($('nav.bottomBar').length > 0){
                if($(window).scrollTop() >= headerHeightValue){
                    $('nav.topBar').addClass('collapseHeader')
                }else{
                    if(!$('.content > section').hasClass('paddingMobileHeader'))
                        $('nav.topBar').removeClass('collapseHeader')
                }
            }
        }

    //Footer functions

        //Fixes footer action buttons above the footer links
        function fixActionButtonsBar(){
            $('.footerActionButtons').show();
            if(!$('.footerActionButtons').hasClass('dropdown') && $('.footerActionButtons').is(':visible')){
                if(($(window).scrollTop() + $(window).height()) >= $('footer').offset().top + 61)
                    $('.footerActionButtons').removeClass('anchored');
                else
                    $('.footerActionButtons').addClass('anchored');
            }
        }

//Events

    //General events

        //Actions when scrolling window
        $(window).scroll(function(){
            var totalHeightScroll = $(document).height() - $(window).height(),
            percentageScrolling = $(window).scrollTop() * 100 / totalHeightScroll;

            $('.scrollingLinesWrapper:first-child .scrollingLines > div').css(
                {'transform': 'translate3d(0px, ' + parseInt(scrollingLinesLeft - (percentageScrolling * scrollingLinesLeft / 100) - 10) + 'px' + ', 0px)'});
            $('.scrollingLinesWrapper ~ .scrollingLinesWrapper .scrollingLines  > div').css(
                {'transform': 'translate3d(0px, ' + parseInt((percentageScrolling * scrollingLinesRight / 100) + 10) * -1 + 'px' + ', 0px)'});

            collapseHeader();
        });

        //When the user clicks on the close button, close sideMenu
        $('.sidr-class-sideMenuCloseButton').click(function(){
            ($(window).width() < 728 ? $.sidr('close', 'sidr-menu') : '');
        });

        $(window).resize(function(){
            showSubHeaderMenuButton();
        });

    //Header events

        //When the user clicks on the button,
        //toggle between hiding and showing the dropdown content
        $('.dropdownButton').click(function(event){
            (!dropdownMenuFlag ? ($('.dropdownButton').hasClass('opened') ? closeDropdownMenu() : openDropdownMenu()) : '');
        });

        //When releasing the mouse on a different element than the .informationBox
        $(document).mouseup(function(event){
            if(!$('.dropdownButton').is(event.target) && $('.dropdownButton').has(event.target).length === 0)
                (!dropdownMenuFlag ? ($('.dropdownButton').hasClass('opened') ? closeDropdownMenu() : '') : '' );
            if(!$('.informationBox').is(event.target) && $('.informationBox').has(event.target).length === 0)
                collapseInformationBox();
        });

        //Swipe on body right or left opens and closes menu
        $(document).on('touchstart', function(event){
            $(window).swipe({
                swipeRight: function(){
                    ($(window).width() < 728 ? $.sidr('close', 'sidr-menu') : '');
                },
                swipeLeft: function(){
                    (!$(event.target).hasClass('icon') ? ($(window).width() < 728 ? $.sidr('open', 'sidr-menu') : '') : '');
                },
                threshold: 60
            });
        });

        //Click on the subheader left menu button
        $('.leftMenuButton').click(function(){
            if($('html, body').scrollTop() > 0){
                $('.content > section').addClass('paddingMobileHeader');
                scrollTopValue = $('html, body').scrollTop();
                $('html, body').scrollTop(0);
            }else{
                $('.content > section').removeClass('paddingMobileHeader');
                $('html, body').scrollTop(scrollTopValue);
                scrollTopValue = 0;
            }
            $(this).toggleClass('active');
            $('.leftMenu.mobile').parent().toggleClass('leftMenuPadding');
            $('.leftMenu.mobile').toggleClass('opened');
            $('body').toggleClass('noScroll');
        });

        //Closing chat window to see that user left chat in widget third party
        $('a.logout, a.sidr-class-logout').click(function(e){
            LC_API.close_chat();
            LC_API.minimize_chat_window();
            e.preventDefault();
            window.location.href = $(this).attr('href');
        });

    //Footer events

        //Clicking on next button in footerActionButtons
        $('.footerActionButtons .button.next').click(function(){
            sectionValidator($('body').find('section:visible'));
        });

        //Clicking on next button in footerActionButtons
        $('.footerActionButtons .button.back').click(function(){
            window.location.href = '/';
        });
