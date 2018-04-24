<template>
  <div id="app">
    <p>
      Total Hours: {{ totalHours }}
    </p>
    <p>
      Total Tips: {{ totalTips }}
    </p>
    <p>
      Leftover Tips: {{ leftovers }}
    </p>
    <hr />
    <template v-for="(employee, index) in employees" >
      <p :key="`employee-info-${index}`">
        <label for="name">Employee: </label>
        <input type="text" name="name" v-model="employee.name" />
        <label for="hours">Tippable Hours:</label>
        <input type="number" min="0" name="hours" v-model.number="employee.hours" />
      </p>
      <p :key="`employee-tips-${index}`">
        Tips Earned: {{ employeeTips(employee.hours) }}
      </p>
    </template>
    <hr />
    <p v-for="(bill, index) in bills" :key="`bill-${index}`">
      <label for="bill">Number of {{ bill.type }}'s</label>
      <input type="number" min="0" name="bill" v-model="bill.count" />
    </p>
  </div>
</template>

<script>

export default {
  name: 'App',
  data () {
    return {
      employees: [
        {
          name: 'Alyx the twat',
          hours: 10
        },
        {
          name: 'Dean the lazy prick',
          hours: 10
        },
        {
          name: 'Kenzoku the Cool',
          hours: 10
        },
        {
          name: 'KissOfFate THE AWESOME',
          hours: 10
        },
        {
          name: 'pvpkill the Madness King',
          hours: 10
        }
      ],
      bills: [
        { type: 1, count: 50 },
        { type: 2, count: 0 },
        { type: 5, count: 0 },
        { type: 10, count: 0 },
        { type: 20, count: 0 },
        { type: 50, count: 0 },
        { type: 100, count: 0 }
      ]
    }
  },

  computed: {
    totalHours () {
      return this.employees.reduce((sum, employee) => {
        return employee.hours + sum
      }, 0)
    },
    totalTips () {
      return this.bills.reduce((sum, bill) => {
        return (bill.type * bill.count) + sum
      }, 0)
    },
    leftovers () {
      return this.totalTips - this.employees.reduce((sum, employee) => {
        return this.employeeTips(employee.hours) + sum
      }, 0)
    }
  },
  methods: {
    employeeTips (hours) {
      return Math.floor(this.totalTips * (hours / this.totalHours))
    }
  }
}
</script>

<style>
#app {
}
</style>
