(function($){
	$.fn.timepicker = function(args){
		//définition des propriétés
		var prop = {
			set separator(val){
				this.sep = (/^:|h/i.test(val)) ? val : ':';
				},
			set model(val){
				this.mod = (val == 12 || val == 24) ? val : 24;
				},
			set class(val){
				this.cla = (val.split(' ').length) ? val : 'ui-timepicker';
				},
			
			get separator(){
				return (typeof this.sep != 'undefined') ? this.sep : ':';
				},
			get model(){
				return (typeof this.mod != 'undefined') ? this.mod : 24;
				},
			get class(){
				return (typeof this.cla != 'undefined') ? this.cla : 'ui-timepicker';
				}
			};
		
		//assignation des arguments aux propriétés
		if(typeof args != 'undefined')
			$.extend(prop, args);
		
		//initialisation des éléments
		this.each(function(i){
			$(this)
			.val('00' + prop.separator + '00')
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
			var eltsPicker = [
					//selection de l'heure
					numField('h', prop.model),
					
					//séparation
					$(document.createElement('span'))
					.text(prop.separator),
					
					//selection des minutes
					numField('m', 60)
				];
			
			//selection de AM/PM
			if(prop.model == 12){
				eltsPicker.push(
					$(document.createElement('select'))
					.append([
						$(document.createElement('option'))
						.text('AM'),
						$(document.createElement('option'))
						.text('PM')
						])
					);
				}
			
			//boutton de fermeture du picker
			eltsPicker.push(
				$(document.createElement('button'))
				.click(function(){
					$('#ui-timepicker-' + i).hide();
					})
				);
			
			//création et ajout du picker au body
			$('body').append(
				$(document.createElement('div'))
				.attr({
					id : 'ui-timepicker-' + i,
					class : prop.class
					})
				.append(eltsPicker)
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
