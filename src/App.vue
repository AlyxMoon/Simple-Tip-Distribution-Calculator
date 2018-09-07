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
            <input class="pure-input-3-4" type="text" placeholder="Employee Name" v-model="employee.name" />
            <input class="pure-input-3-4" type="number" min="0" placeholder="Hours Worked" v-model.number="employee.hours" />
            <input class="pure-input-3-4 pure-button pure-button-error" type="submit" @click.prevent="removeEmployee(index)" value="Remove" />
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
            <input :id="`bill-${bill.type}`" name="bill" type="number" min="0"  v-model="bill.count" />
          </div>
          <div class="pure-control-group">
            <label for="change">Amount of Change</label>
            <input id="chnage" name="change" type="number" min="0" step="0.01"  v-model.number="change" />
          </div>
        </fieldset>
      </form>
    </div>

    <div v-if="page === 2">
      <p>
        Total Hours: {{ totalHours }}
      </p>
      <p>
        Total Tips: {{ totalTips }}
      </p>
      <p>
        Leftover Tips: {{ leftovers }}
      </p>
      <ul v-for="(data, type) in neededBills" :key="`neededBill-${type}`">
        <li>
          Number of {{ type }}'s -- {{ data.count }} -- diff: {{ data.diff}}
        </li>
      </ul>

      <!-- TODO: Show employee tip counts on this page -->
      <!-- <p :key="`employee-tips-${index}`">
        Tips Earned: {{ employeeTips(employee.hours) }}
      </p>
      <ul :key="`employee-bills-${index}`">
        <template v-for="(bill, j) in employee.bills">
          <li :key="`employee-${index}-bills-${j}`">
            Number of {{ bill.type }}'s -- {{ bill.count }}
          </li>
        </template>
      </ul> -->
    </div>
  </div>
</template>

<script>
const validBillTypes = [20, 10, 5, 1]

export default {
  name: 'App',
  data () {
    return {
      employees: [],
      bills: [
        { type: 1, count: 0 },
        { type: 2, count: 0 },
        { type: 5, count: 0 },
        { type: 10, count: 0 },
        { type: 20, count: 0 },
        { type: 50, count: 0 },
        { type: 100, count: 0 }
      ],
      neededBills: {
        1: {
          count: 0,
          diff: 0
        },
        5: {
          count: 0,
          diff: 0
        },
        10: {
          count: 0,
          diff: 0
        },
        20: {
          count: 0,
          diff: 0
        }
      },
      change: 0,
      totalTips: 0,
      totalHours: 0,
      page: 0
    }
  },

  watch: {
    employees: {
      handler: function (oldValue, newValue) {
        this.computeTotalHours()
        this.updateEmployeeBills()
        this.computeNeededBills()
      },
      deep: true
    },
    bills: {
      handler: function (oldValue, newValue) {
        this.computeTotalTips()
        this.updateEmployeeBills()
        this.computeNeededBills()
      },
      deep: true
    },
    change: {
      handler: function (oldValue, newValue) {
        this.computeTotalTips()
        this.updateEmployeeBills()
        this.computeNeededBills()
      },
      deep: true
    }
  },

  computed: {
    leftovers () {
      if (this.totalHours === 0) return 0
      return this.totalTips - this.employees.reduce((sum, employee) => {
        return this.employeeTips(employee.hours) + sum
      }, 0)
    }
  },

  methods: {
    addEmployee () {
      this.employees.push({
        name: '',
        hours: 0
      })
    },

    removeEmployee (index) {
      this.employees.splice(index, 1)
    },

    computeTotalHours () {
      this.totalHours = this.employees.reduce((sum, employee) => {
        return employee.hours + sum
      }, 0)
    },

    computeTotalTips () {
      this.totalTips = this.change + this.bills.reduce((sum, bill) => {
        return (bill.type * bill.count) + sum
      }, 0)
    },

    computeNeededBills () {
      this.neededBills = {
        1: {
          count: 0,
          diff: 0
        },
        5: {
          count: 0,
          diff: 0
        },
        10: {
          count: 0,
          diff: 0
        },
        20: {
          count: 0,
          diff: 0
        }
      }

      this.employees.forEach(employee => {
        employee.bills.forEach(bill => {
          this.neededBills[bill.type].count += bill.count
        })
      })

      this.neededBills[1].diff = this.neededBills[1].count - this.bills[0].count
      this.neededBills[5].diff = this.neededBills[5].count - this.bills[2].count
      this.neededBills[10].diff = this.neededBills[10].count - this.bills[3].count
      this.neededBills[20].diff = this.neededBills[20].count - this.bills[4].count
    },

    employeeTips (hours) {
      if (this.totalHours === 0) return 0
      return Math.floor(this.totalTips * (hours / this.totalHours))
    },

    updateEmployeeBills () {
      this.employees.forEach(employee => {
        let total = this.employeeTips(employee.hours)
        employee.bills = validBillTypes.map(bill => {
          let count = 0
          while (total >= bill) {
            count += 1
            total -= bill
          }

          return {
            type: bill,
            count
          }
        })
      })
    },

    changePage (newPage) {
      this.page = newPage
    }
  },

  created () {
    this.computeTotalHours()
    this.computeTotalTips()
    this.updateEmployeeBills()
    this.computeNeededBills()
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
