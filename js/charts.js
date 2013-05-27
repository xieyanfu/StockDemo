/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

google.load('visualization', '1.0', {
	'packages':['corechart']
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
				value: 1,
				slide: function (event, ui) {
					$("#slider-range-max-amount").text(interval[Number(ui.value)]);
				}
			});

			$("#slider-range-max-amount").text(interval[Number($("#slider-range-max").slider("value"))]);

		}
	};

}();

function addQueryLog(query) {
	$("#query-log-space").append('<div class="alert alert-info query-log"><button class="close" data-dismiss="alert"></button>' + query + '</div>')
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
		addStockpriceData : function(response) {
			map_brand[selected_brand_name] = selected_brand_code;
			array = [];
			for(i=0; i<response.data.length; i++){
				this.dates.push(response.data[i].date);
				array.push(Number(response.data[i].opening_price));
			}
			this.opening_prices[selected_brand_name] = array;
			console.log(response);
		},
		getStockPrice : function () {
			if (selected_brand_name in this.map_brand != true){
				this.map_brand[selected_brand_name] = selected_brand_code;
			}
			console.log(this.map_brand);
			for (brand_name in this.map_brand){
				baseURL = "http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/getStockPrice?";
				var data = {
					brand_code : this.map_brand[brand_name],
					from : $("#input_date").attr("value"),
					to: computeToDate()
				};
				console.log(data);
				$.ajax({
					type: "GET",
					url: baseURL,
					data: data,
					dataType: 'jsonp',
					success: function(response){
						console.log(response);
						addQueryLog(selected_brand_name);
						GraphData.init();
						GraphData.addStockpriceData(response);
						GraphData.drawChart();
					}
				});
			}
		},
		getMapBrand : function () {
			console.log(this.map_brand);
			return this.map_brand;
		},
		drawChart : function () {
			console.log("test");
			data = new google.visualization.DataTable();
			data.addColumn('string', '日付');
			array = [];
			for (brand_name in this.map_brand){
				data.addColumn('number', brand_name);
			}

			for (i = 0; i < this.dates.length; i++){
				tmp = [];
				tmp.push(this.dates[i]);
				for (brand_name in this.map_brand){

					console.log(this.opening_prices[brand_name]);
					tmp.push(this.opening_prices[brand_name][i]);
				}
				array.push(tmp);
			}
			console.log(array);
			data.addRows(array);

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
		pieSliceText: 'label',
		is3D: true
	}

	// 描画する
	var stock_chart = new google.visualization.LineChart(document.getElementById('stock_chart'));
	stock_chart.draw(data, options);
}