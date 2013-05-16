/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

google.load('visualization', '1.0', {
	'packages':['corechart']
});




function getStockPrice() {
	console.log(selected_brand_code);
	baseURL = "http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/getStockPrice?";
	var data = {
		brand_code : selected_brand_code
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