// reduce function takes each of these intermediary results and outputs a final result
function(key, values){
    var sum = 0;
    values.forEach(function(value){
        sum += value['count'];
    });
    return {count:sum};
}

// OUTPUTS
/*
{resource: ’index’, year: 2010, month: 0, day: 20} => {count: 3}
{resource: ’about’, year: 2010, month: 0, day: 20} => {count: 1}
{resource: ’about’, year: 2010, month: 0, day: 21} => {count: 3}
{resource: ’index’, year: 2010, month: 0, day: 21} => {count: 2}
{resource: ’index’, year: 2010, month: 0, day: 22} => {count: 1}

Technically the output in MongoDB is:
_id: {resource: 'index', year: 2010, month: 0, day:20}, value: {count:3}
*/

// it's common to chain reduce methods when performing more complex analysis