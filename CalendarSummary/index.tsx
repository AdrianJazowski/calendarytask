/** @format */

import { Component } from "react";
import moment from "moment";
import { getCalendarEvents } from "../api-client";
import "./index.css";

interface Day {
  date: Date;
  numberOfEvents: number;
  sumAllEvent: number;
  longestEvent: string;
  longestEventDuration: number;
}

class CalendarSummary extends Component {
  today = new Date();
  state = {
    quantityOfDays: 7,
    ourDays: [],
  };

  getDataFropApi() {
    for (let i = 0; i < this.state.quantityOfDays; i++) {
      const nextDay: Date = new Date(this.today);

      nextDay.setDate(nextDay.getDate() + i);

      getCalendarEvents(nextDay)
        .then((res) => {
          const eventDur: number[] = res.map((item) => item.durationInMinutes);
          const sumAllEvent: number = eventDur.reduce(
            (total: number, amount: number) => total + amount
          );

          const longestEventMinutes: number = Math.max(...eventDur);

          const longestEventObj: any = res.find(
            (item) => item.durationInMinutes === longestEventMinutes
          );
          const longestEvent: string = longestEventObj.title;

          const longestEventDuration: number =
            longestEventObj.durationInMinutes;
          const dayObject: Day = {
            date: nextDay,
            numberOfEvents: res.length,
            sumAllEvent,
            longestEvent,
            longestEventDuration,
          };

          this.setState({
            ourDays: [...this.state.ourDays, dayObject],
          });
        })
        .catch((err) => console.log(err));
    }
  }

  componentWillMount() {
    this.getDataFropApi();
  }

  render() {
    const { ourDays } = this.state;

    const sortedArrayByDate:object[] = ourDays.sort((day1: any, day2: any) => {
      return day1.date - day2.date;
    });

    const formatedSortedByDateArray = sortedArrayByDate.map((day: any) => {
      return {
        ...day,
        date: moment(day.date).format("YYYY-MM-DD"),
      };
    });

    let sumNumberOfEvenet: number = 0;
    let sumTotalDuration: number = 0;

    const longestEventDurationArray: number[] = formatedSortedByDateArray.map(
      (day: any) => day.longestEventDuration
    );

    const maxLongestEventDuration: number = Math.max(
      ...longestEventDurationArray
    );

    const eventWithLongestDuration = formatedSortedByDateArray.find(
      (day: any) => day.longestEventDuration === maxLongestEventDuration
    );

    return (
      <div>
        <h2>Calendar summary</h2>

        <table className="tableWrapper">
          <thead className="tableWrapper">
            <tr className="tableWrapper">
              <th>Date</th>
              <th>Number of events</th>
              <th>Total duration [min]</th>
              <th>Longest event</th>
            </tr>
          </thead>
          <tbody>
            {formatedSortedByDateArray.map((day) => {
              const {
                date,
                numberOfEvents,
                sumAllEvent,
                longestEvent,
              } = day;

              sumNumberOfEvenet += numberOfEvents;
              sumTotalDuration += sumAllEvent;

              return (
                <tr key={date}>
                  <td>{date}</td>
                  <td className="numberValue">{numberOfEvents}</td>
                  <td className="numberValue">{sumAllEvent}</td>
                  <td>{longestEvent}</td>
                </tr>
              );
            })}
            <tr>
              <td>Total</td>
              <td className="numberValue">{sumNumberOfEvenet}</td>
              <td className="numberValue">{sumTotalDuration}</td>
              {formatedSortedByDateArray.length > 0 ? (
                <td>{eventWithLongestDuration.longestEvent}</td>
              ) : (
                <td>longest event</td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default CalendarSummary;
