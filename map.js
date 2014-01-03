// goal of map is to emit a value which can be reduced
// map can emit zero or more times (once is common)

// imagine map as looping through each document in hits

function(){
    // this refers to the current document being inspected
    var key = {
        resource: this.resource,
        year: this.date.getFullYear(),
        month: this.date.getMonth(),
        day: this.date.getDate()
    };
    emit(key, {count:1});
}

// OUTPUTS
/*
{resource: ’index’, year: 2010, month: 0, day: 20} => [{count: 1}, {count: 1}, {count:1}]
{resource: ’about’, year: 2010, month: 0, day: 20} => [{count: 1}]
{resource: ’about’, year: 2010, month: 0, day: 21} => [{count: 1}, {count: 1}, {count:1}]
{resource: ’index’, year: 2010, month: 0, day: 21} => [{count: 1}, {count: 1}]
{resource: ’index’, year: 2010, month: 0, day: 22} => [{count: 1}]
*/