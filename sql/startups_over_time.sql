select sub.geographical_location,
	   sub.year_data,
	   count(sub.geographical_location) as year_hits
	from (select location.name as geographical_location,
	   startup.angellist_url as company_url,
	   extract(year from fundraising.round_opened_at) as year_data

	from fundraising

	join location
	 	 on location.startup_id = fundraising.startup_id
	join startup
	 	 on startup.id = location.startup_id
	order by fundraising.round_opened_at) sub

	group by sub.year_data, sub.geographical_location
