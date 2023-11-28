import requests
import pytest
import json
from bs4 import BeautifulSoup
import API_Test.api_util as api_util


def test_orange_hrm_login():
    res1 = requests.get("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
    print("First login", res1)
    assert res1.status_code == 200, "Initial Login failed"

    # Fetch CSRF token from html response
    token = BeautifulSoup(res1.text, 'html.parser').select_one('auth-login')[':token']
    print(f"CSRF token: {token}")

    # Authenticating using CSRF and Credential
    payload = {
        "_token": token,
        "username": "Admin",
        "password": "admin123"
    }
    auth_res = requests.post("https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate", data=payload)
    assert auth_res.status_code == 200, "Authentication failed"


def test_add_employee_and_verify_details():
    try:
        # Session initializing
        session = requests.Session()
        res1 = session.get("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")
        print("First login", res1)
        assert res1.status_code == 200, "Initial Login failed"

        # Fetch CSRF token from html response
        token = BeautifulSoup(res1.text, 'html.parser').select_one('auth-login')[':token']
        print(f"CSRF token: {token}")

        # Authenticating using CSRF and Credential
        payload = {
            "_token": token,
            "username": "Admin",
            "password": "admin123"
        }
        auth_res = session.post("https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate", data=payload)
        assert auth_res.status_code == 200, "Authentication failed"

        # Add Emplyoee into HRM
        emplyoeeData = {
            "firstName": "John",
            "middleName": "wick",
            "lastName": "Smith",
            "empPicture": None,
            "employeeId": api_util.get_employee_id()
        }
        add_res = session.post("https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees",
                               data=emplyoeeData)
        print("Add emp", add_res)
        assert add_res.status_code == 200, "Add employee failed"
        data = add_res.json()
        print("Add Employee response", data)
        empID = data["data"]["empNumber"]

        # Search employee with ID
        search_emp_res = session.get(
            f"https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/{empID}/personal-details")
        assert search_emp_res.status_code == 200, "Search employee failed"
        data = search_emp_res.json()
        print("Search Employee response", data)
        # Assert Employee details
        assert data["data"]["employeeId"] == emplyoeeData["employeeId"], "Employee id mismatch"
        assert data["data"]["lastName"] == emplyoeeData["lastName"], "Employee lastname mismatch"
        assert data["data"]["firstName"] == emplyoeeData["firstName"], "Employee firstname mismatch"
        assert data["data"]["middleName"] == emplyoeeData["middleName"], "Employee middlename mismatch"

    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
