/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


google.load('visualization', '1.0', {
	'packages':['corechart']
});
google.setOnLoadCallback(drawChart);
    
function drawChart() {
	var data = new google.visualization.DataTable();
	data.addColumn('string', '活動');
	data.addColumn('number', '時間');
	data.addRows([
		['睡眠', 80000],
		['仕事', 12000],
		['ネット', 40000]
		]);
        
	// グラフのオプションを指定する
	var options = {
		title: '1日の内訳',
		width: 1000,
		height: 500,
		pieSliceText: 'label',
		is3D: true
	}
 
	// 描画する
	var stock_chart = new google.visualization.LineChart(document.getElementById('stock_chart'));
	stock_chart.draw(data, options);
}