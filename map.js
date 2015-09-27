window.onload = function(){
var xml = new Xml();
xml.getxml();
var json = new Json();
json.getJson();
}

//　＿人人人人人人人人人人人＿
// ＞　　　　　　　　　　　　＜
//＞　 荒ぶるグローバル関数 　＜
// ＞　　　　　　　　　　　　＜
//　￣Y^Y^Y^Y^Y^Y^Y^Y^Y^￣

//jsonの方の名前
myInterest=[{country:"Australia"},
            {country:"Brazil"},
            {country:"Turkey"},
            {country:"Japan"},
            {country:"United States"},
            {country:"United Kingdom"},
            {country:"Russian Federation"},
            {country:"Slovak Republic"},
            {country:"South Africa"}];

//オプション一覧
//id -> 国名コード
//population -> 人口
//ordinal-> jsonファイルの何個目に該当するか。
//x,y -> 座標

///////////////////////
var Json = function(){}
Json.prototype.getJson = function()
{
    d3.json("data.json",function(error,json)
        {   
            var dataNum = json[0].total;
            //iはjsonデータの何番目 jはmyInterestの何番目
            var i,j = 0;
            for(i=0;i < dataNum;i++){
                //json[1][i].country.valueはjsonファイルの国データ一つ分の国名を表す。
                j=0;
                $.each(myInterest,function(key, value) {
                    if ( json[1][i].country.value== value.country) { //今のjsonデータの国名がmyInterestに入っているか。
                        //console.log("国名が一致した時のi:"+i+" /"+dataNum);
                        myInterest[j].id = json[1][i].country.id
                        myInterest[j].population = json[1][i].value
                        myInterest[j].ordinal = i;
                    }
                    j++;
                });
            }
            //console.log(myInterest);
        });
}

var Xml = function(){}
Xml.prototype.getxml = function()
{
    d3.xml("BlankMap-World6.svg","image/svg+xml",function(xml){
        $("#map").append(xml.documentElement);
        d3.selectAll("#circle").remove();//多分circleタグ全部消えてる。
        var i,len,path,paths,maxIndex,maxLen;
        for(i=0;i<myInterest.length;i++){
            paths = [];//初期化
            console.log("国名:"+myInterest[i].country);
            console.log("国名id:"+myInterest[i].id);
            paths = d3.selectAll("#"+myInterest[i].id.toLowerCase()+" > path");//id="国名"で検索したgタグの中のpathタグを全て持ってくる。
            //console.log(paths.empty());
            if (paths.empty()) {//pathが1個しかない場合にpath内にidが指定されているため、それを取得できるようにする。
                paths = d3.select("#"+myInterest[i].id.toLowerCase());
            }
            //console.log("paths:"+paths[0][0].outerHTML);
            paths = paths[0];//一つ余分な配列?オブジェクト?で囲われているから取り出して1次元配列化
            maxIndex = 0;//初期化
            maxLen = paths[0].outerHTML.length;
            //paths配列の中で一番長いpathをもつ添字をとる。
            for(j=1;j<paths.length;j++){
                len = paths[j].outerHTML.length;
                //console.log("長さ:"+len+" j:"+j);
                if (maxLen < len) {
                    maxIndex = j;
                    maxLen = len;
                }
            }
            //console.log("sliceする前:"+paths[maxIndex].outerHTML);
            path = paths[maxIndex].outerHTML
            coordinates = path.slice(path.indexOf("M")+1,path.indexOf("C"));//MからCまでを切り出す。
            //console.log("sliceした結果:"+coordinates);
            coordinates = coordinates.split(",");//x,y座標を分割
            myInterest[i].x = coordinates[0].trim();
            myInterest[i].y = coordinates[1].trim();
            console.log("x:"+myInterest[i].x);
            console.log("y:"+myInterest[i].y);
            
            //円の大きさを決める。
            myInterest[i].r= myInterest[i].population/50000000 * 20;
        }
        var circle = new Circle();
        circle.createCircle();
    });
}

//地図の高さ:442.84
//地図の幅:863.21002
var Circle = function(){}
Circle.prototype.createCircle = function(x,y)
{
    var color = d3.scale.category10();
    for(i=0;i<myInterest.length;i++){
        var svg = d3.select("#"+myInterest[i].id.toLowerCase()).append("svg")
        var g = svg.append('g')//gの中にcircleとtextが入っている。座標はgで指定する。
            .attr({
            'transform': "translate("+myInterest[i].x+","+myInterest[i].y+")",
            });
        g.append('circle')
            .attr({
                'r': myInterest[i].r*2,
                'fill': color(i),
            });
        g.append("text")
            .attr({
            // 真ん中若干下に配置されるように、文字色は白に。
                'text-anchor': "middle",
                'dy': ".35em",
                'fill': "white",
            })
            .text(myInterest[i].country);
        console.log("円作成 国名:"+myInterest[i].country +" ,x:"+myInterest[i].x+" ,y:"+myInterest[i].y+" ,r:"+myInterest[i].r);
    }
}
