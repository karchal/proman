import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """

    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_board(board_id):
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        WHERE id = %(board_id)s;
        """, variables={'board_id': board_id}, fetchall=False)


def get_cards_for_board(board_id):

    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards


def get_user_by_username(username):
    user = data_manager.execute_select(
        """
        SELECT * FROM users
        WHERE username = %(username)s
        """
        , {'username': username}, fetchall=False)

    return user


def get_user_by_user_id(user_id):
    user = data_manager.execute_select(
        """
        SELECT * FROM users
        WHERE id = %(user_id)s
        """
        , {'user_id': user_id}, fetchall=False)

    return user


def add_new_user(new_user):
    data_manager.execute_insert(
        """
        INSERT INTO users(username, password)
        VALUES(%(username)s, %(password)s)
        """
        , {'username': new_user['username'], 'password': new_user['password']})


def create_new_card(board_id, card_details):  # TODO refactor user_id
    data_manager.execute_insert(
        """
        INSERT INTO cards(board_id, status_id, title, card_order, user_id)
        VALUES(%(board_id)s, %(status_id)s, %(title)s, 1, 1)
        """
        , variables={'board_id': board_id, 'status_id': card_details['statusId'], 'title': card_details['cardTitle']})
