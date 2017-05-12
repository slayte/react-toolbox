import * as React from 'react';
import { F } from 'ramda';
import { ComponentClass, PropTypes, PureComponent } from 'react';
import { addMonths, isBefore, isSameDay, isSameMonth, isToday, isWithinRange, setDate } from 'date-fns';
import getPassThrough, { PassTroughFunction } from '../../utils/getPassThrough';
import { Component }  from '../../types';
import { DateChecker,  PickerDate, SelectedSource } from './types';
import getSelectionMatch from './getSelectionMatch';

export interface DayNodeProps {
  blocked: boolean,
  disabled: boolean,
  highlighted: boolean,
  inRange: boolean,
  onClick: (event: React.MouseEvent<any>) => void,
  onMouseEnter: (event: React.MouseEvent<any>) => void,
  onMouseLeave: (event: React.MouseEvent<any>) => void,
  outOfMonth: boolean,
  selected: boolean,
  selectedSource: SelectedSource
  today: boolean,
}

export interface DayFactoryArgs {
  DayNode: Component<DayNodeProps>,
  passthrough: PassTroughFunction<DayProps, 'DayNode'>,
};

export interface DayProps {
  day: Date,
  highlighted: PickerDate,
  isDayBlocked: DateChecker,
  isDayDisabled: DateChecker,
  onClick: (day: Date, event: React.MouseEvent<any>) => void,
  onMouseEnter: (day: Date, event: React.MouseEvent<any>) => void,
  onMouseLeave: (day: Date, event: React.MouseEvent<any>) => void,
  selected: PickerDate,
  viewDate: Date,
};

export type Day = ComponentClass<DayProps>;

export default function dayFactory({ DayNode, passthrough }: DayFactoryArgs): Day {
  const passProps = getPassThrough(passthrough);
  return class Day extends PureComponent<DayProps, void> {
    static defaultProps = {
      isDayBlocked: F,
      isDayDisabled: F,
    };

    handleClick = event => {
      const { day, isDayDisabled, onClick, viewDate } = this.props;
      if (isSameMonth(day, viewDate) && !isDayDisabled(day)) {
        onClick(day, event);
      }
    };

    handleMouseEnter = (event) => {
      const { day, isDayDisabled, onMouseEnter, viewDate } = this.props;
      if (isSameMonth(day, viewDate) && !isDayDisabled(day)) {
        onMouseEnter(day, event);
      }
    };

    handleMouseLeave = (event) => {
      const { day, isDayDisabled, onMouseLeave, viewDate } = this.props;
      if (isSameMonth(day, viewDate) && !isDayDisabled(day)) {
        onMouseLeave(day, event);
      }
    };

    render() {
      const { day, highlighted, isDayBlocked, isDayDisabled, selected, viewDate, ...rest } = this.props;
      const selectedMatch = getSelectionMatch(day, selected);
      const highlightedMatch = getSelectionMatch(day, highlighted);
      const isHighlighted = highlightedMatch.selected || highlightedMatch.inRange;

      return (
        <DayNode
          {...rest}
          {...passProps(this.props, 'DayNode', this)}
          blocked={isDayBlocked(day)}
          disabled={isDayDisabled(day)}
          highlighted={isHighlighted}
          inRange={selectedMatch.inRange}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          outOfMonth={!isSameMonth(viewDate, day)}
          selected={selectedMatch.selected}
          selectedSource={selectedMatch.source}
          today={isToday(day)}
        >
          {day.getDate()}
        </DayNode>
      );
    }
  }
}
