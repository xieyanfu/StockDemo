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


function getStockPrice() {
	console.log($("#input_date").attr("value"));
	baseURL = "http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/getStockPrice?";
	var data = {
		brand_code : selected_brand_code,
		from : $("#input_date").attr("value"),
		to: computeToDate()
	};
	$.ajax({
		type: "GET",
		url: baseURL,
		data: data,
		dataType: 'jsonp',
		success: function(response){
			var data = new google.visualization.DataTable();
			data.addColumn('string', '日付');
			data.addColumn('number', selected_brand_name);
			array = [];
			for(i=0; i<response.data.length; i++){
				console.log(response.data[i].opening_price);
				array.push([response.data[i].date, Number(response.data[i].opening_price)])

			}
			data.addRows(array);
			console.log(data);
			google.setOnLoadCallback(drawChart(data));
		}
	});
}

var Search = function () {
    return {
        //main function to initiate the module
        init: function () {
            if (jQuery().datepicker) {
                $('.date-picker').datepicker({format: 'yyyy-mm-dd'});
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