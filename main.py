from flask import Flask, render_template, url_for, redirect, session, request
from dotenv import load_dotenv

import auth
from util import json_response, user_logged_in
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
app.secret_key = '9232b3e6634925ae2e068c9810e53f4c10faef6e4ff17fb4'
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    #boards = queries.get_boards();
    return render_template('index.html')#, boards=boards)


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route('/register')
def get_register_page():
    if user_logged_in():
        return redirect(url_for('index'))
    return render_template('register.html')


@app.route('/register', methods=['POST'])
def post_register_page():
    username = request.form.get('username')
    password_1 = request.form.get('password')
    password_2 = request.form.get('repeat_password')
    if not queries.get_user_by_username(username):
        if password_1 == password_2:
            new_user = {'username': username,
                        'password': auth.hash_password(password_1)}
            queries.add_new_user(new_user)
    return render_template(url_for('index'))


@app.route('/login')
def get_login_page():
    if user_logged_in():
        return redirect(url_for('index'))
    return render_template('login.html')


@app.route('/login', methods=['POST'])
def post_login_page():
    username = request.form.get('username')
    password = request.form.get('password')
    user = queries.get_user_by_username(username)
    if user and auth.verify_password(password, user['password']):
        session['username'] = username
        return redirect(url_for('index'))


@app.route('/logout', methods=['POST'])
def post_logout():
    session.pop('username', None)
    return redirect(url_for('index'))


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
