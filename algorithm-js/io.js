//PDF AND CSV DOWNLOADING

function downloadCSV() {
    var objArray = generated;
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','

            line += array[i][index];
        }

        str += line + '\r\n';
    }

    var blob = new Blob([str], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("id", "dl-link");
            link.setAttribute("download", "Chores-CSV.csv");
            link.style.visibility = 'hidden';

            $("#admin").append(link);
            link.click();
            $("#dl-link").remove();
        }
    }
}


function downloadPDF(){
    var doc = new jsPDF('l', 'pt');
    var elem = document.getElementById("month-schedule");

    doc.autoTableSetDefaults({
        headerStyles: {fillColor: [178,34,34]}, // Red
        margin: {top: 60},
        addPageContent: function(data) {
            doc.setFontSize(20);
            doc.text($("#month-title").text(), 40, 50);
        }
    });

    var res = doc.autoTableHtmlToJson(elem);
    var columns = ["Date", "Kitchen", "", "Trash", "","Vacuum", ""];
    console.log(res);
    doc.autoTable(columns, res.data);
    doc.save("month.pdf");
}

// The event listener for the file upload
document.getElementById('file-upload').addEventListener('change', upload, false);

// Method that reads and processes the selected file
function upload(evt) {
        var data = null;
        var file = evt.target.files[0];
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(event) {
            //console.log(event.target.result);
            var lines = processData(event.target.result);
            generated = lines;
            display(lines,"schedule-container-admin");
            enable();
        };
        reader.onerror = function() {
            alert('Unable to read ' + file.fileName);
        };
}


function processData(allText) {
    var record_num = 7;  // or however many elements there are in each row
    var allTextLines = allText.split(/\r\n|\n/);
    var lines = [];

    var headings = ["date","k1","k2","t1","t2","v1","v2"];
    
    for(var i =0; i<allTextLines.length-1;i++){
        var tarr = [];
        var row = allTextLines[i].split(',');
        lines.push({date: row[0],k1 : row[1],k2: row[2],t1: row[3],t2: row[4],v1: row[5],v2: row[6]});
    }
    return lines;
}