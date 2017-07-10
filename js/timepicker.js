(function($){
	$.fn.timepicker = function(){
		//initialisation des éléments
		this.each(function(i){
			$(this)
			.val('00:00')
			.attr({
				'maxlength' : 5,
				'data-picker' : i
				})
			.click(function(){
				$('#ui-timepicker-' + i).show();
				});
			
			createPicker($(this), i);
			});
		
		//création du picker
		function createPicker(elt, i){
			$('body').append(
				$(document.createElement('div'))
				.attr({
					id : 'ui-timepicker-' + i,
					class : 'ui-timepicker'
					})
				.append([
					//selection de l'heure
					numField('h', 24),
					
					//séparation
					$(document.createElement('span'))
					.text(':'),
					
					//selection des minutes
					numField('m', 60),
					
					//boutton de fermeture du picker
					$(document.createElement('button'))
					.click(function(){
						$('#ui-timepicker-' + i).hide();
						})
					])
				.css({
					position : 'absolute',
					left : elt.offset().left,
					top : elt.offset().top + elt.outerHeight()
					})
				.hide()
				);
			}
		
		//céation des select du picker
		function numField(selType, maxNum){
			var optGroupElt = $(document.createElement('optgroup'));
			
			var numElt = $(document.createElement('select'))
			.addClass('picker-' + selType)
			.append(optGroupElt);
			
			for(var i = 0; i <= maxNum; i ++){
				optGroupElt.append(
					$(document.createElement('option'))
					.text(i)
					);
				}
			
			return numElt;
			}
		}
	})(jQuery)
