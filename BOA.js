var Name; //ファイル名

var frame_size;
var machine_hight;

var Extruder; //ヘッド温度
var HSpeed; //ヘッド速度
var ESpeed; //エクストルード速度
var ESpeed_s; //フィラメント速度(短辺)

var print_hight;  //高さ
var StartX; //原点
var StartY;
var X;  //範囲
var Y;
var G_Width;  //グリッド幅
var Times;  //重ね数

var content;  //内容

if (window.File == false) {   //APIチェック
  window.alert("The File APIs are not fully supported in this browser.");
}

function OF(){
    get();
    writeParameter();
    makeGcode();
    setName();
    Download();
}

function get(){
  Name = document.getElementById('Name').value;

  frame_size = Number(document.getElementById('frame_size').value);
  machine_hight = Number(document.getElementById('machine_hight').value);

  Extruder = Number(document.getElementById('Extruder').value);
  HSpeed = Number(document.getElementById('HSpeed').value);
  ESpeed = Number(document.getElementById('ESpeed').value)/10;
  ESpeed_s = ESpeed/5;
  Origin = document.getElementById('Origin');

  print_hight = Number(document.getElementById('print_hight').value);
  StartX = Number(document.getElementById('StartX').value);
  StartY = Number(document.getElementById('StartY').value);
  X = Number(document.getElementById('X').value);
  Y = Number(document.getElementById('Y').value);
  G_Width = Number(document.getElementById('G_Width').value);
  Times = Number(document.getElementById('Times').value);
}

function writeParameter(){  //設定をGcodeに記述
  content = [ ";Frame size : " + frame_size + "\n",
              ";Machine hight : " + machine_hight + "\n",
              "\n",
              ";Extruder temperature : " + Extruder + "\n",
              ";Head speed : " + HSpeed + "\n",
              ";Extrude speed : " + ESpeed + "\n",
              ";Extrude speed (short) : " + ESpeed_s + "\n",
              "\n",].join("");

  content += [ ";Hight : " + print_hight + "\n",
              ";StartX : " + StartX + "\n",
              ";StartY : " + StartY + "\n",
              ";X : " + X + "\n",
              ";Y : " + Y + "\n",
              ";G_Width : " + G_Width + "\n",
              ";Times : " + Times + "\n",
              "\n"].join("");
}

function setName(){
  var Download = document.getElementById("download");
  Download.setAttribute("download", Name);
}

function Download() {
    var blob = new Blob([ content ], { "type" : "text/plain" });

    if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, "test.txt");
    } else {
        document.getElementById("download").href = window.URL.createObjectURL(blob);
    }
}
