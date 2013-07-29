/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

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
					App.unblockUI($("#chart_window"));
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
				html += "<h4>" + this.kijis.data[i].kiji_midashi + "</h3>";
				html += "<p>" + this.kijis.data[i].kiji_headline + "</p></div>";
				html += "<ul class='span4 kiji_entity'>";
				if (this.page_type == "view"){
//					html += '<li class="kiji_rate_' + this.kijis.data[i].rate + '"><span>rate: '+ this.kijis.data[i].rate +'</span></li>';
					html += '<li><ul class="unstyled inline star">';
					for (n = 0; n < this.kijis.data[i].rate; n++){
						html += '<li><i class="icon-star"></i></li>';
					}
					for (n = 0; n < 3 - this.kijis.data[i].rate; n++){
						html += '<li><i class="icon-star-empty"></i></li>';
					}
					html += '</ul></li>';
				}
				html += '<li class="kiji_date"><span>date: '+ this.kijis.data[i].date +'</span></li>';
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
				kiji_id : this.kijis.data[0].kiji_id
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
		}

	};
}();

