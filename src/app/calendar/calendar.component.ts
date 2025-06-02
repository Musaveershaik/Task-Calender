import { Component, Input, signal } from '@angular/core';
import { DateTime } from 'luxon';
import { Meeting } from './meetings.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  @Input() meetings: { [key: string]: string[] } = {};

  activeDay = signal<DateTime | null>(null);
  currentMonth = signal<DateTime>(DateTime.now());
  newTaskTitle = signal('');
  newTaskTime = signal('');
  newTaskDescription = signal('');
  tasks = signal<Meeting[]>([]);

  readonly DATE_MED = DateTime.DATE_MED;

  weekDays() {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  }

  firstDayOfActiveMonth() {
    return this.currentMonth();
  }

  daysOfMonth() {
    const firstDay = this.currentMonth().startOf('month');
    const lastDay = this.currentMonth().endOf('month');
    const days: DateTime[] = [];

    // Add days from previous month to fill the first week
    const firstDayOfWeek = firstDay.weekday;
    if (firstDayOfWeek > 1) {
      const prevMonth = firstDay.minus({ days: firstDayOfWeek - 1 });
      for (let i = 0; i < firstDayOfWeek - 1; i++) {
        days.push(prevMonth.plus({ days: i }));
      }
    }

    // Add days of current month
    for (let i = 0; i < lastDay.day; i++) {
      days.push(firstDay.plus({ days: i }));
    }

    // Add days from next month to complete the last week
    const lastDayOfWeek = lastDay.weekday;
    if (lastDayOfWeek < 7) {
      const nextMonth = lastDay.plus({ days: 1 });
      for (let i = 0; i < 7 - lastDayOfWeek; i++) {
        days.push(nextMonth.plus({ days: i }));
      }
    }

    return days;
  }

  goToPreviousMonth() {
    this.currentMonth.update((month) => month.minus({ months: 1 }));
  }

  goToNextMonth() {
    this.currentMonth.update((month) => month.plus({ months: 1 }));
  }

  goToToday() {
    this.currentMonth.set(DateTime.now());
    this.activeDay.set(DateTime.now());
  }

  activeDayMeetings() {
    if (!this.activeDay()) return [];
    const dateStr = this.activeDay()!.toISODate()!;
    return this.tasks().filter(task => task.date === dateStr);
  }

  addTask() {
    if (!this.activeDay() || !this.newTaskTitle()) return;

    const newTask: Meeting = {
      title: this.newTaskTitle(),
      time: this.newTaskTime(),
      description: this.newTaskDescription(),
      date: this.activeDay()!.toISODate()!
    };

    this.tasks.update(tasks => [...tasks, newTask]);
    
    // Clear form
    this.newTaskTitle.set('');
    this.newTaskTime.set('');
    this.newTaskDescription.set('');
  }

  deleteTask(index: number) {
    this.tasks.update(tasks => tasks.filter((_, i) => i !== index));
  }
}
