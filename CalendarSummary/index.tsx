/** @format */

import { Component } from "react";
import { getCalendarEvents } from "../api-client";
import moment from "moment";
import "./index.css";

class CalendarSummary extends Component {
  today = new Date();
  state = {
    ourDays: [],
  };

  componentWillMount() {
    for (let i = 0; i < 7; i++) {
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
          const dayObject: Object = {
            date: moment(nextDay).format("YYYY-MM-DD"),
            numberOfEvents: res.length,
            sumAllEvent,
            longestEvent,
            key: i,
          };

          this.setState({
            ourDays: [...this.state.ourDays, dayObject],
          });
        })
        .catch((err) => console.log(err));
    }
  }

  render() {
    const { ourDays } = this.state;

    let sumNumberOfEvenet: number = 0;
    let sumTotalDuration: number = 0;
    let longetEventOfWeek: string = "";
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
            {ourDays.map((day: any) => {
              const {
                date,
                numberOfEvents,
                sumAllEvent,
                longestEvent,
                key,
              } = day;

              sumNumberOfEvenet += numberOfEvents;
              sumTotalDuration += sumAllEvent;

              return (
                <tr key={key}>
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
              <td>sssss</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default CalendarSummary;
