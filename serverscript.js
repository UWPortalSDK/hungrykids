// Retreive data from the database
function getData() {
    var queryResult = db.Execute('SELECT * FROM hungrykids');
    var rows = JSON.parse(queryResult);
    if (rows.length > 0 && typeof rows[0].Error != 'undefined') {
        return '{"status":"noTable"}';
    }
    return queryResult;
}

// Create talbe
function createTable() {
    var result = {};

    var queryResult = db.Execute('SELECT TOP 1 * FROM hungrykids');
    var row = JSON.parse(queryResult);

    if (row.length > 0 && typeof row[0].Error != 'undefined') {
        db.Execute('CREATE TABLE hungrykids(id INTEGER PRIMARY KEY IDENTITY(1,1), foodname nvarchar(500),startdate datetime, enddate datetime, room nvarchar(50),event nvarchar(200),eventurl nvarchar(500),description nvarchar(4000));');
        result = '{"status":"tableCreated"}';
    } else
        result = '{"status":"tableExist"}';

    return JSON.stringify(result);
}

// Insert into the database
function insert() {
       db.Execute('INSERT INTO hungrykids VALUES(@foodname,@startdate,@enddate,@room,@event,@eventurl,@description)');
       return getData();
}

