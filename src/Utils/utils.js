
export const preparePaginatedData = (array) => {
    let start = 0
    let end = 50
    let paginatedArray = []
    while(end < array?.length ){
      let temp = array.slice(start, end)
      paginatedArray.push(temp)
      start = end +1
      end = end + 50
    }
    return paginatedArray
  }
  
  export const prepareChartData = (currentRows,col ) => {
    return currentRows.map((array) => {
      let obj = {}
      array?.forEach((element, index) => {
        if(index > 0) {
          obj = {
            ...obj,
            [`${col[index]}`]: isNaN(parseInt(element)) ? element : parseInt(element) 
          }
        }
        
      })
      return obj
    })
     
  }
  
  export const buttonArrayObject = [
    {
      id: 1,
      name: 'Python Action',
      svg: 'python.svg'
    },
    {
      id: 2,
      name: 'SQL Action',
      svg: 'filter.svg'
    },
    {
      id: 3,
      name: 'Filter',
      svg: 'fiter.svg'
    },
    {
      id: 4,
      name: 'Pivot',
      svg: 'pivot.svg'
    },
    {
      id: 5,
      name: 'Visualize',
      svg: 'chart.svg'
    }]
  

export const discardOptionFromArray = (arr, option) => {
  return arr.filter((value) => option !== value)
}

export const debouncedMethod = (fn, delay) => {
  let timer;
  return function (argument) {
    console.log(argument)
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(argument)
    }, delay)
  }
}

export const chartType = ['Line Chart','Area Chart','Bar Chart','Scatter Chart','Composed Line Bar Chart']
export const chartTypeIcons = ['line-chart.png','area-chart.png','bar-chart.png','scatter-graph.png','statistics.png']
export const defaultConfig = {
  dataKey: 'price',
  xAxisDataKey: 'province',
  yAxisDataKey: 'price',
  colorKey: "#7583c7",
  chartFilter: false
};


export const initialState = {
  data: [],
  left: "dataMin",
  right: "dataMax",
  refAreaLeft: "",
  refAreaRight: "",
  top: "dataMax+1",
  bottom: "dataMin-1",
  animation: true
};

// get Yaxis domain
export const getAxisYDomain = (
  from,
  to,
  ref,
  offset,
  data
) => {
  const refData = data.slice(from - 1, to);
  let [bottom, top] = [refData[0][ref], refData[0][ref]];

  refData.forEach((d) => {
    if (d[ref] > top) top = d[ref];
    if (d[ref] < bottom) bottom = d[ref];
  });

  return [(bottom | 0) - offset, (top | 0) + offset];
};
