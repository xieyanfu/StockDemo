StockDemo API reference
=========

## autocomplete
**www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/autocomplete/?options<br>**
銘柄名・銘柄コードに関する情報を取得するAPI

### リクエスト

| パラメータ | デフォルト | 説明 |
|----------------------------|
| q | NULL | 会社名の頭文字 |

### レスポンス


## getStockPrice
**www.ai.cs.kobe-u.ac.jp/~fujikawa/softwares/StockDemo/api/getStockPrice/?options**<br>
指定した銘柄の、指定した期間の株価を取得するAPI

### リクエスト

| パラメータ | デフォルト | 説明 |
|----------------------------|
| brand_code | 0101 | 銘柄コード（日経平均:0101, NTT data: 9613, ヤフー: 4689, 東京電力: 9501 etc.） |
| from | 2008-01-01 | 取得開始する日付 |
| to | 2008-01-08 | 取得終了する日付 |
