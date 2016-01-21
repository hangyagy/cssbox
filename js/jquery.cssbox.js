;(function($) {

	var CssBox = function(options) {
		var _self = this;

		_self.$overlay = $(document.createElement('div'));
		_self.$wrapper = $(document.createElement('div'));

		_self.$container = null;
		
		var defaults = {
			url: null,
			cls: 'cssbox',
			closeCls: 'cssbox-close',
			onClose: function() {},
			onOpen: function() {},
			overlayCls: 'cssbox-overlay',
			overlayColor: null,
			overlayOpacity: null,
			tpl: [
				'<div class="<%= cls %>">',
					'<a href="#" class="<%= closeCls %>">X</a>',
					'<div class="<%= cls %>-body">',
						'<%= content %>',
					'</div>',
				'</div>'
			]
		};

		this.options    = $.extend({}, defaults, options);

		var parseTemplate = function(tpl, data) {
			tpl = tpl.join('\n');

			for ( var name in data ) {
				var reg = new RegExp('<%= ' + name + ' %>', 'g');

				tpl = tpl.replace(reg, data[name]);
			}

			return tpl;
		};

		var getContent = function() {
			if ( _self.options.url ) {
				var promise = $.ajax({
					url: _self.options.url,
					dataType: 'html'
				});

				return promise;
			}
		};

		_self.close = function() {
			_self.$overlay.hide();
			_self.$overlay.empty();
			_self.$wrapper.hide();
			_self.$wrapper.empty();
			$('html').removeClass(_self.options.cls + '-open');
			_self.options.onClose.call(this);
		};

		_self.open = function() {

			var promise = getContent();

			promise.done(function(content) {
				var data = {
					cls: _self.options.cls,
					closeCls: _self.options.closeCls,
					content: content
				};

				var html = parseTemplate(_self.options.tpl, data);

				if ( _self.options.overlayColor ) {
					_self.$overlay.css('background-color', _self.options.overlayColor);
				}

				if ( _self.options.overlayOpacity ) {
					_self.$overlay.css('opacity', _self.options.overlayOpacity);
				}

				_self.$container = $(html);

				_self.$close = _self.$container.find('.' + _self.options.closeCls);


				_self.$wrapper.on('click', function(e) {
					if ( e.target === this ) {
						e.preventDefault();
						_self.close();
					}
				});

				_self.$close.on('click', function(e) {
					e.preventDefault();
					_self.close();
				});

				_self.$container.appendTo(_self.$wrapper);

				var topPosition = $(window).scrollTop() + 20;


				_self.$container.css('top', topPosition + 'px');
				_self.$overlay.show();
				_self.$wrapper.show();

				$('html').addClass(_self.options.cls + '-open');

				var width  = _self.$container.outerWidth();
				var height = _self.$container.outerHeight();

				_self.$container.css('margin-left', Math.floor(-width/2) + 'px');
				//_self.$container.css('margin-top', Math.floor(-height/2) + 'px');

				_self.$container.resizeSensor();

				_self.$container.on('sresize', function($e, width, height) {
					width  = _self.$container.outerWidth();
					height = _self.$container.outerHeight();
					_self.$container.css('margin-left', Math.floor(-width/2) + 'px');
					//_self.$container.css('margin-top', Math.floor(-height/2) + 'px');
				});

				$(window).on('resize', function() {
					width  = _self.$container.outerWidth();
					height = _self.$container.outerHeight();
					_self.$container.css('margin-left', Math.floor(-width/2) + 'px');
					//_self.$container.css('margin-top', Math.floor(-height/2) + 'px');
				});

				$(document).on('keyup', function(e) {
					if ( e.keyCode === 27 ) { 
						_self.close();
					}
				});

				_self.options.onOpen.call(this);

			});

			var init = function() {
				_self.$overlay.addClass(_self.options.overlayCls);
				_self.$overlay.hide();
				_self.$overlay.appendTo($('body'));

				_self.$wrapper.hide();
				_self.$wrapper.addClass(_self.options.cls + '-wrapper');
				_self.$wrapper.appendTo($('body'));
				
			};

			init();
		};

	};

	$.cssbox = function(options) {
		var cssBox = new CssBox(options);

		var plugin = {
			open: cssBox.open,
			close: cssBox.close
		};

		cssBox.$wrapper.data('cssbox', plugin);

		return plugin;
	};

	$.fn.cssbox = function(options) {
		this.each(function() {

			var href = $(this).attr('href');

			if ( href ) {
				options = $.extend({}, options);
				options.url = href;
			}

			var cssBox = $.cssbox(options);
			$(this).data('cssbox', cssBox);

			$(this).on('click', function(e) {
				e.preventDefault();
				cssBox.open();
			});

		});
	};
})(jQuery);
