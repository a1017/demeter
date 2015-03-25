select sub.display_name,
	     sub.launch_year,
	     sub.market_count
		from (select market.display_name as display_name,
	  		 startup.launch_date as launch_date,
	  		 extract(year from startup.launch_date) as launch_year,
	  		 count(market.display_name) as market_count


		from market
			 join startup
	 			  on startup.id = market.startup_id
	 	where startup.launch_date is not null

	 	group by market.display_name
	 	) sub
group by sub.display_name, sub.launch_year
order by sub.launch_year
