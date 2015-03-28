#!/usr/bin/env python
# -*- coding: utf-8 -*-


from peewee import *


db = MySQLDatabase("angelco", user="root", passwd="")

q = """
select sub.name_count,
	   sub.name,
	   sub.location_information,
	   sub.early_total_valuation,
	   sub.total_raised,
	   sub.avg_quality,
	   case when sub.name_count = 1 then sub.company_name
	   		else 'not solo' end as solo_names

			from (select market.name,
				 count(market.name) as name_count,
				 location.display_name as location_information,
				 sum(fundraising.raised_amount) as total_raised,
				 sum(pre_money_valuation) as early_total_valuation,
				 avg(startup.quality) as avg_quality,
				 startup.angellist_url as company_name

				 from market

				 join location
				 	on location.startup_id = market.startup_id
				 join fundraising
				 	on fundraising.startup_id = market.startup_id
				 join startup
				 	on startup.id = market.startup_id

				 group by market.name, location.display_name

			) sub

order by sub.name_count desc
"""
results = db.execute_sql(q)
