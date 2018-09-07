<template>
  <div id="app">
    <ul class="page-navigation">
      <li class="navigation-item">
        <button class="pure-button" :class="{ 'pure-button-primary': page === 0 }" @click="changePage(0)">Employees</button>
      </li>
      <li class="navigation-item">
        <button class="pure-button" :class="{ 'pure-button-primary': page === 1 }" @click="changePage(1)">Bill Counts</button>
      </li>
      <li class="navigation-item">
        <button class="pure-button" :class="{ 'pure-button-primary': page === 2 }" @click="changePage(2)">Computed Stuff</button>
      </li>
    </ul>
    <hr />

    <div v-if="page === 0">
      <template v-for="(employee, index) in employees" >
        <form class="pure-form" :key="`employee-info-${index}`">
          <fieldset class="pure-group">
            <input
              class="pure-input-3-4" type="text" placeholder="Employee Name"
              :value="employee.name" @input="changeEmployeeName({ index, name: $event.target.value })" />
            <input
              class="pure-input-3-4" type="number" min="0" placeholder="Hours Worked"
              :value="employee.hours" @input="changeEmployeeHours({ index, hours: $event.target.value })" />
            <input
              class="pure-input-3-4 pure-button pure-button-error" type="submit"
              @click.prevent="removeEmployee(index)" value="Remove" />
          </fieldset>
        </form>
      </template>
      <button class="pure-button pure-button-secondary" @click.prevent="addEmployee">Add Employee</button>
    </div>

    <div v-if="page === 1">
      <form class="pure-form pure-form-aligned">
        <fieldset>
          <div class="pure-control-group" v-for="(bill, index) in bills" :key="`bill-${index}`">
            <label :for="`bill-${bill.type}`">Number of {{ bill.type }}'s</label>
            <input
              :id="`bill-${bill.type}`" name="bill" type="number" min="0"
              :value="bill.count" @input="changeBillCount({ type: bill.type, count: $event.target.value })" />
          </div>
          <div class="pure-control-group">
            <label for="change">Amount of Change</label>
            <input
              id="change" name="change" type="number" min="0" step="0.01"
              :value="change" @input="changeBillCount({ type: 'change', count: $event.target.value })"  />
          </div>
        </fieldset>
      </form>
    </div>

    <div v-if="page === 2">
      <p>
        Total Hours: {{ getTotalHours() }}
      </p>
      <p>
        Total Tips: {{ getTotalTips() }}
      </p>
      <!-- <p>
        Leftover Tips: {{ leftovers }}
      </p>
      <ul v-for="(data, type) in neededBills" :key="`neededBill-${type}`">
        <li>
          Number of {{ type }}'s -- {{ data.count }} -- diff: {{ data.diff}}
        </li>
      </ul> -->

      <div v-for="(employee, index) in getEmployeeBills()" :key="`employee-compute-${index}`">
        <h4>{{ employee.name }}</h4>
        <ul v-if="employee.bills">
          <li v-for="(bill, j) in employee.bills" :key="`employee-compute-${index}-bills-${j}`">
            Number of {{ bill.type }}'s -- {{ bill.count }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'App',

  computed: {
    // leftovers () {
    //   if (this.totalHours === 0) return 0
    //   return this.totalTips - this.employees.reduce((sum, employee) => {
    //     return this.employeeTips(employee.hours) + sum
    //   }, 0)
    // },
    ...mapGetters([
      'getEmployeeBills',
      'getTotalHours',
      'getTotalTips'
    ]),
    ...mapState({
      bills: state => state.app.bills,
      change: state => state.app.change,
      employees: state => state.app.employees,
      employeeBills: state => state.app.employeeBills,
      page: state => state.app.page
    })
  },

  methods: {
    ...mapActions([
      'addEmployee',
      'changeBillCount',
      'changeEmployeeHours',
      'changeEmployeeName',
      'changePage',
      'removeEmployee'
    ])
  }
}
</script>

<style src='purecss/build/pure-min.css' />

<style>
body {
  padding: 0.5em;
}

#app {
}

.delete {
  color: red;
  cursor: pointer;
  user-select: none;
}

.page-navigation {
  list-style: none;
  margin: 0;
  padding: 0;
}

.navigation-item {
  display: inline-block;
}

.pure-button-success,
.pure-button-error,
.pure-button-warning,
.pure-button-secondary {
  color: white;
  border-radius: 4px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.pure-button-success {
    background: rgb(28, 184, 65);
}

.pure-button-error {
    background: rgb(202, 60, 60);
}

.pure-button-warning {
    background: rgb(223, 117, 20);
}

.pure-button-secondary {
    background: rgb(66, 184, 221);
}

</style>
