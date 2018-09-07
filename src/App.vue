<template>
  <div id="app">
    <ul class="page-navigation">
      <li class="navigation-item" :class="{ active: page === 0 }">
        <button @click="changePage(0)">1</button>
      </li>
      <li class="navigation-item" :class="{ active: page === 1 }">
        <button @click="changePage(1)">2</button>
      </li>
      <li class="navigation-item" :class="{ active: page === 2 }">
        <button @click="changePage(2)">3</button>
      </li>
    </ul>

    <div v-if="page === 0">
      <template v-for="(employee, index) in employees" >
        <p :key="`employee-info-${index}`">
          <label for="name">Employee: </label>
          <input type="text" name="name" v-model="employee.name" />
          <label for="hours">Tippable Hours:</label>
          <input type="number" min="0" name="hours" v-model.number="employee.hours" />
          <span class="delete" @click.prevent="removeEmployee(index)">X</span>
        </p>
        <p :key="`employee-tips-${index}`">
          Tips Earned: {{ employeeTips(employee.hours) }}
        </p>
        <ul :key="`employee-bills-${index}`">
          <template v-for="(bill, j) in employee.bills">
            <li :key="`employee-${index}-bills-${j}`">
              Number of {{ bill.type }}'s -- {{ bill.count }}
            </li>
          </template>
        </ul>
      </template>
      <button @click.prevent="addEmployee">Add Employee</button>
    </div>

    <div v-if="page === 1">
      <p v-for="(bill, index) in bills" :key="`bill-${index}`">
        <label for="bill">Number of {{ bill.type }}'s</label>
        <input type="number" min="0" name="bill" v-model="bill.count" />
      </p>
      <p>
        <label for="change">Amount of Change</label>
        <input type="number" min="0" step="0.01" name="change" v-model.number="change" />
      </p>
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

<style>
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

.navigation-item.active button {
  background-color: blue;
  color: white;
}

</style>
