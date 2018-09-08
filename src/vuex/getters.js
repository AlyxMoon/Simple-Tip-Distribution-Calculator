export const getEmployeeTips = state => () => {
  let validBillTypes = [20, 10, 5, 1]
  let totalHours = getTotalHours(state)()
  let totalTips = getTotalTips(state)()

  return state.employees.map(employee => {
    let total = totalHours ? Math.floor(totalTips * (employee.hours / totalHours)) : 0

    let tempTotal = total
    let bills = validBillTypes.map(bill => {
      let count = 0
      while (tempTotal >= bill) {
        count += 1
        tempTotal -= bill
      }

      return { type: bill, count }
    })

    return {
      ...employee,
      bills,
      total
    }
  })
}

export const getLeftoverTips = state => () => {
  return getEmployeeTips(state)().reduce((total, employee) => {
    return total - employee.total
  }, getTotalTips(state)())
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
