

onmessage = function(e) {
 	gameMain.gridInfo = e.data.gridInfo;
	gameMain.grid = e.data.grid;
	gameMain.action = e.data.action;
	if(gameMain.action == "checkPath"){

	}else if(gameMain.action == "shuffle"){
		gameMain.shuffleGrid();
		postMessage({action:"shuffle",grid:gameMain.grid});
	}else if(gameMain.action == "getTips"){
		gameMain.getTips();
		postMessage({action:"getTips",allTips:gameMain.allTips});
	}
}

gameMain = {};
gameMain.isRuningPath = false;
gameMain.gridInfo = {};
gameMain.allTips = [];
gameMain.grid = [];


gameMain.shuffleGrid = function() {
	var array = [];

	for (var x = 0; x < this.grid.length; x++) {
		for (var y = 0; y < this.grid[x].length; y++) {
			if(this.grid[x][y].idCase != 0 && this.grid[x][y].idCase != -1){
				array.push(this.grid[x][y].idCase);
			}
		};
	};
	shuffle(array);
	for (var x = 0; x < this.grid.length; x++) {
		for (var y = 0; y < this.grid[x].length; y++) {
			if(this.grid[x][y].idCase != 0 && this.grid[x][y].idCase != -1){
				this.grid[x][y].idCase = array.pop();
			}
		};
	};
	return array;
	//this.updateAllCases();
};

gameMain.getTips = function() {
	this.allTips = [];
	for (var x = 0; x < this.grid.length-1; x++) {
		for (var y = 0; y < this.grid[x].length-1; y++) {
			if(this.grid[x][y].idCase == 0 || this.grid[x][y].idCase == -1){continue;}
			for (var x2 = 0; x2 < this.grid.length-1; x2++) {
				for (var y2 = 0; y2 < this.grid[x2].length-1; y2++) {
					if(this.grid[x2][y2].idCase == 0 || this.grid[x2][y2].idCase == -1){continue;}
					if(x == x2 && y == y2){continue;}
					if(this.grid[x][y].idCase == this.grid[x2][y2].idCase){
						this.checkPathBetweenCases(this.grid[x][y], this.grid[x2][y2],true);
					}
				};
			};
		};
	};
};


gameMain.checkPathBetweenCases = function(actualCase,caseEnd,isTest) {
	this.isRuningPath = true;
	this.checkPath(actualCase, actualCase, caseEnd, [0,-1], 0, [], {id:-1}, isTest);
	this.checkPath(actualCase, actualCase, caseEnd, [1,0] , 0, [], {id:-1}, isTest);
	this.checkPath(actualCase, actualCase, caseEnd, [0,1] , 0, [], {id:-1}, isTest);
	this.checkPath(actualCase, actualCase, caseEnd, [-1,0], 0, [], {id:-1}, isTest);
	this.isRuningPath = false;
};

gameMain.checkPath = function(actualCase,caseStart,caseEnd,direction,count,path,parent,isTest) {
	if(!this.isRuningPath){return;}
	if(count >this.gridInfo.GAME_CASE_ANGLE){return;}
	var possibleDirection = [[0,-1],[1,0],[0,1],[-1,0]];
	var neighbor;
	var nDir;
	path.push(actualCase);
	for(var i in possibleDirection){
		if(!this.isRuningPath){return;}
		nDir = possibleDirection[i];
		var neighbor = this.getNeighbor(actualCase, nDir[0], nDir[1]);
		if(this.neighborIsVoid(actualCase, nDir[0],nDir[1])){
			if(parent.id == neighbor.id){continue;}
			this.checkPath(neighbor,caseStart, caseEnd, nDir, ((direction[0] == nDir[0] && direction[1] == nDir[1])?count:(count+1)), path,actualCase,isTest);
		}else if(neighbor){
			if(((direction[0] == nDir[0] && direction[1] == nDir[1])?count:(count+1)) > this.gridInfo.GAME_CASE_ANGLE){continue;}
			if(neighbor.id == caseEnd.id){
				path.push(neighbor);
				if(isTest){
					this.allTips.push([neighbor,caseStart]);
				}else{
					for (var i = 0; i < path.length-1; i++) {
						c2_callFunction(C2FUNC.pathCreate,[path[i].logicX,path[i].logicY,path[i+1].logicX,path[i+1].logicY]);
						c2_callFunction(C2FUNC.addPathToCase,[caseStart.logicX,caseStart.logicY,path[i+1].logicX,path[i+1].logicY]);
					};
					c2_callFunction(C2FUNC.startMove,[caseStart.logicX,caseStart.logicY]);
					neighbor.destroy();
					caseStart.destroy();
				}
				this.isRuningPath = false;
			}
		}
	}
	path.pop();
};

gameMain.neighborIsVoid = function(caseGrid,logicX,logicY) {
	if(caseGrid.logicX + logicX >= this.gridInfo.GRID_WIDTH ||
		caseGrid.logicY + logicY >= this.gridInfo.GRID_HEIGHT ||
		caseGrid.logicX + logicX < 0 ||
		caseGrid.logicY + logicY < 0 ){return;}
	var neighbor = this.grid[caseGrid.logicX + logicX][caseGrid.logicY + logicY];
	if(!neighbor){return false}
	if(neighbor.idCase == 0){return true}
	else{return false}
};

gameMain.getNeighbor = function(caseGrid,logicX,logicY) {
	if(caseGrid.logicX + logicX >= this.gridInfo.GRID_WIDTH ||
		caseGrid.logicY + logicY >= this.gridInfo.GRID_HEIGHT ||
		caseGrid.logicX + logicX < 0 ||
		caseGrid.logicY + logicY < 0 ){return;}
	if(!caseGrid){return false}
	var neighbor = this.grid[caseGrid.logicX + logicX][caseGrid.logicY + logicY]
	if(!neighbor){return false}
	return neighbor;
};


function shuffle(array) {
	var m = array.length, t, i;
	// While there remain elements to shuffle…
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}