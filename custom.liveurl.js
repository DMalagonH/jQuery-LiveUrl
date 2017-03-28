/**
 * Extensión de plugin liveurl
 * 
 * Dependencias: jQuery, liveurl
 * 
 * @author Diego Malagón <diego@altactic.com>
 * @param {type} $ jQuery
 * @returns {undefined}
 */
(function($){
    
    var PreviewUrl = function(){
        var $elements;
        var options;
        
        var load = function(){
            var template = $(options.template).html();
            
            $elements.removeClass("preview-url");
            
            $elements.each(function(i, el){
                var $el = $(el);
                
                $el.wrap('<div class="preview-url-wrapper"></div>');
                $el.after('<div class="preview-url-container"></div>');

                var $container = $el.siblings(".preview-url-container");

                $el.processUrl({ 
                    target: $container, 
                    template: template, 
                    curImage: new Array(),
                    multipleImages: true, 
                    loadStart : function(){
                        this.target.find('.loading').show();
                    },
                    loadEnd: function(){
                        $el.remove();
                    },
                    success : function(data) { 
                        if(data.video !== null){
                            var width_cont = ((this.target.width() * 80) / 100); 
                            var ratioW = data.video.width / width_cont;
                            data.video.width  = width_cont;
                            data.video.height = data.video.height / ratioW;
                        }

                        var template = _.template(this.template);
                        this.target.html(template({ data: data }));

                        if(data.video !== null) {
                            var $desc = this.target.find('.link-description');
                            var $video = this.target.find('.link-video');

                            // add event listener
                            $(".link-image, .link-title", this.target).on("click", function(){
                                $desc.hide();
                                $video.show();
                            });
                        }

                        this.target.find('.loading').hide();
                    }, 
                    addImage : function(image) { 
                        if (this.curImages.length < 1) { 
                            var output = this.target;
                            var container = output.find('.link-image');
                            var jqImage = $(image);
                            jqImage.attr('alt', 'Preview');

                            if ((image.width / image.height)  > 7 
                            ||  (image.height / image.width)  > 4 ) {
                                // we dont want extra large images...
                                return false;
                            } 

                            this.curImages.push(jqImage.attr('src')); 
                            container.append(jqImage); 

                            // first image...
                            container.show(); 
                            output.find('.link-image > img').show(); 
                            jqImage.addClass('active'); 
                        }
                    } 
                });
            });
        };
        
        return {
            init: function(element, opts){
                $elements = $(element);
                options = opts;
                
                load();
            }
        };
    }();
    
    $.fn.previewUrl= function(options, args){        
        var element = this;
        
        if(PreviewUrl[options]){
            return PreviewUrl[options](args);
        }
        else if(typeof(options) === "object" || !options){
            
            options = $.extend({}, $.fn.previewUrl.defaults, options );
            
            return PreviewUrl.init(element, options, args);
        }
    };
    
    $.fn.previewUrl.defaults = {
        template: "#preview-url-tmpl"
    };
    
})(jQuery);


