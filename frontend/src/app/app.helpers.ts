/*
 * Inspinia js helpers:
 *
 * correctHeight() - fix the height of main wrapper
 * detectBody() - detect windows size
 * smoothlyMenu() - add smooth fade in/out on navigation show/ide
 *
 */

declare var jQuery:any;
declare var $:any;
declare var WOW:any;

export function landing() {
  $(document).ready(function () {

    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 80
    });

    // Page scrolling feature
    $('a.page-scroll').bind('click', function(event) {
        var link = $(this);
        $('html, body').stop().animate({
            scrollTop: $(link.attr('href')).offset().top - 50
        }, 500);
        event.preventDefault();
        $("#navbar").collapse('hide');
    });
});

var cbpAnimatedHeader = (function() {
    var docElem = document.documentElement,
            header = document.querySelector( '.navbar-default' ),
            didScroll = false,
            changeHeaderOn = 200;
    function init() {
        window.addEventListener( 'scroll', function( event ) {
            if( !didScroll ) {
                didScroll = true;
                setTimeout( scrollPage, 250 );
            }
        }, false );
    }
    function scrollPage() {
        var sy = scrollY();
        if ( sy >= changeHeaderOn ) {
            $(header).addClass('navbar-scroll')
        }
        else {
            $(header).removeClass('navbar-scroll')
        }
        didScroll = false;
    }
    function scrollY() {
        return window.pageYOffset || docElem.scrollTop;
    }
    init();

})();

// Activate WOW.js plugin for animation on scrol
new WOW().init();

}


export function correctHeight() {

  var pageWrapper = jQuery('#page-wrapper');
  var navbarHeight = jQuery('nav.navbar-default').height();
  var wrapperHeight = pageWrapper.height();

  if (navbarHeight > wrapperHeight) {
    pageWrapper.css("min-height", navbarHeight + "px");
  }

  if (navbarHeight <= wrapperHeight) {
    if (navbarHeight < jQuery(window).height()) {
      pageWrapper.css("min-height", jQuery(window).height() + "px");
    } else {
      pageWrapper.css("min-height", navbarHeight + "px");
    }
  }

  if (jQuery('body').hasClass('fixed-nav')) {
    if (navbarHeight > wrapperHeight) {
      pageWrapper.css("min-height", navbarHeight + "px");
    } else {
      pageWrapper.css("min-height", jQuery(window).height() - 60 + "px");
    }
  }
}

export function detectBody() {
  if (jQuery(document).width() < 769) {
    jQuery('body').addClass('body-small')
  } else {
    jQuery('body').removeClass('body-small')
  }
}

export function smoothlyMenu() {
  if (!jQuery('body').hasClass('mini-navbar') || jQuery('body').hasClass('body-small')) {
    // Hide menu in order to smoothly turn on when maximize menu
    jQuery('#side-menu').hide();
    // For smoothly turn on menu
    setTimeout(
      function () {
        jQuery('#side-menu').fadeIn(400);
      }, 200);
  } else if (jQuery('body').hasClass('fixed-sidebar')) {
    jQuery('#side-menu').hide();
    setTimeout(
      function () {
        jQuery('#side-menu').fadeIn(400);
      }, 100);
  } else {
    // Remove all inline style from jquery fadeIn function to reset menu state
    jQuery('#side-menu').removeAttr('style');
  }
}

export function dataTableConfig() {
  jQuery(document).ready(function() {
    jQuery('.dataTables').DataTable({
      pageLength: 25,
      responsive: true,
      dom: '<"html5buttons"B>lTfgitp',
      buttons: [
          { extend: 'copy'},
          {extend: 'csv'},
          {extend: 'excel', title: 'excel_file'},
          {extend: 'pdf', title: 'PDF'},

          {extend: 'print',
            customize: function (win){
              jQuery(win.document.body).addClass('white-bg');
              jQuery(win.document.body).css('font-size', '10px');

              jQuery(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
            }
          }
        ]
    });
  });
}

export function dataPlayersTable(cb) {
  jQuery.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
      var team_name = jQuery('#team_filter').val();
        if(team_name && team_name != '') {
          if(data[4] == team_name)
            return true;
          else
            return false;
        }
        else
          return true;
    }
  );
  jQuery.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
      var position_code = jQuery('#position_filter').val();
        if(position_code && position_code != '') {
          if(data[2] == position_code)
            return true;
          else
            return false;
        }
        else
          return true;
    }
  );
  jQuery.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
      var status_name = jQuery('#status_filter').val();
        if(status_name && status_name != '') {
          if(data[3] == status_name)
            return true;
          else
            return false;
        }
        else
          return true;
    }
  );
  jQuery.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
      var min_price = jQuery('#min_price').val();
      var max_price = jQuery('#max_price').val();
      var value = data[5];
      if(min_price != '' && max_price != '' && min_price > -1 && max_price > -1) {
        
        if(parseInt(value) >= parseInt(min_price) && parseInt(value) <= parseInt(max_price))
          return true;
        else
          return false;
      }
      else
        return true;
    }
  );
  jQuery(document).ready(function() {
    var table = jQuery('.dataTables').DataTable({
      pageLength: 10,
      responsive: true,
      // lengthMenu: [ 10, 25, 50, 75, 100 ],
      // buttons: []
    })
    jQuery("div.DataTables_Table_0_filter").html("");

    jQuery("#team_filter").change(function(){
      table.draw();
    });

    jQuery("#position_filter").change(function(){
      table.draw();
    });

    jQuery("#status_filter").change(function(){
      table.draw();
    });

    cb(table)
  });
}

export function datepicker() {
  jQuery('.input-group.date').datepicker({
    todayBtn: "linked",
    keyboardNavigation: false,
    forceParse: false,
    calendarWeeks: true,
    autoclose: true,
    format: "yyyy-mm-dd"
  });
}

export function dateOfBirthPicker() {
  jQuery('.input-group.date').datepicker({
    keyboardNavigation: false,
    forceParse: false,
    startView: 2,
    autoclose: true,
    format: "yyyy-mm-dd"
  });
}

export function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function tagsinput() {
  jQuery('.tagsinput').tagsinput({
      tagClass: 'label label-primary'
  });
}

export function summernote(attr, cb) {
  jQuery(document).ready(function(){  
    jQuery(attr).summernote({
      callbacks: {
        onChange: function(contents, $editable) {
          cb(contents);
        }
      }
    });  
  });
}

export function summernoteEdit(attr, node, cb) {
  jQuery(document).ready(function(){  
    jQuery(attr).summernote({
      callbacks: {
        onChange: function(contents, $editable) {
          cb(contents);
        }
      }
    }); 
    jQuery(attr).summernote('code', node);
  });
}

export function bootstrapDualListbox() {
  jQuery(document).ready(function(){  
    jQuery('.dual_select').bootstrapDualListbox({
      selectorMinimalHeight: 300,
      nonSelectedListLabel: 'Non-selected',
      selectedListLabel: 'Selected',
      preserveSelectionOnMove: 'moved',
      moveOnSelect: true,
    });
  });
}


// User dashboard

export function breakingNewsSlickSlider() {
  jQuery( document ).ready(function() {
    jQuery('.breaking-news-slick').slick({
        autoplay:true,
        autoplaySpeed:5000,
        dots: false
    });
  });
}

export function homeFixturesSlickSlider() {
  jQuery('.home-fixtures-slick').slick({
    dots: false
  });
}

export function fixturesSlickSlider() {
  jQuery( document ).ready(function() {
    jQuery('.fixtures-slick').slick({
      dots: false
    });
  });
}

export function rangeSlider(element, max_value) {
  jQuery(element).ionRangeSlider({
    min: 0,
    max: max_value / 1000000,
    type: 'double',
    prefix: "€",
    maxPostfix: "+",
    prettify: false,
    hasGrid: true,
    onChange: function (data) {
      console.log("onChange");
    },
  });
}

export function initTshirts(maxwidth, color_main, color_sleeves) {
  return `<svg viewBox="0 0 58 80" style="background-color:#ffffff00; max-width:${maxwidth}px; width:100%"; version="1.1"
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve">
    <g>
      <g>
        <path d="M 20.7449 1.3242 C 20.7449 1.3242 38.9521 -0.3522 41.6339 3.4431 C 44.3154 7.2386 38.58 8.5026 36.1763 8.4494 C 33.7726 8.3962 21.3565 2.3954 20.7449 1.3242 Z" fill="#666666"/>
        <path d="M 41.3003 2.5718 C 41.3003 2.5718 40.6973 -0.606 20.0602 0.1032 L 20.0602 1.5019 C 20.0602 1.5019 38.0706 0.387 41.3047 3.8487 C 41.3047 3.8487 42.1322 3.8484 41.3003 2.5718 Z" fill="${color_sleeves}"/>
        <path d="M 54.9167 12.1432 C 54.9167 12.1432 58.4046 21.4346 57.961 27.4619 C 57.961 27.4619 56.6288 29.8478 51.8088 30.3499 C 51.8088 30.3499 53.4579 14.2779 54.9167 12.1432 Z" fill="${color_sleeves}"/>
        <path d="M 57.961 27.4619 C 57.961 27.4619 58.0201 28.6201 57.8164 30.0737 C 57.8164 30.0737 55.6699 32.3328 51.5577 32.3998 L 51.8088 30.3499 C 51.8088 30.3499 55.9813 29.5023 57.961 27.4619 Z" fill="${color_main}"/>
        <path d="M 42.3968 3.5468 C 42.3968 3.5468 46.4651 6.3153 50.0248 7.322 C 53.5842 8.3287 54.9167 12.1432 54.9167 12.1432 C 54.9167 12.1432 50.1598 40.0098 49.8151 46.7264 C 49.4698 53.4431 49.7 74.1623 49.7 74.1623 C 49.7 74.1623 31.2991 84.8631 10.3687 73.3653 C 10.3687 73.3653 11.1735 65.5103 11.9786 60.7289 C 12.7838 55.9475 7.2322 12.552 9.1454 9.6033 C 11.0587 6.6545 16.8088 4.4478 19.2238 0.9406 C 19.2238 0.9406 39.1187 14.8969 42.3968 3.5468 Z" fill="${color_main}"/>
        <path d="M 9.1454 9.6033 C 5.972 10.8063 2.2581 15.6742 0.2327 32.2892 C 0.2327 32.2892 8.4032 35.2689 14.6147 34.133 C 14.6147 34.133 20.6919 18.8937 15.6274 13.4798 C 12.1838 9.0017 9.1454 9.6033 9.1454 9.6033 Z" fill="${color_sleeves}"/>
        <path d="M 0 33.614 C 0 33.614 5.6369 33.621 7.2069 34.4649 C 8.777 35.309 14.1547 35.2856 14.1547 35.2856 L 14.6147 34.133 C 14.6147 34.133 9.7015 34.1564 7.4198 33.2256 C 5.1378 32.295 0.2327 32.3199 0.2327 32.3199 L 0 33.614 Z" fill="${color_main}"/>
        <path d="M 41.3003 2.5718 L 42.5256 3.6325 C 42.5256 3.6325 43.2493 8.8141 36.8 8.8141 C 30.3504 8.8141 18.9534 1.3098 18.9534 1.3098 L 20.0602 0.1032 C 20.0602 0.1032 31.0435 8.2147 37.554 6.947 C 42.6494 5.9546 41.0991 2.9121 41.3003 2.5718 Z" fill="${color_sleeves}"/>
        <path d="M 30.3817 78.0852 C 44.75 78.0852 49.8678 73.6801 49.8678 73.6801 L 49.8678 75.5949 C 49.8678 75.5949 45.9037 80 30.3817 80 C 14.86 80 10.2828 75.1173 10.2828 75.1173 L 10.2828 73.2024 C 10.2828 73.2024 16.0134 78.0852 30.3817 78.0852 Z" fill="${color_sleeves}"/>
      </g>
    </g>
  </svg>`

}

export function openModal(id_element) {
  jQuery(`#${id_element}`).modal('show');
}

export function closeModal(id_element) {
  jQuery(`#${id_element}`).modal('hide');
}