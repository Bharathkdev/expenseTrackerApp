import NewData from '../../Models/NewData';

export const LOAD_TRANSACTIONS_PER_MONTH = 'LOAD_TRANSACTIONS_PER_MONTH';
export const LOAD_TRANSACTIONS_PER_YEAR = 'LOAD_TRANSACTIONS_PER_YEAR';
export const LOAD_TRANSACTIONS_WEEKLY = 'LOAD_TRANSACTIONS_WEEKLY';
export const LOAD_TRANSACTIONS_CALENDAR = 'LOAD_TRANSACTIONS_CALENDAR';
export const UPDATE_MONTH_YEAR_FILTER = 'UPDATE_MONTH_YEAR_FILTER';
export const UPDATE_VISIBILITY = 'UPDATE_VISIBILITY';
export const UPDATE_DATA_SELECTION = 'UPDATE_DATA_SELECTION';
export const CLEAR_DATA_SELECTION = 'CLEAR_DATA_SELECTION';
export const SET_DATA = 'SET_DATA';
export const UPDATE_MONTH_ENABLE = 'UPDATE_MONTH_ENABLE';

export const fetchData = () => {
  return async (dispatch) => {
    const dataItemsResponse = await fetch(
      `https://money-manager-252627-default-rtdb.firebaseio.com/dataItems.json`,
      {
        method: 'GET',
      },
    );

    const totalBalanceResponse = await fetch(
      `https://money-manager-252627-default-rtdb.firebaseio.com/totalBalance.json`,
      {
        method: 'GET',
      },
    );

    const totalIncomeResponse = await fetch(
      `https://money-manager-252627-default-rtdb.firebaseio.com/totalIncome.json`,
      {
        method: 'GET',
      },
    );

    const totalExpenseResponse = await fetch(
      `https://money-manager-252627-default-rtdb.firebaseio.com/totalExpense.json`,
      {
        method: 'GET',
      },
    );

    const dataItemsResponseData = await dataItemsResponse.json();
    const totalBalanceResponseData = await totalBalanceResponse.json();
    const totalExpenseResponseData = await totalExpenseResponse.json();
    const totalIncomeResponseData = await totalIncomeResponse.json();

    //    const dataGet = Object.keys(responseData["2021"]["5"]["Fri Jun 04 2021"]);

    console.log(
      'responseData for fetch data: ',
      dataItemsResponseData,
      totalExpenseResponseData,
      totalBalanceResponseData,
      totalIncomeResponseData,
    );

    dispatch({
      type: SET_DATA,
      dataItems: dataItemsResponseData,
      totalIncome: totalIncomeResponseData?.income,
      totalExpense: totalExpenseResponseData?.expense,
      totalBalance: totalBalanceResponseData?.balance,
    });
  };
};

export const addData = (
  type,
  date,
  time,
  payment,
  category,
  amount,
  note,
  description,
) => {
  return async (dispatch, getState) => {
    const newData = new NewData(
      new Date().getTime(),
      type,
      date.toString(),
      time.toString(),
      payment,
      category,
      amount,
      note,
      description,
    );

    console.log('responseData for add data: ', newData);

    let totalIncome = 0,
      totalExpense = 0,
      totalIncomeAllDate = 0,
      totalExpenseAllDate = 0,
      innerData = [],
      balanceAmountAllDate = 0;

    if (type == 'Income') {
      totalIncome = amount;
      totalExpense = 0;
      totalIncomeAllDate = getState().data.totalIncome + amount;
      totalExpenseAllDate = getState().data.totalExpense;
    } else if (type == 'Expense') {
      totalIncome = 0;
      totalExpense = amount;
      totalExpenseAllDate = getState().data.totalExpense + amount;
      totalIncomeAllDate = getState().data.totalIncome;
    } else {
      totalExpense = 0;
      totalIncome = 0;
      totalIncomeAllDate = getState().data.totalIncome;
      totalExpenseAllDate = getState().data.totalExpense;
    }
    innerData.push(newData);

    balanceAmountAllDate = totalIncomeAllDate - totalExpenseAllDate;

    const addDataResponse = await fetch(
      `https://money-manager-252627-default-rtdb.firebaseio.com/dataItems/${date
        .getFullYear()
        .toString()}/${date.getMonth().toString()}/${date.toDateString()}.json`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          details: innerData,
          totalIncome,
          totalExpense,
        }),
      },
    );

    const updateAllAmount = updateAmount(
      totalIncomeAllDate,
      totalExpenseAllDate,
      balanceAmountAllDate,
    );
  };
};

export const addDataInExistingDate = (
  type,
  date,
  time,
  payment,
  category,
  amount,
  note,
  description,
) => {
  return async (dispatch, getState) => {
    console.log('Am I getting called??');

    const newDataExistingDate = new NewData(
      new Date().getTime(),
      type,
      date.toString(),
      time.toString(),
      payment,
      category,
      amount,
      note,
      description,
    );

    const year = date.getFullYear().toString();
    const month = date.getMonth().toString();
    const dateInString = date.toDateString();

    const dateIdInRedux = Object.keys(
      getState().data.dataItems[year][month][dateInString],
    );

    const index = dateIdInRedux[0];

    let totalIncome = 0,
      totalExpense = 0,
      totalIncomeAllDate = 0,
      totalExpenseAllDate = 0,
      innerData = [],
      balanceAmountAllDate = 0;

    if (type == 'Income') {
      totalIncome =
        getState().data.dataItems[year][month][dateInString][index]
          .totalIncome + amount;
      totalExpense = getState().data.dataItems[year][month][dateInString][index]
        .totalExpense;
      totalIncomeAllDate = getState().data.totalIncome + amount;
      totalExpenseAllDate = getState().data.totalExpense;
    } else if (type == 'Expense') {
      totalExpense =
        getState().data.dataItems[year][month][dateInString][index]
          .totalExpense + amount;
      totalIncome = getState().data.dataItems[year][month][dateInString][index]
        .totalIncome;
      totalExpenseAllDate = getState().data.totalExpense + amount;
      totalIncomeAllDate = getState().data.totalIncome;
    } else {
      totalExpense = getState().data.dataItems[year][month][dateInString][index]
        .totalExpense;
      totalIncome = getState().data.dataItems[year][month][dateInString][index]
        .totalIncome;
      totalIncomeAllDate = getState().data.totalIncome;
      totalExpenseAllDate = getState().data.totalExpense;
    }

    innerData = getState().data.dataItems[year][month][dateInString][
      index
    ].details.concat(newDataExistingDate);

    balanceAmountAllDate = totalIncomeAllDate - totalExpenseAllDate;

    console.log('Am I gettin called: ', index);

    const addDataInExistingDateResponse = await fetch(
      `https://money-manager-252627-default-rtdb.firebaseio.com/dataItems/${year}/${month}/${dateInString}/${index}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          details: innerData,
          totalIncome,
          totalExpense,
        }),
      },
    );

    const updateAllAmount = updateAmount(
      totalIncomeAllDate,
      totalExpenseAllDate,
      balanceAmountAllDate,
    );
  };
};

const updateAmount = (
  totalIncomeAllDate,
  totalExpenseAllDate,
  balanceAmountAllDate,
) => {
  console.log('Im update amount method outer');

  const updateTotalIncomeResponse = fetch(
    `https://money-manager-252627-default-rtdb.firebaseio.com/totalIncome.json`,
    {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        income: totalIncomeAllDate,
      }),
    },
  );

  const updateTotalExpenseResponse = fetch(
    `https://money-manager-252627-default-rtdb.firebaseio.com/totalExpense.json`,
    {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        expense: totalExpenseAllDate,
      }),
    },
  );

  const updateBalanceResponse = fetch(
    `https://money-manager-252627-default-rtdb.firebaseio.com/totalBalance.json`,
    {
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        balance: balanceAmountAllDate,
      }),
    },
  );

  const promise = Promise.all([
    updateTotalIncomeResponse,
    updateTotalExpenseResponse,
    updateBalanceResponse,
  ]);

  promise
    .then((values) => {
      const value = values[0].json;
      console.log('Successfully updated amounts', value);
    })
    .catch((err) => {
      throw new Error('Amount Updation failed: ', err);
    });
};

export const updateData = (
  id,
  type,
  dateFrom,
  toDate,
  time,
  payment,
  category,
  amount,
  note,
  description,
) => {
  return async (dispatch, getState) => {
    console.log('Data types of date and time', dateFrom, toDate, time);

    const yearToUpdate = toDate.getFullYear().toString();
    const monthToUpdate = toDate.getMonth().toString();
    const dateToUpdate = toDate.toDateString();

    const dataComingFromYear = dateFrom.getFullYear().toString();
    const dataComingFromMonth = dateFrom.getMonth().toString();
    const dataComingFromDate = dateFrom.toDateString();

    let amountAlreadyAvailable = 0,
      fromDateType = '',
      innerDataUpdate = [],
      innerDataUpdateFromDate = [],
      totalIncomeUpdate = 0,
      totalExpenseUpdate = 0,
      totalIncomeAllDateUpdate = 0,
      totalExpenseAllDateUpdate = 0,
      balanceAmountAllDateUpdate = 0,
      totalIncomeUpdateFromDate = 0,
      totalExpenseUpdateFromDate = 0;

    const fromDateIdInRedux = Object.keys(
      getState().data.dataItems[dataComingFromYear][dataComingFromMonth][
        dataComingFromDate
      ],
    );

    const fromDateIndex = fromDateIdInRedux[0];

    const fromDateDataFromRedux = getState().data.dataItems[dataComingFromYear][
      dataComingFromMonth
    ][dataComingFromDate][fromDateIndex];

    const fromDateDetailsLength = fromDateDataFromRedux.details.length;

    console.log(
      'date and time in update screen',
      dataComingFromDate,
      dateToUpdate,
    );

    if (
      !(yearToUpdate in getState().data.dataItems) ||
      !(monthToUpdate in getState().data.dataItems[yearToUpdate]) ||
      !(dateToUpdate in getState().data.dataItems[yearToUpdate][monthToUpdate])
    ) {
      console.log('Im income update 1');

      const updatedData = new NewData(
        new Date().getTime(),
        type,
        toDate.toString(),
        time.toString(),
        payment,
        category,
        amount,
        note,
        description,
      );

      for (const key in fromDateDataFromRedux.details) {
        if (fromDateDataFromRedux.details[key].id == id) {
          amountAlreadyAvailable =
            fromDateDataFromRedux.details[key].type != 'Transfer'
              ? fromDateDataFromRedux.details[key].amount
              : 0;
          fromDateType = fromDateDataFromRedux.details[key].type;
        }
      }

      innerDataUpdate.push(updatedData);

      if (type == 'Income' && fromDateType == type) {
        totalIncomeUpdateFromDate =
          fromDateDataFromRedux.totalIncome - amountAlreadyAvailable;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalIncomeUpdate = amount;
        totalExpenseUpdate = 0;
        totalIncomeAllDateUpdate =
          getState().data.totalIncome - amountAlreadyAvailable + amount;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
      } else if (type == 'Income' && fromDateType == 'Expense') {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate =
          fromDateDataFromRedux.totalExpense - amountAlreadyAvailable;
        totalIncomeUpdate = amount;
        totalExpenseUpdate = 0;
        totalIncomeAllDateUpdate = getState().data.totalIncome + amount;
        totalExpenseAllDateUpdate =
          getState().data.totalExpense - amountAlreadyAvailable;
      } else if (type == 'Income' && fromDateType == 'Transfer') {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalIncomeUpdate = amount;
        totalExpenseUpdate = 0;
        totalIncomeAllDateUpdate = getState().data.totalIncome + amount;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
      } else if (type == 'Expense' && fromDateType == type) {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate =
          fromDateDataFromRedux.totalExpense - amountAlreadyAvailable;
        totalExpenseUpdate = amount;
        totalIncomeUpdate = 0;
        totalExpenseAllDateUpdate =
          getState().data.totalExpense - amountAlreadyAvailable + amount;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      } else if (type == 'Expense' && fromDateType == 'Income') {
        totalIncomeUpdateFromDate =
          fromDateDataFromRedux.totalIncome - amountAlreadyAvailable;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalExpenseUpdate = amount;
        totalIncomeUpdate = 0;
        totalExpenseAllDateUpdate = getState().data.totalExpense + amount;
        totalIncomeAllDateUpdate =
          getState().data.totalIncome - amountAlreadyAvailable;
      } else if (type == 'Expense' && fromDateType == 'Transfer') {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalExpenseUpdate = amount;
        totalIncomeUpdate = 0;
        totalExpenseAllDateUpdate = getState().data.totalExpense + amount;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      } else if (type == 'Transfer' && fromDateType == type) {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalExpenseUpdate = 0;
        totalIncomeUpdate = 0;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      } else if (type == 'Transfer' && fromDateType == 'Income') {
        totalIncomeUpdateFromDate =
          fromDateDataFromRedux.totalIncome - amountAlreadyAvailable;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalIncomeUpdate = 0;
        totalExpenseUpdate = 0;
        totalIncomeAllDateUpdate =
          getState().data.totalIncome - amountAlreadyAvailable;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
      } else if (type == 'Transfer' && fromDateType == 'Expense') {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate =
          fromDateDataFromRedux.totalExpense - amountAlreadyAvailable;
        totalExpenseUpdate = 0;
        totalIncomeUpdate = 0;
        totalExpenseAllDateUpdate =
          getState().data.totalExpense - amountAlreadyAvailable;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      }

      balanceAmountAllDateUpdate =
        totalIncomeAllDateUpdate - totalExpenseAllDateUpdate;

      const updateToDateResponse = await fetch(
        `https://money-manager-252627-default-rtdb.firebaseio.com/dataItems/${yearToUpdate}/${monthToUpdate}/${dateToUpdate}.json`,
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            details: innerDataUpdate,
            totalIncome: totalIncomeUpdate,
            totalExpense: totalExpenseUpdate,
          }),
        },
      );

      if (fromDateDetailsLength === 1) {
        deleteDate(dataComingFromYear, dataComingFromMonth, dataComingFromDate);
      } else {
        for (const key in fromDateDataFromRedux.details) {
          if (fromDateDataFromRedux.details[key].id == id) {
            fromDateDataFromRedux.details.splice(key, 1);
          }
        }

        innerDataUpdateFromDate = fromDateDataFromRedux.details;

        const updateFromDateResponse = await fetch(
          `https://money-manager-252627-default-rtdb.firebaseio.com/dataItems/${dataComingFromYear}/${dataComingFromMonth}/${dataComingFromDate}/${fromDateIndex}.json`,
          {
            method: 'PATCH',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
              details: innerDataUpdateFromDate,
              totalIncome: totalIncomeUpdateFromDate,
              totalExpense: totalExpenseUpdateFromDate,
            }),
          },
        );
      }

      const updateAllAmount = updateAmount(
        totalIncomeAllDateUpdate,
        totalExpenseAllDateUpdate,
        balanceAmountAllDateUpdate,
      );
    } else if (
      dateToUpdate in getState().data.dataItems[yearToUpdate][monthToUpdate] &&
      dateToUpdate != dataComingFromDate
    ) {
      console.log('Im income update 2');

      const updatedData = new NewData(
        new Date().getTime(),
        type,
        toDate.toString(),
        time.toString(),
        payment,
        category,
        amount,
        note,
        description,
      );

      const toDateIdInRedux = Object.keys(
        getState().data.dataItems[yearToUpdate][monthToUpdate][dateToUpdate],
      );

      const toDateIndex = toDateIdInRedux[0];

      const toDateDataFromRedux = getState().data.dataItems[yearToUpdate][
        monthToUpdate
      ][dateToUpdate][toDateIndex];

      for (const key in fromDateDataFromRedux.details) {
        if (fromDateDataFromRedux.details[key].id == id) {
          amountAlreadyAvailable =
            fromDateDataFromRedux.details[key].type != 'Transfer'
              ? fromDateDataFromRedux.details[key].amount
              : 0;
          fromDateType = fromDateDataFromRedux.details[key].type;
        }
      }

      innerDataUpdate = toDateDataFromRedux.details.concat(updatedData);

      console.log('To date data in redux: ', toDateDataFromRedux);

      if (type == 'Income' && fromDateType == type) {
        totalIncomeUpdateFromDate =
          fromDateDataFromRedux.totalIncome - amountAlreadyAvailable;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome + amount;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense;
        totalIncomeAllDateUpdate =
          getState().data.totalIncome - amountAlreadyAvailable + amount;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
      } else if (type == 'Income' && fromDateType == 'Expense') {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate =
          fromDateDataFromRedux.totalExpense - amountAlreadyAvailable;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome + amount;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense;
        totalIncomeAllDateUpdate = getState().data.totalIncome + amount;
        totalExpenseAllDateUpdate =
          getState().data.totalExpense - amountAlreadyAvailable;
      } else if (type == 'Income' && fromDateType == 'Transfer') {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome + amount;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense;
        totalIncomeAllDateUpdate = getState().data.totalIncome + amount;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
      } else if (type == 'Expense' && fromDateType == type) {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate =
          fromDateDataFromRedux.totalExpense - amountAlreadyAvailable;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense + amount;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome;
        totalExpenseAllDateUpdate =
          getState().data.totalExpense - amountAlreadyAvailable + amount;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      } else if (type == 'Expense' && fromDateType == 'Income') {
        totalIncomeUpdateFromDate =
          fromDateDataFromRedux.totalIncome - amountAlreadyAvailable;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense + amount;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome;
        totalExpenseAllDateUpdate = getState().data.totalExpense + amount;
        totalIncomeAllDateUpdate =
          getState().data.totalIncome - amountAlreadyAvailable;
      } else if (type == 'Expense' && fromDateType == 'Transfer') {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense + amount;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome;
        totalExpenseAllDateUpdate = getState().data.totalExpense + amount;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      } else if (type == 'Transfer' && fromDateType == type) {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      } else if (type == 'Transfer' && fromDateType == 'Income') {
        totalIncomeUpdateFromDate =
          fromDateDataFromRedux.totalIncome - amountAlreadyAvailable;
        totalExpenseUpdateFromDate = fromDateDataFromRedux.totalExpense;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense;
        totalIncomeAllDateUpdate =
          getState().data.totalIncome - amountAlreadyAvailable;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
      } else if (type == 'Transfer' && fromDateType == 'Expense') {
        totalIncomeUpdateFromDate = fromDateDataFromRedux.totalIncome;
        totalExpenseUpdateFromDate =
          fromDateDataFromRedux.totalExpense - amountAlreadyAvailable;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome;
        totalExpenseAllDateUpdate =
          getState().data.totalExpense - amountAlreadyAvailable;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      }

      balanceAmountAllDateUpdate =
        totalIncomeAllDateUpdate - totalExpenseAllDateUpdate;

      const updateToDateResponse = await fetch(
        `https://money-manager-252627-default-rtdb.firebaseio.com/dataItems/${yearToUpdate}/${monthToUpdate}/${dateToUpdate}/${toDateIndex}.json`,
        {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            details: innerDataUpdate,
            totalIncome: totalIncomeUpdate,
            totalExpense: totalExpenseUpdate,
          }),
        },
      );

      if (fromDateDetailsLength === 1) {
        deleteDate(dataComingFromYear, dataComingFromMonth, dataComingFromDate);
      } else {
        for (const key in fromDateDataFromRedux.details) {
          if (fromDateDataFromRedux.details[key].id == id) {
            fromDateDataFromRedux.details.splice(key, 1);
          }
        }

        innerDataUpdateFromDate = fromDateDataFromRedux.details;

        const updateFromDateResponse = await fetch(
          `https://money-manager-252627-default-rtdb.firebaseio.com/dataItems/${dataComingFromYear}/${dataComingFromMonth}/${dataComingFromDate}/${fromDateIndex}.json`,
          {
            method: 'PATCH',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
              details: innerDataUpdateFromDate,
              totalIncome: totalIncomeUpdateFromDate,
              totalExpense: totalExpenseUpdateFromDate,
            }),
          },
        );
      }

      const updateAllAmount = updateAmount(
        totalIncomeAllDateUpdate,
        totalExpenseAllDateUpdate,
        balanceAmountAllDateUpdate,
      );
    } else if (
      dateToUpdate in getState().data.dataItems[yearToUpdate][monthToUpdate] &&
      dateToUpdate == dataComingFromDate
    ) {
      const updatedData = new NewData(
        id,
        type,
        toDate.toString(),
        time.toString(),
        payment,
        category,
        amount,
        note,
        description,
      );

      const toDateIdInRedux = Object.keys(
        getState().data.dataItems[yearToUpdate][monthToUpdate][dateToUpdate],
      );

      const toDateIndex = toDateIdInRedux[0];

      const toDateDataFromRedux = getState().data.dataItems[yearToUpdate][
        monthToUpdate
      ][dateToUpdate][toDateIndex];

      for (const key in toDateDataFromRedux.details) {
        if (toDateDataFromRedux.details[key].id == id) {
          amountAlreadyAvailable =
            toDateDataFromRedux.details[key].type != 'Transfer'
              ? toDateDataFromRedux.details[key].amount
              : 0;
          fromDateType = toDateDataFromRedux.details[key].type;
          toDateDataFromRedux.details[key] = updatedData;
        }
      }

      innerDataUpdate = toDateDataFromRedux.details;

      console.log('Im income update 3', type, fromDateType);

      if (type == 'Income' && fromDateType == type) {
        totalIncomeUpdate =
          toDateDataFromRedux.totalIncome - amountAlreadyAvailable + amount;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense;
        totalIncomeAllDateUpdate =
          getState().data.totalIncome - amountAlreadyAvailable + amount;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
      } else if (type == 'Income' && fromDateType == 'Expense') {
        totalIncomeUpdate = toDateDataFromRedux.totalIncome + amount;
        totalExpenseUpdate =
          toDateDataFromRedux.totalExpense - amountAlreadyAvailable;
        totalIncomeAllDateUpdate = getState().data.totalIncome + amount;
        totalExpenseAllDateUpdate =
          getState().data.totalExpense - amountAlreadyAvailable;
      } else if (type == 'Income' && fromDateType == 'Transfer') {
        totalIncomeUpdate = toDateDataFromRedux.totalIncome + amount;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense;
        totalIncomeAllDateUpdate = getState().data.totalIncome + amount;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
      } else if (type == 'Expense' && fromDateType == type) {
        totalExpenseUpdate =
          toDateDataFromRedux.totalExpense - amountAlreadyAvailable + amount;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome;
        totalExpenseAllDateUpdate =
          getState().data.totalExpense - amountAlreadyAvailable + amount;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      } else if (type == 'Expense' && fromDateType == 'Income') {
        totalExpenseUpdate = toDateDataFromRedux.totalExpense + amount;
        totalIncomeUpdate =
          toDateDataFromRedux.totalIncome - amountAlreadyAvailable;
        totalExpenseAllDateUpdate = getState().data.totalExpense + amount;
        totalIncomeAllDateUpdate =
          getState().data.totalIncome - amountAlreadyAvailable;
      } else if (type == 'Expense' && fromDateType == 'Transfer') {
        totalExpenseUpdate = toDateDataFromRedux.totalExpense + amount;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome;
        totalExpenseAllDateUpdate = getState().data.totalExpense + amount;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      } else if (type == 'Transfer' && fromDateType == type) {
        totalExpenseUpdate = toDateDataFromRedux.totalExpense;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      } else if (type == 'Transfer' && fromDateType == 'Income') {
        totalIncomeUpdate =
          toDateDataFromRedux.totalIncome - amountAlreadyAvailable;
        totalExpenseUpdate = toDateDataFromRedux.totalExpense;
        totalIncomeAllDateUpdate =
          getState().data.totalIncome - amountAlreadyAvailable;
        totalExpenseAllDateUpdate = getState().data.totalExpense;
      } else if (type == 'Transfer' && fromDateType == 'Expense') {
        totalExpenseUpdate =
          toDateDataFromRedux.totalExpense - amountAlreadyAvailable;
        totalIncomeUpdate = toDateDataFromRedux.totalIncome;
        totalExpenseAllDateUpdate =
          getState().data.totalExpense - amountAlreadyAvailable;
        totalIncomeAllDateUpdate = getState().data.totalIncome;
      }

      balanceAmountAllDateUpdate =
        totalIncomeAllDateUpdate - totalExpenseAllDateUpdate;

      const updateToDateResponse = await fetch(
        `https://money-manager-252627-default-rtdb.firebaseio.com/dataItems/${yearToUpdate}/${monthToUpdate}/${dateToUpdate}/${toDateIndex}.json`,
        {
          method: 'PATCH',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            details: innerDataUpdate,
            totalIncome: totalIncomeUpdate,
            totalExpense: totalExpenseUpdate,
          }),
        },
      );

      const updateAllAmount = updateAmount(
        totalIncomeAllDateUpdate,
        totalExpenseAllDateUpdate,
        balanceAmountAllDateUpdate,
      );
    }
  };
  // return { type: UPDATE_DATA, data: { id: id, type: type, fromDate: fromDate, toDate: toDate, time: time, payment: payment, category: category, amount: amount, note: note, description: description } };
};

const deleteDate = async (year, month, date) => {
  console.log('delete date called');
  const deleteDateResponse = await fetch(
    `https://money-manager-252627-default-rtdb.firebaseio.com/dataItems/${year}/${month}/${date}.json`,
    {
      method: 'DELETE',
    },
  );

  if (!deleteDateResponse.ok) {
    throw new Error('Something went wrong!!');
  }
};

export const deleteMultipleData = (deleteItems, year, month) => {
  return async (dispatch, getState) => {
    let deleteTotalIncomeAllDateUpdate = getState().data.totalIncome,
      deleteTotalExpenseAllDateUpdate = getState().data.totalExpense;

    await getState().data.selectedDataItems.forEach(async (arr) => {
      const index = arr.index;
      const date = arr.date;

      console.log('Im Delete multiple data action');

      await dispatch(fetchData());

      console.log(
        'Delete multiple data action: ',
        getState().data.dataItems,
        getState().data.totalIncome,
        getState().data.totalExpense,
        getState().data.balanceAmount,
      );

      const dataFromRedux = getState().data.dataItems[year][month];

      if (dataFromRedux[date][index].details.length == 1) {
        if (arr.type === 'Income') {
          deleteTotalIncomeAllDateUpdate -= arr.amount;
        } else if (arr.type === 'Expense') {
          deleteTotalExpenseAllDateUpdate -= arr.amount;
        }
        await deleteDate(year, month, date);
        console.log('Delete multiple data first: ', arr);
      } else if (dataFromRedux[date][index].details.length > 1) {
        for (const key in dataFromRedux[date][index].details) {
          if (dataFromRedux[date][index].details[key].id == arr.id) {
            dataFromRedux[date][index].details.splice(key, 1);
          }
        }

        let innerData = dataFromRedux[date][index].details;

        console.log('Details updated: ', innerData, arr.type);

        let deleteTotalIncomeUpdate = dataFromRedux[date][index].totalIncome,
          deleteTotalExpenseUpdate = dataFromRedux[date][index].totalExpense;

        if (arr.type === 'Income') {
          deleteTotalIncomeUpdate -= arr.amount;
          deleteTotalIncomeAllDateUpdate -= arr.amount;
        } else if (arr.type === 'Expense') {
          deleteTotalExpenseUpdate -= arr.amount;
          deleteTotalExpenseAllDateUpdate -= arr.amount;
        }

        console.log(
          'Delete multiple data seconds: ',
          arr,
          deleteTotalIncomeUpdate,
          deleteTotalExpenseUpdate,
        );

        const updateData = await fetch(
          `https://money-manager-252627-default-rtdb.firebaseio.com/dataItems/${year}/${month}/${date}/${index}.json`,
          {
            method: 'PATCH',
            headers: {
              'Content-type': 'application/json',
            },
            body: JSON.stringify({
              details: innerData,
              totalIncome: deleteTotalIncomeUpdate,
              totalExpense: deleteTotalExpenseUpdate,
            }),
          },
        );
      }
    });

    console.log(
      'Updated delete amounts: ',
      deleteTotalIncomeAllDateUpdate,
      deleteTotalExpenseAllDateUpdate,
      getState().data.totalIncome,
      getState().data.totalExpense,
      getState().data.balanceAmount,
    );

    updateAmount(
      deleteTotalIncomeAllDateUpdate,
      deleteTotalExpenseAllDateUpdate,
      deleteTotalIncomeAllDateUpdate - deleteTotalExpenseAllDateUpdate,
    );
  };
};

export const loadData = (id, fromDate, toDate) => {
  console.log('Load Data Here: ', id, fromDate, toDate);
  return {type: LOAD_DATA, id: id, fromDate: fromDate, toDate: toDate};
};

export const loadTransactionsPerMonth = (month, year) => {
  return {type: LOAD_TRANSACTIONS_PER_MONTH, month: month, year: year};
};

export const loadTransactionsPerYear = (year) => {
  return {type: LOAD_TRANSACTIONS_PER_YEAR, year: year};
};

export const loadTransactionsWeekly = (weeks, year) => {
  return {type: LOAD_TRANSACTIONS_WEEKLY, weeks: weeks, year: year};
};

export const loadTransactionsCalendar = (weeks, year, month) => {
  return {
    type: LOAD_TRANSACTIONS_CALENDAR,
    weeks: weeks,
    year: year,
    month: month,
  };
};

export const updateMonthYearFilter = (month, year) => {
  return {type: UPDATE_MONTH_YEAR_FILTER, month: month, year: year};
};

export const updateVisibility = (addData, editData) => {
  return {type: UPDATE_VISIBILITY, addData: addData, editData: editData};
};

export const updateDataSelection = (
  selectedID,
  selectedDate,
  amount,
  amountType,
) => {
  console.log(
    'Im calling the update data selection action',
    amount,
    amountType,
    selectedDate,
  );
  return {
    type: UPDATE_DATA_SELECTION,
    id: selectedID,
    date: selectedDate,
    amount: amount,
    amountType: amountType,
  };
};

export const clearDataSelection = () => {
  return {type: CLEAR_DATA_SELECTION};
};

export const updateMonthEnable = (screen) => {
  return {type: UPDATE_MONTH_ENABLE, monthEnable: screen};
};
