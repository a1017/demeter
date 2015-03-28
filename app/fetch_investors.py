#!/usr/bin/env python
# -*- coding: utf-8 -*-


import os
import requests
import json
import time
import datetime


ACCESS_TOKEN = os.environ["ANGELCO_ACCESS_TOKEN"]
ANGELLIST_API_URL = "https://api.angel.co/1/"


endpoint = "users"
i = 1
filters = ["raising"]
st = datetime.datetime.fromtimestamp(time.time()).strftime("%Y-%m-%d %H:%M:%S")
f_name = "%s.txt" % (st,)
f = open(f_name, "w+")
print "Getting startups..."
for filter in filters:
    while True:
        payload = {
            "page": i,
            "filter": filter,
            "access_token": ACCESS_TOKEN
        }
        result = requests.get(ANGELLIST_API_URL + endpoint, params=payload).json()
        print "\tpage %s/%s" % (i, result["last_page"])
        f.write(json.dumps(result["startups"]))
        f.write("\n")
        if i == result["last_page"]:
            break
        i += 1

print "done!"
