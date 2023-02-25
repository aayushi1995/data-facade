import Papa from 'papaparse';
import * as XLSX from 'xlsx/xlsx.mjs';


const convertToCsv = (workBook) => {
    return Promise.allSettled(workBook.SheetNames.map(sheetName => {
        const workSheet = workBook.Sheets[sheetName]
        update_sheet_range(workSheet)
        const csvFileName = `${sheetName}.csv`
        return cleanAndFormCSVfromXLSX(workSheet, csvFileName)
    }))
}

const cleanAndFormCSVfromXLSX = (workSheet, csvFileName) => {
    const promise = new Promise((resolve, reject) => {
        const rows = sheet2arr(workSheet)
        if(!!rows) {
            const trimValues = trimSheet(rows)
            const csvFileContent = XLSX.utils.sheet_to_csv(workSheet)
            
            Papa.parse(
                csvFileContent,
                {
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    worker: true,
                    preview: 200,
                    complete: (result) => {
                        const trimmedCsvFileContent = Papa.unparse({
                            data: result.data.map(dataRow => dataRow.slice(trimValues.LeadTrim, dataRow.length-trimValues.TrailTrim))
                        })

                        const newCsvFile = new File([trimmedCsvFileContent], csvFileName, {type: "text/csv"})
                        resolve(newCsvFile)
                    },
                    error: (errors, file) => {
                    }
                }
            )
        } else {
            reject("No rows parsed")
        }
    })
    return promise;
}

const trimSheet = (rows) => {
    const trims = {
        LeadTrim: 0,
        TrailTrim: 0
    }
    if(!!rows) {
        const columnCount = rows[0].length
        const rowCount = rows.length
        
        const isColumnEmpty = (colIndex) => {
            let result = true
            for(let rowIndex=0;rowIndex<rowCount;rowIndex+=1) {
                if(!!rows[rowIndex][colIndex]) {
                    result = false
                }
            }
            return result;
        }

        for(let colIndex=0;colIndex<columnCount;colIndex+=1) {
            if(!isColumnEmpty(colIndex)) {
                trims.LeadTrim = colIndex
                break
            }
        }

        for(let colIndex=columnCount-1;colIndex>=0;colIndex-=1) {
            if(!isColumnEmpty(colIndex)) {
                trims.TrailTrim = (columnCount-1)-colIndex
                break
            }
        }
    }
    return trims;
}

const sheet2arr = (sheet) => {
    var result = [];
    var row;
    var rowNum;
    var colNum;
    var range = XLSX.utils.decode_range(sheet['!ref']);
    for(rowNum = range.s.r; rowNum <= range.e.r; rowNum++){
       row = [];
        for(colNum=range.s.c; colNum<=range.e.c; colNum++){
           var nextCell = sheet[
              XLSX.utils.encode_cell({r: rowNum, c: colNum})
           ];
           if( typeof nextCell === 'undefined' ){
              row.push(void 0);
           } else row.push(nextCell.w);
        }
        result.push(row);
    }
    return result;
};

const update_sheet_range = (ws) => {
    var range = {s:{r:Infinity, c:Infinity},e:{r:0,c:0}};
    Object.keys(ws).filter(function(x) { return x.charAt(0) != "!"; }).map(XLSX.utils.decode_cell).forEach(function(x) {
      range.s.c = Math.min(range.s.c, x.c); range.s.r = Math.min(range.s.r, x.r);
      range.e.c = Math.max(range.e.c, x.c); range.e.r = Math.max(range.e.r, x.r);
    });
    ws['!ref'] = XLSX.utils.encode_range(range);
  }

const findHeader = (dataRows) => {
    const parsingResult = {
        nonNullElements: -1,
        columnNames: [],
        dataStartsFromRow: -1,
        headerRows: []
    }
    for(let i=0;i<dataRows.length;i+=1) {
        const nonNullElements = dataRows[i].filter(cellValue => !!cellValue).length
        if(nonNullElements > parsingResult.nonNullElements) {
            parsingResult.nonNullElements = nonNullElements;
            parsingResult.columnNames = dataRows[i].map((cellValue, index) => (cellValue||"").length>0?cellValue.trim():`Column-${index+1}`)
            parsingResult.dataStartsFromRow = i+1
            parsingResult.headerRows = [i]
        }
    }
    return parsingResult
}

const findHeaderRows = (csvFile, callBackToSendParsingResult) => {
    Papa.parse(csvFile, {
        dynamicTyping: true,
        skipEmptyLines: true,
        preview: 200,
        complete: (result) => {
            const parsedFileResult = findHeader(result.data)
            callBackToSendParsingResult(parsedFileResult.columnNames, parsedFileResult.dataStartsFromRow, result.data.slice(parsedFileResult.dataStartsFromRow), parsedFileResult.headerRows)
        }
    })
}

export {
    convertToCsv,
    findHeaderRows
};
