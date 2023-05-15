$("#start").on("click", () => {game = new Bogglegame()});

$("#submit").on("click", function(evt){
    game.getData(evt);
});

class Bogglegame {

    constructor() {
        this.time = 0;
        this.score = 0;

        this.timer(this.time);
    }
    
    async getData(evt) {
        evt.preventDefault();
        let guess = $("#Guess").val();
        const response = await axios.get("/check-guess", { params: {guess: guess} });
        game.message(response.data);
        game.scoreBoard(response.data);
    }

    message(answer) {
        $("#message").empty();
        $(`<p>That answer is ${answer['result']} </p>`).appendTo($("#message"));
    }

    scoreBoard(answer) {
        if(answer["result"] == "ok") {
            game.score += $("#Guess").val().length;
            $("#scoreBoard").empty();
            $(`<p>The score is ${game.score} </p>`).appendTo($("#scoreBoard"));
        }
    }

    timer(time) {

        $("#submit").css("display","flex");
        $("#start").css("display","none");

        let intervalID = setInterval(function() {
            $('#timer').empty();
            time += 1;

            if(time === 60){
                clearInterval(intervalID);
                game.endGame();
            }

            $(`<p> Time is ${time} </p>`).appendTo("#timer")
        }, 1000)
        
    }

    async endGame() {
        $("#submit").css("display","none");
        $("#start").css("display","flex");

        let score = JSON.stringify(game.score);

        let response = await axios.get("/info-storage", {params: { score }})

        $("#highscore").empty();
        $("#times-played").empty();

        $(".stats").css('display','flex');

        $("#highscore").append(response.data['highscore']);
        $("#times-played").append(response.data['played']);

    }

}