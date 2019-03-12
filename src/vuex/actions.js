import localForage from 'localforage'

export const addEmployee = ({ commit }) => {
  let employee = { name: '', hours: 0 }

  commit('ADD_EMPLOYEE', { employee })
}

export const changePage = ({ commit }, page) => {
  if (page < 0) page = 0
  if (page > 2) page = 2

  commit('CHANGE_PAGE', { page })
}

export const changeBillCount = ({ commit, state }, { type, count }) => {
  if (type === 'change' || type === 'change2') {
    commit('SET_CHANGE_COUNT', { count: Number(count) })
  } else {
    commit('SET_BILL_COUNT', { index: state.bills.findIndex(bill => bill.type === type), count: Number(count) })
  }
}

export const changeEmployeeHours = ({ commit, state }, { index, hours }) => {
  if (index >= 0 && index < state.employees.length) {
    commit('SET_EMPLOYEE_HOURS', { index, hours: Number(hours) })
  }
}

export const changeEmployeeName = ({ commit, state }, { index, name }) => {
  if (index >= 0 && index < state.employees.length) {
    commit('SET_EMPLOYEE_NAME', { index, name })
  }
}

export const clearBillCounts = ({ commit, state }) => {
  for (let type of [1, 2, 5, 10, 20, 50, 100, 'change']) {
    changeBillCount({ commit, state }, { type, count: 0 })
  }
}

export const clearEmployeeHours = ({ commit, state }) => {
  for (let index = 0; index < state.employees.length; index++) {
    commit('SET_EMPLOYEE_HOURS', { index, hours: 0 })
  }
}

export const removeEmployee = ({ commit, state }, index) => {
  if (index >= 0 && index < state.employees.length && confirm('Are you sure you want to remove this person?')) {
    commit('REMOVE_EMPLOYEE', { index })
  }
}

// API stuff
export const loadFromStorage = ({ commit, state }) => {
  return Promise.all([
    localForage.getItem('employees'),
    localForage.getItem('bills'),
    localForage.getItem('change'),
    localForage.getItem('change2')
  ])
    .then(values => {
      if (values[0] && values.length > 0) {
        commit('SET_EMPLOYEES', { employees: values[0] })
      }
      if (values[1] && values[1].length > 0) {
        values[1].forEach(bill => changeBillCount({ commit, state }, { type: bill.type, count: bill.count }))
      }
      if (values[2]) {
        commit('SET_CHANGE_COUNT', { count: values[2] })
      }
      if (values[3]) {
        commit('SET_CHANGE_COUNT', { count2: values[3] })
      }
    })
}

export const saveToStorage = ({ commit, state }) => {
  commit('SET_SAVING', { saving: true })
  return Promise.all([
    localForage.setItem('employees', state.employees),
    localForage.setItem('bills', state.bills),
    localForage.setItem('change', state.change),
    localForage.setItem('change2', state.change2)
  ])
    .then(() => new Promise(resolve => setTimeout(resolve, 500)))
    .then(() => commit('SET_SAVING', { saving: false }))
}
