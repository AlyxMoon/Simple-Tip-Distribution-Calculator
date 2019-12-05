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
    <div class="button-group">
      <button class="pure-button" :class="{ 'pure-button-primary': page === 0 }" @click="changePage(0)">Employees</button>
      <button class="pure-button" :class="{ 'pure-button-primary': page === 1 }" @click="changePage(1)">Bill Counts</button>
      <button class="pure-button" :class="{ 'pure-button-primary': page === 2 }" @click="changePage(2)">Computed Stuff</button>
    </div>
    <hr />

    <div v-if="page === 0" class="content">
      <template v-for="(employee, index) in employees" >
        <form class="pure-form" :key="`employee-info-${index}`">
          <fieldset class="employee-info"
            :class="{ 'drag-active': (draggingOverIndex === index && draggingHeldIndex !== draggingOverIndex && draggingHeldIndex !== draggingOverIndex - 1) }"
            draggable="true"
            @dragstart="handleDragStart(index)"
            @dragover="handleDragOver(index)"
            @dragend="handleDragEnd()"
          >

            <div class="pure-g">
              <div class="f-size-1 py-1 drag-icon-wrapper">
                <i class="fas fa-grip-vertical"></i>
              </div>
              <div class="f-size-10">
                <input
                  data-nodrag="true"
                  class="pure-u-1 b-round-0" type="text" placeholder="Employee Name"
                  :value="employee.name" @input="changeEmployeeName({ index, name: $event.target.value })" />
              </div>

              <div class="f-size-2 employee-num-col">
                <input
                  data-nodrag="true"
                  class="pure-u-1 b-round-0" type="number" min="0" step="0.01"
                  :value="employee.hours" @input="changeEmployeeHours({ index, hours: $event.target.value })" />
              </div>

              <div class="pure-size-1">
                <input
                  data-nodrag="true"
                  class="pure-u-1 pure-button pure-button-error b-round-0" type="submit"
                  @click.prevent="removeEmployee(index)" value="X" />
              </div>
            </div>
            <div class="pure-g">
              <div
                data-nodrag="true"
                class="pure-u-1-3 py-1 text-align-right">
                Quarters To Reserve (in $)
              </div>
              <div class="pure-u-2-3">
                <input
                  data-nodrag="true"
                  class="pure-u-1 b-round-0" type="number" placeholder="Quarters in reserve (in $)" min="0" step="1"
                  :value="employee.reservedQuarters" @input="changeEmployeeReservedQuarters({ index, quarters: $event.target.value })" />
              </div>
            </div>
          </fieldset>
        </form>
      </template>
      <fieldset v-if="employees.length > 0"
        class="drag-placeholder employee-info"
        :class="{ 'drag-active': draggingOverIndex === employees.length }"
        draggable="true"
        @dragover="handleDragOver(employees.length)" @dragend="handleDragEnd()" ></fieldset>

      <button class="pure-button pure-button-secondary" @click.prevent="addEmployee">Add Employee</button>
    </div>

    <div v-if="page === 1" class="content">
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
            <input
              id="change2" name="change2" type="number" min="0" step="0.01"
              :value="change2" @input="changeBillCount({ type: 'change2', count: $event.target.value })"  />
          </div>
        </fieldset>
      </form>
    </div>

    <div v-if="page === 2" class="content">
      <p>
        Total Hours: {{ getTotalHours.toFixed(2) }}
      </p>
      <p>
        Total Tips: ${{ getTotalTips.toFixed(2) }}
      </p>
      <p>
        Tips per hour: ${{ (getTotalTips.toFixed(2) / getTotalHours).toFixed(2) }}
      </p>
      <p>
        Total Leftover: ${{ getLeftoverTips.toFixed(2) }}
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
            <td>{{ getEmployeeTips.reduce((count, employee) => { return count + employee.bills[3 - index].count }, 0)}}</td>
            <td>{{ getEmployeeTips.reduce((count, employee) => { return count + employee.bills[3 - index].count }, 0) - getBillOfType(bill).count }}</td>
          </tr>
          <tr>
            <td>Quarters</td>
            <td>{{ getSumOfQuarters * 4 }}</td>
            <td>0</td>
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
            <th>Quarters</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in getEmployeeTips" :key="`employee-compute-${index}`">
            <td>{{ employee.name }}</td>
            <td>${{ employee.total }}</td>
            <td>{{ employee.percent }}%</td>
            <td>{{ employee.bills[3].count }}</td>
            <td>{{ employee.bills[2].count }}</td>
            <td>{{ employee.bills[1].count }}</td>
            <td>{{ employee.bills[0].count }}</td>
            <td>{{ employee.bills[4].count }}</td>
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

  data () {
    return {
      draggingOverIndex: -1,
      draggingHeldIndex: -1
    }
  },

  computed: {
    ...mapGetters([
      'getBillOfType',
      'getSumOfQuarters',
      'getEmployeeTips',
      'getLeftoverTips',
      'getTotalHours',
      'getTotalTips'
    ]),
    ...mapState({
      bills: state => state.app.bills,
      change: state => state.app.change,
      change2: state => state.app.change2,
      employees: state => state.app.employees,
      page: state => state.app.page,
      saving: state => state.app.saving
    })
  },

  methods: {
    ...mapActions([
      'addEmployee',
      'moveEmployee',
      'changeBillCount',
      'changeEmployeeHours',
      'changeEmployeeName',
      'changeEmployeeReservedQuarters',
      'changePage',
      'clearBillCounts',
      'clearEmployeeHours',
      'removeEmployee',
      'loadFromStorage',
      'saveToStorage'
    ]),

    handleDragStart (index) {
      this.draggingHeldIndex = index
    },

    handleDragOver (index) {
      this.draggingOverIndex = index
    },

    handleDragEnd () {
      if (this.draggingHeldIndex > -1 && this.draggingOverIndex > -1 && this.draggingHeldIndex !== this.draggingOverIndex) {
        this.moveEmployee({ oldIndex: this.draggingHeldIndex, newIndex: this.draggingOverIndex })
      }

      this.draggingHeldIndex = -1
      this.draggingOverIndex = -1
    }
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

@media (min-width: 768px) {
  .employee-info {
    width: 60%;
  }
}

.button-group {
  margin-bottom: 5px;
  display: flex;
  flex-wrap: nowrap;
}
.button-group button {
  margin-right: 5px;
}

input[type=submit] {
  border: 1px solid rgba(0,0,0,0);
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

.b-round-0 {
  border-radius: 0 !important;
}

.drag-icon-wrapper {
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
}
@media only screen and (max-width: 480px) {
  .drag-icon-wrapper {
    margin-bottom: 0.3em;
  }
}

.fa-grip-vertical {
  cursor: crosshair;
  width: 12px;
}

.f-size-1 {
  flex-grow: 1;
}
.f-size-2 {
  flex-grow: 2;
}
.f-size-3 {
  flex-grow: 3;
}
.f-size-10 {
  flex-grow: 10;
}

.pure-g {
  flex-wrap: nowrap;
  align-items: start;
}

.drag-active {
  border-top: 2px solid #3FB0AC !important;
}

.drag-placeholder {
  border: none;
  margin: 5px 0;
}

.py-1 {
  padding-left: 0.25rem !important;
  padding-right: 0.25rem !important;
}

.employee-num-col {
  max-width: 25%;
}

.text-align-right {
  text-align: right;
}

</style>
