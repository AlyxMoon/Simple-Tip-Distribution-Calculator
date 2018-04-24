# simple-tip-distribution-calendar

> A calculator for easily determining how many tips employees get from a shared pool and how many of each bill type is required to make that happen.

## Description of how tips are currently distributed
This is to help me in distributing tips at the café I work at. The current workflow of the task is as follows:

1) Collect all tips from the previous week (in cash)
2) Get together all the loose change and bring that to the local bank, convert change into bills
3) Head back to the store, and divvy up the cash between the partners as best as possible
4) If you do not have enough bills of each type required to divvy up the cash perfectly between people, then swap cash with the register until you do!
5) Any leftover bills/change just rollover into next week's tips

## Where the app comes into play
This app is to assist in steps 2-4, specifically step 4. Right now the process of determining how many bills of each type are required in advance is essentially guesswork, and I want to remove the guesswork from that equation. So the workflow I envision with this app is as follows:

1) Collect all tips from the previous week (in cash)
2) Count up the existing bills of each type and add that into the app
3) Get together all the loose change and bring that to the local bank, convert change into bills
  - Once you have a count of how many all the change is worth, input that into the app and get an exact count of how many bills of each type you required
4) Head back to the store, and divvy up all the cash between partners
5) Any leftover bills/change just rollover into next week's tips

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
