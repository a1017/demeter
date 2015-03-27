$(document).ready(function () {
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

    function createMap(sel, drawOption) {
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
            .attr('height', height)
            //.attr('style', 'padding-left: 70px;');

        svg.append('rect')
            .attr('class', 'background')
            .attr('width', width)
            .attr('height', height)
            .on('click', zoom);

        var g = svg.append('g');

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
                case 1:
                    drawStartupDensityLocations(true);
                    break;
                case 2:
                    drawStartupDensityLocations(false);
                    break;
                case 3:
                    drawStartupLocations();
                    break
            }
        });


        function removeLocations() {
            svg.selectAll('circle').remove();
        }

        function drawStartupLocations() {
            removeLocations();

            d3.json('/data/startups.json', function (error, startups) {
                var scaleFactor = scale == 4 ? 6 : 1;
                var locations = [];
                var count = 0;

                for (var startup in startups) {
                    for (var i = 0; i < startups[startup].locations.length; i++) {
                        locations.push([
                            parseFloat(startups[startup].locations[i].location[0]),
                            parseFloat(startups[startup].locations[i].location[1])
                        ]);
                    }

                    count++;
                }

                $("#startup-badge").html(count);

                svg.selectAll('circle')
                    .data(locations).enter()
                    .append('circle')
                    .attr('cx', function (d) {
                        return projection(d)[0] * scaleFactor;
                    })
                    .attr('cy', function (d) {
                        return projection(d)[1] * scaleFactor;
                    })
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + scale + ")translate(" + -x + "," + -y + ")")
                    .attr('r', '2px')
                    .attr('fill', 'rgb(255, 145, 0)');
            });
        }

        function drawStartupDensityLocations(quality) {
            quality = quality || false;

            removeLocations();

            if (quality) {
                $('#keyTitle').html('Startups');
                $('#keySubject').html('Density');
                $('#keyDescription').html('Location-based density characteristics of different US raising startups.');
            } else {
                $('#keyTitle').html('Startups');
                $('#keySubject').html('Quality');
                $('#keyDescription').html('Location-based quality characteristics of different US raising startups.');
            }

            d3.json('/data/startups.json', function (error, startups) {
                var scaleFactor = 1;
                var cities = [];
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
                                latitude: parseFloat(startups[startup].locations[i].location[0]),
                                longitude: parseFloat(startups[startup].locations[i].location[1])
                            });
                        }
                    }

                    count++;
                }

                $("#startup-badge").html(count);


                var colorScale = d3.scale.linear()
                    .domain([1, 7])
                    .range(["white", "rgb(255, 145, 0)"]);

                svg.selectAll('circle')
                    .data(cities).enter()
                    .append('circle')
                    .attr('cx', function (d) {
                        return projection([d.latitude, d.longitude])[0] * scaleFactor;
                    })
                    .attr('cy', function (d) {
                        return projection([d.latitude, d.longitude])[1] * scaleFactor;
                    });

                svg.selectAll('circle')
                    .attr('r', function (d) {
                        if (quality) {
                            return '5px';
                        } else {
                            var size = Math.sqrt(d.count) * 5;
                            return size + 'px';
                        }
                    })
                    .attr('fill', function (d) {
                        if (quality) {
                            return colorScale(d.quality);
                        } else {
                            return 'rgb(255, 145, 0)';
                        }
                    })
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + scale + ")translate(" + -x + "," + -y + ")")
                    .attr('opacity', function () {
                        if (quality) {
                            return '0.9';
                        } else {
                            return '0.3';
                        }
                    });
            });
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

    createMap('#distribution-map', 1);
    createMap('#density-map', 2);
    createMap('#quality-map', 3);
});
