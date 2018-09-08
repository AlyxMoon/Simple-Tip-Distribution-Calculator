export const ADD_EMPLOYEE = (state, payload) => {
  state.employees = state.employees.concat(payload.employee)
}

export const CHANGE_PAGE = (state, payload) => {
  state.page = payload.page
}

export const REMOVE_EMPLOYEE = (state, payload) => {
  state.employees = state.employees.slice(0, payload.index).concat(state.employees.slice(payload.index + 1))
}

export const SET_BILL_COUNT = (state, payload) => {
  state.bills[payload.index] = Object.assign({}, state.bills[payload.index], { count: payload.count })
}

export const SET_CHANGE_COUNT = (state, payload) => {
  state.change = payload.change
}

export const SET_EMPLOYEE_HOURS = (state, payload) => {
  state.employees[payload.index] = Object.assign({}, state.employees[payload.index], { hours: payload.hours })
}

export const SET_EMPLOYEE_NAME = (state, payload) => {
  state.employees[payload.index] = Object.assign({}, state.employees[payload.index], { name: payload.name })
}
