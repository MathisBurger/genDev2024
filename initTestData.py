import requests
from random import randint


for i in range(1, 2000000):
    url = "http://localhost:8080/api/user/register"
    payload = {"username": "user-" + str(i)}
    headers = {"Content-Type": "application/json"}
    requests.request("POST", url, json=payload, headers=headers)
    url = "http://localhost:8080/api/bets/place"
    payload = {
        "username": "user-" + str(i),
        "gameId": 1,
        "homeGoals": str(randint(0,5)),
        "awayGoals": str(randint(0,5))
    }
    headers = {"Content-Type": "application/json"}
    requests.request("POST", url, json=payload, headers=headers)
    print(i)
