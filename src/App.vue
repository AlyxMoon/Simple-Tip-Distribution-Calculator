<template>
  <div id="app">
    <div class="button-group">
      <button
        class="pure-button pure-button-success"
        @click="saveToStorage">
        <i class="fas fa-spinner fa-spin" v-if="saving"></i> Save to Storage
      </button>
      <button
        class="pure-button pure-button-warning"
        @click="clearEmployeeHours" v-if="page === 0">
        Clear Employee Hours
      </button>
      <button
      class="pure-button pure-button-warning"
      @click="clearBillCounts" v-if="page === 1">
      Clear Bill Counts
    </button>
    </div>
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
        Total Tips: ${{ getTotalTips().toFixed(2) }}
      </p>
      <p>
        Total Leftover: ${{ getLeftoverTips().toFixed(2) }}
      </p>

      <table class="pure-table pure-table-horizontal">
        <thead>
          <th>Bill</th>
          <th>Bills Required</th>
          <th>Difference</th>
        </thead>
        <tbody>
          <tr v-for="(bill, index) in [1, 5, 10, 20]" :key="`bill-${bill}`">
            <td>${{ bill }}</td>
            <td>{{ getEmployeeTips().reduce((count, employee) => { return count + employee.bills[3 - index].count }, 0)}}</td>
            <td>{{ getEmployeeTips().reduce((count, employee) => { return count + employee.bills[3 - index].count }, 0) - getBillOfType(bill).count }}</td>
          </tr>
        </tbody>
      </table>

      <table class="pure-table pure-table-horizontal">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Total Tips</th>
            <th>%</th>
            <th>1's</th>
            <th>5's</th>
            <th>10's</th>
            <th>20's</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in getEmployeeTips()" :key="`employee-compute-${index}`">
            <td>{{ employee.name }}</td>
            <td>${{ employee.total }}</td>
            <td>{{ employee.percent }}%</td>
            <td>{{ employee.bills[3].count }}</td>
            <td>{{ employee.bills[2].count }}</td>
            <td>{{ employee.bills[1].count }}</td>
            <td>{{ employee.bills[0].count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'App',

  computed: {
    ...mapGetters([
      'getBillOfType',
      'getEmployeeTips',
      'getLeftoverTips',
      'getTotalHours',
      'getTotalTips'
    ]),
    ...mapState({
      bills: state => state.app.bills,
      change: state => state.app.change,
      employees: state => state.app.employees,
      page: state => state.app.page,
      saving: state => state.app.saving
    })
  },

  methods: {
    ...mapActions([
      'addEmployee',
      'changeBillCount',
      'changeEmployeeHours',
      'changeEmployeeName',
      'changePage',
      'clearBillCounts',
      'clearEmployeeHours',
      'removeEmployee',
      'loadFromStorage',
      'saveToStorage'
    ])
  },

  created () {
    this.loadFromStorage()
  }
}
</script>

<style src='purecss/build/pure-min.css' />
<style src='@fortawesome/fontawesome-free/css/all.min.css' />

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

.button-group {
  margin-bottom: 5px;
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

.pure-table {
  margin-bottom: 5px;
}

</style>
