StockDemo API reference
=========

## autocomplete
銘柄名・銘柄コードに関する情報を取得するAPI<br>
**http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/autocomplete/?options**


### リクエスト

| パラメータ | デフォルト | 説明 |
|----------------------------|
| q | NULL | 会社名の頭文字 |
| format | jsonp | jsonで返して欲しい場合はjsonと入力する|

### レスポンス
	{
		"status":"OK",
		"data": [{
			"brand_code":"7203",
			"company_name_kana":"トヨタジドウシャ",
			"company_name":"トヨタ自動車",
			"category_code":"17",
			"amount_price":"4",
			"amount_stock":"100"}]
	}

## getStockPrice
指定した銘柄の、指定した期間の株価を取得するAPI<br>
**http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/getStockPrice/?options**

### リクエスト

| パラメータ | デフォルト | 説明 |
|----------------------------|
| brand_code | 0101 | 銘柄コードを入力。','で区切って複数入力可。（日経平均:0101, NTT data: 9613, ヤフー: 4689, 東京電力: 9501 etc.） |
| from | 2008-01-01 | 取得開始する日付 |
| to | 2008-01-08 | 取得終了する日付 |
| format | jsonp | jsonで返して欲しい場合はjsonと入力する|

### レスポンス
	{
    	"status": "ok",
    	"data": {
        	"stockprices": {
            	"0101": {
                	"2008-01-04": {
                   		"stockprice_id": "19358729",
                    	"brand_code": "0101",
                    	"date": "2008-01-04",
                    	"market_category": "i",
                    	"opening_price": "15155",
                    	"high_price": "15156",
                    	"low_price": "14542",
                    	"closing_price": "14691",
                    	"trading_volume": "1424260000"
                	},
                	"2008-01-07": {
                    	"stockprice_id": "19363651",
                    	"brand_code": "0101",
                    	"date": "2008-01-07",
                    	"market_category": "i",
                    	"opening_price": "14549",
                    	"high_price": "14667",
                    	"low_price": "14438",
                    	"closing_price": "14500",
                    	"trading_volume": "2058990000"
                	},
                	"2008-01-08": {
                    	"stockprice_id": "19368573",
                    	"brand_code": "0101",
                    	"date": "2008-01-08",
                    	"market_category": "i",
                    	"opening_price": "14429",
                    	"high_price": "14547",
                    	"low_price": "14365",
                    	"closing_price": "14528",
                    	"trading_volume": "2114150000"
                	}
            	}
        	},
        	"dates": [
            	"2008-01-04",
            	"2008-01-07",
            	"2008-01-08"
        	]
    	}
	}

## getCsq_pred
指定した銘柄の、カイ二乗検定の結果を取得するAPI<br>
**http://www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/getCsq_pred?options**

### リクエスト
| パラメータ | デフォルト | 説明 |
|----------------------------|
| brand_code | 0101 | 銘柄コード（日経平均:0101, NTT data: 9613, ヤフー: 4689, 東京電力: 9501 etc.） |

### レスポンス
	{
	    "status": "ok",
    	"data": {
        	"0101": [
            	{
                	"word": "日経平均株価-反発する",
                	"res_0101": "86.018"
            	},
            	{
                	"word": "上げ幅-超える",
                	"res_0101": "61.0849"
            	},
            	{
                	"word": "日経平均株価-続落する",
                	"res_0101": "50.4349"
            	},
            	{
                	"word": "下げ幅-超える",
                	"res_0101": "43.9282"
            	},
            	{
                	"word": "日経平均株価-反落する",
                	"res_0101": "36.8302"
            	}
        	]
    	}
	}

## getKiji
指定した条件の記事全文を取得するAPI<br>

### リクエスト
| パラメータ | デフォルト | 説明 |
|----------------------------|
| resource | pred | 検索に使うリソースを入力 [pred, mecab] |
| ga_kaku || (predの場合) 主格を入力 |
| pred ||（predの場合）述語を入力 |

### レスポンス
	{
    	"status": "ok",
    	"data": [
        	{
            	"date": "2008-01-17",
            	"kiji_headline": "日経平均が反発、５日ぶり。　十七日の東京株式市場で日経平均株価は小幅反発した。午前中は上げ幅が一時二〇〇円を超える場面もあった。前日までの四日間で約一一〇〇円下げたため、自律的な反発を見込む買いが優勢となったが、午後に入るとアジア株下落で急速に伸び悩み一時は一万三五〇〇円を下回った。　午後一時十分時点の日経平均は前日比三八円九五銭（〇・二九％）高の一万三五四三円四六銭。　朝方から先物に大口の買いが入り、現物株は五日ぶりに反発して始まった。円高が一服し自動車、精密、電機など主力の輸出関連株が買い戻された。"
        	},
        	{
            	"date": "2008-01-19",
            	"kiji_headline": "ＮＹ株反発、一時１８０ドル高。　【ニューヨーク＝米州総局】十八日午前のニューヨーク株式市場でダウ工業株三十種平均株価は反発し、前日比の上げ幅は一時一八〇ドルを超えた。午前十一時（日本時間十九日午前一時）現在、七四ドル三八セント高の一万二二三三ドル五九セント。前日に急落しており、買い戻しの動きが優勢となっている。米ＩＢＭとゼネラル・エレクトリック（ＧＥ）の業績が堅調だったことも買い材料。"
        	},
        	…
        ]
    }
