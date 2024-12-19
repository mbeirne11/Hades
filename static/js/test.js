console.log('Hello')
// fetch the sample file
let moreBoonInfo = {
    Zeus: {}, Poseidon: {}, Ares: {}, Athena: {}, Aphrodite: {}, Demeter: {}, Artemis: {}, Hermes:{}, Dionysus: {}, 
    ChaosBlessings : {}, Duo: {}
}
fetch("./Resources/modify-.json")
.then(response => {
return response.json();
})
// data will be the sample json file
.then(modifyData => {
    Object.entries(modifyData).forEach(([key,value]) =>{
        if(!!moreBoonInfo[value['god']]){
            // console.log(key,value)
            // console.log(moreBoonInfo[value['god']])
            let boon = value['boon'].replace(/([A-Z])/g, ' $1').trim().replace('of', ' of')
            if(boon != value['god']){
                moreBoonInfo[value['god']][key] = value 
                moreBoonInfo[value['god']][key]['count']  = 0
            }
        }
    })
    // console.log(moreBoonInfo)
})
fetch("./Resources/output.json")
.then(response => {
   return response.json();
})
// data will be the sample json file
.then(data => {
    let godCounts = {}
    fetch("./Resources/modify-.json")
    .then(response => {
    return response.json();
    })
    // data will be the sample json file
    .then(modifyData => {        
        data['runs'].forEach(element=>{
            for (let index = 0; index < element['trait'].length; index++) {
                let trait = element['trait'][index]['traitName']
                if(!!modifyData[trait]){
                    let god = modifyData[trait]['god']
                    if(!!moreBoonInfo[god]){
                        if(!!moreBoonInfo[god][trait]){
                            moreBoonInfo[god][trait]['count'] +=1
                        } 
                    }  
                }
            }
        })
        let favGod = 'None'
        let favGodCount = 0
        Object.entries(moreBoonInfo).forEach(([key,value])=>{
            c = 0
            Object.values(value).forEach(element =>{
                c += element['count']
            })
            godCounts[key] = c
            if(c>=favGodCount){
                favGodCount = c
                favGod = key
            }
        })
        //--General Info--//
        let attempts = data['runs'].length
        let firstClear = 'None'
        let totalClears = 0
        let highestHeatAttempt = 0
        let highestHeatClear = 0
        let favWeapon = 'None'
        
        data['runs'].forEach(element => {
            if(element['clearMessage']=='ClearNumOne'){
                firstClear = element['index']
            }
            if(element['result'] == "RunHistoryScreen_Cleared"){
                totalClears +=1 
                if(element['heatPoints'] > highestHeatClear){
                    highestHeatClear = element['heatPoints']
                }
            }
            if(element['heatPoints'] > highestHeatAttempt){
                highestHeatAttempt = element['heatPoints']
            }
            
        })
        document.getElementById('attempts').innerHTML += attempts
        document.getElementById('firstClear').innerHTML += firstClear
        document.getElementById('clears').innerHTML += totalClears
        document.getElementById('highestHeatAttempt').innerHTML += highestHeatAttempt
        document.getElementById('highestHeatClear').innerHTML += highestHeatClear
        document.getElementById('favGod').innerHTML += favGod
        
        let godInfo =  moreBoonInfo['Zeus']
        document.getElementById('godInfo').innerHTML =''
        let sortedGodInfo = {};
        
        for (let index = 0; index < Object.keys(godInfo).length; index++) {
            // console.log(index)
            let max = 0
            Object.entries(godInfo).forEach(([key,value]) => {
                // console.log(key,value['count'])
                // console.log(!sortedGodInfo[key])
                if(!sortedGodInfo[key]){
                    if(value['count'] >= max){
                        max = value['count']
                        // console.log(max)
                    }
                }
            })
            Object.entries(godInfo).forEach(([key,value]) => {
                if(value['count'] >= max){
                    sortedGodInfo[key] = value
                }
            })
        }
        // console.log(sortedGodInfo)

        Object.entries(sortedGodInfo).forEach(([key,value]) => {
            let newDiv = document.createElement('div')
            newDiv.className = "boonInfo"
            newDiv.innerHTML += key + ': <br> \t Name: ' + value['boon'].replace(/([A-Z])/g, ' $1').trim().replace('of', ' of') + ', Count: ' + value['count'] +'<br>'
            if(value['status'] == "Legendary"){
                newDiv.classList.add('Legendary')
            }
            Object.entries(value['count']).forEach(element=>{
                newDiv.innerHTML += element + ' '
            })
            document.getElementById('godInfo').appendChild(newDiv)
            
        })
        let selectGod = d3.select('#godSelect')
        Object.entries(moreBoonInfo).forEach(([key,value])=>{
                newGod = selectGod.append('option')
                newGod.text(key)
                newGod.attr("value", key)
        })         
    })
    
    

    //--TABLE--//
    // Select the table by id
    let runTable = document.getElementById("run-data")
    //create thead
    let headerRow = document.createElement('tr')
    Object.keys(data['runs'][0]).forEach(header=>{
        let th = document.createElement('th')
        th.textContent = header
        headerRow.appendChild(th)
    })
    runTable.tHead.appendChild(headerRow)

    //resest table
    if(!!document.getElementsByTagName("tbody")[0]){
        document.getElementsByTagName("tbody")[0].remove();
    }
    // Create a tbody
    let runTableBody = document.createElement('tbody')
    runTable.append(runTableBody)
    var boons = []
    // Fill in the table with data
    data['runs'].forEach(element => {
        let newRow = document.createElement('tr')
        runTableBody.append(newRow)
        // loop through each column in this row
        Object.entries(element).forEach(([key,value]) => {
            var item = value
            var traits = []
            // cleaning up the table so it's easier to read
            if(key=="result"){
                item = value.replace("RunHistoryScreenResult_","").replace("RunHistoryScreen_","")
            }
            else if(key=="weapon"){
                item = value.replace("Weapon","")
            }
            else if(key=="aspect"){
                item = value.replace("Trait","")
            }
            else if(key=="keepsake"){
                item = value.replace("Trait","")
            }
            else if(key=="companion"){
                item = value.replace("Trait","")
            }
            else if(key=="trait"){
                for (let index = 0; index < item.length; index++) {
                    const element = item[index];
                    traits.push(' ' + element['traitName'])
                    if(!boons.includes(element['traitName'])){
                        boons.push(element['traitName'])
                    }
                }
                item = traits
            }
            else if(key=="heat"){
                for (let index = 0; index < item.length; index++) {
                    const element = item[index];
                    traits.push(' ' + element['heatName'].replace("_ShortTotal","").replace("NoIcon",""))
                }
                item = traits
            }
            else if(key=="darkness"){
                for (let index = 0; index < item.length; index++) {
                    const element = item[index];
                    traits.push(' ' + element['darknessName'].replace("_ShortTotal","").replace("NoIcon",""))
                }
                item = traits
            }
            newCell = document.createElement('td')
            newCell.innerHTML = item
            newRow.append(newCell)
        })
    })
    //--Plotly--//
    
    let runHistory = {}
    data['runs'].forEach(element => {
        if(!runHistory[element['weapon'].replace('Weapon','')]){
            runHistory[element['weapon'].replace('Weapon','')] = []
        }
        let run = {}
        run['Attempt'] = element['index']
        run['Result'] = element['result']
        run['Time'] = element['time'] 
        run['Aspect'] = element['aspect']
        run['Heat'] = element['heatPoints']
        runHistory[element['weapon'].replace('Weapon','')].push(run)
    })
    let favWeaponCount = 0
    Object.entries(runHistory).forEach(([key,value]) =>{
        // console.log(key,value)
        if(value.length >= favWeaponCount){
            favWeaponCount = value.length
            favWeapon = key
        }
    })
    document.getElementById('favWeapon').innerHTML += favWeapon
    function createPlotly(){
        //RunHistory//
        let weaponLayouts = {
            'Sword': {
                'color': '#ff0000',
                'symbol': 'triangle-up'
            },
            'Spear':{
                'color': '#ffff00',
                'symbol': 'diamond-tall-dot'
            },
            'Shield':{
                    'color': '#00ff00',
                    'symbole': 'hexagon-dot'
            },
            'Bow':{
                'color': '#00ffff',
                'symbol': 'y-left',
                // size : 30,
                'line' : {
                    'color' : "#00ffff",
                    'width' : 1
                }
            },
            'Fist':{
                'color': '#0000ff',
                'symbol': 'star'
            },
            'Gun':{
                'color': '#ff00ff',
                'symbol': 'x'
            }
            
        }
            // console.log(weaponLayouts)
        let runHistoryTrace = []
        let y2 = []
        let runResults = {}
        Object.entries(runHistory).forEach(([key,value])=>{
            let x = []
            let y = []
            let text = []
            // console.log(value)
            let trace = {
                x:x,
                y:y,
                text: text,
                hovertemplate: 'Attempt: %{x}' +
                                '<br>%{text}' +
                                '<br>Result: %{y}',
                mode: 'markers',
                name:key,
                marker: weaponLayouts[key],
                type: 'scatter'
            }
            let clears = 0
            Object.values(value).forEach(element=>{
                if(element['Result'].replace('RunHistoryScreen','').replace('Result','')
                    .replace('_','') == 'Cleared'){
                    clears += 1
                }
                let runResult = element['Result'].replace('RunHistoryScreen','').replace('Result','')
                .replace('_','')
                if(!runResults[runResult]){
                    runResults[runResult] = 1
                }else{
                    runResults[runResult] += 1
                }
                trace['x'].push(element['Attempt'])
                trace['y'].push(runResult)
                trace['text'].push('Aspect: ' + element['Aspect'] +
                    '<br>Time: ' + element['Time'] + 
                    '<br>Heat: ' + element['Heat'])
            })
            y2.push(clears)
            // console.log(trace)
            runHistoryTrace.push(trace)
        })
        let layout = {
            paper_bgcolor:  "black",
            plot_bgcolor: "black",
            // width: '100%',
            height: 500,
            title: '<b>Results</b>',
            font:{
                color:'aliceblue'
            },
            xaxis: {
                color:'aliceblue',
                gridcolor:'rgba(180, 0, 0, 0.5)',
                title: {
                    text: '<b>Attempt</b>'
                }
            },
            yaxis: {
                color:'aliceblue',
                gridcolor:'rgba(180, 0, 0, 0.5)',
                automargin:true,
                // showticklabels:false,
                title: {
                    text: '<b>Result</b>'
                },
                categoryarray:[
                                'Tartarus','A_MiniBoss01','A_MiniBoss02','A_Boss01','A_Boss02','A_Boss03',
                                'Asphodel','B_Wrapping01','B_MiniBoss01','B_MiniBoss02','B_Boss01',
                                'Elysium','C_MiniBoss01','C_MiniBoss02','C_Boss01',
                                'CharonFight01','Styx','D_Boss01','Cleared']}
        }
        //Weapons Bar Graph//
        const weaponsList = ['sword','spear','shield','bow','fist','gun']
        let x = weaponsList
        let y1 = [runHistory['Sword'].length,runHistory['Spear'].length,runHistory['Shield'].length,runHistory['Bow'].length,runHistory['Fist'].length,runHistory['Gun'].length]
        let y3 = []
        for(let i = 0;i<x.length;i++){
            y3.push(y2[i]/y1[i]*100)
        }
        let weaponTrace = [{
            x:x, 
            y:y1, 
            type:"bar",
            name: "Attempts"
        },{
            x:x, 
            y:y2, 
            name: "Cleared",
            type:"bar"
        },{
            x:x, 
            y:y3,
            name: "Clear Rate", 
            type:"bar"
        }];
        let weaponLayout = {
            paper_bgcolor: "black",
            plot_bgcolor: "black",
            title:"<b>Weapon</b>",
            automargin:true,
            font:{
                color:'aliceblue'
            },
            xaxis:{
                title: {
                    title: '<b>Weapon</b>'
                }
            },
            yaxis:{
                gridcolor:'rgba(180, 0, 0, 0.5)'
            }
            // height: 500
            // width:750
        };
        //Pie Chart Results//
        let pieResults = [{
            labels:['B_Wrapping01',
                'Tartarus','A_MiniBoss01','A_MiniBoss02','A_Boss01',
                'Asphodel','B_MiniBoss01','B_MiniBoss02','B_Boss01',
                'Elysium','C_MiniBoss01','C_MiniBoss02','C_Boss01',
                'Styx','CharonFight01','D_Boss01','Cleared'], 
            values:[runResults['B_Wrapping01'],
            runResults['Tartarus'],runResults['A_MiniBoss01'],runResults['A_MiniBoss02'],runResults['A_Boss01'],
            runResults['Asphodel'],runResults['B_MiniBoss01'],runResults['B_MiniBoss02'],runResults['B_Boss01'],
                runResults['Elysium'],runResults['C_MiniBoss01'],runResults['C_MiniBoss02'],runResults['C_Boss01'],
                runResults['Styx'], runResults['CharonFight01'],runResults['D_Boss01'],runResults['Cleared']], 
            
                textposition: 'inside',
                type:"pie"
            
        }];
        let pieResultsLayout = {
            paper_bgcolor: "rgb(180,0,0)",
            plot_bgcolor: "rgb(120,120,120,)",
            title:"<b>Results</b>",
            font:{
                color:'aliceblue'
            },
            automargin:true,
            height: '100%',
            // showlegend: true
            // width:750
        };
        //Pie Chart Boons//
        let labels = [
                'Athena','Zeus', 'Poseidon', 'Ares',  'Aphrodite', 'Demeter', 'Artemis', 'Hermes', 'Dionysus', 'Duo']
        let godsTrace = [{
            labels:labels, 
            values:[
                godCounts['Zeus'], 
                godCounts['Poseidon'], 
                godCounts['Ares'], 
                godCounts['Athena'], 
                godCounts['Aphrodite'], 
                godCounts['Demeter'], 
                godCounts['Artemis'],
                godCounts['Hermes'],
                godCounts['Dionysus'],
                godCounts['Duo'],
            ],
            type:"pie"
        }];
        let godsLayout = {
            paper_bgcolor: "rgb(180,0,0)",
            plot_bgcolor: "rgb(120,120,120,)",
            title:"<b>Boons</b>",
            font:{
                color:'aliceblue'
            },
            width:550
        }; 
        //Config//
        config = {
            responsive: true
        }
        //Add Plots to page by id//
        Plotly.newPlot('plot',runHistoryTrace,layout,config)
        Plotly.newPlot('plot2',godsTrace,godsLayout,config)
        Plotly.newPlot('plot3',pieResults,pieResultsLayout,config)
        Plotly.newPlot('plot6',weaponTrace,weaponLayout,config)

        Plotly.Plots.resize('plot')
        Plotly.Plots.resize('plot2')
        Plotly.Plots.resize('plot3')
        Plotly.Plots.resize('plot6')
    }
    createPlotly()
    //Create a function to hide all elements
    d3.select('#homeTab').on('click', () =>{
        d3.select('#home').attr('style', 'display:block')
        d3.select('#compare').attr('style', 'display:none')
    })
    d3.select('#compareTab').on('click', () =>{
        console.log('compare')
        d3.select('#compare').attr('style', 'display:block')
        d3.select('#home').attr('style', 'display:none')
    })
    function hideAllHome() {
        d3.select("#runsHome").attr("style", "display:none")
        d3.select("#godsHome").attr("style", "display:none")
        d3.select("#compare").attr("style", "display:none")
    }
    //Create click events that will display each tab
    // Use D3 to select the tab and add a click event
    d3.select("#general-tab-button").on("click", () => {
        hideAllHome()
        createPlotly()
        // change the display of the tab we want visible
        d3.select("#generalHome").attr("style", "display:grid")
    })
    d3.select("#runs-tab-button").on("click", () => {
        hideAllHome()
        createPlotly()
        d3.select("#runsHome").attr("style", "display:block")
        d3.select("#generalHome").attr("style", "display:none")

    })
    d3.select("#gods-tab-button").on("click", () =>{
        hideAllHome()
        createPlotly()
        d3.select("#godsHome").attr("style", "display:block")
        d3.select("#generalHome").attr("style", "display:none")
    })
    hideAllHome()
    function hideAllCompare() {
        d3.select("#runsCompare").attr("style", "display:none")
        d3.select("#godsCompare").attr("style", "display:none")
    }
    //Create click events that will display each tab
    // Use D3 to select the tab and add a click event
    d3.select("#general-compare-button").on("click", () => {
        hideAllCompare()
        createPlotly()
        // change the display of the tab we want visible
        d3.select("#generalCompare").attr("style", "display:block")
    })
    d3.select("#runs-compare-button").on("click", () => {
        hideAllCompare()
        createPlotly()
        d3.select("#runsCompare").attr("style", "display:block")
        d3.select("#generalCompare").attr("style", "display:none")

    })
    d3.select("#gods-compare-button").on("click", () =>{
        hideAllCompare()
        createPlotly()
        d3.select("#godsCompare").attr("style", "display:block")
        d3.select("#generalCompare").attr("style", "display:none")
    })
    hideAllCompare()
})
let selectGod = d3.select('#godSelect')
function updateGodInfo(){    
    let god = (d3.select("#godSelect").property("value"))
    let godInfo =  moreBoonInfo[god]
    // document.getElementById('godName').innerHTML = god
    document.getElementById('godInfo').innerHTML =''
    let sortedGodInfo = {};
        
        for (let index = 0; index < Object.keys(godInfo).length; index++) {
            let max = 0
            Object.entries(godInfo).forEach(([key,value]) => {
                if(!sortedGodInfo[key]){
                    if(value['count'] >= max){
                        max = value['count']
                    }
                }
            })
            Object.entries(godInfo).forEach(([key,value]) => {
                if(value['count'] >= max){
                    sortedGodInfo[key] = value
                }
            })
        }
    Object.entries(sortedGodInfo).forEach(([key,value]) => {
        let newDiv = document.createElement('div')
            if(!value['boon'].includes('{')){
                newDiv.className = "boonInfo"
                newDiv.innerHTML += key + ': <br> \t Name: ' + value['boon'].replace(/([A-Z])/g, ' $1').trim().replace('of', ' of') + ', Count: ' + value['count'] +'<br>'
            }

            if(value['status'] == "Legendary"){
                newDiv.classList.add('Legendary')
            }
            Object.entries(value['count']).forEach(element=>{
                newDiv.innerHTML += element + ' '
            })
            document.getElementById('godInfo').appendChild(newDiv)
        
    })
}
