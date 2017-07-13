(function($){
	$.fn.timepicker = function(args){
		//définition des propriétées
		var objDate = new Date();
		var firstH = 0;
		var prop = {
			clock : false,
			set separator(val){
				this.defSeparator = (/^:|h/i.test(val)) ? val : ':';
				},
			set model(val){
				if(val == 24) val --;
				if(val == 12) firstH = 1;
				this.defModel = (val == 12 || val == 23) ? val : 23;
				},
			set class(val){
				this.defClass = (val.split(' ').length) ? val : 'ui-timepicker';
				},
			set step(val){
				this.defStep = (val < 30) ? val : 30;
				},
			set h(val){
				this.defH = (val.length == 2) ? val.replace(/\D/, '0') : (val.length < 2) ? '0' + val.replace(/\D/, '0') : val.replace(/\D/, '0').substr(0, 2);
				},
			set m(val){
				this.defM = (val.length == 2) ? val.replace(/\D/, '0') : (val.length < 2) ? '0' + val.replace(/\D/, '0') : val.replace(/\D/, '0').substr(0, 2);
				},
			
			get separator(){
				return (typeof this.defSeparator != 'undefined') ? this.defSeparator : ':';
				},
			get model(){
				return (typeof this.defModel != 'undefined') ? this.defModel : 23;
				},
			get class(){
				return (typeof this.defClass != 'undefined') ? this.defClass : 'ui-timepicker';
				},
			get step(){
				return (typeof this.defStep != 'undefined') ? this.defStep : 1;
				},
			get h(){
				return (typeof this.defH != 'undefined') ? (this.defH > this.model) ? this.model : this.defH : '00';
				},
			get m(){
				return (typeof this.defM != 'undefined') ? this.defM : '00';
				}
			};
		
		
		//assignation des arguments aux propriétées
		if(typeof args != 'undefined')
			$.extend(prop, args);
		
		//initialisation des éléments
		this.each(function(i){
			if(prop.clock){
				var elt = $(this);
				setInterval(function(){timer(elt)}, 1000);
				prop.h = goodLength(String(objDate.getHours()));
				prop.m = goodLength(String(objDate.getMinutes()));
				}
			
			$(this)
			.val(prop.h + prop.separator + prop.m + ((prop.model == 12) ? 'AM' : ''))
			.attr({maxlength : (prop.model == 12) ? 7 : 5})
			.data({picker : i})
			.keydown(function(e){
				e.preventDefault();
				
				if(!prop.clock){
					keyControl($(this), e.keyCode, i);
					if(e.keyCode  < 65) return;
					inputVal($(this), e.key, i);
					}
				})
			.click(function(){
				$('#ui-timepicker-' + i).show();
				});
			
			createPicker($(this), i);
			});
		
		function timer(elt){
			objDate.setSeconds(objDate.getSeconds() + 1);
			var time = curTime();
			
			setH(elt, time[0]);
			setM(elt, time[1]);
			if(prop.model == 12)
				setMeridiem(elt, time[3]);
			}
		
		function curTime(){
			if(prop.model == 12){
				var time = objDate.toLocaleTimeString("en-US").split(':');
				var sTime = time[2].split(' ');
				time[2] = sTime[0];
				time[3] = sTime[1];
				}
			else{
				var time = [objDate.getHours(), objDate.getMinutes(), objDate.getSeconds(), ];
				}
			return time;
			}
		
		//création du picker
		function createPicker(elt, i){
			var eltsPicker = [
				//selection de l'heure
				numField('h', prop.model)
				.change(function(){
					setH(elt, $(this).val());
					}),
				
				//séparation
				$(document.createElement('span'))
				.text(prop.separator),
				
				//selection des minutes
				numField('m', 59)
				.change(function(){
					setM(elt, $(this).val());
					})
				];
			
			//selection de AM/PM
			if(prop.model == 12){
				eltsPicker.push(
					$(document.createElement('select'))
					.addClass('picker-meridiem')
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
					top : elt.offset().top + elt.outerHeight(),
					zIndex : 3
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
			
			
			
			for(var i = (selType == 'h') ? firstH : 0; i <= maxNum; i = (selType == 'h') ? i + 1 : i +  prop.step){
				optGroupElt.append(
					$(document.createElement('option'))
					.attr({selected : i == prop[selType]})
					.text(goodLength(String(i)))
					);
				}
			
			return numElt;
			}
		
		//modification de l'heure du input
		function setH(elt, h){
			h = Number(h);
			
			if(h > prop.model)
				h = prop.model;
			else if(h < firstH)
				h = firstH;
			
			elt.val(elt.val().replaceAt(0, goodLength(String(h))));
			}
		
		//récupération de l'heure du input
		function getH(elt, inStr){
			var h = elt.val().substr(0, 2);
			
			if(inStr) return h;
			return Number(h);
			}
		
		//modification des minutes du input
		function setM(elt, m){
			m = Number(m);
			
			if(m > 59)
				m = 59;
			else if(m < 0)
				m = 0;
			
			elt.val(elt.val().replaceAt(3, goodLength(String(m))));
			}
		
		//récupération des minutes du input
		function getM(elt, inStr){
			var m = elt.val().substr(3, 2);
			
			if(inStr) return m;
			return Number(m);
			}
		
		//mise a la bonne taille des str 'h' et 'm'
		function goodLength(str){
			if(str.length < 2)
				str = '0' + str;
			else if(str.length > 2)
				str = str.substr(0, 2);
			
			return str;
			}
		
		function setMeridiem(elt, mer){
			elt.val(elt.val().replaceAt(5, mer.toUpperCase()));
			}
		
		function getMeridiem(elt){
			return elt.val().substr(5, 2);
			}
		
		//gestion du input par les flèches du clavier
		function keyControl(elt, keyCode, i){
			var start = elt[0].selectionStart;
			if(keyCode == 38 || keyCode == 40){
				if(start < 3)
						var h = getH(elt);
				else
						var m = getM(elt);
				}
			
			switch(keyCode){
				case 38:
					if(start < 3)
						h ++;
					else if(start < 5 && m + prop.step <= 59)
						m = m + prop.step;
					else if(prop.model == 12)
						setMeridiem(elt, 'am');
					break;
				case 40:
					if(start < 3)
						h --;
					else if(start < 5)
						m = m - prop.step;
					else if(prop.model == 12)
						setMeridiem(elt, 'pm');
					break;
				case 39:
					elt[0].selectionStart ++;
					break;
				case 37:
					elt[0].selectionStart --;
					elt[0].selectionEnd --;
					break;
				}
			
			if(keyCode == 38 || keyCode == 40){
				if(start < 3){
					setH(elt, h);
					$('#ui-timepicker-' + i + ' .picker-h').val(getH(elt, true));
					}
				else if(start < 5){
					setM(elt, m);
					$('#ui-timepicker-' + i + ' .picker-m').val(getM(elt, true));
					}
				else if(prop.model == 12)
					$('#ui-timepicker-' + i + ' .picker-meridiem').val(getMeridiem(elt));
				elt[0].selectionStart = elt[0].selectionEnd = start;
				}
			}
		
		//interaction depuis le input
		function inputVal(elt, key, i){
			if(/\D/.test(key) && !/a|p|/i.test(key))
				return;
			
			var start = elt[0].selectionStart;
			switch(start){
				case 0:
				case 1:
					if(/^a|p$/i.test(key)) return;
					var h = getH(elt, true);
					h = h.replaceAt(start, key);
					setH(elt, h);
					$('#ui-timepicker-' + i + ' .picker-h').val(getH(elt, true));
					start ++;
					break;
				case 2:
					start ++;
				case 3:
					var index = 0;
				case 4:
					if(/^a|p$/i.test(key)) return;
					if(start == 4) var index = 1;
					var m = getM(elt, true);
					m = m.replaceAt(index, key);
					if(!$('#ui-timepicker-' + i + ' .picker-m option:contains("' + m + '")').length) return;
					setM(elt, m);
					$('#ui-timepicker-' + i + ' .picker-m').val(getM(elt, true));
					start ++;
					break;
				case 5:
					if(prop.model != 12 || !/a|p/i.test(key)) return;
					setMeridiem(elt, key);
					$('#ui-timepicker-' + i + ' .picker-meridiem').val(getMeridiem(elt));
				case 6:
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
