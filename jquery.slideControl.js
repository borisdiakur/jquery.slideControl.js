/*!
 * jquery.slideControl.js ~ v1.0 ~ Copyright (c) 2013 Boris Diakur, https://github.com/borisdiakur/jquery.slideControl.js
 * Released under WTFPL license, http://wtfpl.org/
 */
(function($, window, document) { 'use strict';
  var _methods;
  
  function _isTouchDevice() {
    return window.hasOwnProperty('ontouchstart') || window.hasOwnProperty('onmsgesturechange');
  }
  
  function _preventBodyScrolling(event_) {
    event_.preventDefault();
  }
  
  function _getInfoObject($slideControl_, $slider_) {
    var
      sliderOffset = ($slider_.offset().left - $slideControl_.offset().left) + ($slider_.width() / 2),
      slideControlWidth = $slideControl_.width(),
      stepWidth = slideControlWidth / ($slideControl_.data('steps') - 1),
      targetStep = Math.round(sliderOffset / stepWidth),
      relativeTargetPosition = Math.round(stepWidth * targetStep) / slideControlWidth,
      infoObject;
    
    $slideControl_.data('relativeTargetPosition', relativeTargetPosition);
    
    infoObject = {
      targetStep: $slideControl_.data('targetStep'),
      currentStep: $slideControl_.data('currentStep'),
      relativePosition: $slideControl_.data('relativePosition'),
      relativeTargetPosition: relativeTargetPosition
    };
    
    if (targetStep !== $slideControl_.data('targetStep')) {
      $slideControl_.data('targetStep', targetStep);
      infoObject.targetStep = targetStep;
      $slideControl_.trigger('onTargetSnapPositionChanged', infoObject);
    }
    
    return infoObject;
  }
  
  function _slideToStep(slideToInfoObj_) {
    var
      $slideControl = slideToInfoObj_.slideControl,
      $slider = $slideControl.find('.slider'),
      slideControlWidth = $slideControl.width(),
      stepWidth = slideControlWidth / (slideToInfoObj_.steps - 1),
      sliderOffset = (stepWidth * slideToInfoObj_.step) / $slideControl.width();
    
    $slideControl.trigger('onStart', _getInfoObject($slideControl, $slider));
    $slider.animate({
      'left': (sliderOffset * 100) + '%'
    }, 100, function() {
      $slideControl.trigger('onComplete', _getInfoObject($slideControl, $slider));
    });
  }
  
  function _snapIntoStep($slideControl_, $slider_) {
    var infoObj = _getInfoObject($slideControl_, $slider_);
    
    if (infoObj.targetStep !== $slideControl_.data('currentStep')) {
      $slideControl_.data('currentStep', infoObj.targetStep);
      infoObj.currentStep = infoObj.targetStep;
      $slideControl_.data('relativePosition', infoObj.relativeTargetPosition);
    }
    
    $slider_.animate({
        'left': (infoObj.relativeTargetPosition * 100) + '%'
    }, 100, function() {
      $slideControl_.trigger('onComplete', infoObj);
    });
  }
  
  function _initialize(context_, settings_) {
    var
      $slideControl = $(context_),
      $slider = $slideControl.find('.slider'),
      slideControlWidth = $slideControl.width(),
      stepWidth = slideControlWidth / (settings_.steps - 1),
      relativeTargetPosition = stepWidth * (settings_.currentStep - 1) / slideControlWidth;
    
    $slideControl.data('steps', settings_.steps);
    $slideControl.data('currentStep', settings_.currentStep);
      
    $slider.css({
      'margin-left': $slider.width() / -2,
      'top': ($slideControl.height() / 2) - ($slider.height() / 2) 
    });
    
    $slideControl.on('onStart', function(event_, arg_) {
      settings_.onStart(arg_);
    });
    $slideControl.on('onChanged', function(event_, arg_) {
      settings_.onChanged(arg_);
    });
    $slideControl.on('onTargetSnapPositionChanged', function(event_, arg_) {
      settings_.onTargetSnapPositionChanged(arg_);
    });
    $slideControl.on('onComplete', function(event_, arg_) {
      settings_.onComplete(arg_);
    });
    
    if (settings_.steps && !isNaN(settings_.currentStep)) {
      $slider.css('left', relativeTargetPosition * 100 + '%');
    }
    
    $slider.on('click', function(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }).on('mousedown touchstart', function() {
      if (_isTouchDevice()) {
        $('body').css('overflow', 'hidden').on('touchmove', _preventBodyScrolling);
      }
      $slideControl.addClass('dragable');
      $slider.addClass('dragable');
      $('html, body').css('cursor', 'ew-resize');
      $slideControl.trigger('onStart', _getInfoObject($slideControl, $slider));
    }).on('dragstart', function(event) {
      event.preventDefault();
    });
    
    $slideControl.on('click', function(event_) {
      var
        pageX = (event_.originalEvent && event_.originalEvent.touches && event_.originalEvent.touches[0].pageX) ? event_.originalEvent.touches[0].pageX : event_.pageX,
        relativePosition = Math.max(0, Math.min((pageX - $slideControl.offset().left) / $slideControl.width(), 1));
      
      $slider.css('left', relativePosition * 100 + '%');
      if (relativePosition !== $slideControl.data('relativePosition')) {
        $slideControl.data('relativePosition', relativePosition);
      }
      $slideControl.trigger('onChanged', _getInfoObject($slideControl, $slider));
      
      _snapIntoStep($slideControl, $slider);
    });
    
    $(window).on('mousemove touchmove', function(event_) {
      if ($slider.hasClass('dragable')) {
        
        if (_isTouchDevice() && String(event.originalEvent).indexOf('MouseEvent') >= 0) {
          return;
        }
          
        var
          pageX = (event_.originalEvent && event_.originalEvent.touches && event_.originalEvent.touches[0].pageX) ? event_.originalEvent.touches[0].pageX : event_.pageX,
          relativePosition = Math.max(0, Math.min((pageX - $slideControl.offset().left) / $slideControl.width(), 1));
        
        $slider.css('left', relativePosition * 100 + '%');
        if (relativePosition !== $slideControl.data('relativePosition')) {
          $slideControl.data('relativePosition', relativePosition);
        }
        $slideControl.trigger('onChanged', _getInfoObject($slideControl, $slider));
      }
    }).on('mouseup touchend touchcancel', function(event_) {
      $('body').css('overflow', '').off('touchmove', _preventBodyScrolling);
      if ($slider.hasClass('dragable')) {
        if (!isNaN(parseInt($slideControl.data('steps'), 10))) {
          _snapIntoStep($slideControl, $slider);
        }
        $slideControl.removeClass('dragable');
        $slider.removeClass('dragable');
        $('html, body').css('cursor', '');
      }
    });
  }
  
  _methods = {
    
    init : function(options_) {
      var settings = $.extend({
        steps : undefined,
        currentStep : (options_ && !isNaN(options_.currentStep) ? options_.currentStep : (options_ && !isNaN(options_.steps) ? (options_.steps + 1) / 2 : undefined)),
        onStart : function() {},
        onChanged : function() {},
        onTargetSnapPositionChanged : function() {},
        onComplete : function() {}
      }, options_);
      
      return this.each(function() {
        _initialize(this, settings);
      });
    },
    
    slideToStep : function(index_) {
      _slideToStep({step: index_, steps: this.data('steps'), slideControl: this});
    }
  };
  
  $.fn.slideControl = function(method_) {
    if (_methods[method_]) {
      return _methods[method_].apply(this, Array.prototype.slice.call(arguments, 1));
    } 
    if (typeof method_ === "object" || !method_) {
      return _methods.init.apply(this, arguments);
    }
  };
  
}(jQuery, window, document));