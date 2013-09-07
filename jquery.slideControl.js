/*!
 * jquery.slideControl.js ~ v1.0 ~ Copyright (c) 2013 Boris Diakur, https://github.com/borisdiakur/jquery.slideControl.js
 * Released under WTFPL license, http://wtfpl.org/
 */
(function($, window, document) { 'use strict';
  var _methods;
  
  function _isTouchDevice() {
    return window.navigator.msMaxTouchPoints || 'ontouchstart' in document.documentElement;
  }
  
  function _preventBodyScrolling(event_) {
    event_.preventDefault();
  }
  
  function _getInfoObject($slideControl_, $slider_) {
    var
      sliderOffset = ($slider_.offset().left - $slideControl_.offset().left) + ($slider_.width() / 2),
      slideControlWidth = $slideControl_.width(),
      stepWidth = $slideControl_.data('steps') ? slideControlWidth / ($slideControl_.data('steps') - 1) : null,
      targetStep = $slideControl_.data('steps') ? Math.round(sliderOffset / stepWidth) : null,
      relativeTargetPosition = $slideControl_.data('steps') ? Math.round(stepWidth * targetStep) / slideControlWidth : sliderOffset / slideControlWidth,
      infoObject;
    
    $slideControl_.data('relativeTargetPosition', relativeTargetPosition);
    
    infoObject = {
      targetStep: $slideControl_.data('targetStep'),
      currentStep: $slideControl_.data('steps') ? $slideControl_.data('currentStep') : null,
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
      sliderOffset = (stepWidth * slideToInfoObj_.step) / slideControlWidth,
      infoObj = _getInfoObject($slideControl, $slider);
    
    $slideControl.trigger('onStart', infoObj);
    $slideControl.trigger('onChanged', infoObj);
    $slider.animate({
      'left': (sliderOffset * 100) + '%'
    }, 100, function() {
      $slideControl.trigger('onComplete', _getInfoObject($slideControl, $slider));
    });
  }
  
  function _slideToRelativePosition(slideToInfoObj_) {
    var
      $slideControl = slideToInfoObj_.slideControl,
      $slider = $slideControl.find('.slider'),
      slideControlWidth = $slideControl.width(),
      infoObj = _getInfoObject($slideControl, $slider);
    
    $slideControl.trigger('onStart', infoObj);
    $slideControl.trigger('onChanged', infoObj);
    $slider.animate({
      'left': (slideToInfoObj_.relativePosition * 100) + '%'
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
    $slideControl.data('targetStep', settings_.currentStep);
    $slideControl.data('relativePosition', settings_.currentRelativePosition);
      
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
      if (settings_.steps) {
        settings_.onTargetSnapPositionChanged(arg_);
      }
    });
    $slideControl.on('onComplete', function(event_, arg_) {
      settings_.onComplete(arg_);
    });
    
    if (settings_.steps && !isNaN(settings_.currentStep)) {
      $slider.css('left', relativeTargetPosition * 100 + '%');
    } else if (!isNaN(settings_.currentRelativePosition)) {
      $slider.css('left', settings_.currentRelativePosition * 100 + '%');
    }
    
    $slider.on('click', function(event_) {
      event_.preventDefault();
      event_.stopImmediatePropagation();
    }).on('mousedown touchstart', function() {
      if (_isTouchDevice()) {
        $('body').css('overflow', 'hidden').on('touchmove', _preventBodyScrolling);
      }
      $slideControl.addClass('dragable');
      $slider.addClass('dragable');
      $('html, body').css('cursor', 'ew-resize');
      
      $slideControl.trigger('onStart', _getInfoObject($slideControl, $slider));
    }).on('dragstart', function(event_) {
      event_.preventDefault();
    });
    
    $slideControl.on('click', function(event_) {
      event_.preventDefault();
      event_.stopImmediatePropagation();

      var
        pageX = (event_.originalEvent && event_.originalEvent.touches && event_.originalEvent.touches[0].pageX) ? event_.originalEvent.touches[0].pageX : event_.pageX,
        slideControlHorizontalPadding = parseFloat($slideControl.css('padding-left')) + parseFloat($slideControl.css('padding-right')),
        relativePosition = Math.max(0, Math.min((pageX - $slideControl.offset().left) / ($slideControl.width()), 1)),
        infoObj;
      
      $slider.css('left', relativePosition * 100 + '%');
      if (relativePosition !== $slideControl.data('relativePosition')) {
        $slideControl.data('relativePosition', relativePosition);
      }
      
      infoObj = _getInfoObject($slideControl, $slider);
      $slideControl.trigger('onStart', infoObj);
      $slideControl.trigger('onChanged', infoObj);
      
      _snapIntoStep($slideControl, $slider);
    });
    
    $(document).on('mousemove touchmove', function(event_) {
      if ($slider.hasClass('dragable')) {
        
        if (_isTouchDevice() && String(event_.originalEvent).indexOf('MouseEvent') >= 0) {
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
        } else {
          $slideControl.trigger('onComplete', _getInfoObject($slideControl, $slider));
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
        currentRelativePosition : 0,
        steps : undefined,
        currentStep : 0,
        onStart : function() {},
        onChanged : function() {},
        onTargetSnapPositionChanged : function() {},
        onComplete : function() {}
      }, options_);
      
      settings.currentStep += 1;
      
      return this.each(function() {
        _initialize(this, settings);
      });
    },
    
    slideToStep : function(index_) {
      _slideToStep({step: index_, steps: this.data('steps'), slideControl: this});
    },
    
    slideToRelativePosition : function(relativePosition_) {
      _slideToRelativePosition({relativePosition: relativePosition_, slideControl: this});
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