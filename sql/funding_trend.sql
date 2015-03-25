select fundraising.round_opened_at,
	   location.name,
	   startup.angellist_url

from fundraising

join location
	 on location.startup_id = fundraising.startup_id
join startup
	 on startup.id = location.startup_id

order by fundraising.round_opened_at, location.name


