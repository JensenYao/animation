jQuery(function ($) {
	var G = {
		active: false,
		/*
		 * 使用适当的选项调用SimpleModal
		 */
		init: function () {
			G.images = $('.flickr_badge_image a');
			G.images.click(function () {
				G.current_idx = G.images.index(this);
				console.log(G);
				$(G.create()).modal({
					closeHTML: '',
					overlayId: 'gallery-overlay',
					containerId: 'gallery-container',
					containerCss: {left:0, width:'100%'},
					opacity: 80,
					position: ['10%', null],
					onOpen: G.open,
					onClose: G.close
				});

				return false;
			});
		},
		/*
		 * 为查看器创建HTML
		 */
		create: function () {
			return $("<div id='gallery'> \
					<div id='gallery-image-container'> \
						<div id='gallery-controls'> \
							<div id='gallery-previous'> \
								<a href='#' id='gallery-previous-link'>上一张</a> \
							</div> \
							<div id='gallery-next'> \
								<a href='#' id='gallery-next-link'>下一张</a> \
							</div> \
						</div> \
					</div> \
					<div id='gallery-meta-container'> \
					<div id='gallery-meta'> \
						<div id='gallery-close'><a href='#' class='simplemodal-close'>X</a></div> \
					</div> \
				</div> \
				</div>");
		},
		/*
		 *  SimpleModal回调来创建
		 *  查看器并使用动画打开它
		 */
		open: function (d) {
			G.container = d.container[0];
			G.gallery = $('#gallery', G.container);
			G.image_container = $('#gallery-image-container', G.container);
			G.controls = $('#gallery-controls', G.container);
			G.next = $('#gallery-next-link', G.container);
			G.previous = $('#gallery-previous-link', G.container);
			G.meta_container = $('#gallery-meta-container', G.container);
			G.meta = $('#gallery-meta', G.container);
			G.title = $('#gallery-title', G.container);
			G.pages = $('#gallery-pages', G.container);

			d.overlay.slideDown(300, function () {
				d.container
					.css({height:0})
					.show(function () {
						d.data.slideDown(300, function () {
							// load the first image
							G.display();
						});
					});
			});
		},
		/*
		 * SimpleModal回调来关闭
		 * 
		 */
		close: function (d) {
			var self = this;
			G.meta.slideUp(function () {
				G.image_container.fadeOut('fast', function () {
					d.data.slideUp(500, function () {
						d.container.fadeOut(500, function () {
							d.overlay.slideUp(500, function () {
								self.close(); // or $.modal.close();	
							});
						});
					});
					G.unbind();
				});
			});
		},
		/*
		 * 显示前一个/下一个映像
		 */
		browse: function (link) {
			G.current_idx = $(link).parent().is('#gallery-next') ? (G.current_idx + 1) : (G.current_idx - 1);
			G.display();
		},
		/* 显示所请求的图像，并将容器的高度/宽度进行动画化*/
		display: function () {
			G.controls.hide();
			G.meta.slideUp(300, function () {
				G.meta_container.hide();
				G.image_container.fadeOut('fast', function () {
					$('#gallery-image', G.container).remove();

					var img = new Image();
					img.onload = function () {
						G.load(img);
					};
					img.src = G.images.eq(G.current_idx).find('img').attr('src').replace(/_(s|t|m)\.jpg$/, '.jpg');

					if (G.current_idx !== 0) {
						// pre-load prev img
						var p = new Image();
						p.src = G.images.eq(G.current_idx - 1).find('img').attr('src').replace(/_(s|t|m)\.jpg$/, '.jpg');
					}
					if (G.current_idx !== (G.images.length - 1)) {
						// pre-load next img
						var n = new Image();
						n.src = G.images.eq(G.current_idx + 1).find('img').attr('src').replace(/_(s|t|m)\.jpg$/, '.jpg');
					}
				});
			});
		},
		load: function (img) {
			var i = $(img);
			i.attr('id', 'gallery-image').hide().appendTo('body');
			var h = i.outerHeight(true),
				w = i.outerWidth(true);

			if (G.gallery.height() !== h || G.gallery.width() !== w) {
				G.gallery.animate(
					{height: h},
					300,
					function () {
						G.gallery.animate(
							{width: w},
							300,
							function () {
								G.show(i);
							}
						);
					}
				);
			}
			else {
				G.show(i);
			}
		},
		/* 
		 * 显示图像，然后控制和元数据
		 */
		show: function (img) {
			img.show();
			G.image_container.prepend(img).fadeIn('slow', function () {
				G.showControls();
				G.showMeta();
			});
		},
		/*
		 * 显示图像控制;前一个和后一个
		 */
		showControls: function () {
			G.next.hide().removeClass('disabled');
			G.previous.hide().removeClass('disabled');
			G.unbind();
			if (G.current_idx === 0) {
				G.previous.addClass('disabled');
			}
			if (G.current_idx === (G.images.length - 1)) {
				G.next.addClass('disabled');
			}
			G.controls.show();

			$('a', G.controls[0]).bind('click.gallery', function () {
				G.browse(this);
				return false;
			});
			$(document).bind('keydown.gallery', function (e) {
				if (!G.active) {
					if ((e.keyCode === 37 || e.keyCode === 80) && G.current_idx !== 0) {
						G.active = true;
						G.previous.trigger('click.gallery');
					}
					else if ((e.keyCode === 39 || e.keyCode === 78) && G.current_idx !== (G.images.length - 1)) {
						G.active = true;
						G.next.trigger('click.gallery');
					}
				}
			});
			$('div', G.controls[0]).hover(
				function () {
					var self = this,
						l = $(self).find('a:not(.disabled)');
					if (l.length > 0) {
						l.show();
					}
				},
				function () {
					$(this).find('a').hide();
				}
			);
		},
		/*
		 * 显示图像元;标题，x的图像x和关闭的x
		 */
		showMeta: function () {
			var link = G.images.eq(G.current_idx).clone(),
				title = link.find('img').attr('title');

			G.title.html(link.attr('title', 'View on Flickr').html(title));
			G.pages.html('Image ' + (G.current_idx + 1) + ' of ' + G.images.length);
			G.meta_container.show()
			G.meta.slideDown(function () {
				G.active = false;	
			});
		},
		/*
		 * 解开画廊控制事件
		 */
		unbind: function () {
			$('a', G.controls[0]).unbind('click.gallery');
			$(document).unbind('keydown.gallery');
			$('div', G.controls[0]).unbind('mouseenter mouseleave');
		}
	};

	G.init();
	
});