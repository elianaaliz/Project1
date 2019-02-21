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
	this.messUpCards(); //DesordenarCartas
    this.loop();    //Bucle del juego
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
    this.loop = function(){//yeee
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
        if(this.state == 0 && !this.gameCards[cardId].isFlipped){
            this.cardOne = this.gameCards[cardId];
            this.cardOne.flip();
            this.state = 1; //ha elegido una carta, vamos a por la segunda
        }
        //Hemos pillado la segunda
        if(this.state == 1 && !this.gameCards[cardId].isFlipped){
            this.cardTwo = this.gameCards[cardId];
            this.cardTwo.flip();
            this.state = 2;
            //El estado (2) es donde comenzamos a comprobar si son iguales o no
            firstCard = this.cardOne;
			secondCard = this.cardTwo;
			var that = this;
            
            if(firstCard.compareTo(secondCard)){  //Si son iguales
                this.Cardsfound = this.Cardsfound + 2;
				firstCard.found();
				secondCard.found();
				this.messageGame = "Match found..!!";
				that.state = 0; //Volvemos al estado Inicial
            }
            else{   //Si no son iguales
                this.messageGame = "Upps,..Try Again";
				setTimeout(function() {
					firstCard.flip();
					secondCard.flip();
					that.state = 0; //Volvemos al estado Inicial
				},1000);
			}
        }
        
		if (this.Cardsfound == this.gameCards.length){  //si ya hemos pillado todas las cartas eres el ganador
			this.messageGame = "You Win,Very Good..!!";
	    }
    }



    /** Funciones Auxiliares */
    this.createCards = function() {/**XX */
		this.gameCards = [
			new MemoryGameCard("8-ball"),
			new MemoryGameCard("8-ball"),
			new MemoryGameCard("potato"), 
			new MemoryGameCard("potato"),
			new MemoryGameCard("dinosaur"), 
			new MemoryGameCard("dinosaur"),
			new MemoryGameCard("kronos"), 
			new MemoryGameCard("kronos"),
			new MemoryGameCard("rocket"), 
			new MemoryGameCard("rocket"),
			new MemoryGameCard("unicorn"), 
			new MemoryGameCard("unicorn"),
			new MemoryGameCard("guy"), 
			new MemoryGameCard("guy"),
			new MemoryGameCard("zeppelin"), 
			new MemoryGameCard("zeppelin")
		]
    }

    this.messUpCards = function() {/**XX */

		var numCards = this.gameCards.length;
		var cardsAux = [];
		
		while(numCards > 0) {
			rd = Math.floor(Math.random() * numCards);  //random rd
			aux = this.gameCards[rd];
			this.gameCards.splice(rd,1);
			cardsAux.push(aux);
			numCards = this.gameCards.length;
		}
		this.gameCards = cardsAux;
	}
    
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {

    this.id = id;
    this.isFlipped = false; //false si no ha sido volteada y true si esta volteada
    this.isChosen = false; //ha sido cogida la carta?

    /**Da la vuelta a la carta, cambiando el estado de la misma */
    this.flip = function(){
        if(this.isFlipped == false){
            this.isFlipped = true;
        }else{
            this.isFlipped = false;
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

        if(this.isFlipped == false){
            gs.draw("back", pos);
        }else{
            gs.draw(this.id, pos);
        }
    }
};
