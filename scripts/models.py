#!/usr/bin/env python
# -*- coding: utf-8 -*-


import peewee
from peewee import *


db = MySQLDatabase("angelco", user="root", passwd="")


class Startup(peewee.Model):
    community_profile = peewee.CharField(null=True)
    crunchbase_url = peewee.CharField(null=True)
    video_url = peewee.CharField(null=True)
    company_url = peewee.CharField(null=True)
    _id = peewee.IntegerField(null=True)
    angellist_url = peewee.CharField(null=True)
    quality = peewee.IntegerField(null=True)
    follower_count = peewee.IntegerField(null=True)
    hidden = peewee.BooleanField(null=True)
    launch_date = peewee.DateField(null=True)
    product_desc = peewee.TextField(null=True)
    twitter_url = peewee.CharField(null=True)
    high_concept = peewee.CharField(null=True)
    facebook_url = peewee.CharField(null=True)
    updated_at = peewee.DateField(null=True)
    thumb_url = peewee.CharField(null=True)
    company_size = peewee.CharField(null=True)
    logo_url = peewee.CharField(null=True)
    name = peewee.CharField(null=True)
    created_at = peewee.DateField(null=True)
    linkedin_url = peewee.CharField(null=True)
    blog_url = peewee.CharField(null=True)

    class Meta:
        database = db


if __name__ == "__main__":
    try:
        Startup.create_table()
        print "created startup table"
    except Exception, e:
        print e


class Fundraising(peewee.Model):
    startup = ForeignKeyField(Startup)
    raised_amount = peewee.FloatField(null=True)
    updated_at = peewee.DateField(null=True)
    round_opened_at = peewee.DateField(null=True)
    discount = peewee.CharField(null=True)
    pre_money_valuation = peewee.CharField(null=True)
    equity_basis = peewee.CharField(null=True)
    public = peewee.BooleanField(null=True)
    raising_amount = peewee.IntegerField(null=True)

    class Meta:
        database = db


if __name__ == "__main__":
    try:
        Fundraising.create_table()
        print "created fundraising table"
    except Exception, e:
        print e


class Abilities(peewee.Model):
    startup = ForeignKeyField(Startup)
    has_intro = peewee.BooleanField(null=True)
    can_intro = peewee.BooleanField(null=True)

    class Meta:
        database = db


if __name__ == "__main__":
    try:
        Abilities.create_table()
        print "created abilities table"
    except Exception, e:
        print e


class Market(peewee.Model):
    startup = ForeignKeyField(Startup)
    angellist_url = peewee.CharField(null=True)
    tag_type = peewee.CharField(null=True)
    display_name = peewee.CharField(null=True)
    _id = peewee.IntegerField(null=True)
    name = peewee.CharField(null=True)

    class Meta:
        database = db


if __name__ == "__main__":
    try:
        Market.create_table()
        print "created main table"
    except Exception, e:
        print e


class Status(peewee.Model):
    startup = ForeignKeyField(Startup)
    created_at = peewee.DateField(null=True)
    message = peewee.TextField(null=True)
    _id = peewee.IntegerField(null=True)

    class Meta:
        database = db


if __name__ == "__main__":
    try:
        Status.create_table()
        print "created status table"
    except Exception, e:
        print e


class CompanyType(peewee.Model):
    startup = ForeignKeyField(Startup)
    angellist_url = peewee.CharField(null=True)
    tag_type = peewee.CharField(null=True)
    display_name = peewee.CharField(null=True)
    _id = peewee.IntegerField(null=True)
    name = peewee.CharField(null=True)

    class Meta:
        database = db


if __name__ == "__main__":
    try:
        CompanyType.create_table()
        print "created companytype table"
    except Exception, e:
        print e


class Location(peewee.Model):
    startup = ForeignKeyField(Startup)
    angellist_url = peewee.CharField(null=True)
    tag_type = peewee.CharField(null=True)
    display_name = peewee.CharField(null=True)
    _id = peewee.IntegerField(null=True)
    name = peewee.CharField(null=True)

    class Meta:
        database = db


if __name__ == "__main__":
    try:
        Location.create_table()
        print "created location table"
    except Exception, e:
        print e


class Screenshot(peewee.Model):
    startup = ForeignKeyField(Startup)
    thumb = peewee.CharField(null=True)
    original = peewee.CharField(null=True)

    class Meta:
        database = db


if __name__ == "__main__":
    try:
        Screenshot.create_table()
        print "created screenshot table"
    except Exception, e:
        print e
