/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs) {

    this.gs = gs;   //servidor gráfico
    this.nameCards = ["8-ball","potato","dinosaur","kronos","rocket","unicorn","guy","zeppelin"];//nombre de las cartas del juego
    this.gameCards = [];    //array de cartas de juego
    this.Cardsfound; //# cartas encontradas
    this.messageGame;   //Mensaje del juego
    this.state; //Estado Actual del juego
    this.cardOne;   //Primera Carta
    this.cardTwo;   //Segunda Carta
    
    /**Inicializa el juego creando las cartas (recuerda que son 2 de
    cada tipo de carta), desordenándolas y comenzando el bucle de juego. 
    */
   this.initGame = function() {

    this.messageGame = "!!..Memory Game..!!"; 
    this.Cardsfound = 0;
    this.state = 0;
    this.createCards(); //crearCartas
	this.mixUpCards(); //DesordenarCartas
    this.loop();    //Bucle principal del juego
   }

   /**Dibuja el juego, esto es: (1) escribe el mensaje con el estado actual
    del juego y (2) pide a cada una de las cartas del tablero que se dibujen.
    */
   this.draw = function(){
        this.gs.drawMessage(this.messageGame);
        for(var i = 0; i < this.gameCards.length ; i++){
            this.gameCards[i].draw(this.gs, i);
        }
   }

   /**  Es el bucle del juego. En este caso es muy sencillo: llamamos al
    método draw cada 16ms (equivalente a unos 60fps). Esto se realizará con
    la función setInterval de Javascript
    */
    this.loop = function(){
        var that = this;
        setInterval(function(){
            that.draw()},16);
    }

    /**Este método se llama cada vez que el jugador pulsa
    sobre alguna de las cartas (identificada por el número que ocupan en el
    array de cartas del juego). Es el responsable de voltear la carta y, si hay
    dos volteadas, comprobar si son la misma (en cuyo caso las marcará como
    encontradas). En caso de no ser la misma las volverá a poner boca abajo 
    */
    this.onClick = function(cardId){
       
        //Si es la primera carta que elige(state = 0)
        // es decir no ha sido elegida
        if(this.state == 0 && !this.gameCards[cardId].isTurned){
            this.cardOne = this.gameCards[cardId];
            this.cardOne.flip();
            this.state = 1; //ha elegido una carta, vamos a por la segunda
        }
        //Hemos pillado la segunda
        if(this.state == 1 && !this.gameCards[cardId].isTurned){
            this.cardTwo = this.gameCards[cardId];
            this.cardTwo.flip();
            this.state = 2;
            //El estado (2) es donde comenzamos a comprobar si son iguales o no
            firstCard = this.cardOne;
			secondCard = this.cardTwo;
			var that = this;
            //Empieza al comprobacion del estado 2
            if(firstCard.compareTo(secondCard)){  //Si son iguales
                this.Cardsfound = this.Cardsfound + 2;  //Aumentamos en dos el numero de cartas pilladas
				firstCard.found();
				secondCard.found();
				this.messageGame = "Match found..!!";
				that.state = 0; //Volvemos al estado Inicial
            }
            else{   //Si no son iguales
                this.messageGame = "Ups,..Try Again";
				setTimeout(function() {
					firstCard.flip();
					secondCard.flip();
					that.state = 0; //Volvemos al estado Inicial
				},1000);
			}
        }
        
		if (this.Cardsfound == this.gameCards.length){  //si ya hemos pillado todas las cartas eres el ganador
			this.messageGame = "You Win...!!";
	    }
    }



    /** Funciones Auxiliares */
    /**
     * Creamos las cartas del juego
     */
    this.createCards = function() {
        //Colocamos 2 por cada tipo de carta a nuestro array de cartas
        for(var c = 0; c < this.nameCards.length; c++){
            this.gameCards.push(new MemoryGameCard(this.nameCards[c]));
            this.gameCards.push(new MemoryGameCard(this.nameCards[c]));
        }
    }
    
    /**
     * Desordenamos las cartas del juego
     */
    this.mixUpCards = function() {     

        var num = this.gameCards.length;

        while(--num){
            rd = Math.floor(Math.random() * num);  //random (rd)
            tmp = this.gameCards[num];
            this.gameCards[num] = this.gameCards[rd];
            this.gameCards[rd] = tmp;
        }
	}
    
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {

    this.id = id;   //identificador de la carta
    this.isTurned = false; //false -> si no ha sido dado la vuelta y true lo contrario
    this.isChosen = false; //ha sido escogida la carta

    /**Da la vuelta a la carta, cambiando el estado de la misma */
    this.flip = function(){

        if(this.isTurned == false){    //si no esta volteada -> dale la vuelta a la carta
            this.isTurned = true;
        }else{                          // lo contrario
            this.isTurned = false;
        }
    }

    /**Marca una carta como encontrada, cambiando el estado de la misma. */
    this.found = function(){
        this.isChosen = true;
    }

    /** Compara dos cartas, devolviendo true si ambas representan la misma carta. */
    this.compareTo = function(otherCard){
        return this.id === otherCard.id;
    }

    /**Dibuja la carta de acuerdo al estado en el que se encuentra.
    Recibe como parámetros el servidor gráfico y la posición en la que se
    encuentra en el array de cartas del juego (necesario para dibujar una
    carta). */

    this.draw = function(gs, pos){

        if(this.isTurned == false){ //Dibuja la carta de boca abajo, si no ha sido girado
            gs.draw("back", pos);
        }else{                      //En otros casos dibuja la carta correspondiente
            gs.draw(this.id, pos);
        }
    }
};
