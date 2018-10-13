var before_point = new Array(3); //移動前の座標点
var after_point = new Array(3);  //移動後の座標点
var move_x = move_y = move_z = 0; //各軸移動量


function makeGcode(){
  Gcode_Start();

  for(var t=0; t<Times; t++){ //重ねるレイヤー数
    for(var i=0; i<X/G_Width; i++){
      after_point = [G_Width*i, Y*(i%2), print_hight];
      movement_calculater(before_point, after_point);
      content += ["G1 X" + move_x + " Y" + move_y + " Z" + move_z + " E" + ESpeed + "\n",
                  "G92\n"].join("");
    }
    for(var i=0; i<Y/G_Width; i++){
      after_point = [X*(i%2), G_Width*i, print_hight];
      movement_calculater(before_point, after_point);
      content += ["G1 X" + move_x + " Y" + move_y + " Z" + move_z + " E" + ESpeed + "\n",
                  "G92\n\n"].join("");
    }
  }

  Gcode_End();
}

function movement_calculater(before_point, after_point){
  //X
    before_point_x = Math.sqrt((before_point[0]-0)**2 + (before_point[1]-0)**2 + (before_point[2]-machine_hight)**2);
    after_point_x = Math.sqrt((after_point[0]-0)**2 + (after_point[1]-0)**2 + (after_point[2]-machine_hight)**2);
    move_x = after_point_x - before_point_x;
    move_x = Math.round(move_x * 100) / 100;

  //Y
    before_point_y = Math.sqrt((before_point[0]-frame_size*1)**2 + (before_point[1]-0)**2 + (before_point[2]-machine_hight)**2);
    after_point_y = Math.sqrt((after_point[0]-frame_size*1)**2 + (after_point[1]-0)**2 + (after_point[2]-machine_hight)**2);
    move_y = after_point_y - before_point_y;
    move_y = Math.round(move_y * 100) / 100;

  //Z
    before_point_z = Math.sqrt((before_point[0]-frame_size*0.5)**2 + (before_point[1]-frame_size*Math.sqrt(3))**2 + (before_point[2]-machine_hight)**2);
    after_point_z = Math.sqrt((after_point[0]-frame_size*0.5)**2 + (after_point[1]-frame_size*Math.sqrt(3))**2 + (after_point[2]-machine_hight)**2);
    move_z = after_point_z - before_point_z;
    move_z = Math.round(move_z * 100) / 100;

    //シフト
    for(var i=0; i<3; i++){
      before_point[i] = after_point[i];
    }
}

function Gcode_Start(){  //Gcode start
  content += [ "G90\n",  //Set to Absolute Positioning
              "M82\n",  //set extruder to absolute mode
              "M106 S0\n" ,      //Fan On
              "M109 S" + Extruder + "\n"].join(""); //Set Extruder Temperature and Wait

  //原点(フレームの中心かつ接地する点→BOAのグリッドのスタート地点)
  before_point = [frame_size*0.5, frame_size*0.5/Math.sqrt(3), 0];
  after_point = [StartX, StartY, print_hight];
  movement_calculater(before_point, after_point);

  content += [ "G1 X" + move_x + " Y" + move_y + " Z" + move_z + " F1000 ;Move to new Origin\n",
              "G92\n", //Set Position
              "G1 F" + HSpeed + "\n\n"].join(""); //Set Moving Speed
}

function  Gcode_End(){ //Gcode end
  content += ["\n",
              "G92 E0\n",  //Set Position
              "M104 S0\n", //Set Extruder Temperature
              "M140 S0\n",  //Bed Temperature
              "M84"].join("");  //Stop idle hold
}
