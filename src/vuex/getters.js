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
