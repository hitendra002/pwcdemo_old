import datetime


def get_employee_id():
    return datetime.datetime.now().strftime('%d%H%M%S%f')[-10:]




if __name__ == "__main__":
    print(get_employee_id())