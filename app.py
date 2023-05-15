from boggle import Boggle
from flask import Flask, render_template, request
from flask import session, redirect, jsonify
import json

app = Flask(__name__)

app.config['SECRET_KEY'] = "abc123"

boggle_game = Boggle()



@app.route('/')
def board():
    """ This creates the board and displays the board """

    session['board'] = boggle_game.make_board()
    session['highScore'] = 0
    session['played'] = 0

    return render_template("boggle.html")

@app.route('/check-guess')
def check_guess():
    """ checks whether a guess is a word and if it is on the board """
    guess = request.args["guess"]
    board = session["board"]
    res = boggle_game.check_valid_word(board, guess)

    return jsonify({'result': res})

@app.route('/info-storage')
def info_storage():
    """ will store the highsore in the session and the times played """
    if(int(session['highScore']) < int(request.args["score"])):
        session['highScore'] = request.args["score"]

    session['played'] += 1

    info = {"played": f"{session['played']}", "highscore": f"{session['highScore']}"}

    return jsonify(info)