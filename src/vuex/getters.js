export const getEmployeeBills = state => () => {
  let validBillTypes = [20, 10, 5, 1]
  let totalHours = getTotalHours(state)()
  let totalTips = getTotalTips(state)()

  return state.employees.map(employee => {
    let total = totalHours ? Math.floor(totalTips * (employee.hours / totalHours)) : 0

    let bills = validBillTypes.map(bill => {
      let count = 0
      while (total >= bill) {
        count += 1
        total -= bill
      }

      return { type: bill, count }
    })

    return { ...employee, bills }
  })
}

export const getTotalHours = state => () => {
  return state.employees.reduce((sum, employee) => {
    return isNaN(employee.hours) ? sum : employee.hours + sum
  }, 0)
}

export const getTotalTips = state => () => {
  return state.change + state.bills.reduce((sum, bill) => {
    if (!isNaN(bill.type) && !isNaN(bill.count)) {
      return (bill.type * bill.count) + sum
    }
    return sum
  }, 0)
}
