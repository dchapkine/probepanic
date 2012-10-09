
/**
 * Simple bomber-man like game prototype written in 600 lines of pure js/html5/css3
 *
 * @see http://www.nihilogic.dk/labs/canvas_sheet/HTML5_Canvas_Cheat_Sheet.pdf
 * @see http://uncyclopedia.wikia.com/wiki/File:Bomb.png
 * @see http://us.battle.net/sc2/en/game/unit/probe
 * @see http://us.battle.net/sc2/en/game/unit/hellion
 * @see http://html5snippet.net/#snippet/33
 * @see https://twitter.com/html5snippet/status/68143525065261056
 *
 * @author dmitri chapkine 2011
 */
var game = (function(){

    /**
	 * Tile width / height
	 */
	var TW = 64;
	var TH = 64;

    var game = {
        
        canvas: null,
        canvasw: 0,
        canvash: 0,
        g: null,
        
        /**
         * 0    floor(empty)
         * 1    destroyable wall
         * 2    undestroyable wall
         * 3    player initial position
         * 4    ennemy's initial positions
         * 5    bombs
         * 6    exit
         */
        map: 
		[
        /*    [3, 0, 0, 2, 2, 2, 0],
            [0, 1, 0, 0, 0, 2, 0],
            [2, 0, 1, 0, 0, 1, 1],
            [2, 0, 1, 1, 2, 2, 6]],*/
		
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 3, 0, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 4, 0, 0, 1, 4, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 4, 0, 0, 0, 0, 4, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 4, 2],
        [2, 0, 4, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 4, 1, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 4, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 1, 1, 0, 1, 4, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 4, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 2],
        [2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 4, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2],
        [2, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2],
        [2, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 4, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2],
        [2, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 1, 2],
        [2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 4, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2],
        [2, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 2],
        [2, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 4, 0, 2],
        [2, 0, 1, 0, 0, 0, 0, 4, 1, 0, 4, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 4, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 2],
        [2, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 2],
        [2, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 4, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 4, 0, 0, 0, 2],
        [2, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 4, 2],
        [2, 0, 4, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 4, 0, 0, 1, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 2],
        [2, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2],
        [2, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 4, 0, 1, 0, 0, 0, 0, 4, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 4, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 4, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 4, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2],
        [2, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
        ],
        
        score: 0,
        lives: 3,
        
        time: 400,
        
        initmap: [],
        
        mapw: 0,
        maph: 0,
        
        player: {dir: {x: 0, y:0}, lastDir: {x: 0, y: 0}},
        
        exit: {},
        
        bombs: [],
        
        ennemy: [],
        
        keys: {up: false, down: false, left: false, right: false},
        
        drawInterval: 0,
        moveEnnemyInterval: 0,
        bombTickInterval: 0,
        
        keyUpListener: null,
        
        init: function()
        {
            var that = this;
            
            this.canvas = document.getElementById('c');
            this.g = this.canvas.getContext('2d');
            this.keyUpListener = function(e)
            {
                switch (e.keyCode)
                {
                    case 32:
                        var hasBombedHere = false;
                        for (var i in that.bombs)
                        {
                            if (that.bombs[i] && that.bombs[i].x == Math.floor(that.player.x+0.5) && that.bombs[i].y == Math.floor(that.player.y+0.5))
                            {
                                hasBombedHere = true;
                            }
                        }
                        if (!hasBombedHere)
                            that.bombs.push({x: Math.floor(that.player.x+0.5), y: Math.floor(that.player.y+0.5), dropTimestamp: that.getTimestamp()});
                    break;
                    
                    case 37:
                        that.keys.left = false;
                    break;
                    
                    case 38:
                        that.keys.up = false;
                    break;
                    
                    case 39:
                        that.keys.right = false;
                    break;
                    
                    case 40:
                        that.keys.down = false;
                    break;
                }
            };
            this.keyDownListener = function(e)
            {
                switch (e.keyCode)
                {
                    case 37:
                        that.keys.left = true;
                    break;
                    
                    case 38:
                        that.keys.up = true;
                    break;
                    
                    case 39:
                        that.keys.right = true;
                    break;
                    
                    case 40:
                        that.keys.down = true;
                    break;
                }
            };
			
			
            window.addEventListener('keyup', this.keyUpListener);
            window.addEventListener('keydown', this.keyDownListener);
            
			//
            // init viewport & level size
			//
			this.viewport = {
				width: this.canvas.width,
				height: this.canvas.height
			};
			
			this.level = {
				width: Math.floor(this.map[0].length) * TW,
				height: this.map.length * TW
			};
			
			
			this.mapw = this.map[0].length;
            this.maph = this.map.length;
            
            // init player and ennemies
            for (var i in this.map)
            {
                this.initmap[i] = [];
                for (var j in this.map[i])
                {
                    this.initmap[i].push(this.map[i][j]);
                    switch (this.map[i][j])
                    {   
                        // player
                        case 3:
                            this.player.x = j;
                            this.player.y = i;
							
							// replace with ground tile
							this.map[i][j] = 0;
							
                        break;
                        
                        // exit
                        case 6:
                            this.exit.x = j;
                            this.exit.y = i;
							
							// replace with ground tile
							this.map[i][j] = 0;
							
                        break;
                        
                        // ennemy
                        case 4:
                            this.ennemy.push({x: j, y: i, dir: {x: 1, y: 0}});
							
							// replace with ground tile
							this.map[i][j] = 0;
							
                        break;
                    }
                }
            }
            
            // loading sprites
            this.img = new Image();
            this.img.onload = function()
            {
                that.drawInterval = setInterval(function(){that.draw.call(that)}, 1000/20);
                that.moveEnnemyInterval =setInterval(function(){that.moveEnnemy.call(that)}, 1000/30);
                that.bombTickInterval =setInterval(function(){that.bombTick.call(that)}, 30);
                that.movePlayerInterval = setInterval(function(){that.movePlayer.call(that)}, 1000/80);
                that.timeoutTickInterval = setInterval(function()
                {
                    that.time--;
                    if (that.time == 0)
                    {
                        that.lives--;
                        that.restart();
                    }
                }, 1000);
            };
            this.img.src = "img/game-sprite.png";
        },
        
        tryAgain: function()
        {
            document.getElementById('game').style.display = 'block';
            document.getElementById('youlose').style.display = 'none';
            this.lives = 3;
            this.score = 0;
            this.restart();
        },
        
        restart: function(map)
        {
            clearInterval(this.drawInterval);
            clearInterval(this.movePlayerInterval);
            clearInterval(this.moveEnnemyInterval);
            clearInterval(this.bombTickInterval);
            clearInterval(this.timeoutTickInterval);
            window.removeEventListener('keyup', this.keyUpListener);
            window.removeEventListener('keydown', this.keyDownListener);
            
            if (map != undefined)
                this.initmap = map;
            this.map = [];
            for (var i in this.initmap)
            {
                this.map[i] = [];
                for (var j in this.initmap[i])
                    this.map[i].push(this.initmap[i][j]);
            }
            
            this.ennemy = [];
            this.bombs = [];
            
            this.time = 400;
            
            this.init();
        },
        
        canMoveTo: function(x, y)
        {
            x = Math.floor(x);
            y = Math.floor(y);
            
            if (this.map[y] == undefined || this.map[y][x] == undefined ||
                this.map[y][x] == 1 || this.map[y][x] == 2)
                return false;
            return true;
        },
        
        getTimestamp: function()
        {
            var d = new Date();
            return d.getTime();
        },
        
        movePlayer: function()
        {
            if (this.keys.left)
                this.player.dir.x = -1;
            else if (this.keys.right)
                this.player.dir.x = 1;
            else
                this.player.dir.x = 0;
            
            if (this.keys.up)
                this.player.dir.y = -1;
            else if (this.keys.down)
                this.player.dir.y = 1;
            else
                this.player.dir.y = 0;
                
            if (this.canMoveTo(parseFloat(this.player.x) + 0.5 + parseFloat(this.player.dir.x) * 0.1 + parseFloat(this.player.dir.x) * 0.5,
                                parseFloat(this.player.y) + 0.5))
            {
                this.player.x = parseFloat(this.player.x) + parseFloat(this.player.dir.x) * 0.1;
            }
			else
			{
				this.player.dir.x = 0;
			}
            
            if (this.canMoveTo(parseFloat(this.player.x) + 0.5,
                                parseFloat(this.player.y) + 0.5 + parseFloat(this.player.dir.y) * 0.1 + parseFloat(this.player.dir.y) * 0.5))
            {
                this.player.y = parseFloat(this.player.y) + parseFloat(this.player.dir.y) * 0.1;
            }
			else
			{
				this.player.dir.y = 0;
			}
			
			//
			// We save player's direction when it is moving
			//
			if (!(this.player.dir.x == 0 && this.player.dir.y == 0))
			{
				this.player.lastDir.x = this.player.dir.x;
				this.player.lastDir.y = this.player.dir.y;
			}
            
            if (Math.floor(this.player.x) == this.exit.x &&
                Math.floor(this.player.y) == this.exit.y)
            {
                this.score++;
                this.restart();
            }
        },
        
        moveEnnemy: function()
        {
            for (var i in this.ennemy)
            {
                if (this.ennemy[i])
                {
                    if (Math.abs(parseFloat(this.ennemy[i].x) - parseFloat(this.player.x)) < 0.4 &&
                        Math.abs(parseFloat(this.ennemy[i].y) - parseFloat(this.player.y)) < 0.4)
                    {
                        this.lives--;
                        this.restart();
                        return;
                    }
                    
                    if (!this.canMoveTo(parseFloat(this.ennemy[i].x) + 0.5 + parseFloat(this.ennemy[i].dir.x) * 0.1 + parseFloat(this.ennemy[i].dir.x) * 0.5,
                                        parseFloat(this.ennemy[i].y) + 0.5 + parseFloat(this.ennemy[i].dir.y) * 0.1 + parseFloat(this.ennemy[i].dir.y) * 0.5))
                    {
                        var choises = [];
                        var culdesac = false;
                        if (this.canMoveTo(this.ennemy[i].x - 1, this.ennemy[i].y))
                            choises.push({x: -1, y: 0});
                        if (this.canMoveTo(this.ennemy[i].x + 1, this.ennemy[i].y))
                            choises.push({x: 1, y: 0});
                        if (this.canMoveTo(this.ennemy[i].x, this.ennemy[i].y + 1))
                            choises.push({x: 0, y: 1});
                        if (this.canMoveTo(this.ennemy[i].x, this.ennemy[i].y - 1))
                            choises.push({x: 0, y: -1});
                        if (choises.length === 0)
                        {
                            this.ennemy[i].dir.x = 0;
                            this.ennemy[i].dir.y = 0;
                            culdesac = true;
                        }
                        
                        if (!culdesac)
                        {
                            var dir = choises[Math.floor(Math.random()*choises.length)];
                            this.ennemy[i].dir.x = parseInt(dir.x);
                            this.ennemy[i].dir.y = parseInt(dir.y);
                        }
                    }
                    
                    this.ennemy[i].x = parseFloat(this.ennemy[i].x) + parseFloat(this.ennemy[i].dir.x)*0.1;
                    this.ennemy[i].y = parseFloat(this.ennemy[i].y) + parseFloat(this.ennemy[i].dir.y)*0.1;
                    
                    if (Math.abs(parseFloat(this.ennemy[i].x) - parseFloat(this.player.x)) < 0.4 &&
                        Math.abs(parseFloat(this.ennemy[i].y) - parseFloat(this.player.y)) < 0.4)
                    {
                        this.lives--;
                        this.restart();
                    }
                }
            }
        },
        
        bombTick: function()
        {
            var toDelete = [];
            for (var i in this.bombs)
            {
                if (this.bombs[i] && (this.getTimestamp() - this.bombs[i].dropTimestamp) > 2000)
                {
					// player dead
                    if ((Math.abs(this.bombs[i].x - this.player.x) < 0.4 && Math.abs(this.bombs[i].y - this.player.y) < 0.4) ||
                        (Math.abs(this.bombs[i].x - this.player.x) < 0.4 && Math.abs(this.bombs[i].y+1 - this.player.y) < 0.4) ||
                        (Math.abs(this.bombs[i].x - this.player.x) < 0.4 && Math.abs(this.bombs[i].y-1 - this.player.y) < 0.4) ||
                        (Math.abs(this.bombs[i].x+1 - this.player.x) < 0.4 && Math.abs(this.bombs[i].y - this.player.y) < 0.4) ||
                        (Math.abs(this.bombs[i].x-1 - this.player.x) < 0.4 && Math.abs(this.bombs[i].y - this.player.y) < 0.4))
                    {
                        this.lives--;
                        this.restart();
                    }
                    
                    // ennemies dead?
                    for (var j in this.ennemy)
                    {
                        if (this.bombs[i] && this.ennemy[j])
                            if ((Math.abs(this.bombs[i].x - this.ennemy[j].x) < 0.4 && Math.abs(this.bombs[i].y - this.ennemy[j].y) < 0.4) ||
                                (Math.abs(this.bombs[i].x - this.ennemy[j].x) < 0.4 && Math.abs(this.bombs[i].y+1 - this.ennemy[j].y) < 0.4) ||
                                (Math.abs(this.bombs[i].x - this.ennemy[j].x) < 0.4 && Math.abs(this.bombs[i].y-1 - this.ennemy[j].y) < 0.4) ||
                                (Math.abs(this.bombs[i].x+1 - this.ennemy[j].x) < 0.4 && Math.abs(this.bombs[i].y - this.ennemy[j].y) < 0.4) ||
                                (Math.abs(this.bombs[i].x-1 - this.ennemy[j].x) < 0.4 && Math.abs(this.bombs[i].y - this.ennemy[j].y) < 0.4))
                            {
                                this.score++;
                                this.ennemy[j] = null;
                            }
                    }
                        
                    // walls deleted ?
                    for (var j in this.map)
                    {
                        for (var k in this.map[j])
                        {
                            if (this.map[j][k] == 1 &&
                                this.bombs[i] &&
                                ((this.bombs[i].x == parseInt(k) && this.bombs[i].y == parseInt(j)) ||
                                 (this.bombs[i].x == parseInt(k) && this.bombs[i].y+1 == parseInt(j)) ||
                                 (this.bombs[i].x == parseInt(k) && this.bombs[i].y-1 == parseInt(j)) ||
                                 (this.bombs[i].x+1 == parseInt(k) && this.bombs[i].y == parseInt(j)) ||
                                 (this.bombs[i].x-1 == parseInt(k) && this.bombs[i].y == parseInt(j))))
                            {
                                this.map[j][k] = 0;
                            }
                        }
                    }
                    
                    toDelete.push(i);
                }
            }
            
            // remove bombs
            for (var i in toDelete)
                this.bombs.splice(toDelete[i], 1);
        },
        
        draw: function()
        {
            var g = this.g;
			// vision radius
            var rv = 4;
            
            var cadreincx = 0;
            var cadreincy = 0;
            
            
            
            
            if (parseFloat(this.player.x) < parseFloat(rv))
            {
            }
            else if (parseFloat(this.player.x) > parseFloat(this.map[0].length - rv + 1))
            {
                cadreincx = -parseFloat(this.map[0].length - rv * 2.0 + 1.0) * TW;
            }
            else
            {
                cadreincx = -(parseFloat(this.player.x) - parseFloat(rv)) * TW;
            }
            
            
            if (parseFloat(this.player.y) < parseFloat(rv))
            {
            }
            else
            {
                cadreincy = -(parseFloat(this.player.y) - parseFloat(rv)) * TW;
            }
            
			// if level size > viewport size
			if (this.level.width >= this.viewport.width)
			{
				if (parseInt(this.level.width + cadreincx) < parseInt(this.viewport.width))
				{
					cadreincx = -(this.level.width - this.viewport.width);
				}
			}
			// else, we display it in left-top corner of the viewport
			else
			{}
			
			// if level size > viewport size
			if (this.level.height >= this.viewport.height)
			{
				if (parseInt(this.level.height + cadreincy) < parseInt(this.viewport.height))
				{
					cadreincy = -(this.level.height - this.viewport.height);
				}
			}
			// else, we display it in left-top corner of the viewport
			else
			{}
            
            g.fillStyle = "white";
            g.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // draw floor and walls
            for (var i in this.map)
            {
                for (var j in this.map[i])
                {
					switch (this.map[i][j])
					{   
						// empty
						case 0:
							g.drawImage(this.img,
										0, 0, TW, TW,
										j*TW + cadreincx, i*TW + cadreincy, TW, TW)
						break;
						
						// destroyable wall
						case 1:
							g.drawImage(this.img,
										0, 1*TW, TW, TW,
										j*TW + cadreincx, i*TW + cadreincy, TW, TW)
						break;
						
						// wall
						case 2:
							g.drawImage(this.img,
										0, 2*TW, TW, TW,
										j*TW + cadreincx, i*TW + cadreincy, TW, TW)
						break;
						
						// exit
						case 6:
							g.drawImage(this.img,
										0, 6*TW, TW, TW,
										j*TW + cadreincx, i*TW + cadreincy, TW, TW)
						break;
					}
                }
            }
            
            // draw bombs
            for (var i in this.bombs)
            {
				g.drawImage(this.img,
							0, 5*TW, TW, TW,
							this.bombs[i].x*TW + cadreincx, this.bombs[i].y*TW + cadreincy, TW, TW);
            }
            
            // draw player
            var orientationId = 0;
            
			// bottom-left direction
			if (this.player.lastDir.x == -1 && this.player.lastDir.y == 1)
				orientationId = 4;
			// bottom-right direction
			else if (this.player.lastDir.x == 1 && this.player.lastDir.y == 1)
				orientationId = 5;
				
			// top-right direction
			else if (this.player.lastDir.x == 1 && this.player.lastDir.y == -1)
				orientationId = 6;
			// top-left direction
			else if (this.player.lastDir.x == -1 && this.player.lastDir.y == -1)
				orientationId = 7;
				
			//
            else if (this.player.lastDir.x == 1)
                orientationId = 1;
            else if (this.player.lastDir.x == -1)
                orientationId = 2;
            else if (this.player.lastDir.y == 1)
                orientationId = 0;
            else if (this.player.lastDir.y == -1)
                orientationId = 3;
                
            g.drawImage(this.img,
                        orientationId * TW, 3*TW, TW, TW,
                        parseInt(this.player.x*TW) + cadreincx, parseInt(this.player.y*TW) + cadreincy, TW, TW);
                        
            
            // draw enemies
            for (var i in this.ennemy)
            {
                if (this.ennemy[i])
                {
                    var orientationId = 0;
                    
                    if (this.ennemy[i].dir.x == 1)
                        orientationId = 1;
                    else if (this.ennemy[i].dir.x == -1)
                        orientationId = 2;
                    else if (this.ennemy[i].dir.y == 1)
                        orientationId = 0;
                    else if (this.ennemy[i].dir.y == -1)
                        orientationId = 3;

					g.drawImage(this.img,
								orientationId * TW, 4*TW, TW, TW,
								parseInt(this.ennemy[i].x*TW) + cadreincx, parseInt(this.ennemy[i].y*TW) + cadreincy, TW, TW);
                }
            }
        }
    };
    return game;
})();

