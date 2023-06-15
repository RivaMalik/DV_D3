
function generatePieChart(name,svg){
    var data=processData(name);
    pieChart(data,svg);
    $("#legendDiv").show();
    
  }
  
  function processData(input){
    console.log(input)
     input=input.toUpperCase()
     var inputNameArray=input.split('');
   
    var binNamesArray=[
      ["A","B","C","D"],["E","F","G","H"],["I","J","K","L"],["M","N","O","P"],["Q","R","S","T","U"],["V","W","X","Y","Z"]];
    
    var colors=["#6C3483","#229954",
               "#3498DB ","#CB4335 ",
                "#F39C12 ","#DFFF00"];
     
  
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
      //console.log("This is bins"+binNamesArray)
      for(var i=0;i<binNamesArray.length;i++){
          var division=binNamesArray[i]
          var color=colors[i]
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
    resultJsonObj["color"]=color;
    resultJsonArray.push(resultJsonObj)
  
  }
  
  console.log(resultJsonArray)
  return resultJsonArray;
   
  }
  
  
  
  function pieChart(data,svg){
    var radius=200;
    svg.setAttribute("width", 2*radius);
   svg.setAttribute("height", 2*radius);
    var sum=0;  
    for(var i=0; i<data.length; i++){
      sum+=data[i].portion;
    }
    // generate proportional pie for all segments
    var startAngle=0, endAngle=0;
    for(var i=0; i<data.length; i++){
      var element=data[i];
      if(element.portion!=0){
      var angle=element.portion * 2 * Math.PI / sum;
      endAngle+=angle;
      var svgLine=makeSVG('line',{x1: radius, y1: radius, x2: (Math.cos(endAngle)*radius+radius), y2: (Math.sin(endAngle)*radius+radius), stroke: element.color});    
     svg.append(svgLine);
      var pathStr=
          "M "+(radius)+","+(radius)+" "+
          "L "+(Math.cos(startAngle)*radius+radius)+","+
               (Math.sin(startAngle)*radius+radius)+" "+
          "A "+(radius)+","+(radius)+
               " 0 "+(angle<Math.PI?"0":"1")+" 1 "+
               (Math.cos(endAngle)*radius+radius)+","+
               (Math.sin(endAngle)*radius+radius)+" "+
          "Z";
      var svgPath=makeSVG('path',{d: pathStr, fill: element.color});
      svg.append(svgPath);
      startAngle+=angle;
    }
    }
  };
  
  // internal svg 
  function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
      el.setAttribute(k, attrs[k]);
    return el;
  } 
  