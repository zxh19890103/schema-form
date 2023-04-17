import React from 'react';
import { DatePicker, TimePicker } from 'antd';
import { AntdFormControlPropsBase } from '../core/interfaces';
import type { Moment } from 'moment';

/**
 * @todo
 */
interface Props extends AntdFormControlPropsBase<Moment> {}

const transform = (val, type: 'month' | 'date' | 'datetime' | 'time') => {
  return val;
};

const DateTimePicker = (props: Props) => {
  const value = transform(props.value, 'datetime');

  return (
    <DatePicker
      {...props}
      showTime
      value={value}
      onChange={(value) => {
        props.onChange(transform(value, 'datetime'));
      }}
    />
  );
};

DateTimePicker.TimePicker = (props: Props) => {
  const value = transform(props.value, 'datetime');

  return (
    <TimePicker
      {...props}
      value={value}
      onChange={(value) => {
        props.onChange(transform(value, 'time'));
      }}
    />
  );
};

DateTimePicker.DatePicker = (props: Props) => {
  const value = transform(props.value, 'date');

  return (
    <DatePicker
      {...props}
      showTime={false}
      value={value}
      onChange={(value) => {
        props.onChange(transform(value, 'date'));
      }}
    />
  );
};

DateTimePicker.MonthPicker = (props: Props) => {
  const value = transform(props.value, 'month');

  return (
    <DatePicker.MonthPicker
      {...props}
      value={value}
      onChange={(value) => {
        props.onChange(transform(value, 'month'));
      }}
    />
  );
};

export default DateTimePicker;
