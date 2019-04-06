// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;


// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);
  
  // Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
//============================================================================chosenYAxis
var chosenYAxis = "income";

// function used for updating x-scale var upon click on axis label
function xScale(stateData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.8,
      d3.max(stateData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}
//function used for updating y-scale var upon click on axis label=======================Y1
function yScale(stateData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(stateData, d => d[chosenYAxis]) * 0.8,
      d3.max(stateData, d => d[chosenYAxis]) * 1.2
    ])
    .range([height, 0]);

  return yLinearScale;
}
//====================================================================================Y1 end

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}
// function used for updating yAxis bar upon click on y axis label=======================y2 
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

//===================================================================================y2 end

// function used for updating circles group with a transition to
// new circles
function renderXCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating circles group with a transition to new circles ===========y3
function renderYCircles(circlesGroup, newYScale, chosenYaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}
// ==================================================================================y3 end


// function used for updating circles group with new tooltip


function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "age"){
    var xlabel = "Age: "
//     var ylabel = "Income: $";
  }
  else if (chosenXAxis === "obesity"){
    var xlabel = "Obesity: "
  }
  else {
  	var xlabel = "Health Care: "

  }
  
  if (chosenYAxis === "income"){
    var ylabel = "Income: "
//     var ylabel = "Income: $";
  }
  else if (chosenYAxis === "smokes"){
    var ylabel = "Smokes: ";
  }
  else {
  	var ylabel = "Poverty: ";

  }
  
  
  
  // updateToolTip ====================================================================y4
  
  
  
  
  // function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
//   // format the X Axis labelsGroup
//   	var formattedXLabel = chosenXAxis[0]. toUpperCase() + chosenXAxis(1) + " : ";
//   	
//   // format the Y axis labelsGroup
//   	var formattedYLabel = chosenYAxis[0]. toUpperCase() + chosenYAxis(1) + " : ";
// 
// 	 if (chosenYAxis == "income") {
//     	formattedYLabel = formattedYLabel + " $ ";
//   };
//   
//   
//   // do something with circlesGroup
// //     circlesGroup.call(toolTip);
// 	return circlesGroup;
// 
// };
//   
  
  
  // ================================================================================y4 end
  
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  chartGroup.call(toolTip);


  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this)
    .attr("fill", "black")
    .attr("opacity", "0.3")
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data, this);
    });
  return circlesGroup;
}

d3.csv("assets/data/stateData.csv").then(stateData => {
	  
 // parse data
  stateData.forEach(function(data) {
    data.age = +data.age;
    data.obesity = +data.obesity;
    data.healthcare = +data.healthcare;
    data.income = +data.income;
    data.smokes = +data.smokes;
    data.poverty = +data.poverty;
  });

 // xLinearScale function above csv import
  var xLinearScale = xScale(stateData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(stateData, d => d.income)])
    .range([height, 0]);
    
    // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);
    
    // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
    
// append y axis========================================================================y6
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
//     .attr("transform", `translate(${width}, 0)`)
    .call(leftAxis);
// ===================================================================================y6 end
  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".4");
    
     // Create group for  3 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageDataLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age per State");

  var obesityDataLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesity Rate per State");

var healthcareDataLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("inactive", true)
    .text("Available Healthcare per State");
    
// Y Axis lable group =============================================================== y5

var yLabelsGroup = chartGroup.append("g")
//     .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var incomeDataLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height /2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Income")
    .attr("value", "income") // value to grab for event listener
    .classed("active", true);

  var smokesDataLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height /2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes");

var povertyDataLabel = yLabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height /2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("Poverty");

// append y axis
 //  chartGroup.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 0 - margin.left)
//     .attr("x", 0 - (height / 2))
//     .attr("dy", "1em")
//     .classed("axis-text", true)
//     .text("Income");

// Y Axis lable group =============================================================== y5 end

// LABEL GROUP Y  ===========================================START


// LABEL GROUP Y  ===========================================END


 // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

	yLabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXaxis with value
        chosenYAxis = value;
        

        // functions here found above csv import
        // updates x scale for new data
//         xLinearScale = xScale(stateData, chosenXAxis);
        yLinearScale = yScale(stateData, chosenYAxis);

        // updates x axis with transition
//         xAxis = renderXAxes(xLinearScale, xAxis);
    	yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
//         circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
        circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        
        // changes classes to change bold text
        
// ===================================================================================Y 
        if (chosenYAxis === "income") {
          incomeDataLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesDataLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyDataLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "smokes") {
          smokesDataLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeDataLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyDataLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else  {
          smokesDataLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeDataLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyDataLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
	
  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXaxis with value
        chosenXAxis = value;
        

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(stateData, chosenXAxis);
//         yLinearScale = yScale(stateData, chosenYAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);
//     	yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
//         circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        
        // changes classes to change bold text
        if (chosenXAxis === "obesity") {
          obesityDataLabel
            .classed("active", true)
            .classed("inactive", false);
          ageDataLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareDataLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age") {
          obesityDataLabel
            .classed("active", false)
            .classed("inactive", true);
          ageDataLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareDataLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          obesityDataLabel
            .classed("active", false)
            .classed("inactive", true);
          ageDataLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareDataLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

});





