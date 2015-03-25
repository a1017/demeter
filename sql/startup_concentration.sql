Select companytype.name,
       count(companytype.name) as name_count,
       location.name as physical_location

from companytype

join location
    on location.startup_id = companytype.startup_id

where companytype.name = 'startup'

group by companytype.name, location.name
order by name_count desc