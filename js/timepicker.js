(function($){
	$.fn.timepicker = function(args){
		//définition des propriétés
		var hLen, mLen;
		
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
			set h(val){
				this.defH = (val.length == 2) ? val.replace(/\D/, '0') : (val.length < 2) ? '0' + val.replace(/\D/, '0') : val.replace(/\D/, '0').substr(0, 2);
				},
			set m(val){
				this.defM = (val.length == 2) ? val.replace(/\D/, '0') : (val.length < 2) ? '0' + val.replace(/\D/, '0') : val.replace(/\D/, '0').substr(0, 2);
				},
			
			get separator(){
				return (typeof this.sep != 'undefined') ? this.sep : ':';
				},
			get model(){
				return (typeof this.mod != 'undefined') ? this.mod : 24;
				},
			get class(){
				return (typeof this.cla != 'undefined') ? this.cla : 'ui-timepicker';
				},
			get h(){
				return (typeof this.defH != 'undefined') ? (this.defH > this.model) ? this.model : this.defH : '00';
				},
			get m(){
				return (typeof this.defM != 'undefined') ? this.defM : '00';
				}
			};
		
		//assignation des arguments aux propriétés
		if(typeof args != 'undefined')
			$.extend(prop, args);
		
		//initialisation des éléments
		this.each(function(i){
			$(this)
			.val(prop.h + prop.separator + prop.m + ((prop.model == 12) ? 'AM' : ''))
			.attr({maxlength : (prop.model == 12) ? 7 : 5})
			.data({picker : i})
			.keydown(function(e){
				e.preventDefault();
				
				inputVal($(this), e, i);
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
					.attr({selected : i == prop[selType]})
					.text(i)
					);
				}
			
			return numElt;
			}
		
		//interaction depuis le input
		function inputVal(elt, e, i){
			var key = e.key;
			if(/\D/.test(key) && !/a|p|m/i.test(key))
				return;
			
			var start = elt[0].selectionStart;
			switch(start){
				case 0:
					if(/a|p|m/i.test(e.key)) return;
					
					key = (prop.model == 12) ? (key > 1) ? '1' : key  : (key > 2) ? 2 : key ;
					elt.val(elt.val().replaceAt(start, key));
					start ++;
					
					if(prop.model == 12 && key == '1'){
						if(elt.val()[start] > 2)
							elt.val(elt.val().replaceAt(start, '2'));
						}
					else if(prop.model == 24 && key == '2'){
						if(elt.val()[start] > 4)
							elt.val(elt.val().replaceAt(start, '4'));
						}
					
					$('#ui-timepicker-' + i + ' .picker-h').val(parseInt(elt.val()[start - 1] + elt.val()[start], 10));
					break;
				case 1:
					if(/a|p|m/i.test(e.key)) return;
					
					key = (prop.model == 12) ? (elt.val()[start-1] == 1 && key > 2) ? '2' : key : (elt.val()[start-1] == 2 && key > 4) ? '4' : key;
					elt.val(elt.val().replaceAt(start, key));
					
					$('#ui-timepicker-' + i + ' .picker-h').val(parseInt(elt.val()[start - 1] + elt.val()[start], 10));
					start ++;
					break;
				case 2:
					start ++;
				case 3:
					if(/a|p|m/i.test(e.key)) return;
					
					elt.val(elt.val().replaceAt(start, (key > 6) ? 6 : key));
					start ++;
					if(key == 6) elt.val(elt.val().replaceAt(start, '0'));
					$('#ui-timepicker-' + i + ' .picker-m').val(parseInt(elt.val()[start - 1] + elt.val()[start], 10));
					break;
				case 4:
					if(/a|p|m/i.test(e.key)) return;
					
					if(elt.val()[start - 1] == 6) key = '0';
					elt.val(elt.val().replaceAt(start, key));
					$('#ui-timepicker-' + i + ' .picker-m').val(parseInt(elt.val()[start - 1] + elt.val()[start], 10));
					start ++;
					break;
				case 5:
					if(prop.model == 24 || !/a|p/i.test(key)) return;
					elt.val(elt.val().replaceAt(start, key.toUpperCase()));
					$('#ui-timepicker-' + i + ' select:last').val(key.toUpperCase() + 'M');
					start ++;
					break;
				case 6:
					if(prop.model == 24 || !/m/i.test(key)) return;
					start ++;
					break;
				}
			
			elt[0].selectionStart = elt[0].selectionEnd = start;
			}
		}
	})(jQuery)


		
String.prototype.replaceAt = function(index, replace){
	return this.substr(0, index) + replace + this.substr(index + replace.length);
	}
