import React, { Component } from 'react';
import { View, WebView, StatusBar } from 'react-native';

export default class App extends Component {
    render() {

        var webViewCode = `
<html>
<head>
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
<script type="text/javascript" src="https://static.codehs.com/gulp/bf68824d27e450b319aae427333c8bbdb64a25dc/chs-js-lib/chs.js"></script>

<style>
    body, html {
        margin: 0;
        padding: 0;
    }
    canvas {
        margin: 0px;
        padding: 0px;
        display: inline-block;
        vertical-align: top;
    }
    #btn-container {
        text-align: center;
        padding-top: 10px;
    }
    #btn-play {
        background-color: #8cc63e;
    }
    #btn-stop {
        background-color: #de5844;
    }
    .glyphicon {
        margin-top: -3px;
        color: #FFFFFF;
    }
</style>
</head>

<body>
    <div id="canvas-container" style="margin: 0 auto; ">
        <canvas
        id="game"
        width="400"
        height="480"
        class="codehs-editor-canvas"
        style="width: 100%; height: 100%; margin: 0 auto;"
        ></canvas>
    </div>
    <div id="console"></div>
    <div id="btn-container">
        <button class="btn btn-main btn-lg" id="btn-play" onclick='stopProgram(); runProgram();'><span class="glyphicon glyphicon-play" aria-hidden="true"></span></button>
        <button class="btn btn-main btn-lg" id="btn-stop" onclick='stopProgram();'><span class="glyphicon glyphicon-stop" aria-hidden="true"></span></button>
    </div>

<script>
    var console = {};
    console.log = function(msg){
        $("#console").html($("#console").html() + "     " + msg);
    };

    var runProgram = function() {
        const SNAKE_DIM = readInt("How big is each tile? (default is 10): ");//the size of each tile
const SNAKE_COLOUR = '#0f0';//the colour of the snake
const DEAD_COLOUR = '#f00';//the colour of death point
const FOOD_COLOUR = '#ab04c7';//the colour of food
const WALL_COLOUR = '#000';//the colour of walls
var length = 1;//current length
var lengthMax = 1;//maximum length
var direction;//stores direction
var alive = true;//stores if the snake is alive
var flip = false;//stores if the snake is curently flipping
var setGrid = readLine("Add grid? (Y/N): ");//stores if the grid lines are on
var frameCount = 0;//counts how many frames a flip is valid for
var foodCount = 0;//keeps only one bit of food on screen
var i = 0;//x on board
var j = 0;//y on board
var x = 0;//subs for i
var y = 0;//subs for j

var difficulty = readLine("What difficulty? easy(e), medium(m), hard(h), lightning(l), blitzkrieg(b): ");//sets the difficulty
var difficulty2 = readLine("Add walls? (Y/N): ");//sets if there are walls or not
var setWall;//deals with walls
var delay;//how long the delay is

//stores the current state of the game board
var board = new Grid(Math.floor(getHeight()/SNAKE_DIM), Math.floor(getWidth()/SNAKE_DIM)); 

//sets the difficulty, establishes turning on wasd press, starts draw timer
function start(){
    if(difficulty == 'easy' || difficulty == 'e'){
        delay = 100;
    }else if(difficulty == 'medium' || difficulty == 'm'){
        delay = 70;
    }else if(difficulty == 'hard' || difficulty == 'h'){
        delay = 50;
    }else if(difficulty == 'lightning' || difficulty == 'l'){
        delay = 40;
    }else if(difficulty == 'blitzkrieg' || difficulty == 'b'){
        delay = 30;
    }else if(difficulty == 'FUCK' || difficulty == 'F' || difficulty == 'f'){//easter egg difficulty
        delay = 10;
    }else {//handles invalid difficulties
        delay = 1000;
    }
    if(difficulty2 == 'Y' || difficulty2 == 'y' || difficulty2 == 'yes'){
        setWall = true;//adds the walls
    }
    if(setGrid == 'Y' || difficulty2 == 'y' || difficulty2 == 'yes'){
        setGrid = true;//turns on the grid
    }
    println("use wasd to move");//prints the controls
    setBoard();//goes to line 53
    keyDownMethod(turn);//goes to line 61
    setTimer(draw, delay);//goes to line 93
}

//generates the board and places snake in centre of board
function setBoard(){
    board.init(0);//fills all tiles with a zero
    //goes to board centre
    i = Math.floor(getWidth()/SNAKE_DIM/2);
    j = Math.floor(getHeight()/SNAKE_DIM/2);
}

//turns the snake depending on what key is pushed
function turn(e){
    if(e.keyCode == Keyboard.letter('W')){//turn north
        if(direction == 'SOUTH'){//flip south
            flip = true;
            frameCount = lengthMax;
        }
        direction = 'NORTH';
    }
    if(e.keyCode == Keyboard.letter('D')){//turn east 
        if(direction == 'WEST'){//flip west
            flip = true;
            frameCount = lengthMax;
        }
        direction = 'EAST';
    }
    if(e.keyCode == Keyboard.letter('S')){//turn south
        if(direction == 'NORTH'){//flip north
            flip = true;
            frameCount = lengthMax;
        }
        direction = 'SOUTH';
    }
    if(e.keyCode == Keyboard.letter('A')){//turn west
        if(direction == 'EAST'){//flip east
            flip = true;
            frameCount = lengthMax;
        }
        direction = 'WEST';
    }
}

//main function per frame
function draw(){
    board.set(j, i, -1);//curent position of snake head is -1 on board
    if(direction == 'NORTH'){//moves north by decreasing the j value
        j--;
    }else if(direction == 'EAST'){//moves east by increasing the i value
        i++;
    }else if(direction == 'SOUTH'){//moves south by increasing the j value
        j++;
    }else if(direction == 'WEST'){//moves west by decreasing the i value
        i--;
    }
    if(direction != null){
        boardAccess('death');//access the board to check for a death
    }
    if(alive){
        boardAccess('food');//access the board to check for a bit of food
        boardAccess('length');//access the board to manage length
        boardAccess('refresh');//refreshes the board to clear graphical errors
        addTile(i,j,SNAKE_COLOUR);//adds a new snake tile on screen
    }
    if(frameCount >= 1){
        frameCount--;
    }else{
        flip = false;
    }
}

//manages deaths and length
function boardAccess(search){
    if(search == 'death'){//looks for if death has occured
        if(j > 0 && j < getHeight()/SNAKE_DIM){//fixes a bug with the corners of the screen 
            if(board.get(j, i) <= -1){//snakes dies if it runs into itself
                if(flip){}else{//not if flipping
                    gameOver('intersect');
                }
            }
            if(board.get(j, i) == 'wall'){
                gameOver('hit wall');
            }
        }
        if(j < 0){//ran into north wall
            gameOver('pos north');
        }else if(i+1 > getWidth()/SNAKE_DIM){//ran into east wall
            gameOver('pos east');
        }else if(j+1 > getHeight()/SNAKE_DIM){//ran into south wall
            gameOver('pos south');
        }else if(i < 0){//ran into west wall
            gameOver('pos west');
        }
    }
    if(search == 'refresh'){
        removeAll();
    }
    if(search == 'refresh' || search == 'length' || search == 'food' || search == 'death spot'){
        for(y = 0; y < Math.floor(getHeight()/SNAKE_DIM); y++){
            if(search == 'refresh'){
                var line = new Line(0, y*SNAKE_DIM, getWidth(), y*SNAKE_DIM);
                line.setLineWidth(0.1);
                add(line);
            }
            for(x = 0; x < Math.floor(getWidth()/SNAKE_DIM); x++){
                if(search == 'death spot'){//looks for the point of death
                    if(board.get(y, x) == 'end'){
                        addTile(x,y,DEAD_COLOUR);
                    }
                }
                if(search == 'refresh'){
                    if(y != 0){}else{
                        var line = new Line(x*SNAKE_DIM, 0, x*SNAKE_DIM, getHeight());
                        line.setLineWidth(0.1);
                        add(line);
                    }
                    if(board.get(y, x) <= -1){
                        addTile(x,y,SNAKE_COLOUR);
                    }else if(board.get(y, x) == 'end'){
                        addTile(x,y,DEAD_COLOUR);
                    }else if(board.get(y, x) == 'nom'){
                        addTile(x,y,FOOD_COLOUR);
                    }else if(board.get(y, x) == 'wall'){
                        addTile(x,y,WALL_COLOUR);
                    }
                }
                if(search == 'length'){//looks for how long the snake is
                    if(board.get(y, x) <= -1){
                        board.set(y, x, board.get(y,x)-1);//'ages' each snake tile
                    }
                    if(board.get(y, x) < -lengthMax){
                        remove(getElementAt(x*SNAKE_DIM, y*SNAKE_DIM));//removes oldest snake tile from screen
                        board.set(y, x, 0);//removes oldest snake tile from board
                    }
                }
                if(search == 'food'){
                    if(board.get(y, x) == 'nom'){
                        foodCount = 1;
                    }
                }
            }
        }
    }
    if(search == 'food'){
        if(foodCount != 1){
            y = Math.round(Math.random()*Math.floor(getHeight()/SNAKE_DIM-1));
            x = Math.round(Math.random()*Math.floor(getWidth()/SNAKE_DIM-1));
            while(y==j){
                y = Math.round(Math.random()*Math.floor(getHeight()/SNAKE_DIM-1));
            }
            while(x==i){
                x = Math.round(Math.random()*Math.floor(getWidth()/SNAKE_DIM-1));
            }
            board.set(y, x, 'nom');
            addTile(x,y,FOOD_COLOUR);
        }else if(foodCount == 1){
            if(board.get(j, i) == 'nom'){
                lengthMax++;
                foodCount = 0;
                board.set(j, i, 0);
                println(lengthMax);
                if(setWall){
                    boardAccess('wall');
                }
            }
        }
    }
    if(search == 'wall'){
        y = Math.round(Math.random()*Math.floor(getHeight()/SNAKE_DIM-1));
        x = Math.round(Math.random()*Math.floor(getWidth()/SNAKE_DIM-1));
        if(/*(y+5 < j && y-5 > j) || (x+5 > i && x-5 < i)*/(j-y)*(j-y)+(i-x)*(i-x) <= 25){
            while(y+5 < j && y-5 > j){
                y = Math.round(Math.random()*Math.floor(getHeight()/SNAKE_DIM-1));
            }
            while(x+5 > i && x-5 < i){
                x = Math.round(Math.random()*Math.floor(getWidth()/SNAKE_DIM-1));
            }
        }
        var direct = Math.round(2*Math.random());
        if(direct == 1){
            if(x-1 == -1){
                x+=2;
            }
            if(x+1 == Math.floor(getWidth()/SNAKE_DIM)+1){
                x-=2;
            }
            board.set(y, x-1, 'wall');
            board.set(y, x+1, 'wall');
            addTile(x-1,y,WALL_COLOUR);
            addTile(x+1,y,WALL_COLOUR);
        }else if(direct == 2){
            if(y-1 == -1){
                y+=2;
            }
            if(y+1 == Math.floor(getHeight()/SNAKE_DIM)+1){
                y-=2;
            }
            board.set(y-1, x, 'wall');
            board.set(y+1, x, 'wall');
            addTile(x,y-1,WALL_COLOUR);
            addTile(x,y+1,WALL_COLOUR);
        }
        board.set(y, x, 'wall');
        addTile(x,y,WALL_COLOUR);
    }
}

function gameOver(error){
    alive = false;
    if(error == 'pos north'){
        println('Game Over: ran off board');
        board.set(j+1, i, 'end');
    }else if(error == 'pos east'){
        println('Game Over: ran off board');
        board.set(j, i-1, 'end');
    }else if(error == 'pos south'){
        println('Game Over: ran off board');
        board.set(j-1, i, 'end');
    }else if(error == 'pos west'){
        println('Game Over: ran off board');
        board.set(j, i+1, 'end');
    }else if(error == 'intersect'){
        println('Game Over: ran into yourself');
        board.set(j, i, 'end');
    }else if(error == 'hit wall'){
        println('Game Over: hit a wall');
        board.set(j, i, 'end');
    }
    println(i + ", " + j);
    stopTimer(draw);
    boardAccess('death spot');
    console.log(board);
}

function addTile(x,y,colour){
    var tile = new Rectangle(SNAKE_DIM,SNAKE_DIM);
    tile.setColor(colour);
    tile.setPosition(x*SNAKE_DIM, y*SNAKE_DIM);
    add(tile);
}

        if (typeof start === 'function') {
            start();
        }

        // Overrides setSize() if called from the user's code. Needed because
        // we have to change the canvas size and attributes to reflect the
        // user's desired program size. Calling setSize() from user code only
        // has an effect if Fit to Full Screen is Off. If Fit to Full Screen is
        // On, then setSize() does nothing.
        function setSize(width, height) {
            if (!true) {
                // Call original graphics setSize()
                window.__graphics__.setSize(width, height);

                // Scale to screen width but keep aspect ratio of program
                // Subtract 2 to allow for border
                var canvasWidth = window.innerWidth - 2;
                var canvasHeight = canvasWidth * getHeight() / getWidth();

                // Make canvas reflect desired size set
                adjustMarginTop(canvasHeight);
                setCanvasContainerSize(canvasWidth, canvasHeight);
                setCanvasAttributes(canvasWidth, canvasHeight);
            }
        }
    };

    var stopProgram = function() {
        removeAll();
        window.__graphics__.fullReset();
    }

    window.onload = function() {
        if (!false) {
            $('#btn-container').remove();
        }

        var canvasWidth;
        var canvasHeight;
        if (true) {
            // Get device window width and set program size to those dimensions
            setSize(window.innerWidth, window.innerHeight);
            canvasWidth = getWidth();
            canvasHeight = getHeight();

            if (false) {
                // Make room for buttons if being shown
                $('#btn-container').css('padding', '5px 0');
                canvasHeight -= $('#btn-container').outerHeight();
            }

            setCanvasAttributes(canvasWidth, canvasHeight);
        } else {
            // Scale to screen width but keep aspect ratio of program
            // Subtract 2 to allow for border
            canvasWidth = window.innerWidth - 2;
            canvasHeight = canvasWidth * getHeight() / getWidth();

            // Light border around canvas if not full screen
            $('#canvas-container').css('border', '1px solid #beccd4');

            adjustMarginTop(canvasHeight);
        }

        setCanvasContainerSize(canvasWidth, canvasHeight);

        if (true) {
            runProgram();
        }
    };

    // Set the canvas container width and height.
    function setCanvasContainerSize(width, height) {
        $('#canvas-container').width(width);
        $('#canvas-container').height(height);
    }

    // Set the width and height attributes of the canvas. Allows
    // getTouchCoordinates to sense x and y correctly.
    function setCanvasAttributes(canvasWidth, canvasHeight) {
        $('#game').attr('width', canvasWidth);
        $('#game').attr('height', canvasHeight);
    }

    // Assumes the Fit to Full Screen setting is Off. Adjusts the top margin
    // depending on the Show Play/Stop Buttons setting.
    function adjustMarginTop(canvasHeight) {
        var marginTop = (window.innerHeight - canvasHeight)/2;
        if (false) {
            marginTop -= $('#btn-container').height()/3;
        }
        $('#canvas-container').css('margin-top', marginTop);
    }
</script>
</body>
</html>
`;
        return (
            <View style={{ flex: 1 }}>
                <StatusBar hidden />
                <WebView
                    source={{html: webViewCode, baseUrl: "/"}}
                    javaScriptEnabled={true}
                    style={{ flex: 1 }}
                    scrollEnabled={false}
                    bounces={false}
                    scalesPageToFit={false}
                ></WebView>
            </View>
        );
    }
}
