var body=d3.select('body');
d3.select('#visualizeButton').on('click',generateCharts);

var selectedData;

function generateCharts(){
    selectedData="";
    generateBarChart();
    generatePieChart();
    console.log("generate function")
    
}

function splitToChunks (arr, chunkSize) {

    var chunks = [],
    i = 0,
    n = arr.length;

    while (i < n) {
    chunks.push(arr.slice(i, i += chunkSize));
    }

    return chunks;
}

function processData(){

     var input=document.getElementById("userNameInput").value;
     var windowsize=parseInt(document.getElementById('windowInput').value);
  
    console.log(input)
    console.log(windowsize)
    var letterArray=["A","B","C","D","E","F","G","H","I","J","K",
        "L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    input=input.toUpperCase()
    var inputNameArray=input.split('');

    let letterCountInName = inputNameArray.reduce(function (allNames, name) {
    if (name in allNames) {
        allNames[name]++
    }
    else {
        allNames[name] = 1
    }
    return allNames
  
    }, {});



    resultJsonArray=[]
    console.log(letterCountInName)
    var binsName=splitToChunks(letterArray,windowsize)
    console.log(binsName)
    for(var i=0;i<binsName.length;i++){
        var division=binsName[i]
        var binStart=division[0]
        var binEnd=division[division.length-1]
        var sum=0
        var resultJsonObj={}
        for(var j=0;j<division.length;j++){
   
            if(letterCountInName[division[j]]!==undefined){
            sum=sum+letterCountInName[division[j]];
       
        } 
    } 
  
  var bin=binStart+"-"+binEnd
 
  resultJsonObj["bin"]=bin;
  resultJsonObj["portion"]=sum;
  resultJsonArray.push(resultJsonObj)

}

console.log(resultJsonArray)
return resultJsonArray;
 
}



function generateBarChart(){
  
  var data=processData();

  var barChartDiv=d3.select("#barChartDiv");
  barChartDiv.selectAll('*').remove();

 // create a tooltip
 var tooltipBar = d3.select("#barChartDiv")
 .append("div")
 .style("opacity", 0)
 .attr("class", "tooltip");

/*.style("position","absolute")
 .style("width","60px")
 .style("height","30px")

 .style("background-color", "red")
 .style("border", "solid")
 .style("border-width", "2px")
 .style("border-radius", "5px")
 .style("padding", "5px")*/





  var margin = {top: 20, right: 20, bottom: 30, left: 30};

var svgWidth = 600-margin.left-margin.right, 
svgHeight = 600-margin.top-margin.bottom,
barPadding = 1;
var scaleWidth = 30;
var barWidth = ((svgWidth-scaleWidth) / data.length);

//inserting svg
var svg = barChartDiv.append('svg')
    .attr("width", svgWidth+margin.left+margin.right)
    .attr("height", svgHeight+margin.top+margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

//defining x scale

var xScale = d3.scaleBand()
.range([ 0, svgWidth ])
.domain(data.map(function(d) { return d.bin; }))
.padding(0.2);

//defining y scale
var yScale = d3.scaleLinear()
    .domain([0,d3.max(data, function(d) { return d.portion; })])
    .range([svgHeight,0]);

//inserting x scale to svg
var x_axis=d3.axisBottom()
.scale(xScale);

svg.append("g")
.attr("transform", "translate(0," + svgWidth + ")")
.call(x_axis);


//inserting y scale to svg            
var y_axis = d3.axisLeft()
    .scale(yScale);
svg.append("g")
    .call(y_axis);

    //setting color of bars
    var color = d3.scaleOrdinal(d3.schemeSet1);
  //inserting bars to svg

   var bars= svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return xScale(d.bin); })
    .attr("y", function(d) { return yScale(d.portion); })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) { return svgHeight - yScale(d.portion); })
    .attr("fill", function(d){
        console.log("here")
      return color(d.bin);
    })
    .on("mouseover", function(event,d) {
          console.log("in mouse over")
          
          tooltipBar
          .style("opacity", 1)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1);

          tooltipBar.html("Slice: "+d.bin+"</br>"+"Count: "+d.portion)
          tooltipBar.style("left", (event.pageX+10) + "px" )
          .style("top", (event.pageY-10) + "px");
        })
      .on("mouseleave", function(d) {
          console.log("mouse out")
          tooltipBar
            .style("opacity", 0)
            d3.select(this)
            .style("stroke", "none")
            .style("opacity", 0.8)
        });

        bars.on("click",function(event,d){
            console.log("clicked")
            selectedData=d.bin;
            console.log(selectedData)
            bars.filter(d=>d.bin==selectedData).attr("fill","blue");
            bars.filter(d => d.bin !=selectedData)
            .attr('fill', function(d){
                return color(d.bin);
            });
            generatePieChart();
            

        });


}

function generatePieChart(){
   
         var pieChartDiv=d3.select("#pieChartDiv");
         pieChartDiv.selectAll('*').remove();

 // create a tooltip
        var tooltipPie = d3.select("#pieChartDiv")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip");


         var width = 600,height = 500,margin = 50;
         var radius = Math.min(width, height) / 2 -margin; 
         var svgPie=pieChartDiv.append('svg').attr('id','pieSvg').attr('width',width).attr('height',height).style("margin","10%");
         var g=svgPie.append("g")
         .attr("transform", "translate(" + radius + "," +radius + ")");
        
         console.log("hellloo");
     
   
       
         var color = d3.scaleOrdinal(d3.schemeSet1);
      
        var data= processData();

        //calulating total for percentage
        var total = data.map(d => d.portion).reduce((acc, d) => d + acc);

   
         var pie = d3.pie()
           .value(function(d) {return d.portion;
          });
          
         var path=d3.arc().outerRadius(radius).innerRadius(0);
         var arc=g.selectAll("arc").data(pie(data))
         .enter()
         .append("g");
         arc.append("path")
         .attr("d",path)
         .attr("d",path)
         .attr("fill",function(d){
             if(d.data.bin===selectedData){
                 console.log("in pie"+selectedData)
                 return "blue";
             }else{
             return color(d.data.bin);
            }
         }) .on("mouseover", function(event,d) {
            console.log("in mouse over")
            tooltipPie
            .style("opacity", 1)
          d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1);
  
            tooltipPie.html("Slice: "+d.data.bin+"</br>"+"%age: "+Math.round(d.data.portion/total*100))
            tooltipPie.style("left", (event.pageX+10) + "px" )
            .style("top", (event.pageY-10) + "px");
          })
        .on("mouseleave", function(d) {
            console.log("mouse out")
            tooltipPie
     .style("opacity", 0)
   d3.select(this)
     .style("stroke", "none")
     .style("opacity", 0.8)
          });
        


         //adding legends
         var legendRectSize = 15;                                  
         var legendSpacing = 4;                                    
         var size = 20;
       //  var legendSvg=pieChartDiv.append("svg").attr('width',20).attr('height',40)
         var legendGroup=svgPie.append("g")  .attr("transform", "translate(410,0)");
         legendGroup.selectAll("mydots")
           .data(color.domain())
           .enter()
           .append("rect")
             .attr("x", 10)
             .attr("y", function(d,i){ return 10 + i*(size+5)}) // 10 is where the first dot appears. 25 is the distance between dots
             .attr("width", size)
             .attr("height", size)
             .style("fill", function(d){ return color(d)})
         
       // Add one dot in the legend for each name.
       legendGroup.selectAll("mylabels")
            .data(data)
            .enter()
            .append("text")
              .attr("x", 10 + size*1.2)
              .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 10 is where the first dot appears. 25 is the distance between dots
           .    style("fill", "black")
                .text(function(d){ return d.bin})
              .attr("text-anchor", "left")
              .style("alignment-baseline", "middle")   

  
  }

