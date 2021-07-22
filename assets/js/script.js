
function randomForRGB() {
    return Math.floor(Math.random() * 256);
}

function onload() {
    let liveChartElement = document.createElement("canvas")
    let liveChartNoScriptElement = document.createElement("noscript")

    let table1Element = document.getElementById("table1")
    let table1ChartElement = document.createElement("canvas")
    let table1ChartNoScriptElement = document.createElement("noscript")

    let table2Element = document.getElementById("table2")
    let table2ChartElement = document.createElement("canvas")
    let table2ChartNoScriptElement = document.createElement("noscript")

    liveChartNoScriptElement.innerText = "Le graphique n'a pas pu charger car Javascript est désactivé sur votre navigateur :/"
    table1ChartNoScriptElement.innerText = "Le graphique n'a pas pu charger car Javascript est désactivé sur votre navigateur :/"
    table2ChartNoScriptElement.innerText = "Le graphique n'a pas pu charger car Javascript est désactivé sur votre navigateur :/"

    document.getElementById("firstHeading").insertAdjacentElement("afterend", liveChartElement)
    document.getElementById("firstHeading").insertAdjacentElement("afterend", liveChartNoScriptElement)

    table1Element.insertAdjacentElement("beforebegin",table1ChartElement)
    table1Element.insertAdjacentElement("beforebegin",table1ChartNoScriptElement)

    table2Element.insertAdjacentElement("beforebegin",table2ChartElement)
    table2Element.insertAdjacentElement("beforebegin",table2ChartNoScriptElement)

    drawLivechart(liveChartElement)
    drawChart1(table1Element, table1ChartElement)
    drawChart2(table2Element, table2ChartElement)
}

function drawChart1(tableElement, chartElement) {

    const chartData = {
        labels: [],
        datasets: []
    };
    const chartConfig = {
        type: 'line',
        data: chartData
    };

    let tableDataTrElements = [...tableElement.querySelectorAll("tbody tr")]
    let labels = [...tableDataTrElements[0].querySelectorAll("th")]
    let dataTrElements = tableDataTrElements.slice(1,tableDataTrElements.length)

    chartData.labels = labels.map(value => value.innerText).filter(value => value !== "")

    dataTrElements.forEach(trElement => {
        let tdElements = [...trElement.querySelectorAll("td")]
        let datas = tdElements.map(value => value.innerText === ":" ? 0 : value.innerText)

        chartData.datasets.push({
            label: datas[0],
            data: datas.slice(1,datas.length).map(value => value.toString().replace(",",".")),
            fill: false,
            borderColor: `rgb(${randomForRGB()},${randomForRGB()},${randomForRGB()})`,
            tension: 0
        })
    })

    new Chart(chartElement.getContext("2d"), chartConfig);
}

function drawChart2(tableElement, chartElement) {

    const chartData = {
        labels: [],
        datasets: []
    };
    const chartConfig = {
        type: 'bar',
        data: chartData
    };

    let labels = [...tableElement.querySelectorAll("thead tr th")]
    let dataElements = [...tableElement.querySelectorAll("tbody tr")]

    chartData.labels = labels.slice(2, labels.length).map(value => value.innerText)

    dataElements.forEach(dataTrElement => {
        let datas = [...dataTrElement.querySelectorAll("td")].map(value => value.innerText)

        chartData.datasets.push({
            label: datas[0],
            data: datas.slice(1, datas.length),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)'
            ],
            borderWidth: 1
        })
    })

    new Chart(chartElement.getContext("2d"), chartConfig);
}

function drawLivechart(chartElement) {
    const chartData = {
        labels: [],
        datasets: [{
                label: "line",
                data: [],
                fill: false,
                borderColor: `rgb(${randomForRGB()},${randomForRGB()},${randomForRGB()})`,
                tension: 0
            }]
    };
    const chartConfig = {
        type: 'line',
        data: chartData
    };

    let chart = new Chart(chartElement.getContext("2d"), chartConfig);
    let xStart = 1
    let yStart = 10
    let lenght = 10

    function updateliveChart() {
        fetch(`https://canvasjs.com/services/data/datapoints.php?xstart=${xStart}&ystart=${yStart}&length=${lenght}&type=json`)
            .then(value => value.json())
            .then(data => {
                console.log(data)

                data.forEach(value => {
                    chart.data.labels.push(value[0])
                    chart.data.datasets[0].data.push(value[1])
                })

                xStart = chart.data.labels.length + 1
                yStart = chart.data.datasets[0].data[chart.data.datasets[0].data.length - 1]
                lenght = 1

                chart.update();
                setTimeout(() => updateliveChart(), 1000)
            })
            .catch(reason => {
                console.error(reason)
            })
    }

    updateliveChart()
}

window.onload = onload()