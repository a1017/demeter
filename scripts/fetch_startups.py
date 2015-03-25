#!/usr/bin/env python
# -*- coding: utf-8 -*-

import models
import json
from peewee import *


db = MySQLDatabase("angelco", user="root", passwd="")


def parse_datetime(str):
    """
    Converts 2014-10-30T22:48:00Z into YYYY-MM-DD HH:MM:SS
    """
    if str:
        return str.replace("Z", "").replace("T", " ")
    else:
        return None


with open("../data/2014-11-02 13:37:22.txt") as f:
    lines = f.readlines()

try:
    for line in lines:
        line.replace("\n", "")
        startups = json.loads(line)
        for s in startups:
            startup = models.Startup(community_profile=s["community_profile"],
                                     crunchbase_url=s["crunchbase_url"],
                                     video_url=s["video_url"],
                                     company_url=s["company_url"],
                                     _id=s["id"],
                                     angellist_url=s["angellist_url"],
                                     quality=s["quality"],
                                     follower_count=s["follower_count"],
                                     hidden=s["hidden"],
                                     launch_date=parse_datetime(s["launch_date"]),
                                     product_desc=s["product_desc"],
                                     twitter_url=s["twitter_url"],
                                     high_concept=s["high_concept"],
                                     facebook_url=s["facebook_url"],
                                     updated_at=parse_datetime(s["updated_at"]),
                                     thumb_url=s["thumb_url"],
                                     company_size=s["company_size"],
                                     logo_url=s["logo_url"],
                                     name=s["name"],
                                     created_at=parse_datetime(s["created_at"]),
                                     linkedin_url=s["linkedin_url"],
                                     blog_url=s["blog_url"])
            startup.save()
            for screenshot in s["screenshots"]:
                models.Screenshot(startup=startup,
                                  thumb=screenshot["thumb"],
                                  original=screenshot["original"]).save()
            for location in s["locations"]:
                models.Location(startup=startup,
                                angellist_url=location["angellist_url"],
                                tag_type=location["tag_type"],
                                name=location["name"],
                                _id=location["id"],
                                display_name=location["display_name"]).save()
            for company_type in s["company_type"]:
                models.CompanyType(startup=startup,
                                   angellist_url=company_type["angellist_url"],
                                   display_name=company_type["display_name"],
                                   _id=company_type["id"],
                                   name=company_type["name"],
                                   tag_type=company_type["tag_type"]).save()
            for market in s["markets"]:
                models.Market(startup=startup,
                              tag_type=market["tag_type"],
                              _id=market["id"],
                              name=market["name"],
                              display_name=market["display_name"]).save()
            if s["status"]:
                models.Status(startup=startup,
                              created_at=parse_datetime(s["status"]["created_at"]),
                              _id=s["status"]["id"],
                              message=s["status"]["message"]).save()
            if s["fundraising"]:
                fundraising = models.Fundraising(startup=startup,
                                                 raised_amount=s["fundraising"]["raised_amount"],
                                                 round_opened_at=parse_datetime(s["fundraising"]["round_opened_at"]),
                                                 updated_at=parse_datetime(s["fundraising"]["updated_at"]),
                                                 discount=s["fundraising"]["discount"],
                                                 pre_money_valuation=s["fundraising"]["pre_money_valuation"],
                                                 equity_basis=s["fundraising"]["equity_basis"],
                                                 public=s["fundraising"]["public"],
                                                 raising_amount=s["fundraising"]["raised_amount"]).save()
            if s["abilities"] and s["abilities"]["intro"]:
                abilities = models.Abilities(startup=startup,
                                             has_intro=s["abilities"]["intro"]["has"],
                                             can_intro=s["abilities"]["intro"]["can"]).save()
except Exception, e:
    print "exception: %s" % (e,)

print "done"
