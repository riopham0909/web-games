
(function( window, undefined ) {
	var MahjongConnect = function(){		

		this.MAX_ROWS=14;
		this.MAX_COLS=14;
		this.MIN_ROWS=6;
		this.MIN_COLS=6;
		this.MAX_TYPES=30;
		
		this.lineWidth=3;
		this.Pictypes=15;
		this.picWidth=80;
		this.picHeight=80;
		this.leftPadding=0;
		this.topPadding=0;
		this.img;
		this.imgPosition;

		this.totalCount=0;
		this.moveType=0;
		this.selectedPoint = {
			row: 0,
			col: 0
		};
		
		this.lastSelectPoint = {
			row:0,
			col:0
		};
		
		this.hint = [];
		this.hinted = false;
		
		this.rows=0;
		this.cols=0;		
		this.fullMap=new Array();
		
		this.mapCanvasID="myCanvas";
		this.mapContext;
		this.mapCanvas;
		
		this.controlCanvasID="conCanvas";
		this.controlContext;
		this.controlCanvas;
		
		this.lineCanvasID="lineCanvas";
		this.lineContext;
		this.lineCanvas;
		
		this.success=function(){};
		this.passthrough = function(){};
		this.clearOne = function(){};

		this.SoundCG;
		this.SoundSelect;
		this.SoundDisappear;
		this.SoundResort;
		this.SoundNoDisappear;		
			
		this.IsNeedDrawLine = true;		
		
		this.icount=0;
		this.score=0;
		this.browser={    
			versions:function(){            
				var u = navigator.userAgent, app = navigator.appVersion;            
				return {                
					trident: u.indexOf('Trident') > -1, //IE core                
					presto: u.indexOf('Presto') > -1, //opera core                
					webKit: u.indexOf('AppleWebKit') > -1, //apple¡¢google core                
					gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //firefox core                
					mobile: !(u.indexOf('Windows')>-1) &&
						(!!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/)), //mobile                
					ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios                
					android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android                
					iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //iPhone QQHD                
					iPad: u.indexOf('iPad') > -1, //iPad                
					webApp: u.indexOf('Safari') == -1 //web           
				};
			}()
		}; 
		this.checkrows=this.browser.versions.mobile ? parseInt((window.innerHeight+2)/this.picHeight)-2 : 10;
		this.checkcols=this.browser.versions.mobile ? parseInt((window.innerWidth+2)/this.picWidth)-2 : 14;
	};
	MahjongConnect.prototype={
		
		select:function(row,col){
			if( row>0 && row<=this.rows && col>0 && col<=this.cols){
				if (this.fullMap[row][col]==0) {
					return;
				}
				if(this.hint.length > 0){
					// console.log(this.hint);
					this.clearBorder(this.controlContext,this.hint[0][0],this.hint[0][1]);
					this.clearBorder(this.controlContext,this.hint[1][0],this.hint[1][1]);
					this.hint.splice(0);
					this.hinted = false;
				}
				if(this.selectedPoint.row==0 || this.selectedPoint.col==0){//如何是第一次点击
					this.selectedPoint.row=row;
					this.selectedPoint.col=col;	
					this.drawBorder(this.controlContext,row,col,'#00ffaa');	
					//this.SoundSelect.currentTime=0;
					this.SoundSelect.play();
				}
				else{
					if (this.selectedPoint.row==row && this.selectedPoint.col==col){
						this.clearBorder(this.controlContext,this.selectedPoint.row,this.selectedPoint.col);
						this.selectedPoint.row=0;
						this.selectedPoint.col=0;	
						this.lastSelectPoint.row=0;
						this.lastSelectPoint.col=0;	
						return;
					}
					if (this.fullMap[this.selectedPoint.row][this.selectedPoint.col]==this.fullMap[row][col]){						
						if (this.checkRoad(this.selectedPoint.row,this.selectedPoint.col,row,col)){
							this.clearBorder(this.controlContext,this.selectedPoint.row,this.selectedPoint.col);
							this.clearBorder(this.controlContext,this.lastSelectPoint.row,this.lastSelectPoint.col);
							this.fullMap[this.selectedPoint.row][this.selectedPoint.col]=0;
							this.fullMap[row][col]=0;
							this.SoundDisappear.play();  
							this.clearOne();
							this.moveMap(row,col,this.selectedPoint.row,this.selectedPoint.col);
							this.drawMap();
							this.checkGameOver();								
							this.selectedPoint.row=0;
							this.selectedPoint.col=0;	
							this.lastSelectPoint.row=0;
							this.lastSelectPoint.col=0;		

						}
						else{
							if (this.lastSelectPoint.row==row && this.lastSelectPoint.col==col){
								this.clearBorder(this.controlContext,this.selectedPoint.row,this.selectedPoint.col);
								this.selectedPoint.row=row;
								this.selectedPoint.col=col;			
								this.drawBorder(this.controlContext,row,col,'#00ffaa');	
								this.lastSelectPoint.row=0;
								this.lastSelectPoint.col=0;
							}
							else{
								this.lastSelectPoint.row=row;
								this.lastSelectPoint.col=col;
								this.SoundNoDisappear.play();								
							}
						}
					}
					else{
						this.clearBorder(this.controlContext,this.selectedPoint.row,this.selectedPoint.col);
						this.selectedPoint.row=row;
						this.selectedPoint.col=col;			
						this.drawBorder(this.controlContext,row,col,'#00ffaa');
						this.SoundSelect.play();							
					}								
				}
			}
		},	
		checkGameOver : function() {
			this.totalCount--;
			this.totalCount--;
			if (!this.totalCount){
				this.SoundCG.play();
				// if(this.moveType<8){
					//alert("Congradulations!,Go Next!");
					// this.moveType++;
					this.passthrough();					
					this.createmap(this.rows,this.cols);
					// this.initCanvas();
					// this.drawMap();
				// }
				// else{
				// 	alert("Success!");
				// 	this.success();
				// }
			}else{
				this.IsNeedDrawLine=false;
				while(!this.isAlive()){
					this.resort();
					this.SoundResort.play();
					this.icount=this.icount+60;
				}
				this.IsNeedDrawLine=true;
			}			
		},
		
		manResort : function(){
			this.IsNeedDrawLine=false;
			this.resort();//
			while(!this.isAlive()){
				this.resort();
				this.icount=this.icount+60;
			}
			this.IsNeedDrawLine=true;
			
		},

		clickHint: function(){
			if(!this.hinted){
				for (var i=1;i<=this.rows;i++){
					for(var j=1;j<=this.cols;j++){
						if (this.fullMap[i][j]>0){
							if (this.isAliveOther(i,j)){
								for (var k = i ; k<=this.rows ;k++){
									for(var m=1;m<=this.cols;m++){
										if ((k==i && m>j) || k>i){
											if (this.fullMap[i][j]==this.fullMap[k][m]){
												if (this.checkRoad(i,j,k,m)) {
													this.drawBorder(this.controlContext,i,j,'#00ffaa');
													this.drawBorder(this.controlContext,k,m,'#00ffaa');
													this.hint.push([i, j]);
													this.hint.push([k, m]);
													this.hinted = true;
													return;
												}
											}
										}
									}	
								}
							}
						}
					}	
				}
			}	
		},
		
		
		isAlive : function(){
			for (var i=1;i<=this.rows;i++){
				for(var j=1;j<=this.cols;j++){
					if (this.fullMap[i][j]>0){
						if (this.isAliveOther(i,j)) return true;
					}
				}	
			}
			return false;
		},
		
		
		isAliveOther : function (_row,_col){
			for (var i = _row ; i<=this.rows ;i++){
				for(var j=1;j<=this.cols;j++){
					if ((i==_row && j>_col)	|| i>_row){
						if (this.fullMap[_row][_col]==this.fullMap[i][j]){
							if (this.checkRoad(_row,_col,i,j)) {
								// console.log(_row+'-'+_col+':'+i+'-'+j);
								return true;
							}
						}
					}
				}	
			}
			return false;
		},
		
		
		moveMap : function (row1,col1,row2,col2){			
			/**
			* moveType==1 move down
			*/		
			switch (this.moveType){	
					/**
				 * moveType==1 move down
				 */		
				case 1:
					if (col1==col2 && row1>row2){col2=row1;row1=row2;row2=col2;col2=col1;}
					for(i=row1;i>0;i--){this.fullMap[i][col1]=this.fullMap[i-1][col1];}
					for(i=row2;i>0;i--){this.fullMap[i][col2]=this.fullMap[i-1][col2];}
					break;
					/**
				 * moveType==2 move up
				 */		
				case 2:	    	
					if (col1==col2 && row1<row2){
						col2=row1;row1=row2;row2=col2;col2=col1;
					}
					for(i=row1;i<=this.rows;i++){
						this.fullMap[i][col1]=this.fullMap[i+1][col1];
					}
					for(i=row2;i<=this.rows;i++){
						this.fullMap[i][col2]=this.fullMap[i+1][col2];
					}
					break;
					/**
				 * moveType==3 move left
				 */		
				case 3:	    	
					if (row1==row2 && col1<col2){
						row2=col1;col1=col2;col2=row2;row2=row1;
					}
					for(i=col1;i<=this.cols;i++){
						this.fullMap[row1][i]=this.fullMap[row1][i+1];
					}
					for(i=col2;i<=this.cols;i++){
						this.fullMap[row2][i]=this.fullMap[row2][i+1];
					}
					break;
					/**
				 * moveType==1 move right
				 */		
				case 4:	
					if (row1==row2 && col1>col2){
						row2=col1;col1=col2;col2=row2;row2=row1;
					}
					for(i=col1;i>0;i--){
						this.fullMap[row1][i]=this.fullMap[row1][i-1];
					}
					for(i=col2;i>0;i--){
						this.fullMap[row2][i]=this.fullMap[row2][i-1];
					}
					break;
						
					/**
				 * moveType==5 split up down
				 */		
				case 5:	    	
					var _minrow=parseInt(this.rows/2);
					var _maxrow=_minrow+1;
					if (col1==col2){
						if(row1<row2 && row2<=_minrow){
							col2=row1;row1=row2;row2=col2;col2=col1;
						}
						if(row1>row2 && row2>=_maxrow){
							col2=row1;row1=row2;row2=col2;col2=col1;		    				
						}
					} 
					if (row1<=_minrow){
						for(i=row1;i<=_minrow;i++){
							this.fullMap[i][col1]= (i==_minrow ? 0 : this.fullMap[i+1][col1]);
						}
					}else{
						for(i=row1;i>=_maxrow;i--){
							this.fullMap[i][col1]=(i==_maxrow?0:this.fullMap[i-1][col1]);
						}
					}
					if (row2<=_minrow){
						for(i=row2;i<=_minrow;i++){
							this.fullMap[i][col2]=(i == _minrow ? 0 : this.fullMap[i+1][col2]);
						}
					}else{						
						for(i=row2;i>=_maxrow;i--){
							this.fullMap[i][col2]=(i==_maxrow?0:this.fullMap[i-1][col2]);
						}
					}
					break;		    	
					
					/**
				 * moveType==6 gather up down
				 */		
				case 6:	    	
					var _minrow=parseInt(this.rows/2);
					var _maxrow=_minrow+1;
					if (col1==col2){
						if(row1>row2 && row1<=_minrow){
							col2=row1;row1=row2;row2=col2;col2=col1;
						}
						if(row1<row2 && row1>=_maxrow){
							col2=row1;row1=row2;row2=col2;col2=col1;		    				
						}
					} 
					if (row1<=_minrow){
						for(i=row1;i>0;i--){
							this.fullMap[i][col1]=this.fullMap[i-1][col1];
						}
					}else{
						for(i=row1;i<=this.rows;i++){
							this.fullMap[i][col1]= this.fullMap[i+1][col1];
						}
					}
					if (row2<=_minrow){
						for(i=row2;i>0;i--){
							this.fullMap[i][col2]=this.fullMap[i-1][col2];
						}
					}else{
						for(i=row2;i<=this.rows;i++){
							this.fullMap[i][col2]= this.fullMap[i+1][col2];
						}
					}
					break;
					
					
					/**
				 * moveType==7 split left right
				 */		
				case 7:	    	
					var _mincol=parseInt(this.cols/2);
					var _maxcol=_mincol+1;
					if (row1==row2){
						if(col1<col2 && col2<=_mincol){
							row2=col1;col1=col2;col2=row2;row2=row1;
						}
						if(col1>col2 && col2>=_maxcol){
							row2=col1;col1=col2;col2=row2;row2=row1;		    				
						}
					} 
					if (col1<=_mincol){
						for(i=col1;i<=_mincol;i++){
							this.fullMap[row1][i]= (i==_mincol ? 0 : this.fullMap[row1][i+1]);
						}
					}else{
						for(i=col1;i>=_maxcol;i--){
							this.fullMap[row1][i]=(i==_maxcol?0:this.fullMap[row1][i-1]);
						}
					}
					if (col2<=_mincol){
						for(i=col2;i<=_mincol;i++){
							this.fullMap[row2][i]= (i==_mincol ? 0 : this.fullMap[row2][i+1]);
						}
					}else{
						for(i=col2;i>=_maxcol;i--){
							this.fullMap[row2][i]=(i==_maxcol?0:this.fullMap[row2][i-1]);
						}
					}
					break;		    	
					
					/**
				 * moveType==8 gather left right
				 */		
				case 8:	    	
					var _mincol=parseInt(this.cols/2);
					var _maxcol=_mincol+1;
					if (row1==row2){
						if(col1>col2 && col1<=_mincol){
							row2=col1;col1=col2;col2=row2;row2=row1;
						}
						if(col1<col2 && col1>=_maxcol){
							row2=col1;col1=col2;col2=row2;row2=row1;		    				
						}
					} 
					
					if (col1<=_mincol){
						for(i=col1;i>0;i--){
							this.fullMap[row1][i]=this.fullMap[row1][i-1];
						}
					}else{
						for(i=col1;i<=this.cols;i++){
							this.fullMap[row1][i]= this.fullMap[row1][i+1];
						}
					}
					if (col2<=_mincol){
						for(i=col2;i>0;i--){
							this.fullMap[row2][i]=this.fullMap[row2][i-1];
						}
					}else{
						for(i=col2;i<=this.cols;i++){
							this.fullMap[row2][i]= this.fullMap[row2][i+1];
						}
					}
					break;
				default:
			}
			
		},
		
		
		checkRoadRow : function (_col1,_col2,_row){
			var _min=_col1<_col2?_col1:_col2;
			var _max=_col1<_col2?_col2:_col1;
			for (var x=_min+1;x<_max;x++){
				if (this.fullMap[_row][x]!=0){
					return 1;
				}
			}
			return 0;
		},
		checkRoadCol : function (_row1,_row2,_col){
			var _min=_row1<_row2?_row1:_row2;
			var _max=_row1<_row2?_row2:_row1;
			for (var x=_min+1;x<_max;x++){
				if (this.fullMap[x][_col]!=0){
					return 1;
				}
			}
			return 0;
		},
		
		checkRoad : function(row1,col1,row2,col2){
			var icheck=0;
			
			if (Math.abs(row1-row2)+Math.abs(col1-col2)==1){
				this.drawLine(this.lineContext,row1,col1,row2,col2);
				return 1;
			}
			if (Math.abs(row1-row2)==1 && Math.abs(col1-col2)==1){
				if (this.fullMap[row1][col2]==0 || this.fullMap[row2][col1]==0){
					if(this.fullMap[row1][col2]==0){
						this.drawLine(this.lineContext,row1,col1,row1,col2);
						this.drawLine(this.lineContext,row1,col2,row2,col2);
					}
					else
					{
						if (this.fullMap[row2][col1]==0){
						this.drawLine(this.lineContext,row1,col1,row2,col1);
						this.drawLine(this.lineContext,row2,col1,row2,col2);
						}
					}
					return 1;
				}
				else{
					return 0;
				}
			}
			
			for (i=Math.max(row1,row2);i>=0;i--){
				icheck=0;
				if (col1==col2) {break}  
				if ((this.fullMap[i][col1]==0 || i==row1) && (i==row2 || this.fullMap[i][col2]==0)){ 
					icheck=icheck+ this.checkRoadCol(row1,i,col1);
					icheck=icheck+ this.checkRoadRow(col1,col2,i);
					icheck=icheck+ this.checkRoadCol(i,row2,col2);
				}
				else{
					icheck=1;
				}
				if (!icheck) {					
					this.drawLine(this.lineContext,row1,col1,i,col1);
					this.drawLine(this.lineContext,i,col1,i,col2);
					this.drawLine(this.lineContext,i,col2,row2,col2);
					return 1;
				}
			}			
			
			for (i=Math.max(row1,row2)+1;i<this.rows+2;i++){
				icheck=0;
				if (col1==col2) {break}  
				if ((this.fullMap[i][col1]==0 || i==row1) && (i==row2 || this.fullMap[i][col2]==0)){ 
					icheck=icheck+ this.checkRoadCol(row1,i,col1);
					icheck=icheck+ this.checkRoadRow(col1,col2,i);
					icheck=icheck+ this.checkRoadCol(i,row2,col2);
				}
				else{
					icheck=1;
				}
				if (!icheck) {					
					this.drawLine(this.lineContext,row1,col1,i,col1);
					this.drawLine(this.lineContext,i,col1,i,col2);
					this.drawLine(this.lineContext,i,col2,row2,col2);
					return 1;
				}
			}
			
						
			for (j=Math.max(col1,col2);j>=0;j--){
				icheck=0;
				if (row1==row2) {break} 
				if ((j==col1 || this.fullMap[row1][j]==0) && (j==col2 || this.fullMap[row2][j]==0)){
					icheck=icheck+ this.checkRoadRow(col1,j,row1);
					icheck=icheck+ this.checkRoadCol(row1,row2,j);
					icheck=icheck+ this.checkRoadRow(j,col2,row2);
				}
				else{
					icheck++;
				}
				if (!icheck) {
					this.drawLine(this.lineContext,row1,col1,row1,j);
					this.drawLine(this.lineContext,row1,j,row2,j);
					this.drawLine(this.lineContext,row2,j,row2,col2);
					return 1;
				}
			}

			
			for (j=Math.max(col1,col2)+1;j<this.cols+2;j++){
				icheck=0;
				if (row1==row2) {break} 
				if ((j==col1 || this.fullMap[row1][j]==0) && (j==col2 || this.fullMap[row2][j]==0)){
					icheck=icheck+ this.checkRoadRow(col1,j,row1);
					icheck=icheck+ this.checkRoadCol(row1,row2,j);
					icheck=icheck+ this.checkRoadRow(j,col2,row2);
				}
				else{
					icheck++;
				}
				if (!icheck) {
					this.drawLine(this.lineContext,row1,col1,row1,j);
					this.drawLine(this.lineContext,row1,j,row2,j);
					this.drawLine(this.lineContext,row2,j,row2,col2);
					return 1;
				}
			}
			return 0;
		},
		
		
		
		initCanvas: function(){		
			var that=this;	
			this.mapCanvas=document.getElementById(this.mapCanvasID);
			this.mapContext=this.mapCanvas.getContext('2d');
			this.lineCanvas=document.getElementById(this.lineCanvasID);
			this.lineContext=this.lineCanvas.getContext('2d');
			
			var elem = this.controlCanvas=document.getElementById(this.controlCanvasID);
			this.controlContext=this.controlCanvas.getContext('2d');
			elem.addEventListener('click',function(evt){
				var col=parseInt((evt.offsetX-that.leftPadding)/that.picWidth);
				var row=parseInt((evt.offsetY-that.topPadding)/that.picHeight);
				that.select(row,col);
			},false);
			var pWidth=this.leftPadding + this.picWidth*(this.cols+2);
			var pHeight=this.topPadding + this.picHeight*(this.rows+2);
			this.mapCanvas.width=this.controlCanvas.width=this.lineCanvas.width=pWidth;
			this.mapCanvas.height=this.controlCanvas.height=this.lineCanvas.height=pHeight;
		},
		
		clearBorder : function(ctx,y,x) {
			ctx.clearRect(x*this.picWidth+this.leftPadding+4,y*this.picHeight+this.topPadding-1,this.picWidth,this.picHeight);
		},
		
		drawLine : function(ctx,row1,col1,row2,col2){	
			
			if (!this.IsNeedDrawLine) return;		
			
			var x1=col1*this.picWidth+this.leftPadding+this.picWidth/2;
			var x2=col2*this.picWidth+this.leftPadding+this.picWidth/2;
			var y1=row1*this.picHeight+this.topPadding+this.picHeight/2;
			var y2=row2*this.picHeight+this.topPadding+this.picHeight/2;
			ctx.beginPath();  
			ctx.strokeStyle = "#ff0000";//#1d953f
			ctx.lineWidth = this.lineWidth;
			ctx.moveTo(x1,y1);  
			ctx.lineTo(x2,y2);  
			ctx.stroke();  
			ctx.closePath();
		},
		//
		drawBorder : function(ctx,y,x,color){
			ctx.beginPath();
			ctx.rect(x*this.picWidth+this.leftPadding + 5, y*this.picHeight+this.topPadding, this.picWidth - 2, this.picHeight - 2);
			ctx.lineWidth = 1;
			ctx.globalAlpha=0.4;
			ctx.fillStyle = color;  
			ctx.strokeStyle = color;
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		},
		
		
		drawBox : function(ctx,y,x,color){
			ctx.beginPath();
			ctx.rect(x*this.picWidth+this.leftPadding, y*this.picHeight+this.topPadding, this.picWidth, this.picHeight);
			ctx.lineWidth = 1;
			ctx.strokeStyle = "rgba(255,255,255,0)";
			ctx.fillStyle = 'rgba(255,255,255,0)';
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
			if (color){
				ctx.drawImage(this.img,0,this.imgPosition[color],120,120,x*this.picWidth+5+this.leftPadding, y*this.picHeight+this.topPadding,this.picWidth,this.picHeight);
			}
			else{
				this.clearBorder(ctx, y, x);
				// ctx.clearRect(x*this.picWidth+this.leftPadding-1,y*this.picHeight+this.topPadding-1,this.picWidth+2,this.picHeight+2);
			}
		},
		
		drawMap : function(){			
			for(i=0;i < this.rows+2;i++){
				for(j=0;j < this.cols+2;j++){
					if(i>=0 && i<=this.rows+1 && j>=0 && j<=this.cols+1){
						this.drawBox(this.mapContext,i,j,this.fullMap[i][j]);
					}
				}
			}
		},
		
		randomsort:function (a, b) {  
			return Math.random()>.5 ? -1 : 1;  
		},

		resort:function(){

			var rnd = [];
			for(i=1;i<this.rows+1;i++){
				for(j=1;j<this.cols+1;j++){
					if(this.fullMap[i][j]>0){
						rnd[rnd.length]=this.fullMap[i][j];
					}
				}
			}
			rnd.sort(this.randomsort);
			for(i=1;i<this.rows+1;i++){
				for(j=1;j<this.cols+1;j++){
					if(this.fullMap[i][j]>0){
						//rnd[rnd.length]=this.fullMap[i][j];
						this.fullMap[i][j]=rnd[0];
						rnd.splice(0,1);
					}
				}
			}
			this.drawMap();
		},


		createmap: function(_rows,_cols) {
			
			// _rows = (_cols==6 && _rows>10) ? 12 : _rows;
			// _rows = (_cols==8 && _rows>10) ? 12 : _rows;
			// _rows = (_cols==14 ) ? 10 : _rows;
			
						
			// _rows=_rows*_cols%2?_rows-1:_rows;
			
			this.picTypes=parseInt(_rows*_cols/2);
			this.picTypes=this.picTypes>this.MAX_TYPES?this.MAX_TYPES:this.picTypes;
			
			
			this.rows=Math.min(_rows,this.MAX_ROWS);
			this.cols=Math.min(_cols,this.MAX_COLS);

						
			// this.leftPadding=(window.innerWidth+2-(this.cols+2)*this.picWidth)/2;
			this.leftPadding=($('#gameContainer').width()-(this.cols+2)*this.picWidth)/2;
			
			this.topPadding=($('#gameContainer').height() - 120 -(this.rows+3)*this.picHeight)/2;
			// this.topPadding=(window.innerHeight+2-(this.rows+2)*this.picHeight)/2;
			// this.leftPadding=this.leftPadding>=0 ? this.leftPadding :0;
			// this.topPadding=this.topPadding>=0 ? this.topPadding :0;
			// console.log(this.leftPadding)
			// console.log(this.topPadding)
			this.totalCount=this.rows*this.cols;
			var rnd = [];
			for(var i=1;i<=(this.rows)*(this.cols)/2;i++)
			{
				var r = parseInt(Math.random()*this.picTypes+1);
				rnd[rnd.length]=rnd[rnd.length+1]=r;
			}		
			
			var _array1=new Array();
			for(i=0;i<this.rows+2;i++){
				_array1[i]=new Array();
				for(j=0;j<this.cols+2;j++){
					if(i>0 && i<this.rows+1 && j>0 && j<this.cols+1){
						var k = parseInt(Math.random()*rnd.length);
						_array1[i][j] = rnd[k];
						rnd.splice(k,1);
					}else{
						_array1[i][j] = 0; 
					}
				}
			}
			this.fullMap=_array1;		
		},
	
	};
	window.MahjongConnect=MahjongConnect;
})(window);