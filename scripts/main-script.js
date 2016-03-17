dataset = d3.csv("data/Economy_Parameters_clean.csv", function(dataset){

// Inititalizing filter variables
  var year = [];
  var country = [];
  var region = [];
  var income_group = [];
  var pop = [];

  dataset.forEach(function(d)
  {
    year.push(d.year);
    country.push(d.country);
    region.push(d.region);
    income_group.push(d.income_group);
    pop.push(parseInt(d.population));
  })

  year = _.uniq(year);
  country = _.uniq(country);
  region = _.uniq(region);
  income_group = _.uniq(income_group);

// Setting default values
  var region_list = region;
  var countries = country;
  var income_group_list = income_group;
  var years = year;
  var min_pop = _.min(pop);
  var max_pop = _.max(pop);
  var pstart = min_pop;
  var pstop = max_pop;
  var filtered_data = dataset;
  var year_int = [];
  year.forEach(function(d){year_int.push(parseInt(d))});
  year_int = _.sortBy(year_int);

// ---------------------------------------
// Country Filter - Functionality 

  var cl = document.getElementById("country-list");
  country.forEach(function(d){
    var option = document.createElement("option");
    option.text = d;
    cl.add(option);
  });

  $(".filter-country").chosen({width: "25%", placeholder_text_multiple: "Country"});
  $( ".filter-country" ).change(function() {
    countries = $('#country-list').val();
    if(countries == null)
    {
      countries = country;
      filtered_data = filterData(dataset, countries, region_list, income_group_list, years, pstart, pstop);
      makePlot(filtered_data);
    }
    else
    {
    filtered_data = filterData(dataset, countries, region_list, income_group_list, years, pstart, pstop);
    makePlot(filtered_data);
    console.log(countries, region_list, income_group_list, years);
  };
  });

// ---------------------------------------
// Region Filter - Functionality 

  var rl = document.getElementById("region-list");
  region.forEach(function(d){
    var option = document.createElement("option");
    option.text = d;
    rl.add(option);
  });
  
  $(".filter-region").chosen({width: "25%", placeholder_text_multiple: "Regions"});

  $( ".filter-region" ).change(function() {
    region_list = $('#region-list').val();
    if(region_list == null)
    {
      region_list = region;
      filtered_data = filterData(dataset, countries, region_list, income_group_list, years, pstart, pstop);
      makePlot(filtered_data);
    }
    else {
      filtered_data = filterData(dataset, countries, region_list, income_group_list, years, pstart, pstop);
      makePlot(filtered_data);
    };
  });

// ---------------------------------------
// Income Group Filter - Functionality 

  var ig = document.getElementById("ig-list");

  income_group.forEach(function(d){
    var option = document.createElement("option");
    option.text = d;
    ig.add(option);
  });


  $(".filter-ig").chosen({width: "25%", placeholder_text_multiple: "Income Group"});
  $( ".filter-ig" ).change(function() {
    income_group_list = $('#ig-list').val();
    if(income_group_list == null)
    {
      income_group_list = income_group;
      filtered_data = filterData(dataset, countries, region_list, income_group_list, years, pstart, pstop);
      makePlot(filtered_data);
    }
    else
    {
      filtered_data = filterData(dataset, countries, region_list, income_group_list, years, pstart, pstop);
      makePlot(filtered_data);
  };
  });

// ---------------------------------------
// Slider #1: Year - Functionality 

  var tooltip = $('<div id="tooltip" />').css({
    position: 'absolute',
    top: -25,
    left: -10
  }).hide();
  
  $( "#slider1" ).slider({
    min: 2010,
    max: 2014,
    values: [2010,2014],
    step: 1,
    range: true,
    start: function( event, ui ) {
        console.log(ui);
        $(ui.handle).find('.ui-slider-tooltip').show();
      },
      stop: function( event, ui ) {
        $(ui.handle).find('.ui-slider-tooltip').hide();
      },
      slide: function(event, ui) {
          $(ui.handle).find('.ui-slider-tooltip').text(ui.value);
          start = ui.values[0];
          stop = ui.values[1];
          years = [];
          while(start <= stop){
              years.push(start.toString());
              start++;
          }
          filtered_data = filterData(dataset, countries, region_list, income_group_list, years, pstart, pstop);
          makePlot(filtered_data);
      },
      create: function( event, ui ) {
        var tooltip = $('<div class="ui-slider-tooltip" />').css({
            position: 'absolute',
            top: -25,
            left: -10
        });
        
        $(event.target).find('.ui-slider-handle').append(tooltip);
      }
  });

// ---------------------------------------
// Slider #2: Population - Functionality 

$("#slider2" ).slider({
    min: min_pop,
    max: max_pop,
    step:1,
    values: [min_pop,max_pop],
    range: true,
    start: function( event, ui ) {
        console.log(ui);
        $(ui.handle).find('.ui-slider-tooltip').show();
      },
      stop: function( event, ui ) {
        $(ui.handle).find('.ui-slider-tooltip').hide();
      },
      slide: function(event, ui) {
          $(ui.handle).find('.ui-slider-tooltip').text(ui.value);
          pstart = ui.values[0];
          pstop = ui.values[1];
          filtered_data = filterData(dataset, countries, region_list, income_group_list, years, pstart, pstop);
          makePlot(filtered_data);
      },
      create: function( event, ui ) {
        var tooltip = $('<div class="ui-slider-tooltip" />').css({
            position: 'absolute',
            top: -25,
            left: -10
        });
        $(event.target).find('.ui-slider-handle').append(tooltip);
      }
    });

//----------------------------------------------------------
// Color Scheme Filtering

var color_schemes = ["By Region", "By Income Group", "By Year"];

var scheme = 1;

var csx = document.getElementById("color-filter");

  color_schemes.forEach(function(d){
    var option = document.createElement("option");
    option.text = d;
    csx.add(option);
  });

  // Default color value
  var applied_color = d3.scale.ordinal()
                        .domain(region)
                        .range(["#F9690E","#3FC380","#F5D76E", "#4B77BE", "#9B59B6", "#96281B", "#DB0A5B"]);

  
  $( ".color" ).change(function() {
    selected_color = $('#color-filter').val();

    if (selected_color == "By Region")
    {
      scheme = 1;
      applied_color = d3.scale.ordinal()
                        .domain(region)
                        .range(["#F9690E","#3FC380","#F5D76E", "#4B77BE", "#9B59B6", "#96281B", "#DB0A5B"]);

      makePlot(filtered_data);
    }
    if (selected_color == "By Income Group")
    {
      scheme = 2;
      applied_color = d3.scale.ordinal()
                        .domain(income_group)
                        .range(["#96281B","#F4D03F","#4183D7", "#F62459", "#2ECC71"]);

      makePlot(filtered_data);
    }
    if (selected_color == "By Year")
    {
      scheme = 3;
      applied_color = d3.scale.ordinal()
                        .domain(year_int)
                        .range(["#b3ffb3","#33ff33","#00e600","#009900", "#003300"]);
      console.log(applied_color);
      console.log("1");
      makePlot(filtered_data);
    }
  });
  

makePlot(dataset);

//----------------------------------------------------------
// FilterData function that returns data to be plotted based on the selections in filters

function filterData(dataset,countries, region_list, income_group_list, years, start, stop)
{
  var filtered_data = [];
  filtered_data = _.filter(dataset,function(d){
        if (($.inArray(d.country, countries) != -1) && ($.inArray(d.region, region_list) != -1) 
          && ($.inArray(d.income_group, income_group_list) != -1) && ($.inArray(d.year, years) != -1) 
          && (d.population >= start) && (d.population <= stop)) {
          return true;
        };
      });
  return filtered_data;
}

// -------------------------------------------------------------

// Data Plotting 

function makePlot(dataset)

{

  d3.selectAll("svg").remove();
  d3.selectAll(".legend").remove();

  var margin = {top: 20, right: 20, bottom: 30, left: 50};
  var w = 900 - margin.left - margin.right;
  var h = 400 - margin.top - margin.bottom;
  var padding = 20;

  var tooltip = d3.select('body').append('div')
            .style('position','absolute')
            .style('padding','10px 10px')
            .style('background','#ecf0f1')
            .style('opacity',0)

  var svg = d3.select("#chart").append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scale.linear()
        .domain([0, 125])
        .range([0, w]);
        //.range([padding, w-padding]);

  var y = d3.scale.linear()
        .domain([0, 50])
        .range([h, 0]);
        //.range([h-padding, padding]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
      .append("text")
      .attr("x", w)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Average Internet Users (Per 100 people)");

  svg.append("g")
   .attr("class", "axis")
   .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Average Unemployment Rate %");


  var circles = svg.selectAll("circle")
   .data(dataset)
   .enter()
   .append("circle")
    .attr("cx", function(d) { return x(d.internet_users);  })
    .attr("cy", function(d) { return y(d.unemployment);  })
    .attr("r", 3.5)
    .style("stroke", "black")
    .style("opacity", 0.7);

    if (scheme == 1)
    {
      svg.selectAll("circle")
        .style("fill", function (d){return applied_color(d.region);})
        .style("stroke","#95A5A6" /*function (d){return applied_color(d.region);}*/);
      var legend = svg.selectAll(".legend")
                .data(region)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) {return "translate(-20," + i * 25 + ")"; });
      legend.append("rect")
                .attr("x", w-140)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", function(d, i) {return applied_color(d);});
      legend.append("text")
                .attr("x", w-120)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function(d, i){return region[i];});
    }

    if (scheme == 2)
    {
      svg.selectAll("circle")
        .style("fill", function (d){return applied_color(d.income_group);})
        .style("stroke","#95A5A6" /*function (d){return applied_color(d.income_group);}*/);
      
      var legend = svg.selectAll(".legend")
                .data(income_group)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) {return "translate(-20," + i * 25 + ")"; });
      legend.append("rect")
                .attr("x", w-140)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", function(d, i) {return applied_color(d);});
      legend.append("text")
                .attr("x", w-120)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function(d, i){ return income_group[i];});
    }

    if (scheme == 3)
    {
      svg.selectAll("circle")
        .style("fill", function (d){return applied_color(d.year);})
        .style("stroke", "#95A5A6"/*function (d){return applied_color(d.year);}*/);
      var legend = svg.selectAll(".legend")
                .data(year_int)
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) {return "translate(-20," + i * 25 + ")"; });
      legend.append("rect")
                .attr("x", w-140)
                .attr("width", 12)
                .attr("height", 12)
                .style("fill", function(d, i) {return applied_color(d);});
      legend.append("text")
                .attr("x", w-120)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "start")
                .text(function(d, i){ return year_int[i];});
    }

$('svg circle').tipsy({ 
        gravity: 's', 
        html: true, 
        title: function() {
          var d = this.__data__;
        return "Country: " + "<i>" + d.country + "</i>" + "<br>" 
        + "Year: " + "<i>" + d.year + "</i>" + "<br>"
        + "Unemployment Rate: " + "<i>" + d.unemployment + "%" + "</i>" + "<br>"
        + "Average Internet Users: " + "<i>" + d.internet_users + "</i>" + "<br>"
        + "Total Population: " + "<i>" + d.population + "</i>" + "<br>"
        + "Region: " + "<i>" + d.region + "</i>" + "<br>"
        + "Income Group: " + "<i>" + d.income_group + "</i>"; 
        }
      });

};


});


