/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
function toLowerCase(str){
	return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
		return String.fromCharCode(s.charCodeAt(0) - 65248);
	});
}

var KijiData = function() {
	this.page_type = "";
	this.kijis;
	this.page_num = 0;
	this.date = "";
	this.count = 0;
	return {
		init : function(type){
			this.page_type = type;
			this.page_num = 0;
			this.count = 0;
			this.getKiji();
		},
		getKiji : function (){
			baseURL = "http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/getKiji_raw?";
			if (this.page_type == "annotation"){
				var data = {
					type : this.page_type
				};
				App.blockUI($("#kiji_window"));
				console.log(data);
			}
			else{
				var data = {
					type : this.page_type,
					start : this.page_num * 10
				};
			}
			this.blockUI($("#kiji_window"));
			$.ajax({
				type: "GET",
				url: baseURL,
				data: data,
				dataType: 'jsonp',
				success: function(response){
					KijiData.kijis = response;
					if (KijiData.kijis.count != undefined){
						KijiData.count = KijiData.kijis.count;
						console.log(KijiData.count);
					}

					KijiData.drawKijis();
					KijiData.unblockUI($("#kiji_window"));
				}
			});
		},
		drawKijis : function(){
			if (this.page_type == "view"){
				this.reflectHitNum();
			}
			$("#kijis").children().remove();
			console.log(this.kijis);
			for (i = 0; i < this.kijis.data.length; i++){
				html = "<li class='kiji span12'><div class='kiji_text span8'>";
				console.log(this.kijis.synonyms);
				for (n = 0; n < this.kijis.synonyms.length; n++){
					console.log(this.kijis.synonyms[n]);
					this.kijis.data[i].kiji.kiji_headline = toLowerCase(this.kijis.data[i].kiji.kiji_headline).split(this.kijis.synonyms[n]).join("<strong>" + this.kijis.synonyms[n] + "</strong>");
				}
				html += "<div class='kiji_midashi'><h4>" + this.kijis.data[i].kiji.kiji_midashi + "</h4>";
				html += "<h5>[ " + this.kijis.data[i].kiji.date + " ]</h5></div>";
				html += "<p>" + this.kijis.data[i].kiji.kiji_headline + "</p></div>";
				html += "<ul class='span4 kiji_entity'>";
				if (this.page_type == "view"){
					html += '<li><ul class="unstyled inline star">';
					for (n = 0; n < this.kijis.data[i].kiji.rate; n++){
						html += '<li><i class="icon-star"></i></li>';
					}
					for (n = 0; n < 3 - this.kijis.data[i].kiji.rate; n++){
						html += '<li><i class="icon-star-empty"></i></li>';
					}
					html += '</ul></li>';
				}
				for (n = 0; n < this.kijis.data[i].stockprice.length; n++){
					diff = 0;
					if (this.kijis.data[i].stockprice[n].opening_price)
						diff = Math.round(((this.kijis.data[i].stockprice[n].closing_price - this.kijis.data[i].stockprice[n].opening_price) / this.kijis.data[i].stockprice[n].opening_price) * 100);
					console.log(diff);
					pos_neg = "";
					if (diff > 0)
						pos_neg = "_p";
					else if (diff < 0)
						pos_neg = "_n";
					html += '<li class="kiji_stockprice' + pos_neg + '"><p>'+ this.kijis.data[i].stockprice[n].company_name +'</p><span>' + diff +  '% ('+ this.kijis.data[i].stockprice[n].date +  ')</span></li>';
				}
				html += "</ul>";
				html += "</li>";

				$("#kijis").append(html);
			}
		},
		reflectHitNum : function() {
			$("#hit_num").children().remove();
			$("#hit_num").append("<p>アノテーション済記事：" + this.count + " 件</p>");
			$("#current_page").html("");
			$("#current_page").append((this.page_num * 10 + 1) + "件 ~ " + (this.page_num * 10 + 10) + "件（全" + this.count + "件）");
		},
		getNextKijis : function() {
			this.page_num ++;
			this.getKiji();
		},
		getPrevKijis : function() {
			this.page_num --;
			this.getKiji();
		},
		annotateKiji : function(rate){
			baseURL = "http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/annotateKiji?";
			data = {
				rate : rate,
				kiji_id : this.kijis.data[0].kiji.kiji_id
			};
			$.ajax({
				type: "GET",
				url: baseURL,
				data: data,
				dataType: 'jsonp',
				success: function(response){
					KijiData.getKiji();
				}
			});
		},
		blockUI: function (el, centerY) {
            jQuery(el).block({
                message: '<img src="../assets/img/ajax-loading.gif" align="">',
                centerY: centerY != undefined ? centerY : true,
                css: {
                    top: '10%',
                    border: 'none',
                    padding: '2px',
                    backgroundColor: 'none'
                },
                overlayCSS: {
                    backgroundColor: '#000',
                    opacity: 0.05,
                    cursor: 'wait'
                }
            });
        },

        // wrapper function to  un-block element(finish loading)
        unblockUI: function (el) {
            jQuery(el).unblock({
                onUnblock: function () {
                    jQuery(el).removeAttr("style");
                }
            });
        },

	};
}();

