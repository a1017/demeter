$(document).ready(function () {
    var DENSITY = 3;
    var QUALITY = 2;
    var DISTRIBUTION = 1;

    var CHART_COLOR = "#26a69a";

    var DENSITY_SEL = '#density-map';
    var DISTRIBUTION_SEL = '#distribution-map';
    var QUALITY_SEL = '#quality-map';

    var startups = [];
    var locations = [];
    var cities = [];

    function createMap(sel, drawOption) {
        var g;

        var scale = 1,
            width = $(sel).width(),
            height = 500,
            centered,
            x = width / 2,
            y = height / 2;

        var projection = d3.geo.albersUsa()
            .scale(800)
            .translate([width / 2, height / 2]);

        var path = d3.geo.path()
            .projection(projection);

        var svg = d3.select(sel).append('svg')
            .attr('width', width)
            .attr('height', height);

        svg.append('rect')
            .attr('class', 'background')
            .attr('width', width)
            .attr('height', height)
            .on('click', zoom);

        g = svg.append('g');

        d3.json('/data/us.json', function (error, us) {
            states = topojson.feature(us, us.objects.states).features;

            g.append('g')
                .attr('id', 'states')
                .selectAll('path')
                .data(states)
                .enter().append('path')
                .attr('d', path)
                .on('click', zoom);

            g.append('path')
                .datum(topojson.mesh(us, us.objects.states, function (a, b) {
                    return a !== b;
                }))
                .attr('id', 'state-borders')
                .attr('d', path);

            switch (drawOption) {
                case QUALITY:
                    drawQuality();
                    break;
                case DISTRIBUTION:
                    drawDistribution();
                    break;
                case DENSITY:
                    drawDensity();
                    break
            }

            svg.selectAll('circle')
                .attr('class', 'overlay');
        });

        function drawDistribution() {
            svg.selectAll('circle')
                .data(locations).enter()
                .append('circle')
                .attr('cx', function (d) {
                    return projection(d.coords)[0] * scale;
                })
                .attr('cy', function (d) {
                    return projection(d.coords)[1] * scale;
                })
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + scale + ")translate(" + -x + "," + -y + ")")
                .attr('r', '2px')
                .attr('fill', CHART_COLOR)
                .on('mouseover', function (d) {
                    console.log('yo')
                })
        }

        function drawDensity() {
            svg.selectAll('circle')
                .data(cities).enter()
                .append('circle')
                .attr('cx', function (d) {
                    return projection([d.latitude, d.longitude])[0] * scale;
                })
                .attr('cy', function (d) {
                    return projection([d.latitude, d.longitude])[1] * scale;
                })
                .attr('r', function (d) {
                    var size = Math.sqrt(d.count) * 5;
                    return size + 'px';
                })
                .attr('fill', function () {
                    return CHART_COLOR;
                })
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + scale + ")translate(" + -x + "," + -y + ")")
                .attr('opacity', function () {
                    return '0.3';
                })
                .on('mouseover', function (d) {
                    console.log('yo')
                })
                console.log('good')
        }

        function drawQuality() {
            var colorScale = d3.scale.linear()
                .domain([1, 7])
                .range(["white", CHART_COLOR]);

            svg.selectAll('circle')
                .data(cities).enter()
                .append('circle')
                .attr('cx', function (d) {
                    return projection([d.latitude, d.longitude])[0] * scale;
                })
                .attr('cy', function (d) {
                    return projection([d.latitude, d.longitude])[1] * scale;
                })
                .attr('r', function () {
                    return '5px';
                })
                .attr('fill', function (d) {
                    return colorScale(d.quality);
                })
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + scale + ")translate(" + -x + "," + -y + ")")
                .attr('opacity', function () {
                    return '0.9';
                })
                .on('mouseover', function (d) {
                    console.log('yo')
                })
        }

        function zoom(d) {
            if (d && centered !== d) {
                var centroid = path.centroid(d);

                x = centroid[0];
                y = centroid[1];
                scale = 4;
                centered = d;
            } else {
                x = width / 2;
                y = height / 2;
                scale = 1;
                centered = null;
            }

            g.selectAll('path')
                .classed('active', centered && function (d) {
                    return d === centered;
                });

            d3.selectAll(sel + " circle")
                .transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + scale + ")translate(" + -x + "," + -y + ")");

            g.transition()
                .duration(750)
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ') scale(' + scale + ')translate(' + -x + ',' + -y + ')')
                .style('stroke-width', 1.5 / scale + 'px');
        }
    }

    function parseLocations() {
        var count = 0;

        locations = [];

        for (var startup in startups) {
            for (var i = 0; i < startups[startup].locations.length; i++) {
                locations.push({
                    name: startups[startup].name,
                    coords: [
                        parseFloat(startups[startup].locations[i].location[0]),
                        parseFloat(startups[startup].locations[i].location[1])
                    ]
                });
            }

            count++;
        }
    }

    function parseCities() {
        var sentinel;
        var count = 0;

        for (var startup in startups) {
            sentinel = true;

            for (var i = 0; i < startups[startup].locations.length; i++) {
                for (var j = 0; j < cities.length; j++) {
                    if (cities[j].name == startups[startup].locations[i].name) {
                        cities[j].count++;
                        cities[j].quality = (cities[j].quality + startups[startup].quality) / 2;
                        sentinel = false;
                        break;
                    }
                }

                if (sentinel) {
                    cities.push({
                        count: 1,
                        quality: startups[startup].quality,
                        name: startups[startup].locations[i].name,
                        startup: startups[startup],
                        latitude: parseFloat(startups[startup].locations[i].location[0]),
                        longitude: parseFloat(startups[startup].locations[i].location[1])
                    });
                }
            }

            count++;
        }
    }

    function fetchStartups(callback) {
        d3.json('/data/startups.json', function (error, data) {
            startups = data;

            parseCities();
            parseLocations();

            callback();
        });
    }

    function createMaps() {
        createMap(DENSITY_SEL, DENSITY);
        createMap(DISTRIBUTION_SEL, DISTRIBUTION);
        createMap(QUALITY_SEL, QUALITY);
    }

    function initMaterialize() {
        var pp = $("#pushpin");

        pp.width(pp.width());
        pp.pushpin({
            top: pp.offset().top,
            offset: 92
        });

        var options = [
            {selector: '#density-map', offset: $('#density-map').offset().top, callback: 'expandDensities()'},
            {selector: '#distribution-map', offset: $('#distribution-map').offset().top, callback: 'expandDistribution()'},
            {selector: '#quality-map', offset: $('#quality-map').offset().top, callback: 'expandQualities()'}
        ];

        window.expandDensities = function () {
            $('#expand-densities').click();
        };

        window.expandDistribution = function () {
            $('#expand-distributions').click();
        };

        window.expandQualities = function () {
            $('#expand-qualities').click();
        };

        $('#expand-densities').click();

        scrollFire(options);

        $('.scrollspy').scrollSpy();
        $(".dropdown-button").dropdown();
    }

    fetchStartups(createMaps);
    initMaterialize();
});
