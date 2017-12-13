var width = document.getElementById('svg1').clientWidth;
var height = document.getElementById('svg1').clientHeight;

var marginLeft = 0;
var marginTop = 0;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

//set up the projection for the map
var mercatorProjection = d3.geoMercator()  //tell it which projection to use
    .scale(700)                           //tell it how big the map should be
    .translate([(width/2), (height/2)]);  //set the center of the map to show up in the center of the screen

//set up the path generator function to draw the map outlines
path = d3.geoPath()
    .projection(mercatorProjection);        //tell it to use the projection that we just made to convert lat/long to pixels

var stateLookup = d3.map();

var colorScale = d3.scaleLinear().range(['white','blue']);

queue()
    .defer(d3.json, "./locations.json")
    .defer(d3.json, "./regions.json")
    .defer(d3.json, "./mountains_lakes.json")
    //.defer(d3.csv, "./statePop.csv")
    .await(function(err, locations, regions, mountains_lakes){


    populationData.forEach(function(d){
        stateLookup.set(d.name, d.population);
    });


    colorScale.domain([0, d3.max(populationData.map(function(d){return +d.population}))]);

    svg.selectAll("path.locations")               //make empty selection
        .data(locations.features)          //bind to the features array in the map data
        .enter()
        .append("path")                 //add the paths to the DOM
        .attr("d", path)                //actually draw them
        .attr("class", "locations")
        .attr('fill',function(d){
            return colorScale(stateLookup.get(d.properties.NAME));
        })
        .attr('stroke','white')
        .attr('stroke-width',.2);

        svg.selectAll("path.regions")               //make empty selection
            .data(regions.features)          //bind to the features array in the map data
            .enter()
            .append("path")                 //add the paths to the DOM
            .attr("d", path)                //actually draw them
            .attr("class", "regions")
            .attr('fill',function(d){
                return colorScale(stateLookup.get(d.properties.NAME));
            })
            .attr('stroke','white')
            .attr('stroke-width',.2);

  });
