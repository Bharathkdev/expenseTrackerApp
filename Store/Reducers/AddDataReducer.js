import {
  LOAD_TRANSACTIONS_PER_MONTH,
  UPDATE_MONTH_YEAR_FILTER,
  UPDATE_VISIBILITY,
  UPDATE_DATA_SELECTION,
  CLEAR_DATA_SELECTION,
  SET_DATA,
  LOAD_TRANSACTIONS_PER_YEAR,
  LOAD_TRANSACTIONS_WEEKLY,
  UPDATE_MONTH_ENABLE,
  LOAD_TRANSACTIONS_CALENDAR,
} from '../Actions/AddDataAction';

const initialState = {
  dataItems: {},
  selectedDataItems: [],
  totalIncome: 0,
  totalExpense: 0,
  balanceAmount: 0,
  totalIncomeMonthly: 0,
  totalExpenseMonthly: 0,
  balanceAmountMonthly: 0,
  totalIncomeWeekly: 0,
  totalExpenseWeekly: 0,
  balanceAmountWeekly: 0,
  totalIncomeCalendar: 0,
  totalExpenseCalendar: 0,
  balanceAmountCalendar: 0,
  totalIncomeYearly: 0,
  totalExpenseYearly: 0,
  balanceAmountYearly: 0,
  MonthYearFilter: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  visibility: {
    addDataVisible: false,
    editDataVisible: false,
  },
  MonthYearFilteredDataItems: {},
  yearlyFilteredDataItems: {},
  weeklyFilteredDataItems: {},
  calendarFilteredDataItems: {},
  monthYearPicker: {
    screen: 'Daily',
  },
};

const AddDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_DATA:
      console.log(
        'data type from server within addDataReducer : ',
        action.dataItems,
        action.totalBalance,
        action.totalExpense,
        action.totalIncome,
      );
      return {
        ...state,
        dataItems: action.dataItems,
        totalIncome: action.totalIncome ? action.totalIncome : 0,
        totalExpense: action.totalExpense ? action.totalExpense : 0,
        balanceAmount: action.totalBalance ? action.totalBalance : 0,
      };

    case LOAD_TRANSACTIONS_PER_MONTH:
      const month = action.month;
      const year = action.year;

      console.log('Load transactions Here: ', month, year);

      let updatedTransactions = {},
        totalIncomeTransactions = 0,
        totalExpenseTransactions = 0,
        totalBalanceTransactions = 0;

      if (
        state.dataItems &&
        year in state.dataItems &&
        month in state.dataItems[year]
      ) {
        console.log('Im inside load transactions loop');
        for (const key in state.dataItems[year][month]) {
          const dateID = Object.keys(state.dataItems[year][month][key]);
          const index = dateID[0];

          updatedTransactions[key] = state.dataItems[year][month][key][index];
          totalIncomeTransactions +=
            state.dataItems[year][month][key][index].totalIncome;
          totalExpenseTransactions +=
            state.dataItems[year][month][key][index].totalExpense;
        }
      }

      totalBalanceTransactions =
        totalIncomeTransactions - totalExpenseTransactions;

      console.log(
        'Total transactions in load transactions actions: ',
        totalIncomeTransactions,
        totalExpenseTransactions,
        totalBalanceTransactions,
      );

      return {
        ...state,
        MonthYearFilteredDataItems: updatedTransactions,
        totalIncomeMonthly: totalIncomeTransactions,
        totalExpenseMonthly: totalExpenseTransactions,
        balanceAmountMonthly: totalBalanceTransactions,
      };

    case LOAD_TRANSACTIONS_PER_YEAR:
      const yearly = action.year;
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      let updatedYearlyTransaction = {},
        yearlyIncome = 0,
        yearlyExpense = 0,
        yearlyBalance = 0;

      if (state.dataItems && yearly in state.dataItems) {
        for (const month in months) {
          let monthlyIncome = 0,
            monthlyExpense = 0,
            details = [];

          if (month in state.dataItems[yearly]) {
            for (const key in state.dataItems[yearly][month]) {
              const dateID = Object.keys(state.dataItems[yearly][month][key]);
              const index = dateID[0];

              details.push(state.dataItems[yearly][month][key][index].details);
              monthlyIncome +=
                state.dataItems[yearly][month][key][index].totalIncome;
              monthlyExpense +=
                state.dataItems[yearly][month][key][index].totalExpense;
              yearlyIncome +=
                state.dataItems[yearly][month][key][index].totalIncome;
              yearlyExpense +=
                state.dataItems[yearly][month][key][index].totalExpense;
            }
            let monthKey = months[month];
            updatedYearlyTransaction[monthKey] = {
              details,
              income: monthlyIncome,
              expense: monthlyExpense,
              year: yearly,
              month: month,
            };
          } else {
            let monthKey = months[month];
            updatedYearlyTransaction[monthKey] = {
              details,
              income: 0,
              expense: 0,
              year: yearly,
              month: month,
            };
          }
        }
      } else {
        for (let month of months) {
          updatedYearlyTransaction[month] = {
            details: [],
            income: 0,
            expense: 0,
            year: yearly,
            month: month,
          };
        }
      }

      yearlyBalance = yearlyIncome - yearlyExpense;

      return {
        ...state,
        yearlyFilteredDataItems: updatedYearlyTransaction,
        totalIncomeYearly: yearlyIncome,
        totalExpenseYearly: yearlyExpense,
        balanceAmountYearly: yearlyBalance,
      };

    case LOAD_TRANSACTIONS_WEEKLY:
      const weeks = action.weeks;
      const weekInWords = ['first', 'second', 'third', 'fourth', 'fifth'];
      const weeklyYear = action.year;

      let updatedWeeklyTransactions = {},
        totalIncomeWeekly = 0,
        totalExpenseWeekly = 0,
        balanceAmountWeekly = 0;

      if (state.dataItems && weeklyYear in state.dataItems) {
        for (let week in weeks) {
          let weeklyIncome = 0,
            weeklyExpense = 0;
          console.log('Week in weeks: ', week);
          for (let weekDays in weeks[week]) {
            console.log('Weekdays in week: ', weekDays);
            let weeklyMonth = weeks[week][weekDays]._d.getMonth();
            let weekDay = weeks[week][weekDays]._d.toDateString();
            console.log('Week data: ', weeklyMonth, weekDay, weeklyYear);
            if (weeklyMonth in state.dataItems[weeklyYear]) {
              //for (const key in state.dataItems[weeklyYear][weeklyMonth]) {
              if (state.dataItems[weeklyYear][weeklyMonth][weekDay]) {
                //  if (weekDay === key) {
                const dateID = Object.keys(
                  state.dataItems[weeklyYear][weeklyMonth][weekDay],
                );
                const index = dateID[0];

                weeklyIncome +=
                  state.dataItems[weeklyYear][weeklyMonth][weekDay][index]
                    .totalIncome;
                weeklyExpense +=
                  state.dataItems[weeklyYear][weeklyMonth][weekDay][index]
                    .totalExpense;
                totalIncomeWeekly +=
                  state.dataItems[weeklyYear][weeklyMonth][weekDay][index]
                    .totalIncome;
                totalExpenseWeekly +=
                  state.dataItems[weeklyYear][weeklyMonth][weekDay][index]
                    .totalExpense;
              }
            }
          }
          updatedWeeklyTransactions[weekInWords[week]] = {
            startDate: weeks[week][0]._d,
            endDate: weeks[week][6]._d,
            income: weeklyIncome,
            expense: weeklyExpense,
            weekDates: weeks[week],
          };
        }
      } else {
        for (const week in weeks) {
          updatedWeeklyTransactions[weekInWords[week]] = {
            startDate: weeks[week][0]._d,
            endDate: weeks[week][6]._d,
            income: 0,
            expense: 0,
            weekDates: weeks[week],
          };
        }
      }

      balanceAmountWeekly = totalIncomeWeekly - totalExpenseWeekly;

      console.log(
        'weekly data: ',
        updatedWeeklyTransactions,
        totalIncomeWeekly,
        totalExpenseWeekly,
        balanceAmountWeekly,
      );

      return {
        ...state,
        weeklyFilteredDataItems: updatedWeeklyTransactions,
        totalIncomeWeekly: totalIncomeWeekly,
        totalExpenseWeekly: totalExpenseWeekly,
        balanceAmountWeekly: balanceAmountWeekly,
      };

    case LOAD_TRANSACTIONS_CALENDAR:
      const weeksInCalendar = action.weeks;
      const calendarYear = action.year;
      const calendarMonth = action.month;

      let updatedCalendarTransactions = {},
        totalIncomeCalendar = 0,
        totalExpenseCalendar = 0,
        balanceAmountCalendar = 0;

      if (state.dataItems && calendarYear in state.dataItems) {
        for (let week in weeksInCalendar) {
          for (let weekDays in weeksInCalendar[week]) {
            let weeklyMonth = weeksInCalendar[week][weekDays]._d.getMonth();
            let weekDay = weeksInCalendar[week][weekDays]._d.toDateString();
            let details = [],
              dailyIncome = 0,
              dailyExpense = 0;
            console.log(
              'Week datums: ',
              state.dataItems,
              weeklyMonth in state.dataItems[calendarYear],
              state.dataItems[calendarYear][weeklyMonth],
            );
            if (state.dataItems[calendarYear][weeklyMonth]) {
              if (state.dataItems[calendarYear][weeklyMonth][weekDay]) {
                const dateID = Object.keys(
                  state.dataItems[calendarYear][weeklyMonth][weekDay],
                );
                const index = dateID[0];

                console.log('Im index of calendar: ', index);

                if (weeklyMonth === calendarMonth) {
                  totalIncomeCalendar +=
                    state.dataItems[calendarYear][weeklyMonth][weekDay][index]
                      .totalIncome;
                  totalExpenseCalendar +=
                    state.dataItems[calendarYear][weeklyMonth][weekDay][index]
                      .totalExpense;
                }
                details =
                  state.dataItems[calendarYear][weeklyMonth][weekDay][index]
                    .details;
                dailyIncome =
                  state.dataItems[calendarYear][weeklyMonth][weekDay][index]
                    .totalIncome;
                dailyExpense +=
                  state.dataItems[calendarYear][weeklyMonth][weekDay][index]
                    .totalExpense;
              }
            }
            updatedCalendarTransactions[weekDay] = {
              details: details,
              income: dailyIncome,
              expense: dailyExpense,
            };
          }
        }
      } else {
        for (let week in weeksInCalendar) {
          for (let weekDays in weeksInCalendar[week]) {
            let weekDay = weeksInCalendar[week][weekDays]._d.toDateString();
            updatedCalendarTransactions[weekDay] = {
              details: [],
              income: 0,
              expense: 0,
            };
          }
        }
      }

      balanceAmountCalendar = totalIncomeCalendar - totalExpenseCalendar;

      console.log(
        'Calendar data: ',
        updatedCalendarTransactions,
        totalIncomeCalendar,
        totalExpenseCalendar,
        balanceAmountCalendar,
      );

      return {
        ...state,
        calendarFilteredDataItems: updatedCalendarTransactions,
        totalIncomeCalendar: totalIncomeCalendar,
        totalExpenseCalendar: totalExpenseCalendar,
        balanceAmountCalendar: balanceAmountCalendar,
      };

    case UPDATE_MONTH_YEAR_FILTER:
      const monthFilter = action.month;
      const yearFilter = action.year;

      return {
        ...state,
        MonthYearFilter: {
          month: monthFilter,
          year: yearFilter,
        },
      };

    case UPDATE_VISIBILITY:
      const addDataVisibility = action.addData;
      const editDataVisibility = action.editData;

      console.log('Edit screen: ', addDataVisibility, editDataVisibility);
      return {
        ...state,
        visibility: {
          addDataVisible: addDataVisibility,
          editDataVisible: editDataVisibility,
        },
      };

    case UPDATE_MONTH_ENABLE:
      const screen = action.monthEnable;

      console.log('Month enable in redux: ', screen);

      return {
        ...state,
        monthYearPicker: {
          screen: screen,
        },
      };

    case UPDATE_DATA_SELECTION:
      const selectedID = action.id;
      const selectedDate = new Date(action.date).toDateString();
      const selectedYear = new Date(selectedDate).getFullYear().toString();
      const selectedMonth = new Date(selectedDate).getMonth().toString();
      const amount = action.amount;
      const amountType = action.amountType;

      let dataItemsSelected = [],
        tempArray = state.selectedDataItems;

      const idInRedux = Object.keys(
        state.dataItems[selectedYear][selectedMonth][selectedDate],
      );

      const index = idInRedux[0];

      if (state.selectedDataItems.length > 0) {
        let flag = false;
        for (let key of state.selectedDataItems) {
          if (key.id === selectedID) {
            tempArray.splice(state.selectedDataItems.indexOf(key), 1); // splice will return the removed items
            dataItemsSelected = tempArray;
            flag = true;
            console.log(
              'Update data selection already exists ID',
              dataItemsSelected,
            );
          }
        }
        if (flag === false) {
          dataItemsSelected = tempArray.concat({
            id: selectedID,
            date: selectedDate,
            index: index,
            amount: amount,
            type: amountType,
          });
          console.log('Update data selection new ID ', dataItemsSelected);
        }
      } else {
        dataItemsSelected = tempArray.concat({
          id: selectedID,
          date: selectedDate,
          index: index,
          amount: amount,
          type: amountType,
        });
        console.log('Update data selection new ID ', dataItemsSelected);
      }

      return {
        ...state,
        selectedDataItems: dataItemsSelected,
      };

    case CLEAR_DATA_SELECTION:
      return {
        ...state,
        selectedDataItems: [],
      };
  }
  return state;
};

export default AddDataReducer;
