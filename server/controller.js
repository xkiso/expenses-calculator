const controller = {};

controller.calculate = (req, res, next) => {
  try {
    if (!req.body) // req body should not be empty
      throw "Request body should not be empty.";

    const data = req.body;
    
    let arr = []; // array of { studentName, totalExpenses }
    let average = 0; // total expenses

    if (data.students.length <= 0)
      throw "Students array should not be empty.";

    // loop through "students" array
    data.students.forEach( student => {
      
      // student did not spend any expenses/empty array
      if (student.expenses.length <= 0) {
        arr.push(
          { "name": student.name, "total": 0 }
        );
      } else {
        // add student name and total
        arr.push(
          {
            "name": student.name,
            // use reduce to calculate total
            "total": student.expenses.reduce( (acc, curr) => {
              if (typeof curr != "number")
                throw `Array should contain numbers only: ${ curr }`;
              average += curr * 100; // multiply by 100 to work with cleaner integer operations
              acc += curr * 100;
              return acc;
            }, 0)
          }
        );
      }
    
    }) // data.students.forEach

    average /= (data.students.length); // calculate average
    average = Number(average.toFixed(0)); // round to the nearest ones place

    // sort array from lowest to highest
    arr = arr.sort( (a, b) => {
      return a.total - b.total;
    })

    // subtract the average from each student total
    arr = arr.map( element => {
      return { "name": element.name, "total": element.total - average };
    })

    let result = []; 
    let start = 0, end = arr.length - 1;
    
    while (start < end) {
      let calc = arr[end].total + arr[start].total;
      if (calc > 0) { // fully transferred to END student
        result.push(`${ arr[start].name } owes ${ arr[end].name } $ ${ Math.abs(arr[start].total / 100) }`);
        start++;
        arr[end].total = calc;
      } else if (calc < 0) { // not enough to cover START student
        result.push(`${ arr[start].name } owes ${ arr[end].name } $ ${ Math.abs(arr[end].total  / 100) }`);
        end--;
        arr[start].total = calc;
      } else { // evenly exchanged
        result.push(`${ arr[start].name } owes ${ arr[end].name } $ ${ Math.abs(arr[start].total  / 100) }`);
        start++;
        end--;
      }
    }

    res.locals.result = { result };
    next();
  }
  catch (err) {
    console.log(`controller.js/calculate: ${ err }`)
    // ERROR handler
    return next({
      log: `controller.js/calculate: ${ err }`,
      message: {
        err:
          'Error occurred in controller.js/calculate. Check server logs for more details.',
      },
    });
  }
}

module.exports = controller;