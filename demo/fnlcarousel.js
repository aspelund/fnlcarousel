(function( $ ) {
    
    /**
     * JQuery plugin for handling "page" navigation for a carousel with pages containing
     * multiple items.
     * fnlCarousel gives navigation with pageButtons and right/left
     * 
     * Needed input is outer div, options containing pageButtonSpacing, itemsPerPage,
     * data array, templateFunction
     */
    $.fn.fnlCarousel = function(options) {
        var self = this;
        var pageButtonSpacing = options.pageButtonSpacing!=undefined?options.pageButtonSpacing:18;
        var itemsPerPage = options.itemsPerPage!=undefined?options.itemsPerPage:6;
            
        var data = options.data;
        var getItem = options.templateFunction;
        var curPageIndex = 0;    
        
        var getPageDiv = function(pageIndex){
            var newPage = $("<div></div>").addClass('container');
            for(var i=0;i<itemsPerPage && pageIndex*itemsPerPage+i<data.length;i++){
                var item = getItem(data[pageIndex*itemsPerPage + i]);
                newPage.append(item);
            }
            return newPage;
        };
        
        var setSelectedIcon = function(pageIndex){
            var icons = $(".pageButtons", self);
            $(icons).removeClass('curPage');
            $(icons[pageIndex]).addClass('curPage');
        };
        
        var gotoPage = function(pageIndex){    
          var newPage = getPageDiv(pageIndex).css({opacity:0});
          var oldPage = $(".container", self);
          $(oldPage).animate({opacity:0}, 300, function(){$(this).remove();});
          $(self).append(newPage);
          $(newPage).animate({opacity:1}, 300);
          setSelectedIcon(pageIndex);
          curPageIndex = pageIndex;
        };
                
        var getGotoPageFunction = function(c){
            return function(){
                gotoPage(c);
            };
        };
        
        var gotoRight = function(){
          var pageIndex = curPageIndex+1;
          if(pageIndex>=Math.ceil(data.length / parseFloat(itemsPerPage)))
              return;
          var page = getPageDiv(pageIndex);
          var oldPage = $(".container", self);
          var pageWidth = $(".container",self).width();
          $(page).css({left:pageWidth, opacity:1});
          $(self).append(page);
          $(oldPage).animate({left:-1*pageWidth}, 300, function(){$(this).remove();});
          $(page).animate({left:0}, 300);
          setSelectedIcon(pageIndex);
          curPageIndex = pageIndex;
        };
        
        var gotoLeft = function(){
          var pageIndex = curPageIndex-1;
          if(pageIndex<0)
              return;
          var newPage = getPageDiv(pageIndex);
          var oldPage = $(".container", self);
          var pageWidth = $(".container", self).width();
          $(newPage).css({left:-1*pageWidth, opacity:1});
          $(self).append(newPage);
          $(oldPage).animate({left:pageWidth}, 300, function(){$(this).remove();});
          $(newPage).animate({left:0}, 300);
          setSelectedIcon(pageIndex);
          curPageIndex = pageIndex;
        };
        
        var init = function(){
            var pageCount = Math.ceil(data.length / parseFloat(itemsPerPage));
            var pageButtonsIndent = $(self).width()/2 - (pageButtonSpacing*pageCount)/2;
            var curDiv = $("<div></div>").addClass('curPage').addClass('pageButtons').css({left:pageButtonsIndent});
            $(self).append(curDiv);            

            $(curDiv).click(getGotoPageFunction(0));
            for(var i=1;i<pageCount;i++){
                curDiv = $("<div></div>").addClass('pageButtons').css({left:pageButtonsIndent+i*pageButtonSpacing});        
                $(self).append(curDiv);
                $(curDiv).click(getGotoPageFunction(i));
            }
            $(self).append($('<div></div>').addClass('button').addClass('right').click(gotoRight));
            $(self).append($('<div></div>').addClass('button').addClass('left').click(gotoLeft));            
        }
        
        init();
        return self;
    };       
})(jQuery);