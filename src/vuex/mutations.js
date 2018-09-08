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
  state.bills = [
    ...state.bills.slice(0, payload.index),
    { type: state.bills[payload.index].type, count: payload.count },
    ...state.bills.slice(payload.index + 1)
  ]
}

export const SET_CHANGE_COUNT = (state, payload) => {
  state.change = payload.count
}

export const SET_EMPLOYEE_HOURS = (state, payload) => {
  state.employees = [
    ...state.employees.slice(0, payload.index),
    { name: state.employees[payload.index].name, hours: payload.hours },
    ...state.employees.slice(payload.index + 1)
  ]
}

export const SET_EMPLOYEE_NAME = (state, payload) => {
  state.employees = [
    ...state.employees.slice(0, payload.index),
    { name: payload.name, hours: state.employees[payload.index].hours },
    ...state.employees.slice(payload.index + 1)
  ]
}

export const SET_EMPLOYEES = (state, payload) => {
  state.employees = payload.employees
}

export const SET_SAVING = (state, payload) => {
  state.saving = payload.saving
}
