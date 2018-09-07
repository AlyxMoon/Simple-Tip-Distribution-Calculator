export const addEmployee = ({ commit }) => {
  let employee = { name: '', hours: 0 }

  commit('ADD_EMPLOYEE', { employee })
}

export const changePage = ({ commit }, page) => {
  if (page < 0) page = 0
  if (page > 2) page = 2

  commit('CHANGE_PAGE', { page })
}

export const changeEmployeeHours = ({ commit, state }, index, hours) => {
  if (index >= 0 && index < state.employees.length) {
    commit('SET_EMPLOYEE_HOURS', { index, hours })
  }
}

export const changeEmployeeName = ({ commit, state }, index, name) => {
  if (index >= 0 && index < state.employees.length) {
    commit('SET_EMPLOYEE_NAME', { index, name })
  }
}

export const removeEmployee = ({ commit, state }, index) => {
  if (index >= 0 && index < state.employees.length) {
    commit('REMOVE_EMPLOYEE', { index })
  }
}

// const validBillTypes = [20, 10, 5, 1]
// computeNeededBills () {
//   this.neededBills = {
//     1: {
//       count: 0,
//       diff: 0
//     },
//     5: {
//       count: 0,
//       diff: 0
//     },
//     10: {
//       count: 0,
//       diff: 0
//     },
//     20: {
//       count: 0,
//       diff: 0
//     }
//   }
//
//   this.employees.forEach(employee => {
//     employee.bills.forEach(bill => {
//       this.neededBills[bill.type].count += bill.count
//     })
//   })
//
//   this.neededBills[1].diff = this.neededBills[1].count - this.bills[0].count
//   this.neededBills[5].diff = this.neededBills[5].count - this.bills[2].count
//   this.neededBills[10].diff = this.neededBills[10].count - this.bills[3].count
//   this.neededBills[20].diff = this.neededBills[20].count - this.bills[4].count
// },
//
// employeeTips (hours) {
//   if (this.totalHours === 0) return 0
//   return Math.floor(this.totalTips * (hours / this.totalHours))
// },
//
// updateEmployeeBills () {
//   this.employees.forEach(employee => {
//     let total = this.employeeTips(employee.hours)
//     employee.bills = validBillTypes.map(bill => {
//       let count = 0
//       while (total >= bill) {
//         count += 1
//         total -= bill
//       }
//
//       return {
//         type: bill,
//         count
//       }
//     })
//   })
// }
