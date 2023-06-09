from flask import Flask, render_template, url_for, session, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from dotenv import load_dotenv

import auth
from util import json_response
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)
app.secret_key = '9232b3e6634925ae2e068c9810e53f4c10faef6e4ff17fb4'
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html', user=queries.get_user_by_username(session.get('username')))


@app.route("/api/users/<int:user_id>/boards")
@json_response
def get_boards(user_id: int):
    """
    All the boards
    :param user_id: id of the current user
    """
    return queries.get_boards(user_id)


@app.route("/api/users/<int:user_id>/boards/<int:board_id>", methods=['PATCH'])
@json_response
def patch_rename_board(user_id: int, board_id: int):
    """
    Rename the board
    :param user_id: id of the current user
    :param board_id: id of the board
    """
    board_title = request.get_json()
    queries.rename_board(board_id, board_title['boardTitle'], user_id)
    return {'message': 'Successfully renamed.'}


@app.route("/api/users/<int:user_id>/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(user_id: int, board_id: int):
    """
    All cards that belongs to a board
    :param user_id: id of the current user
    :param board_id: id of the board
    """
    return queries.get_cards_for_board(user_id, board_id)


@app.route("/api/users/<int:user_id>/boards/<int:board_id>/cards", methods=['POST'])
@json_response
def post_create_card_for_board(user_id: int, board_id: int):
    """
    Create new card for board
    :param user_id: id of the current user
    :param board_id: id of the board
    """
    card_details = request.get_json()
    queries.create_new_card(board_id, card_details, user_id)
    return {'message': 'Successfully created.'}


@app.route("/api/users/<int:user_id>/boards/<int:board_id>/cards", methods=['PATCH'])
@json_response
def patch_update_cards_for_board(user_id: int, board_id: int):
    """
    Updates all cards that belongs to a board
    :param user_id: id of the current user
    :param board_id: id of the board
    """
    cards_details = request.get_json()
    return queries.update_cards(board_id, user_id, cards_details)


@app.route("/api/users/<int:user_id>/boards/<int:board_id>/cards/<int:card_id>", methods=['DELETE'])
@json_response
def delete_card_from_board(user_id: int, board_id: int, card_id: int):
    """
    Remove card from board
    :param user_id: id of the current user
    :param board_id: id of the board
    :param card_id: id of the card
    """
    queries.remove_card(board_id, card_id, user_id)
    return {'message': 'Successfully removed.'}


@app.route('/register', methods=['POST'])
def post_register_page():
    """
    Register user in database
    """
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
            user = queries.get_user_by_username(username)
            return jsonify({'user_id': user['id'], 'message': 'Successfully registered, You are now logged in.'}), 200
        return jsonify({'message': "Passwords do not match!"}), 403
    return jsonify({'message': "User already exists!"}), 409


@app.route('/login', methods=['POST'])
def post_login_page():
    """
    Login user
    """
    user_data = request.get_json()
    username = user_data['username']
    password = user_data['password']
    user = queries.get_user_by_username(username)
    if user and auth.verify_password(password, user['password']):
        session['username'] = username
        return jsonify({'user_id': user['id'], 'message': 'Successfully logged in.'}), 200
    return jsonify({'message': 'Wrong credentials!'}), 401


@app.route('/logout', methods=['POST'])
def post_logout():
    """
    Logout user
    """
    session.pop('username', None)
    return jsonify({'message': 'Logged out successfully.'}), 200


@app.route('/api/statuses/<int:board_id>')
@json_response
def get_statuses(board_id):
    """
    Get all statuses(columns) that belongs to a board
    :param board_id: id of the board
    """
    return queries.get_statuses(board_id)


@app.route('/api/statuses/<int:board_id>', methods=['POST'])
@json_response
def post_new_status(board_id):
    """
    Create new status(column) and add it into a board
    :param board_id: id of the board
    """
    data = request.get_json()
    queries.create_new_column(board_id, data['columnTitle'])
    return {'message': 'Successfully created.'}


@app.route('/api/statuses/<int:board_id>', methods=['DELETE'])
@json_response
def delete_status(board_id):
    """
    Delete status(column) from a board
    :param board_id: id of the board
    """
    data = request.get_json()

    queries.remove_column(board_id, data['columnId'])
    return {'message': 'Successfully removed.'}


@app.route('/api/statuses/<int:board_id>', methods=['PATCH'])
@json_response
def patch_rename_status(board_id):
    """
    Rename status(column) that belongs to a board
    :param board_id: id of the board
    """
    data = request.get_json()

    queries.rename_column(board_id, data['columnId'], data['columnTitle'])
    return {'message': 'Successfully renamed.'}


@app.route("/api/users/<int:user_id>/boards", methods=["POST"])
@json_response
def post_new_board(user_id):
    """
    Create new board
    :param user_id: id of the current user
    """
    data = request.get_json()
    queries.add_new_board(data['boardTitle'], data['public_private'], user_id)
    return {'message': 'Successfully created.'}


@app.route("/api/users/<int:user_id>/boards/<int:board_id>", methods=["DELETE"])
@json_response
def delete_board(user_id: int, board_id: int):
    """
    Remove a board
    :param user_id: id of the current user
    :param board_id: id of the board
    """
    queries.delete_board(board_id, user_id)
    return {'message': 'Successfully removed.'}


@app.route("/api/users/<int:user_id>/boards/<int:board_id>/cards/<int:card_id>", methods=['PATCH'])
@json_response
def patch_rename_card(user_id: int, board_id: int, card_id: int):
    """
    Rename a card
    :param user_id: id of the current user
    :param board_id: id of the board
    :param card_id: id of the card
    """
    new_card_title = request.get_json()
    queries.rename_card(board_id, card_id, new_card_title['cardTitle'], user_id)
    return {'message': 'Successfully renamed.'}


@app.route("/api/users/<int:user_id>/boards/<int:board_id>/cards/<int:card_id>/archive", methods=['PATCH'])
@json_response
def patch_archive_card(user_id: int, board_id: int, card_id: int):
    """
    Archive/unarchive a card
    :param user_id: id of the current user
    :param board_id: id of the board
    :param card_id: id of the card
    """
    queries.archive_card(board_id, card_id, user_id)
    return {'message': 'Operation done.'}


@app.route("/api/users/<int:user_id>/boards/<int:board_id>/cards/archived")
@json_response
def get_archived_cards_for_board(user_id: int, board_id: int):
    """
    Get all archived card that belongs to a board
    :param user_id: id of the current user
    :param board_id: id of the board
    """
    return queries.get_archived_cards_for_board(user_id, board_id)


@socketio.on('message')
def handle_msg(msg):
    """
    Listen on any messages, then sends message to front-end which will trigger the syncing function
    """
    socketio.send('Syncing...')


def main():
    socketio.run(app, debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
