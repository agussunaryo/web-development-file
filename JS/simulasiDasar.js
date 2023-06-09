/*
	Simulasi Dasar merupakan kumpulan kode yang digunakan untuk mempermudah pembuatan simulasi menggunakan kode HTML 5
	Programer 		: Wandah Wibawanto
	Lisensi			: CC, SA, BY (Creative Common, Share Alike, Credit)
	
	inisiasi awal diperlukan untuk mengaktivasi kode
		var canvas = document.getElementById("scene");
		var konten = canvas.getContext("2d");
		
	log 5 juni 2021 - penambahan fitur touch untuk gawai touchscreen
	*/
	//tombol
	//struktur xt, yt, pt, lt, nama
	var tombolDB = [];
	var sliderDB = [];
	var dragDB = [];
	var inputDB = [];
	var inputAktif = "";
	var isActive = true;
	var konten;
	var canvas;
	var isLocal = false;
	var touchX = 0;
	var touchY = 0;
	var tobj;
	
	function resetTombol(){
		tombolDB = [];
	}
	function resetInteraktif(){
		tombolDB = [];
		var i;
		//slider
		if (sliderDB.length > 0){
			for (i=0;i<sliderDB.length;i++){
				sliderDB[i].isPushed = false;
			}
		}
		sliderDB = [];
		//input
		if (inputDB.length > 0){
			for (i=0;i<inputDB.length;i++){
				inputDB[i].isPushed = false;
			}
		}
		inputDB = [];
		dragDB = [];
	}
	
	function resetSlider(){
		sliderDB = [];
	}
	
	function tombol(nama, x, y, p, l, fnt='bold 12pt Calibri', fontclr = "#000", sclr="#000", fclr="#adadad", isr="", func=null){
		if (isr=="r"){
			kotakr(x,y,p,l,8, 1, sclr, fclr);
		}else{
			kotak(x,y,p,l,1, sclr, fclr);
		}
		//nama tombol jika memiliki id, maka yang dipakai adalah id
		var lbl = nama.split("/id=");
		var label = lbl[0];
		var namatombol = label;
		//console.log(lbl.length);
		if (lbl.length>1){
			namatombol = lbl[1];
		}
		konten.textBaseline = "middle";
		teks(label, x+p/2, y+l/2, fnt, fontclr);
		konten.textBaseline = "alphabetic";
		//push tombol ke db
		var isPushed = false;
		if (tombolDB.length>0){
			for (var i=0;i<tombolDB.length;i++){
				if (tombolDB[i][0] == namatombol) isPushed = true;
			}			
		}
		if (!isPushed){
			var dataTombol = [namatombol, x, y, p, l, func];
			tombolDB.push(dataTombol);
		}
	}
	
	function tombolImg(nama, x, y, p, l, src, func=null){
		gambar(src, x, y);
		//nama tombol jika memiliki id, maka yang dipakai adalah id
		var lbl = nama.split("/id=");
		var label = lbl[0];
		var namatombol = label;
		//console.log(lbl.length);
		if (lbl.length>1){
			namatombol = lbl[1];
		}		
		//push tombol ke db
		var isPushed = false;
		if (tombolDB.length>0){
			for (var i=0;i<tombolDB.length;i++){
				if (tombolDB[i][0] == namatombol) isPushed = true;
			}			
		}
		if (!isPushed){
			var dataTombol = [namatombol, x, y, p, l, func];
			tombolDB.push(dataTombol);
		}
	}
	
	function cekTombol(e){
		if (isActive){
			var res = "";
			//var id = document.getElementById("scene");
			var xClick = e.pageX - tobj.offsetLeft;
			var yClick = e.pageY - tobj.offsetTop;
			//mobile
			if (isMobile){
				xClick = touchX;
				yClick = touchY;
			}
			if (tombolDB.length>0){
				for (var i=0; i<tombolDB.length;i++){
					var dt = tombolDB[i];
					if (xClick > dt[1] && xClick < (dt[1]+dt[3]) && yClick > dt[2] && yClick < (dt[2]+dt[4])){
						res = dt[0];
						//tombol fungsi
						if (dt[5]!=null) {
							dt[5]();
						}
					}
				}
			}
			return res;
		}
	}
	//slider
	function slider (data){
		if (data.tipe == "H" || data.tipe == "h"){
			//slider H
			if (data.label != ""){
				teks(data.minS+" "+data.label, data.x+20, data.y+5, "12pt Calibri", "#000", "right");
				teks(data.maxS+" "+data.label, data.x+45+data.p, data.y+5, "12pt Calibri", "#000", "left");
			}
			kotakr(data.x+30, data.y, data.p, 5, 2);
			var posX = (data.valS-data.minS)/(data.maxS-data.minS) * data.p;
			kotakr(data.x+30, data.y, posX, 5, 2, 1, "000", "#adadad");
			//slider		
			kotakr(data.x+30+posX-6, data.y-6, 18, 17, 2);
		}else{
			//slider V
			if (data.label != ""){
				teks(data.maxS+" "+data.label, data.x, data.y+5, "12pt Calibri", "#000", "center");
				teks(data.minS+" "+data.label, data.x, data.y+data.p+43, "12pt Calibri", "#000", "center");
			}
			kotakr(data.x, data.y+20, 5, data.p, 2);
			var posY = (data.valS-data.minS)/(data.maxS-data.minS) * data.p;
			kotakr(data.x, data.y+20+data.p-posY, 5, posY, 2, 1, "000", "#adadad");
			//slider		
			kotakr(data.x-7, data.y+data.p+11-posY, 19, 18, 2);
		}
		//push ke database
		//push tombol ke db
		if (data.isPushed == undefined || data.isPushed == null || data.isPushed == false){
			data.isPushed = true;
			sliderDB.push(data);
		}		
	}
	
	function cekSlider(e){
		if (isActive){
		var res = null;
		//var id = document.getElementById("scene");
		var xClick = e.pageX - tobj.offsetLeft;
		var yClick = e.pageY - tobj.offsetTop;
		//mobile
			if (isMobile){
				xClick = touchX;
				yClick = touchY;
			}
		var cPos = 0;
		if (sliderDB.length>0){
			for (var i=0; i<sliderDB.length;i++){
				var dt = sliderDB[i];
				if (dt.tipe == "H" || dt.tipe == "h"){
					//slider horisontal
					var xPos = ((dt.valS-dt.minS)/(dt.maxS-dt.minS) * dt.p);
					if (xClick > (dt.x+20+xPos) && xClick < (dt.x+xPos+40) && yClick > dt.y-6 && yClick < (dt.y+12)){		
						if (xClick<dt.x+30) xClick = dt.x+30;
						if (xClick>dt.x+dt.p+30) xClick = dt.x+dt.p+30;
						dt.valS = (((xClick - (dt.x+30))/dt.p)*(dt.maxS-dt.minS))+dt.minS;
						dt.valS = dt.valS.toFixed(dt.desimal);
						res = dt;					
					}else{
						//click di bar slider
						if (xClick > dt.x+30 && xClick < dt.x+dt.p+30 &&  yClick>dt.y-6 && yClick < dt.y+12 ){
							dt.valS = (((xClick - (dt.x+30))/dt.p)*(dt.maxS-dt.minS))+dt.minS;
							dt.valS = dt.valS.toFixed(dt.desimal);
							res = dt;
						}
					}
				}else{
					//slider vertikal
					var yPos = ((dt.valS-dt.minS)/(dt.maxS-dt.minS) * dt.p);
					if (yClick > (dt.y+dt.p+11-yPos) && yClick < (dt.y+38+dt.p-yPos) && xClick > dt.x-10 && xClick < (dt.x+15)){		
						if (yClick<dt.y+20) yClick = dt.y+20;
						if (yClick>dt.y+dt.p+20) yClick = dt.y+dt.p+20;
						dt.valS = ((dt.y+dt.p+20-yClick)/dt.p)*(dt.maxS-dt.minS)+dt.minS;
						dt.valS = dt.valS.toFixed(dt.desimal);
						res = dt;					
					}else{
						if (xClick > dt.x-10 && xClick < dt.x+15 && yClick > dt.y+20 && yClick < dt.y+dt.p+20){
							dt.valS = ((dt.y+dt.p+20-yClick)/dt.p)*(dt.maxS-dt.minS)+dt.minS;
							dt.valS = dt.valS.toFixed(dt.desimal);
							res = dt;
						}
					}
				}
			}
		}
		return res;
		}
	}
	
	
	//fungsi teks
	function teks(txt, px, py, fnt='bold 16pt Calibri', clr='#2f2f2f', alg='center' ){
		konten.font = fnt;
		konten.fillStyle = clr;
		konten.textAlign = alg;
		//if (txt.indexOf("^")>-1 || txt.indexOf("_")>-1){
			
		//}else{			
			konten.fillText(txt, px, py);
		//}
	}
	//membuat garis
	function garis(x1,y1, x2, y2, tbl=1, clr="#000", st=""){
		if (st.length>0){
			var stx = st.split("-");
			if (stx[0] == "dash"){
				if (stx[1] == undefined || stx[1] == null) stx[1] = 5;
				if (stx[2] == undefined || stx[2] == null) stx[2] = 3;
				var dashArr = [];				
				for (var i=1;i<stx.length;i++){
					dashArr.push(stx[i]);
				}
				konten.setLineDash(dashArr);
			}
		}
		konten.strokeStyle = clr;
		konten.lineWidth = tbl;
		konten.beginPath();
		konten.moveTo(x1,y1);
		konten.lineTo(x2,y2);
		konten.stroke();
		konten.setLineDash([]);
	}
	//membuat kotak
	function kotak(x,y, p, l, tbl=1, sclr="#000", fclr="#fff", st=""){
		if (st.length>0){
			var stx = st.split("-");
			if (stx[0] == "dash"){
				if (stx[1] == undefined || stx[1] == null) stx[1] = 5;
				if (stx[2] == undefined || stx[2] == null) stx[2] = 3;
				var dashArr = [];				
				for (var i=1;i<stx.length;i++){
					dashArr.push(stx[i]);
				}
				konten.setLineDash(dashArr);
			}
		}
		konten.beginPath();
		konten.rect(x, y, p, l);
		if (fclr!="none"){
			konten.fillStyle = fclr;
			konten.fill();
		}
		if (sclr!="none"){
			konten.lineWidth = tbl;
			konten.strokeStyle = sclr;
			konten.stroke();
			konten.setLineDash([]);
		}
	}
	
	//membuat lingkaran
	function lingkaran(x, y, r, tbl=1, sclr="#000", fclr="#fff", st=""){
		if (st.length>0){
			var stx = st.split("-");
			if (stx[0] == "dash"){
				if (stx[1] == undefined || stx[1] == null) stx[1] = 5;
				if (stx[2] == undefined || stx[2] == null) stx[2] = 3;
				var dashArr = [];				
				for (var i=1;i<stx.length;i++){
					dashArr.push(stx[i]);
				}
				konten.setLineDash(dashArr);
			}
		}
		konten.beginPath();
		konten.arc(x, y, r, 0, 2 * Math.PI, false);
		if (fclr!="none"){
			konten.fillStyle = fclr;
			konten.fill();
		}
		if (sclr!="none"){
			konten.lineWidth = tbl;
			konten.strokeStyle = sclr;
			konten.stroke();
			konten.setLineDash([]);
		}
	}
	//fungsi menambahkan gambar
	function gambar(imgSrc, x=0, y=0, ob={}){
		var px = x;
		var py = y;
		if (ob.x != undefined) px+= ob.x;
		if (ob.y != undefined) py+= ob.y;
		if (ob.r != undefined){
			if (ob.r == 0){
				konten.drawImage(imgSrc, px, py);
			}else{
				konten.save();
				konten.translate(x, y);
				konten.rotate(ob.r*Math.PI/180.0);
				konten.translate(-x, -y);
				konten.drawImage(imgSrc, px, py);
				konten.restore();
			}
		}else{
			konten.drawImage(imgSrc, px, py);
		}
	}
	//fungsi untuk menggambar panah
	function panah(x,y,p,t,skala, tebal, warna) {
		var theta = Math.atan2(t,p);
		konten.strokeStyle = warna;
		konten.lineWidth = tebal;
		konten.beginPath();
		konten.moveTo(x, y);
		konten.lineTo(x+skala*p, y-skala*t);
		konten.stroke();
		konten.lineWidth = 2;
		var d = Math.sqrt(p*p+t*t);
		if (d > 5) d = 5;
		konten.fillStyle = warna;
		konten.beginPath();
		konten.moveTo(x+skala*p-3*d*Math.cos(theta+0.25*(Math.PI/2)),y-skala*t+3*d*Math.sin(theta+0.25*(Math.PI/2)));
		konten.lineTo(x+skala*p,y-skala*t);
		konten.lineTo(x+skala*p-3*d*Math.cos(theta-0.25*(Math.PI/2)),y-skala*t+3*d*Math.sin(theta-0.25*(Math.PI/2)));
		konten.stroke();
		konten.fill();
    }
	//fungsi menggambar kertas grafik
	function grafik(data){
		//background grafik
		konten.fillStyle = data.warnaBG;
		konten.fillRect(data.startX, data.startY, data.tileW*data.dataW, data.tileW*data.dataH);

		var axisLabel = '';
		var axisValue = 0;

		konten.lineWidth = 1;
		konten.strokeStyle = data.warnaGaris;

		// grid vertikal
		for (var i = 0; i <= data.dataW; i++) {
			konten.beginPath();
			konten.moveTo(data.startX+data.tileW*i, data.startY);
			if (data.offsetY >= data.dataH){
				//axis diposisi paling bawah
				konten.lineTo(data.startX+data.tileW*i, data.startY+data.tileW*data.dataH+5);
				konten.stroke();
			}else{
				//offset y normal
				konten.lineTo(data.startX+data.tileW*i, data.startY+data.offsetY*data.tileW+5);
				konten.stroke();
				konten.moveTo(data.startX+data.tileW*i, data.startY+data.offsetY*data.tileW+data.tileW-5);
				konten.lineTo(data.startX+data.tileW*i, data.startY+data.tileW*data.dataH);
				konten.stroke();
			}			
			
			if (data.xLabel != "noaxis"){
				konten.font = data.fontLabel;
				konten.fillStyle = data.warnaLabel;
				konten.textAlign = 'center';
				konten.textBaseline = 'middle';
				axisValue = data.skalaX*(i-data.offsetX);
				axisLabel = axisValue.toFixed(data.desimalX);				
				if (i != data.offsetX || data.yLabel == "noaxis") konten.fillText(axisLabel, data.startX+data.tileW*i, data.startY+data.offsetY*data.tileW+0.5*data.tileW);				
			}
		}

		//grid horisontal
		for (i = 0; i <= data.dataH; i++) {
			konten.beginPath();
			if (data.yLabel == "noaxis" || data.offsetX > 0){
				konten.moveTo(data.startX, data.startY+data.tileW*i);
			}else{
				konten.moveTo(data.startX-5, data.startY+data.tileW*i);
			}
			if (data.offsetX > 0) konten.lineTo(data.startX+data.tileW*data.offsetX-(data.tileW-5), data.startY+data.tileW*i);
			konten.moveTo(data.startX+data.tileW*data.offsetX-5, data.startY+data.tileW*i);			
			konten.lineTo(data.startX+data.tileW*data.dataW, data.startY+data.tileW*i);			
			konten.stroke();
			if (data.yLabel != "noaxis"){
				konten.font = data.fontLabel;
				konten.fillStyle = data.warnaLabel;
				konten.textAlign = 'center';
				konten.textBaseline = 'middle';
				axisValue = data.skalaY*-(i-data.offsetY);
				axisLabel = axisValue.toFixed(data.desimalY);
				if (i != data.offsetY || data.xLabel == "noaxis")konten.fillText(axisLabel, data.startX-0.5*data.tileW+data.offsetX*data.tileW, data.startY+data.tileW*i+3);
				if (data.offsetX == 0 && i == data.offsetY) konten.fillText("0", data.startX-0.5*data.tileW+data.offsetX*data.tileW, data.startY+data.tileW*i+3);
			}
		}

         // x-axis
		if (data.xLabel != "noaxis"){
			panah(data.startX-1+data.offsetX*data.tileW, data.startY+data.offsetY*data.tileW,data.tileW*(data.dataW-data.offsetX)+25, 0, 1, 4, data.warnaGaris);
			konten.font = '16pt Calibri';
			konten.fillStyle = data.warnaLabel;
			konten.textAlign = 'left';
			konten.fillText(data.xLabel, data.startX+data.tileW*data.dataW+30, data.startY+data.offsetY*data.tileW);
			if (data.offsetX > 0){
				panah(data.startX-1+data.offsetX*data.tileW, data.startY+data.offsetY*data.tileW,-data.tileW*data.offsetX-25, 0, 1, 4, data.warnaGaris);
			}
		}
		if (data.yLabel != "noaxis"){
			// y-axis
			if (data.offsetY > 0) panah(data.startX+data.offsetX*data.tileW, data.startY+data.offsetY*data.tileW, 0, data.offsetY*data.tileW+25,1,4,data.warnaGaris);
			if (data.offsetY <= data.dataH){
				var ox = 0;
				if (data.offsetX > 0) ox = 27;
				if (data.offsetY < data.dataH)panah(data.startX+data.offsetX*data.tileW, data.startY+data.offsetY*data.tileW, 0, -data.dataH*data.tileW+data.offsetY*data.tileW-ox,1,4,data.warnaGaris);
			}
			konten.textAlign = 'center';
			konten.font = '16pt Calibri';
			konten.fillStyle = data.warnaLabel;
			if (data.offsetY > 0){
				konten.fillText(data.yLabel, data.startX+data.offsetX*data.tileW, data.startY-40);
			}else{
				konten.fillText(data.yLabel, data.startX+data.offsetX*data.tileW, data.startY+data.tileW*data.dataH + 40);
			}
		}
	}
	
	//pengait
	function pengait(x,y, l, tbl=1, dir = 1,clr="#000"){
		konten.lineWidth = tbl;
		konten.strokeStyle = clr;
		var cy;		
		konten.beginPath();
		if (dir == 1){
			cy = y+(l/3);
			konten.arc(x, cy, l/3, 1*Math.PI, 2.5 * Math.PI);
			konten.moveTo(x,cy+(l/3));
			konten.lineTo(x,y+l);
		}
		if (dir == 2){
			cy = y+(l*2/3);
			konten.arc(x, cy, l/3, 0, 1.5 * Math.PI);
			konten.moveTo(x,cy-(l/3));
			konten.lineTo(x,y);
		}
		konten.stroke();
	}
	
	//grid scale V
	
	
	function gridV(data){		
		// draw the grid
		for (var i=0; i<=data.total; i++)
        {
			garis(data.startX, data.startY+i*data.skalaGrid, data.startX-7, data.startY+i*data.skalaGrid, 1, data.warnaGaris);
        }
        for (i=0; i<data.label.length; i++)
        {
			teks(data.label[i], data.startX-20, data.startY+i*data.skalaGrid*data.labelY+5, data.fontLabel, data.warnaLabel, "right");
			garis(data.startX-7, data.startY+i*data.skalaGrid*data.labelY, data.startX-14, data.startY+i*data.skalaGrid*data.labelY, 1, data.warnaGaris);
        }
        
	}
	//kotak rounded
	function kotakr(x, y, width, height, radius=5, tbl = 1, stroke="#000", fill="#fff") {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
		konten.beginPath();
		konten.moveTo(x + radius.tl, y);
		konten.lineTo(x + width - radius.tr, y);
		konten.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		konten.lineTo(x + width, y + height - radius.br);
		konten.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		konten.lineTo(x + radius.bl, y + height);
		konten.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		konten.lineTo(x, y + radius.tl);
		konten.quadraticCurveTo(x, y, x + radius.tl, y);
		konten.closePath();
		if (fill!="none"){
			konten.fillStyle = fill;
			konten.fill();
		}
		if (stroke!="none"){
			konten.lineWidth = tbl;
			konten.strokeStyle = stroke;
			konten.stroke();
		}	
	}
	function kotakrs(x, y, width, height, radius=5, tbl = 1, stroke="#000", fill="#fff", shad="none") {
		radius = {tl: radius, tr: radius, br: radius, bl: radius};
		konten.beginPath();
		konten.moveTo(x + radius.tl, y);
		konten.lineTo(x + width - radius.tr, y);
		konten.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		konten.lineTo(x + width, y + height - radius.br);
		konten.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		konten.lineTo(x + radius.bl, y + height);
		konten.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		konten.lineTo(x, y + radius.tl);
		konten.quadraticCurveTo(x, y, x + radius.tl, y);
		konten.closePath();
		konten.strokeStyle = stroke;
		konten.stroke();
		if(shad!="none"){			
			konten.shadowColor = "rgba(0,0,0,0.3)";
			konten.shadowBlur = 5;
			konten.shadowOffsetX = 10;
			konten.shadowOffsetY = 10;
		}
		
		konten.fillStyle = fill;
		konten.fill();
		konten.lineWidth = tbl;	
		//netralkan
		konten.shadowColor = "";
		konten.shadowBlur = 0;
		konten.shadowOffsetX = 0;
		konten.shadowOffsetY = 0;
	}
	//gambar berotasi
	function gambarR(imgSrc, x, y, w, h, degrees){
			konten.save();
			konten.translate(x+w/2, y+h/2);
			konten.rotate(degrees*Math.PI/180.0);
			konten.translate(-x-w/2, -y-h/2);
			konten.drawImage(imgSrc, x, y, w, h);
			konten.restore();				
	}
	//menggambar gear 
	function gear(data, ang){		
		var pi2     = 2 * Math.PI;            // cache 2xPI (360deg)
		var angle   = pi2 / (data.notches * 2);
		var taperAI,taperAO;
		taperAI = angle * data.taperI * 0.005; // inner taper offset (100% = half notch)
		taperAO = angle * data.taperO * 0.005; // outer taper offset		
		
		var a = angle,                  // iterator (angle)
		toggle  = false;                  // notch radius level (i/o)
		
		var ac = ang*Math.PI/180; //rotasi dari gear
		konten.beginPath();
		// move to starting point
		konten.moveTo(data.cx + data.radiusO * Math.cos(taperAO+ac), data.cy + data.radiusO * Math.sin(taperAO+ac));
		
		// loop
		for (; a <= pi2; a += angle) {

			// draw inner to outer line
			if (toggle) {
				konten.lineTo(data.cx + data.radiusI * Math.cos(a - taperAI+ac),
						   data.cy + data.radiusI * Math.sin(a - taperAI+ac));
				konten.lineTo(data.cx + data.radiusO * Math.cos(a + taperAO+ac),
						   data.cy + data.radiusO * Math.sin(a + taperAO+ac));
			}

			// draw outer to inner line
			else {
				konten.lineTo(data.cx + data.radiusO * Math.cos(a - taperAO+ac),  // outer line
						   data.cy + data.radiusO * Math.sin(a - taperAO+ac));
				konten.lineTo(data.cx + data.radiusI * Math.cos(a + taperAI+ac),  // inner line
						   data.cy + data.radiusI * Math.sin(a + taperAI+ac));
			}

			// switch level
			toggle = !toggle;
		}
		// close the final line
		konten.closePath();
		// Punch hole
		konten.moveTo(data.cx + data.radiusH, data.cy);
		konten.arc(data.cx, data.cy, data.radiusH, 0, pi2);
		// now fill using even-odd rule
		if (data.warnaIsi == undefined || data.warnaIsi == null) data.warnaIsi = "#5c5c5c";
		konten.fillStyle = data.warnaIsi;
		konten.fill("evenodd");

		// stroke
		konten.lineWidth = 2;
		if (data.warnaGaris == undefined || data.warnaGaris == null) data.warnaGaris = "black";
		konten.strokeStyle = data.warnaGaris;
		konten.stroke();		
	}
	
	function roda(data, ang){
		var x = data.cx;
		var y = data.cy;
		var r1 = data.radiusO;
		var r2 = data.radiusH;
		var tbl = data.tbl;
		var jari = {cx:x, cy:y, notches:4, radiusO:r1, radiusI:r2+tbl, radiusH:tbl, taperO:70, taperI:5}
		gear(jari, -22.5+ang);
		konten.beginPath();
		var p2 = 2 * Math.PI ;
		var ac = ang*Math.PI/180;
		konten.arc(x, y, r1, ac, p2+ac, false);
		konten.arc(x, y, r1-tbl, ac, p2+ac, false);
		konten.fill("evenodd");
		konten.lineWidth = 2;
		konten.strokeStyle = "#000";
		konten.stroke();//
	}
	
	function cariSudut(cx, cy, ex, ey) {
		  var dy = ey - cy;
		  var dx = ex - cx;
		  var theta = Math.atan2(dy, dx); // range (-PI, PI]
		  theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
		  if (theta < 0) theta = 360 + theta; // range [0, 360)
		  return theta;
	}
	
	var warnaBG;
	var funcDB = [];
	function hapusLayar(wrn=warnaBG, ob = {}){
		warnaBG = wrn;
		konten.clearRect(0, 0, canvas.width, canvas.height);
		konten.fillStyle = warnaBG;
		konten.fillRect(0, 0, canvas.width, canvas.height);
		if (ob.stat == "run") {
			funcDB.push(ob.func);
		}
		if (ob.stat == "clear") {
			funcDB = [];
		}
		if (funcDB.length>0) jalankan(funcDB[0]);
		
	}
	//-------------drag
	var xClickOld = 0;
	var yClickOld = 0;
		
	function startDrag(func){
		xClickOld = 0;
		yClickOld = 0;
		canvas.onmousemove = func;
	}
	
	function setDrag(data){
		data.ox = data.x;
		data.oy = data.y;
		dragDB.push(data);
	}
	
	function cekDrag(e){
		if (isActive){
		var res = null;
		var id = document.getElementById("scene");
		var xClick = e.pageX - id.offsetLeft;
		var yClick = e.pageY - id.offsetTop;
		if (xClickOld == 0) {
			xClickOld = xClick;
		}
		if (yClickOld == 0) {
			yClickOld = yClick;
		}		
			
		if (dragDB.length>0){
			for (var i= dragDB.length-1;i>=0;i--){
				var data = dragDB[i];
				if (xClick>data.x && xClick<data.x+data.w && yClick > data.y && yClick < data.y+data.h){
					//mouse di area
					var xd=0;
					var yd=0;
					//console.log("xo = "+xClickOld+"  x now = "+xClick);
					if (xClick != xClickOld){
						xd = xClick - xClickOld;
						xClickOld = xClick;
					}
					if (yClick != yClickOld){
						yd = yClick - yClickOld;
						yClickOld = yClick;
					}
					//console.log("xo = "+xClickOld+"  xd = "+xd);
					if (data.limit == "x" || data.limit == "xy") data.x+=xd;
					if (data.limit == "y" || data.limit == "xy") data.y+=yd;
					if (data.limit.includes("radius")){
						var dis = Number(data.limit.substr(7));
						var nx = data.x+xd;
						var ny = data.y+yd;
						//cek jarak
						if (jarak(data.ox, data.oy, nx, ny) < dis){
							data.x = nx;
							data.y = ny;
						}	
					}
					res = {nama:data.nama, dx:xd, dy:yd};		
					return res;
				}
			}
		}
		return res;
		}
	}
	
	function getPixel(x, y)
	{
		var p = konten.getImageData(x, y, 1, 1).data; 
		var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);  
		return hex;
	}

	function rgbToHex(r, g, b) {
		if (r > 255 || g > 255 || b > 255)
			throw "Invalid color component";
		return ((r << 16) | (g << 8) | b).toString(16);
	}
	
	function jarak(x1, y1, x2, y2){
		var res = 0;
		res = Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
		return res;
	}
	
	function jarakObjek(ob1, ob2){
		return jarak(ob1.x, ob1.y, ob2.x, ob2.y);
	}
	
	//image loader
	var images = {};
	var loadedImages = 0;
	var numImages = 0;
	function siapkanGambar(sources, callback) 
	{
		// get num of sources
		for (var src in sources) {
			numImages++;
		}
		//gambar preloader
		hapusLayar();
		teks("loading", canvas.width/2, canvas.height/2-20, 'bold 14pt Calibri', 'white', 'center');
		kotakr(canvas.width/2-150, canvas.height/2-10, 300, 15, 4, 2, "white", "none");
		
		for (var src in sources) {
			images[src] = new Image();
			images[src].onload = function() {
				//tampilkan preloading baris
				hapusLayar();
				teks("loading", canvas.width/2, canvas.height/2-20, 'bold 14pt Calibri', 'white', 'center');
				var persen = loadedImages/numImages*300; //300 = panjang preloader
				kotakr(canvas.width/2-150, canvas.height/2-10, persen, 15, 4, 2, "white", "white");
				kotakr(canvas.width/2-150, canvas.height/2-10, 300, 15, 4, 2, "white", "none");
				if (++loadedImages >= numImages) {
					callback(images);
				}
			};
			//console.log(sources[src]);
			//if (isLocal) sources[src] = "http://localhost/"+sources[src];
			images[src].src = sources[src];
		}
	}
	
	  function pegas(data){
		var x1=data.x1, y1=data.y1, x2=data.x2, y2=data.y2, windings=data.putaran, width=data.lebar, offset=data.offset, col1=data.warna1, col2=data.warna2, lineWidth=data.tebal;
        var x = x2 - x1;
        var y = y2 - y1;
        var dist = Math.sqrt(x * x + y * y);
        
        var nx = x / dist;
        var ny = y / dist;
        konten.strokeStyle = col1
        konten.lineWidth = lineWidth;
        konten.lineJoin = "round";
        konten.lineCap = "round";
        konten.beginPath();
        konten.moveTo(x1,y1);
        x1 += nx * offset;
        y1 += ny * offset;
        x2 -= nx * offset;
        y2 -= ny * offset;
        var x = x2 - x1;
        var y = y2 - y1;
        var step = 1 / (windings);
        for(var i = 0; i <= 1-step; i += step){  // for each winding
            for(var j = 0; j < 1; j += 0.05){
                var xx = x1 + x * (i + j * step);
                var yy = y1 + y * (i + j * step);
                xx -= Math.sin(j * Math.PI * 2) * ny * width;
                yy += Math.sin(j * Math.PI * 2) * nx * width;
                konten.lineTo(xx,yy);
            }
        }
        konten.lineTo(x2, y2);
        konten.lineTo(x2 + nx * offset, y2 + ny * offset)
        konten.stroke();
        konten.strokeStyle = col2
        konten.lineWidth = lineWidth - 4;
        var step = 1 / (windings);
        konten.beginPath();
        konten.moveTo(x1 - nx * offset, y1 - ny * offset);
        konten.lineTo(x1, y1);
        konten.moveTo(x2, y2);
        konten.lineTo(x2 + nx * offset, y2 + ny * offset)
        for(var i = 0; i <= 1-step; i += step){  // for each winding
            for(var j = 0.25; j <= 0.76; j += 0.05){
                var xx = x1 + x * (i + j * step);
                var yy = y1 + y * (i + j * step);
                xx -= Math.sin(j * Math.PI * 2) * ny * width;
                yy += Math.sin(j * Math.PI * 2) * nx * width;
                if(j === 0.25){
                    konten.moveTo(xx,yy);
                
                }else{
                    konten.lineTo(xx,yy);
                }
            }
        }
        konten.stroke();
    }

   function termometer(data){
		var x = data.x, y = data.y, l = data.l, t=data.t, min = data.min, max = data.max, val=data.val, off=data.offset;
		var l2 = l/2;
		konten.beginPath();
		konten.lineWidth = 2;
		konten.strokeStyle = data.warnaGaris;
		konten.arc(x+l2, y+l2, l2, Math.PI, Math.PI*2);	
		konten.stroke();
		konten.beginPath();
		konten.arc(x+l2, y+1.2*l2+t+off*2, 1.5*l2, 1.7*Math.PI, Math.PI*3.3);		
		konten.stroke();
		garis(x, y+l2, x, y+t+off*2, 2, data.warnaGaris);
		garis(x+l, y+l2, x+l, y+t+off*2, 2, data.warnaGaris);
		//fill
		lingkaran(x+l2, y+1.2*l2+t+off*2, 1.5*l2-3, 1,data.warnaIsi, data.warnaIsi);
		data.ujungX = x+l2;
		data.ujungY = y+1.2*l2+t+off*2;
		if (val < min) val = min;
		if (val > max) val = max;
		var fillH = ((val-min)/(max-min))*t;
		
		kotak(x+3, y+t+off*2, l-6, -fillH, 1, data.warnaIsi, data.warnaIsi);
		//0 ke bawah
		kotak(x+3, y+t+off*2, l-6, l, 1, data.warnaIsi, data.warnaIsi);
		//labeling grid
		var skala = t/10;
		for (var i=0; i<=10; i++)
        {
			garis(x, y+t+off*2-i*skala, x+l/3, y+t+off*2-i*skala, 1, data.warnaGaris);
        }
		//label teks
		skala = t/(data.label.length-1);
		
		for (i=0; i<data.label.length; i++)
        {
			teks(data.label[i], x-5, y+t+off*2-i*skala+5, "10pt Calibri", data.warnaGaris, "right");
			
        }
		//show val
		if (data.showVal != null && data.showVal){
			if (data.val > max) data.val = max;
			teks(data.val.toFixed(data.desimal)+"â°", x+l/2, y-10, "12pt Calibri", data.warnaGaris, "center");
		}
	}
	
	//-------partikel------------
	
	
	function Particle(x, y, xs, ys, rad = 1) {
		this.x=x;
		this.y=y;
		this.xs=xs;
		this.ys=ys;
		this.life=0;
		this.rad = rad;
	}
	
	
	function api(data) {
		var ax = data.x, ay = data.y, speed = data.v, size = data.rad, max = data.max;
		if (data.db == null){
			data.db = [];
		}
        var particles = data.db;
		var col = data.warna;
		var c1, c2;
		//buat partikel baruvar
		var p = new Particle(ax, ay, (Math.random()*2*speed-speed)/2, 0-Math.random()*2*speed);
        particles.push(p);
    
		//Cycle through all the particles to draw them
		for (var i=0; i<particles.length; i++) {	
			var px = particles[i].x;
			var py = particles[i].y;
			var rad = (max-particles[i].life)/max*(size/2)+(size/2);
			var grd = konten.createRadialGradient(px, py, rad/4, px-rad/4, py, rad*1);
			if (col == "blue"){
				c1 = "rgba("+(10+(particles[i].life*2))+","+((particles[i].life*2)+60)+","+150+(particles[i].life*2)+","+(((max-particles[i].life)/max)*0.4)+")";
			}else{ 
				c1 = "rgba("+(260-(particles[i].life*2))+","+((particles[i].life*2)+50)+","+(particles[i].life*2)+","+(((max-particles[i].life)/max)*0.4)+")";
			}
			if (particles[i].life < 2+acak(3)){
				if (col == "blue"){
					c1 = "rgba(5, 233,254,1)";
				}else{
					c1 = "rgba(255, 234,104,1)";
				}
				grd = konten.createRadialGradient(px, py, rad/20, px-rad/20, py+rad/2, rad*1);
			}
			if (col == "blue"){
				c2 = "rgba("+((5+particles[i].life*2))+","+((particles[i].life*2)+50)+","+150+(particles[i].life*2)+",0)";
			}else{
				c2 = "rgba("+(260-(particles[i].life*2))+","+((particles[i].life*2)+50)+","+(particles[i].life*2)+",0)";
			}
			grd.addColorStop(0, c1);
			grd.addColorStop(1, c2);
			
			konten.beginPath();
			konten.fillStyle = grd;
			//Draw the particle as a circle, which gets slightly smaller the longer it's been alive for
			konten.arc(px,py,rad,0,2*Math.PI);
			konten.fill();
			var ox = particles[i].x;
			var oy = particles[i].y;
			//Move the particle based on its horizontal and vertical speeds
			particles[i].x+=particles[i].xs;
			particles[i].y+=particles[i].ys;
			
			//ada yang ngeblok
			if (data.blok != "none"){								
				if (particles[i].x > data.blok.x && particles[i].x < data.blok.x+data.blok.l){								
					if (particles[i].y < data.blok.y+data.blok.t+rad){						
						particles[i].y = oy;
						//particles[i].xs*=1.07;
					}
				}
			}

			particles[i].life++;
			//If the particle has lived longer than we are allowing, remove it from the array.
			if (particles[i].life >= max) {
				particles.splice(i, 1);
				i--;
			}
		}
	}
	
	function acak(num){
		return Math.floor(Math.random()*num);
	}
	
	//--------------tabung reaksi------------
	function tabung(data){
		if (data.tipe =="beaker"){
			//isi
			var dy = data.y+data.t;
			var h = data.vol/100*(data.t);
			if (data.vol>0){
				konten.beginPath();
				konten.fillStyle = hexToRGBA(data.warnaIsi, 0.7);
				konten.moveTo(data.x+4, dy-h);
				konten.lineTo(data.x+data.l-4, dy-h);
				konten.lineTo(data.x+data.l-4, data.y+data.t-data.rad);
				konten.arc(data.x+data.l-data.rad, data.y+data.t-data.rad, data.rad-4, 0, 0.5*Math.PI);
				konten.lineTo(data.x+data.rad+4, dy-4);
				konten.arc(data.x+data.rad, data.y+data.t-data.rad, data.rad-4, 0.5*Math.PI, Math.PI);
				konten.lineTo(data.x+4, dy-h);
				konten.fill();
			}
			//garis gelas
			konten.beginPath();
			konten.lineWidth = 2;
			konten.strokeStyle = hexToRGBA(data.warnaGaris, 0.8);
			konten.arc(data.x-data.rad, data.y+data.rad, data.rad, 1.5*Math.PI, 0);
			konten.moveTo(data.x-data.rad, data.y);
			konten.lineTo(data.x+data.l+data.rad, data.y);
			konten.stroke();
			konten.beginPath();
			konten.arc(data.x+data.l+data.rad, data.y+data.rad, data.rad, Math.PI, Math.PI*1.5);
			konten.moveTo(data.x+data.l, data.y+data.rad);
			konten.lineTo(data.x+data.l, data.y+data.t-data.rad);
			konten.arc(data.x+data.l-data.rad, data.y+data.t-data.rad, data.rad, 0, 0.5*Math.PI);
			konten.lineTo(data.x+data.rad, data.y+data.t);
			konten.arc(data.x+data.rad, data.y+data.t-data.rad, data.rad, 0.5*Math.PI, Math.PI);
			konten.lineTo(data.x, data.y+data.rad);						
			konten.stroke();
			
			//skala
			var skala = (data.t)/10;
			var skalaW = data.l/6;
			if (skalaW < 4) skalaW = 4;
			//console.log(skalaW);
			for (var i=0; i<=9; i++)
			{
				if (i>0) garis(data.x+4, data.y+data.t-i*skala, data.x+4+skalaW, data.y+data.t-i*skala, 1, data.warnaGaris);
			}
		}
	}
	
	function hexToRGBA(hex, alp){
		var c;
		if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
			c= hex.substring(1).split('');
			if(c.length== 3){
				c= [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c= '0x'+c.join('');
			return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alp+')';
		}
		throw new Error('Kode hex warna salah, cek ulang!!');
   }
	
	function gelembung(data, spd = 5) {
		var ax = data.x, ay = data.y+data.t-4, speed = 1, size = data.l/10, max = 60, l=data.l,h = data.vol/100*data.t; 
		if (data.bubbledb == null) {
			data.bubbledb = [];
			data.counter = 0;
		}
		if (size<5) size = 5;
        var particles = data.bubbledb;
		var c1, c2;
		//buat partikel baruvar
		var out = 10-spd;
		if (out<1) out = 1;
		data.counter++;
		if (data.counter>out){
			var p = new Particle(ax+acak(l-size*2)+size, ay, (Math.random()*2*speed-speed)/2, -Math.random()*2*speed);
			particles.push(p);
			data.counter = 0;
		}
    
		//Cycle through all the particles to draw them
		for (var i=0; i<particles.length; i++) {	
			var px = particles[i].x;
			var py = particles[i].y;
			var rad = (max-particles[i].life)/max*(size/2)+(size/2);
			var grd = konten.createRadialGradient(px, py, rad/4, px-rad/4, py, rad*1);
			c1 = "rgba(255,245,245,0.2)";
			c2 = "rgba(0, 18, 71, 0)";
			
			grd.addColorStop(0, c1);
			grd.addColorStop(1, c2);
			
			konten.beginPath();
			konten.fillStyle = grd;
			//Draw the particle as a circle, which gets slightly smaller the longer it's been alive for
			konten.arc(px,py,rad,0,2*Math.PI);
			konten.fill();
			var ox = particles[i].x;
			var oy = particles[i].y;
			//Move the particle based on its horizontal and vertical speeds
			particles[i].x+=particles[i].xs;
			particles[i].y+=particles[i].ys;
			
			//di dalam area terus
			if (particles[i].x < ax+rad || particles[i].x > ax+l-size-4) particles[i].x = ox;
			if (particles[i].y < ay-h+size) particles[i].life = max;

			particles[i].life++;
			//If the particle has lived longer than we are allowing, remove it from the array.
			if (particles[i].life >= max) {
				particles.splice(i, 1);
				i--;
			}
		}
	}
	function uap(data, spd = 5) {
		var ax = data.x, ay = data.y+data.t-4, speed = 1, size = data.l/5, max = 60, l=data.l,h = data.vol/100*(data.t); 
		if (data.smokedb == null) {
			data.smokedb = [];
			data.smokecounter = 0;
		}
		if (size<5) size = 5;
        var particles = data.smokedb;
		var c1, c2;
		//buat partikel baruvar
		var out = 10-spd;
		if (out<1) out = 1;
		data.smokecounter++;
		if (data.smokecounter>out){
			var p = new Particle(ax+acak(l-size*2)+size, ay-h-size, (Math.random()*speed-speed)/2, -Math.random()*2*speed);
			particles.push(p);
			data.smokecounter = 0;
		}
    
		//Cycle through all the particles to draw them
		for (var i=0; i<particles.length; i++) {	
			var px = particles[i].x;
			var py = particles[i].y;
			var rad = particles[i].life/2+20;
			var grd = konten.createRadialGradient(px, py, rad/4, px-rad/4, py, rad*1);
			c1 = "rgba(255,255,255,0.2)";
			c2 = "rgba(200, 200, 200, 0)";
			
			grd.addColorStop(0, c1);
			grd.addColorStop(1, c2);
			
			konten.beginPath();
			konten.fillStyle = grd;
			//Draw the particle as a circle, which gets slightly smaller the longer it's been alive for
			konten.arc(px,py,rad,0,2*Math.PI);
			konten.fill();
			var ox = particles[i].x;
			var oy = particles[i].y;
			//Move the particle based on its horizontal and vertical speeds
			particles[i].x+=particles[i].xs;
			particles[i].y+=particles[i].ys;
			
			//di dalam area botol
			if (particles[i].y > data.y){
				if (particles[i].x < ax+rad || particles[i].x > ax+l-size-4) particles[i].x = ox;
			}

			particles[i].life++;
			//If the particle has lived longer than we are allowing, remove it from the array.
			if (particles[i].life >= max) {
				particles.splice(i, 1);
				i--;
			}
		}
	}
	
	function air(data) {
		var ax = data.x, ay = data.y, speedx = data.vx, speedy = data.vy, g = data.grav, size = data.rad, max = data.max;
		if (data.db == null){
			data.db = [];
		}
        var particles = data.db;
		var col = data.warna;
		var c1, c2, c3;
		//buat partikel baruvar
		//for (var m=0;m<3;m++){
		var p = new Particle(ax, ay, speedx+(acak(10)-acak(10))/30, speedy+(acak(10)-acak(10))/30, size+(acak(10)-acak(10))/10);
        particles.push(p);
		//}
    
		//Cycle through all the particles to draw them
		for (var i=0; i<particles.length; i++) {	
			var px = particles[i].x;
			var py = particles[i].y;
			var rad = particles[i].rad-particles[i].life/20;
			var grd = konten.createRadialGradient(px, py, rad/5, px-rad/5, py, rad*1);			
			c1 = "rgba(200,200,255, 0.6)";
			//c1 = hexToRGBA(data.warna, 0.5);
			c2 = hexToRGBA(data.warna, 0);
			
			grd.addColorStop(0, c1);
			grd.addColorStop(1, c2);			
			konten.beginPath();
			konten.fillStyle = grd;
			//Draw the particle as a circle, which gets slightly smaller the longer it's been alive for
			konten.arc(px,py,rad,0,2*Math.PI);
			konten.fill();
			var ox = particles[i].x;
			var oy = particles[i].y;
			//Move the particle based on its horizontal and vertical speeds
			particles[i].x+=particles[i].xs;
			particles[i].y+=particles[i].ys;
			particles[i].ys+=g/100;
			//ada yang ngeblok
			if (data.blok != "none"){								
				//mantul bawah
				if (particles[i].y>data.blok.y-rad && particles[i].y<data.blok.y+data.blok.t+rad){
					if (particles[i].x > data.blok.x && particles[i].x < data.blok.x+data.blok.l) {
						particles[i].ys*=-.5;
						particles[i].x = ox;
						particles[i].y = oy;
					}
				}else if (particles[i].x>data.blok.x-rad && particles[i].y<data.blok.y+data.blok.t){
					if (particles[i].y > data.blok.y && particles[i].y < data.blok.y+data.blok.t+rad) {
						particles[i].xs*=-0.5;
						particles[i].x = ox;
						particles[i].y = oy;
					}
				}	
			}	

			particles[i].life++;
			//If the particle has lived longer than we are allowing, remove it from the array.
			if (particles[i].life >= max) {
				particles.splice(i, 1);
				i--;
			}
		}
	}

	function burner(data) {
		var x = data.x;
		var y = data.y;
		var width = data.l;
		var height = data.t;
		var stroke = data.warnaGaris;
		var fill = data.warnaIsi;
		var sum = width/2;
		kotakr(x+width/2-5, y-10, 10, height, 2, 2, "#9b6517", "#9b6517");
		var radius = width/3;
		if (radius > height/3) radius = height/3;
		radius = {tl: radius*2, tr: radius*2, br: radius, bl: radius};
		konten.beginPath();
		konten.moveTo(x + radius.tl, y);
		konten.lineTo(x + width - radius.tr, y);
		konten.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		konten.lineTo(x + width, y + height - radius.br);
		konten.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		konten.lineTo(x + radius.bl, y + height);
		konten.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		konten.lineTo(x, y + radius.tl);
		konten.quadraticCurveTo(x, y, x + radius.tl, y);
		konten.closePath();
		
		konten.fillStyle = hexToRGBA(fill, 0.3);
		konten.fill();
		konten.lineWidth = 2;
		konten.strokeStyle = stroke;
		konten.stroke();
		kotakr(x+width/2-sum/2, y-4, sum, 5, 2, 2, stroke, stroke);
	}
	
	function teksHTML(s, x0, y0,  maxW, fnt, col) {
	//parsing dulu font nya
	var jenisF = fnt.split("-");
	var fz = jenisF[1];
	var font = jenisF[1]; 
	var fontsize = Number(jenisF[0].substring(0,2));
	var align = jenisF[2];
	konten.textAlign = "left";
	var spasi = 1.5;
	if (jenisF[3] != undefined || jenisF[3]!= null){
		spasi = Number(jenisF[3]);
		
	}
	//console.log("font = "+font+"  "+spasi+" "+align);
    // 2d canvas context, string, pos.x, pos.y, left/right/center, font, font height, color
    // Convert html code to a series of individual strings, each displayable by fillText().
    font = 'px '+font
    var lines = []
    var line = [0]
    var part = '' // the text element preceding a '<'
    var cmd = ''
    var bold = false
    var italic = false
    var sup = false
    var sub = false
    var x = 0, y = 0
    var dx, start
    var legal = ['b', 'strong', 'i', 'em', 'sup', 'sub']
	var rx = 0;
	var words = "";
	var temp = "";
	var otemp = "";
	var sisa = part;
	var potong = "";
    
	function add_part() {
        var style = ''
        var fs = fontsize
        if (bold) style += 'bold '
        if (italic) style += 'italic '
        if (sup || sub) {
            fs = 0.8*fontsize
            if (sup) y -= 0.3*fontsize // y increases downward in 2D canvas
            else y += 0.3*fontsize
        }
        konten.font = style+fs+font;
		words = part.split(" ");
		temp = "";
		otemp = "";
		sisa = part;
		potong = "";
		rx = 0;
		for (var i=0; i<words.length;i++){
			otemp = temp;
			temp+=words[i]+" ";
			dx = x+konten.measureText(temp).width;
			rx = x+konten.measureText(otemp).width;
			if (dx > maxW){
				potong+=otemp;
				//console.log("temp >>>" +otemp);
				line.push([x,y,konten.font,otemp, rx]);
				//sisa yang belum ke push
				sisa = part.substring(potong.length);
				//netralkan semua
				i--;
				x = 0;
				y = 0;
				temp = "";
				//ganti baris
				lines.push(line);
				line = [0];				
			}
		}
		if (sisa.length > 0){
			//console.log("sisa >>" +sisa);
			dx = konten.measureText(sisa).width;
			rx = x+dx;
			line.push([x, y, konten.font, sisa, rx]);			
			part = '';			
			x += dx;
		}
		//diubah disini*/
		
    }

    function end_line() {
        if (part !== '') add_part()
        line[0] = x
        lines.push(line)
        line = [0]
        x = y = 0
    }

    for (var i=0; i<s.length; i++) {
        var c = s[i]
        if (c == '\n') {
            end_line()
        } else if (c != '<') {
            part += c // a part of the text
        } else { // encountered '<'
            //if (part !== '') add_part()
            start = i+1
            i++
            cmd = s[i]
            var end = false
            if (cmd == '/') {
                cmd = ''
                end = true
            }
            var ok = true
            for (i=i+1; i<s.length; i++) {
                if (s[i] == '<') { // This means that the intial '<' did not start a command
                    i = i-1 // back up
                    part += '<'+cmd
                    add_part()
                    ok = false // signal that we encountered '<'
                    break
                }
                if (s[i] == '>') break
                cmd += s[i]
            }
            if (!ok) continue
            if (cmd == 'br' || cmd == 'br/') {
                end_line()
            } else {
                if (legal.indexOf(cmd) >= 0 && part !== '') add_part()
                switch (cmd) {
                    case 'b':
                    case 'strong':
                        bold = !end
                        break
                    case 'i':
                    case 'em':
                        italic = !end
                        break
                    case 'sup':
                        sup = !end
                        if (end) y = 0
                        break
                    case 'sub':
                        sub = !end
                        if (end) y = 0
                        break
                    default:
                        part += '<'+cmd+'>'
                }
            }
        }
    }
	//sisa text yang masih belum keparsing
	//console.log("sisa t = "+part);
    if (part.length > 0) {
		words = part.split(" ");
		temp = "";
		otemp = "";
		sisa = part;
		potong = "";
		konten.font = fontsize+font;
		for (i=0; i<words.length;i++){
			otemp = temp;
			temp+=words[i]+" ";
			dx = x+konten.measureText(temp).width;
			rx = x+konten.measureText(otemp).width;
			if (dx > maxW){
				potong+=otemp;
				//console.log("temp >>>" +temp);
				line.push([x,y,konten.font,otemp, rx]);
				//sisa yang belum ke push
				sisa = part.substring(potong.length);
				//netralkan semua
				x = 0;
				y = 0;
				i--;
				temp = "";
				//ganti baris
				lines.push(line);
				line = [0];				
			}
		}
		if (sisa.length > 0){
			//console.log("sisa >>" +sisa);
			dx = konten.measureText(sisa).width;
			rx = x+dx;
			line.push([x, y, konten.font, sisa, rx]);	
			lines.push(line);
			part = '';			
			x += dx;
		}
		/*line.push([x, y, fontsize+font, part])
		//console.log(part);
		konten.font = fontsize+font
		line[0] = x + konten.measureText(part).width
		lines.push(line)*/
	}
    var width, L
    var nline = 0
    // Each line in lines starts with the total width of the line, followed by
    // elements of the form {x, y, font, text}, where x and y start at zero.
    var maxwidth = -1	
    for (L in lines) {
        if (lines[L][0] > maxwidth) maxwidth = lines[L][0]
		//console.log(">>"+lines[L]);
    }
    for (L in lines) {
		//console.log("y before = "+y0);
        y0 += spasi*fontsize;
        nline++		
		//console.log("y before = "+y0+ "   >> "+nline);
        for (var p in lines[L]) {
            var k = lines[L][p]
			
            if (k[1] === undefined) {
                width = k
                continue
            }
			var ta = lines[L][lines[L].length-1];
			if (ta.length>1){
				rx = ta[4];
				//console.log("rx = "+rx);
			}
            konten.font = k[2]
            konten.fillStyle = col;
            switch (align) {
                case 'left':
                    x = x0 + k[0]
                    y = y0 + k[1]
                    break
                case 'center':
					x = x0 +  maxW/2+ k[0] - rx/2;
                    y = y0 + k[1]
                    break
                case 'right':
					x = x0 + k[0]+maxW - rx;
                    y = y0 + k[1]
                    break
                default:
                    throw new Error(align+' is not a possible alignment option.')
            }
			//console.log(maxW+" "+k[3]);
            konten.fillText(k[3], x, y)
        }
    }
}

var inputBlinking;
	var blinkcode = "";
	
	
	function teksInput(data){
		//hapus dulu sebelum menggambar
		konten.clearRect(data.x-1, data.y-1, data.p+2, data.t+2);
		var cl = warnaBG;
		if (data.warnaLayar != undefined){
			cl = data.warnaLayar;
		}
		konten.fillStyle = cl;
		konten.fillRect(data.x-1, data.y-1, data.p+2, data.t+2);
		kotakr(data.x, data.y, data.p, data.t, 5, 1, "#212121");
		//hitung panjang kata
		var t_display = data.val;
		var lt = konten.measureText(t_display).width;
		var nt = 1;
		//terlalu panjang untuk area, maka potong bagian depan
		while (lt > data.p - 10){
			t_display = t_display.substring(nt);
			lt = konten.measureText(t_display).width;
		}
		konten.textBaseline = "middle";
		teks(t_display+blinkcode, data.x+5, data.y+data.t/2, data.huruf, "#212121", "left");
		konten.textBaseline = "alphabetic";
		//push tombol ke db
		if (data.isPushed == undefined || data.isPushed == null  || data.isPushed == false){
			data.isPushed = true;
			inputDB.push(data);
		}
	}
	
	function cekTeksInput(e){
		//console.log("cek input");
		if(isActive){
		var res = "";
		var id = document.getElementById("scene");
		var xClick = e.pageX - id.offsetLeft;
		var yClick = e.pageY - id.offsetTop;
		var findInput = false;		
		if (inputDB.length>0){
			for (var i=0; i<inputDB.length;i++){
				var dt = inputDB[i];				
				if (xClick > dt.x && xClick < (dt.x+dt.p) && yClick > dt.y && yClick < (dt.y+dt.t)){
					res = dt;					
					findInput = true;
				}
			}			
		}
		//hapus jika klik di luar objek
		if (!findInput && inputAktif.nama != "" ){
			//hapus listener
			blinkcode = "";
			teksInput(inputAktif);
			//console.log("last active = "+inputAktif.val);
			inputAktif = "";			
			window.removeEventListener("keydown", tombolditahan, false);
			window.removeEventListener("keypress", tombolditekan, false);
			clearInterval(inputBlinking);
		}
		
		if (findInput && (inputAktif == "" || inputAktif.nama != res.nama)){
			if (inputAktif.nama != res.nama){
				//hapus listener lama dulu
				blinkcode = "";
				teksInput(inputAktif);
				window.removeEventListener("keydown", tombolditahan, false);
				window.removeEventListener("keypress", tombolditekan, false);
				clearInterval(inputBlinking);				
			}
			//tambahkan listener untuk membaca tombol
			inputAktif = res;
			window.addEventListener("keydown", tombolditahan, false);
			window.addEventListener("keypress", tombolditekan, false);
			inputBlinking = setInterval(isBlink, 300);
		}
		return res;
		}
	}
	
	function isBlink(){
		if (blinkcode == ""){
			blinkcode = "|";
		}else{
			blinkcode = "";
		}
		teksInput(inputAktif);
	}
	
	function tombolditahan(e){
		var keycode = parseInt(e.which);
		
		//delete or backspace
		if (keycode == 46 || keycode == 8) {
		  event.preventDefault(); //prevent back navigation from backspace
		  inputAktif.val = inputAktif.val.slice(0,inputAktif.val.length-1);
		  teksInput(inputAktif);
		}
	  }
	function tombolditekan(e){
		var keycode = parseInt(e.which);
		//console.log(keycode);
		if (keycode == 13){
			//console.log("enter");
			event.preventDefault();
			blinkcode = "";
			teksInput(inputAktif);
			//console.log("last active = "+inputAktif.val);
			inputAktif = "";			
			window.removeEventListener("keydown", tombolditahan, false);
			window.removeEventListener("keypress", tombolditekan, false);
			clearInterval(inputBlinking);
			return;
		}
		if (inputAktif.val.length < inputAktif.max)
		{
		  if (inputAktif.limit == "*"){
			inputAktif.val += String.fromCharCode(keycode);
		  }
		  if (inputAktif.limit == "0-9"){
			  if (keycode>=48 && keycode <= 57) inputAktif.val += String.fromCharCode(keycode);
		  }
		  if (inputAktif.limit == "a-z" || inputAktif.limit == "A-Z"){
			  if (keycode<48 && keycode > 57) inputAktif.val += String.fromCharCode(keycode);
		  }
		}
		teksInput(inputAktif);
	 }
	 
	 function gridBG(){
		kotak(0,0,canvas.width, canvas.height, 8, "rgba(255,255,255,0.2)", "none");
		var i;
		var tsize = 5;
		for (i=0;i<canvas.width/tsize;i++){
			garis(i*tsize, 0, i*tsize, canvas.height, 1, "rgba(255,255,255,0.07)");
			garis(0, i*tsize, canvas.width, i*tsize, 1, "rgba(255,255,255,0.07)");
		}
		for (i=0;i<canvas.width/(tsize*10);i++){
			garis(i*tsize*10, 0, i*tsize*10, canvas.height, 3, "rgba(255,255,255,0.04)");
			garis(0, i*tsize*10, canvas.width, i*tsize*10, 3, "rgba(255,255,255,0.04)");
		}
	}
	
	var popupAktif ="";
	
	function popup(data){
		isActive = false;
		kotak(0,0,canvas.width, canvas.height, 1, "black", "rgba(0,0,0,0.3)" );
		kotakrs(data.x, data.y, data.l, data.t, 10, 2, data.warnaGaris, data.warnaBG, "black");
		//text
		teksHTML(data.val, data.x+40, data.y+30, data.l-80, data.huruf, data.warnaHuruf);
		if (data.tutup == "ok"){
			//tombol
			tombol("OK/id=popup", data.x+data.l/2-40, data.y+data.t-50, 80, 30, "bold 14pt Calibri", "white", "#12b098", "#12b098", "r");
			//push data ke popup Aktif
			popupAktif = data;
		}
	}
	
	function cekPopup(e){
		if (popupAktif!=""){
			var t_pop = {x:popupAktif.x+popupAktif.l/2-40, y:popupAktif.y+popupAktif.t-50, l:80, t:30};
			var id = document.getElementById("scene");
			var xClick = e.pageX - id.offsetLeft;
			var yClick = e.pageY - id.offsetTop;
			if (xClick > t_pop.x && xClick < t_pop.x+t_pop.l && yClick > t_pop.y && yClick < t_pop.y+t_pop.t){
				//splice data tombol				
				for (var i=0;i<tombolDB.length;i++){
					if (tombolDB[i][0] == "popup"){
						tombolDB.splice(i,1);
					}
				}
				//ok ditekan
				isActive = true;
				//console.log("jalankan "+popupAktif.func);
				jalankan(popupAktif.func);
				popupAktif = "";				
			}			
		}
	}
	
	function jalankan(func){
		func();
	}
	
	function aturCanvas(){
		canvas = document.getElementById("scene");			
		konten = canvas.getContext("2d");
		//mobile?
		isMobile = deteksiMobile();
		if (isMobile){
			//set touch
			canvas.addEventListener("touchend", touchEnd, false);
			canvas.addEventListener("touchmove", touchMove, false);
			canvas.addEventListener("touchstart", touchStart, false);
			
			tobj = document.createElement('canvasesdiv');
			tobj.style.cssText = "position:relative; display:block; margin:auto; width:640px; height:480px";
		}
	}
	
	
	function setJudul(str){
		document.title = str;
	}
	
	var dataGambar = {};	
	//-----------------preload-------------------------------
	function preload(img, func){	
		var loc = window.location.href;
		var tt = loc.split(":");
		if (tt[0] == "file"){
			isLocal = true;
		}
		siapkanGambar(img, function(images) {
			dataGambar = images;
			console.log("gfx loaded");
			func();
		});
	}
	
function sprite(data, x, y, fr){
	var imgW = data.img.width;
	var imgH = data.img.height;
	var divX = Math.floor(imgW/data.imgW);
	var divY = Math.floor(imgH/data.imgH);
	var maxFrame = divX * divY;
	data.maxFrame = maxFrame;
	if (data.frame == undefined) data.frame = fr;
	var frameY = Math.floor((fr-1)/divX);
	var frameX = (fr-1)-frameY*divX;
	if (data.skala == undefined || data.skala == null) data.skala = 1;
	konten.drawImage(data.img, frameX * data.imgW, frameY * data.imgH, data.imgW, data.imgH, x, y, data.skala*data.imgW, data.skala*data.imgH);
}

function loopSprite(data, x, y){
	if (data.frame == undefined) {
		data.frame = 1;
		data.maxFrame = 10;
	}
	data.frame++;
	if (data.frame > data.maxFrame) data.frame = 1;
	sprite(data, x, y, data.frame);
}

function constraint(ob1, ob2, jarak, adj){
			var adj2 = 1-adj;
			var dist_x = ob1.x-ob2.x;
			var dist_y = ob1.y-ob2.y;
			var jarak_titik = Math.sqrt(dist_x*dist_x+dist_y*dist_y);
			var sudut_titik = -Math.atan2(dist_x, dist_y);
			var error = jarak_titik-jarak;
			ob1.x += (error*adj)*Math.sin(sudut_titik);
			ob1.y -= (error*adj)*Math.cos(sudut_titik);
			ob2.x -= (error*adj2)*Math.sin(sudut_titik);
			ob2.y += (error*adj2)*Math.cos(sudut_titik);
}

function rotasi(ob1, ob2){
	var rad =  -Math.atan2((ob1.x - ob2.x), (ob1.y - ob2.y)); 
	return rad * 180 / Math.PI;
}

function setApi(data1, data2){
	data2.x = data1.x+(data1.l/2);
	data2.y = data1.y-25;
	api(data2);
}


function cekHit(x, y, data, tipe){
	var res = false;
	if (tipe == "vol"){
		var h = data.vol/100*data.t; 
		var ay = data.y+data.t-4;
		if (x > data.x && x < data.x + data.l && y > ay - h && y < ay) res = true; 
	}
	return res;
}

function lensaCembung(x1, y1, radius, lensRadius, f){
	konten.strokeStyle = '#000';
	konten.lineWidth = 2;
	konten.beginPath();
	konten.moveTo(x1+0.71*radius,y1+lensRadius);
	konten.quadraticCurveTo(x1+0.71*radius-(110-f),y1,x1+0.71*radius,y1-lensRadius);
	konten.moveTo(x1+0.71*radius,y1+lensRadius);
	konten.quadraticCurveTo(x1+0.71*radius+(110-f),y1,x1+0.71*radius,y1-lensRadius);
	konten.fillStyle = "rgba(255,255,250,0.7)";
	konten.stroke();
	konten.fill();
}
function lensaCekung(x1, y1, radius, lensRadius, f){
	konten.strokeStyle = '#000';
	konten.lineWidth = 2;
	konten.beginPath();
	konten.moveTo(x1+0.71*radius-30,y1+lensRadius);
	konten.lineTo(x1+0.71*radius+30,y1+lensRadius);
	konten.quadraticCurveTo(x1+0.71*radius+30-(0.40*f+60),y1,x1+0.71*radius+30,y1-lensRadius);
	konten.lineTo(x1+0.71*radius-30,y1-lensRadius);
	konten.quadraticCurveTo(x1+0.71*radius-30+(0.4*f+60),y1,x1+0.71*radius-30,y1+lensRadius);
	konten.fillStyle = "rgba(255,255,250,0.7)";
	konten.stroke();
	konten.fill(); 
}
//-----------touch ------------------
var isMobile = false;
function deteksiMobile() {
		const toMatch = [
			/Android/i,
			/webOS/i,
			/iPhone/i,
			/iPad/i,
			/iPod/i,
			/BlackBerry/i,
			/Windows Phone/i
		];

		return toMatch.some((toMatchItem) => {
			return navigator.userAgent.match(toMatchItem);
		});
}

function touchMove(e){
	e.preventDefault();
	var id = document.getElementById("scene");
	touchX = e.targetTouches[0].pageX - id.offsetLeft;
	touchY = e.targetTouches[0].pageY - id.offsetTop;
}
function touchEnd(e){
	e.preventDefault();
	var id = document.getElementById("scene");
	touchX = e.targetTouches[0].pageX - id.offsetLeft;
	touchY = e.targetTouches[0].pageY - id.offsetTop;
}
function touchStart(e){
	e.preventDefault();
	var id = document.getElementById("scene");
	touchX = e.targetTouches[0].pageX - id.offsetLeft;
	touchY = e.targetTouches[0].pageY - id.offsetTop;
}
