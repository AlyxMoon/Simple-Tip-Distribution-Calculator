export const getBillOfType = state => type => {
  return state.bills.find(bill => bill.type === type)
}

export const getSumOfQuarters = state => {
  return state.employees.reduce((sum, employee) => {
    return sum + (Number(employee.reservedQuarters) || 0)
  }, 0)
}

export const getEmployeeTips = (state, getters) => {
  let validBillTypes = [20, 10, 5, 1]
  let totalHours = getters.getTotalHours
  let totalTips = getters.getTotalTips

  let employeeTotals = state.employees.map((employee, index) => {
    return {
      total: totalHours ? Math.floor(totalTips * (employee.hours / totalHours)) : 0,
      index
    }
  })
  let leftover = employeeTotals.reduce((leftover, employee) => { return leftover - employee.total }, totalTips)

  let whoGetsLeftovers = []
  employeeTotals.sort((x, y) => {
    if (x.total < y.total) return 1
    if (x.total > y.total) return -1
    return 0
  }).forEach(employee => {
    if (--leftover >= 0) whoGetsLeftovers.push(employee.index)
  })

  return state.employees.map((employee, index) => {
    let total = totalHours ? Math.floor(totalTips * (employee.hours / totalHours)) : 0
    total += whoGetsLeftovers.includes(index) ? 1 : 0

    let tempTotal = total - employee.reservedQuarters || 0
    let bills = validBillTypes.map(bill => {
      let count = 0
      while (tempTotal >= bill) {
        count += 1
        tempTotal -= bill
      }

      return { type: bill, count }
    }).concat({ type: 'quarter', count: employee.reservedQuarters * 4 })

    return {
      ...employee,
      bills,
      total,
      percent: ((total / totalTips) * 100).toFixed(2)
    }
  })
}

export const getLeftoverTips = (state, getters) => {
  return getters.getEmployeeTips.reduce((total, employee) => {
    return total - employee.total
  }, getters.getTotalTips)
}

export const getTotalHours = state => {
  return state.employees.reduce((sum, employee) => {
    return isNaN(employee.hours) ? sum : employee.hours + sum
  }, 0)
}

export const getTotalTips = (state, getters) => {
  return (
    state.change2 +
    state.change +
    getters.getSumOfQuarters +
    state.bills.reduce((sum, bill) => {
      if (!isNaN(bill.type) && !isNaN(bill.count)) {
        return (bill.type * bill.count) + sum
      }
      return sum
    }, 0)
  )
}

export const getTotalChangeAmounts = (state, getters) => {
  return state.change + state.change2
}
