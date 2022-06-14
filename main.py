from flask import Flask, render_template, url_for, redirect, session, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

import auth
from util import json_response, user_logged_in
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
CORS(app)
app.secret_key = '9232b3e6634925ae2e068c9810e53f4c10faef6e4ff17fb4'
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html', user=queries.get_user_by_username(session.get('username')))


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/boards/<int:board_id>")
@json_response
def get_board(board_id: int):
    return queries.get_board(board_id)


@app.route("/api/boards/<int:board_id>", methods=['PATCH'])
@json_response
def patch_rename_board(board_id: int):
    board_title = request.get_json()
    return queries.rename_board(board_id, board_title['boardTitle'])


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/api/boards/<int:board_id>/cards", methods=['POST'])
@json_response
def post_create_card_for_board(board_id: int):
    card_details = request.get_json()
    return queries.create_new_card(board_id, card_details)


@app.route('/register', methods=['POST'])
def post_register_page():
    user_data = request.get_json()
    username = user_data['username']
    password_1 = user_data['password']
    password_2 = user_data['password2']
    if not queries.get_user_by_username(username):
        if password_1 == password_2:
            new_user = {'username': username,
                        'password': auth.hash_password(password_1)}
            queries.add_new_user(new_user)
            session['username'] = username
            return jsonify({'url': request.root_url}), 200
        return jsonify({'url': request.root_url}), 403
    return jsonify({'url': request.root_url}), 409


@app.route('/login', methods=['POST'])
def post_login_page():
    user_data = request.get_json()
    username = user_data['username']
    password = user_data['password']
    user = queries.get_user_by_username(username)
    if user and auth.verify_password(password, user['password']):
        session['username'] = username
        return jsonify({'url': request.root_url}), 200
    return jsonify({'url': request.root_url}), 401


@app.route('/logout', methods=['POST'])
def post_logout():
    session.pop('username', None)
    return redirect(url_for('index'))


@app.route('/api/statuses')
@json_response
def get_statuses():
    return queries.get_statuses()


@app.route('/api/statuses/<int:status_id>')
@json_response
def get_status(status_id):
    return queries.get_card_status(status_id)


@app.route("/api/boards", methods=["POST"])
@json_response
def post_new_board():
    data = request.get_json()
    queries.add_new_board(data['boardTitle'])


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
