var width = d3.select('svg').attr('width');
var height = d3.select('svg').attr('height');

var marginLeft = 100;
var marginTop = 100;

var svg = d3.select('svg')
    .append('g')
    .attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');

//set up scales to position circles using the data
var scaleX = d3.scalePoint().domain(["16-19", "20-24", "25-34", "35-44", "45-54", "55-64","65+"]).range([0, 600]);
var scaleY = d3.scaleLinear().domain([0,1200]).range([400, 0]);  //remember that 0,0 is at the top of the screen! 300 is the lowest value on the y axis

var nestedData = [];

// Add the x Axis
svg.append("g")
    .attr('transform','translate(0,400)')  //move the x axis from the top of the y axis to the bottom
    .call(d3.axisBottom(scaleX));

svg.append("g")
    .call(d3.axisLeft(scaleY));


//use d3 to create a function to draw the line, and store it in a variable for future use
//Tell the function how to calculate x and y positions for each point, using your scale functions and the values stored in the data
//(it doesn't matter that the data hasn't loaded yet, because this function won't run until you call it, and then it will
//use the data that you pass it using d3)
var makeArea = d3.area()
    .x(function(d) { console.log(d); return scaleX(d.age); })
    .y0(scaleY(0))
    .y1(function(d) { return scaleY(d.total); });


//import the data from the .csv file
d3.csv('./incomeData.csv', function(dataIn){

    nestedData = d3.nest()
        .key(function(d){return d.year})
        .entries(dataIn);

    var loadData = dataIn;

    svg.append('text')
        .text('Weekly income by age and gender')
        .attr('transform','translate(300, -20)')
        .style('text-anchor','middle');

    svg.append('text')
        .text('age group')
        .attr('transform','translate(260, 440)');

    svg.append('text')
        .text('weekly income')
        .attr('transform', 'translate(-50,250)rotate(270)');

    // Add the path
    svg.append("path")
                               //skipping .enter(), because we don't want a new path for every point in the dataset!
        .datum(dataIn)         //datum (not data!) tells d3 that all of the data belongs to a single line
        .attr("class", "line")
        .attr("d", makeArea)   //the "d" attribute is just part of how the path element is defined, like "cx" or "cy" for a circle.
                               //it calls the makeLine function above, and hands it sets of points that the path should contain.
        .attr('fill','blue')
        .attr('stroke','blue')
        .attr('stroke-width',3);

});
