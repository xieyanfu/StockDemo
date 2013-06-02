/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

google.load('visualization', '1.0', {
	'packages':['corechart', 'annotatedtimeline']
});

function computeDate(year, month, day, addDays) {
	var dt = new Date(year, month - 1, day);
	var baseSec = dt.getTime();
	var addSec = addDays * 86400000;//日数 * 1日のミリ秒数
	var targetSec = baseSec + addSec;
	dt.setTime(targetSec);
	return dt.getFullYear() + '-' + String(Number(dt.getMonth()) + 1) + '-' + dt.getDate();
}

function computeToDate(){
	var year = $("#input_date").attr("value").split('-')[0];
	var month = $("#input_date").attr("value").split('-')[1];
	var day = $("#input_date").attr("value").split('-')[2];
	switch(Number($("#slider-range-max").slider("value"))){
		case 0:
			return computeDate(year, month, day, 7);
		case 1:
			return computeDate(year, month, day, 30);
		case 2:
			return computeDate(year, month, day, 180);
		case 3:
			return computeDate(year, month, day, 365);
		case 4:
			return computeDate(year, month, day, 730);
		case 5:
			return String(Number(year) + 4) + '-' + month + '-' + day;
	}
}

var UISliders = function () {
	var interval = ['1 week', '1 month', '6 month', '1 year', '2 year','4 year']
	return {
		//main function to initiate the module
		initSliders: function () {
			$("#slider-range-max").slider({
				range: "max",
				min: 0,
				max: 5,
				value: 5,
				slide: function (event, ui) {
					$("#slider-range-max-amount").text(interval[Number(ui.value)]);
				}
			});

			$("#slider-range-max-amount").text(interval[Number($("#slider-range-max").slider("value"))]);

		}
	};

}();

function addQueryLog(query) {
	$("#query-log-space").append('<div class="alert alert-info query-log"><button class="close" query="' + query + '" data-dismiss="alert" onClick="removeQueryLog(this)"></button>' + query + '</div>');
}

function removeQueryLog(obj){
	GraphData.removeBrand(obj.getAttribute("query"));
	selected_brand_name = "";
	selected_brand_code = "";
	GraphData.getStockPrice();
}

var GraphData = function() {
	this.dates = [];
	this.map_brand = {};
	this.opening_prices = {};
	this.words = {};
	return {
		init : function() {
			this.dates = [];
			this.map_brand = {};
			this.opening_prices = {};
			this.words = {};
		},
		reload : function() {
			this.getStockPrice();
			this.getCsq_pred();
		},
		removeBrand : function(brand_name){
			console.log(brand_name);
			delete this.map_brand[brand_name];
		},
		addStockpriceData : function(response) {
			this.dates = response.data.dates;
			for (var brand_name in this.map_brand){
				var brand_code = this.map_brand[brand_name];
				this.opening_prices[brand_code] = {};
				for (var date in response.data.stockprices[brand_code]){
					record = response.data.stockprices[brand_code][date];
					this.opening_prices[brand_code][date] = record.opening_price;
				}
				console.log(this.opening_prices);
			}
		},
		getStockPrice : function (){
			baseURL = "http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/getStockPrice?";
			if (selected_brand_name != "" && selected_brand_name in GraphData.map_brand == false){
				addQueryLog(selected_brand_name);
				this.map_brand[selected_brand_name] = selected_brand_code;
			}
			if ($.isEmptyObject(GraphData.map_brand) != true){
				brand_codes = "";
				for (brand_name in this.map_brand){
					brand_codes += this.map_brand[brand_name] + ',';
				}
				var data = {
					brand_code : brand_codes,
					//from : $("#input_date").attr("value"),
					from : "1999-1-1",
					//to: computeToDate()
					to: "2012-12-31"
				};
				App.blockUI($("#chart_window"));
				console.log(data);
				$.ajax({
					type: "GET",
					url: baseURL,
					data: data,
					dataType: 'jsonp',
					success: function(response){
						console.log(response);
						App.unblockUI($("#chart_window"));
						GraphData.addStockpriceData(response);
						GraphData.drawChart();
					}
				});
			}
		},
		getCsq_pred : function() {
			baseURL = "http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/getCsq_pred?";
			if ($.isEmptyObject(GraphData.map_brand) != true){
				brand_codes = "";
				$("#csq_window").children('.portlet-body').html('');
				for (brand_name in this.map_brand){
					this.makeTable_csq(this.map_brand[brand_name], brand_name);
					brand_codes += this.map_brand[brand_name] + ',';
				}
				var data = {
					brand_code : brand_codes
				};
				App.blockUI($("#csq_window"));
				console.log(data);
				$.ajax({
					type: "GET",
					url: baseURL,
					data: data,
					dataType: 'jsonp',
					success: function(response){
						App.unblockUI($("#csq_window"));
						GraphData.drawCsqTable_pred(response);
						console.log(response);
					}
				});
			}
		},
		getKiji : function(data) {
			baseURL = "http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/getKiji?";
			$("#kiji_table").children('tbody').html('');
			App.blockUI($("#kiji_window"));
			console.log(data);
			console.log("getkiji#####");
			$.ajax({
				type: "GET",
				url: baseURL,
				data: data,
				dataType: 'jsonp',
				success: function(response){
					App.unblockUI($("#kiji_window"));
					GraphData.drawKijiTable(response);
				}
			});
		},
		getMapBrand : function () {
			console.log(this.map_brand);
			return this.map_brand;
		},
		makeTable_csq : function(brand_code, brand_name) {
			$("#csq_window").children('.portlet-body').append('<table id="csq_table_' + brand_code + '" class="table table-striped table-bordered"><caption>' + brand_code + ' : ' + brand_name + '</caption><thead><tr><th>word</th><th>chi-square</th></tr></thead><tbody></tbody></table>');
		},
		drawCsqTable_pred : function(response){
			for (brand_code in response.data){
				for (i = 0; i < response.data[brand_code].length; i++){
					console.log($('#csq_table_' + brand_code).children('tbody'));
					$('#csq_table_' + brand_code).children('tbody').append('<tr onclick="GraphData.getKiji(GraphData.makeQuery_pred($(this).children(\'td\')))"><td>' + response.data[brand_code][i]['word'] + '</td><td>' + response.data[brand_code][i]['res_' + brand_code] + '</td></tr>');
				}
			}
		},
		makeQuery_pred : function(dom){
			data = {};
			data["ga_kaku"] = dom[0].innerText.split('-')[0];
			data["pred"] = dom[0].innerText.split('-')[1];
			return data;
		},
		drawKijiTable : function(response){
			console.log(response);
			for (i = 0; i < response.data.length; i++){
				$('#kiji_table').children('tbody').append('<tr><td>' + response.data[i].date + '</td><td>' + response.data[i].kiji_headline + '</td></tr>');
			}
		},
		drawChart : function () {
			data = new google.visualization.DataTable();
			data.addColumn('date', '日付');
			records = [];
			for (brand_name in this.map_brand){
				data.addColumn('number', brand_name);

			}
			for (i = 0; i < this.dates.length; i++){
				record = []
				record.push(new Date(this.dates[i]));
				for (brand_name in this.map_brand){
					record.push(Number(this.opening_prices[this.map_brand[brand_name]][this.dates[i]]));
				}

				records.push(record);

			}
			console.log(records);
			data.addRows(records);


			google.setOnLoadCallback(drawChart(data));
		}
	};
}();

var Search = function () {
	return {
		//main function to initiate the module
		init: function () {
			if (jQuery().datepicker) {
				$('.date-picker').datepicker({
					format: 'yyyy-mm-dd'
				});
			}
			App.initFancybox();
		}
	};
}();

function drawChart(data) {

	// グラフのオプションを指定する
	var options = {
		title: '',
		width: $("#stock_chart").width(),
		height: $("#stock_chart").width() / 2,
		displayAnnotations: true,
		scaleType: 'allmaximized'

	}

	// 描画する
	var stock_chart = new google.visualization.AnnotatedTimeLine(document.getElementById('stock_chart'));
	stock_chart.draw(data, options);
}
