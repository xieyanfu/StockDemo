/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var selected_brand_code = "";
var selected_brand_name = "";
var candidates = {};

$(function() {
	$("#input_brand_name").typeahead({
		source: function (query, process) {
			candidates = {};
			var baseURL = "http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/autocomplete?";
			if(typeof query == "undefined"){
				query = $("#inputLocation").val();
			}
			var data = {
				q : query + '%'
			};
			return $.ajax({
				type: "GET",
				url: baseURL,
				data: data,
				dataType: 'jsonp',
				success: function(response){
					candidateArray = [];
					for(i=0; i<response.data.length; i++){
						candidateArray.push(response.data[i].company_name);
						candidates[response.data[i].company_name] = response.data[i].brand_code;
					}
					process(candidateArray);
					console.log(response);
				}
			});
		},
		updater: function(item){
			selected_brand_code = candidates[item];
			selected_brand_name = item;
			console.log(item);
			if(item == undefined){
				return this.query;
			}else if(item.length == 0){
				return this.query;
			}else{
				return item;
			}
		},
		matcher: function(item){
			console.log(item);
			return true;
		},
		highlighter: function(item){
			console.log(item)
			return item;
		}
	})
});


//Stock_brand.showCandidates();
