import React, {
  LegacyRef,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Form, FormRule } from 'antd';
import {
  AntdFormControlPropsBase,
  SchemaField,
  SchemaFormInstance,
} from './interfaces';
import NoMatch from './NoMatch';
import sfc from './context';
import { useTick } from './tick';

interface MatchProps {
  schema: SchemaField;
  wrapper?: React.FC;
  wrapperProps?: Record<string, any>;
  form: SchemaFormInstance;
}

const Match = React.memo((props: MatchProps) => {
  const tick = useTick();
  const componentDivWrap = useRef<HTMLDivElement>(null);
  const { components, validators, collect, recycle, T } = useContext(
    sfc.__ctx__
  );

  /**
   * translate messges of rules.
   */
  const [field] = useState(() => {
    const descripitor = sfc.normalizeSchemaField(props.schema);

    const C = components[descripitor.componentTag];

    const rules = descripitor.rules
      .map((rule) => {
        if (rule.name) {
          return validators[rule.name];
        } else {
          return rule;
        }
      })
      .flat()
      .map((rule) => {
        if (typeof rule.message === 'string') {
          return {
            ...rule,
            message: T(rule.message),
          };
        }
        return rule;
      });

    return { descripitor, C, rules };
  });

  const { descripitor, C, rules } = field;
  const { _def: schema, wrapperProps, componentProps } = descripitor;

  useEffect(() => {
    collect(descripitor.name, {
      tick,
      descripitor,
      rules,
      el: componentDivWrap.current,
    });

    (async () => {
      const schema = descripitor._def;
      if (!schema.initialState) return;

      try {
        const { componentProps, wrapperProps } = descripitor;

        const state = await schema.initialState(schema, props.form);

        if (!state) return;

        const { value, readOnly, disabled, hidden } = state;

        if (readOnly !== undefined) componentProps.readOnly = readOnly;
        if (disabled !== undefined) componentProps.disabled = disabled;
        if (hidden !== undefined) wrapperProps.hidden = hidden;

        if (value !== undefined) {
          props.form.setFieldValue(schema.name, value);
        }

        tick();
      } catch (e) {}
    })();

    return () => {
      recycle(descripitor.name);
    };
  }, []);

  if (process.env.NODE_ENV === 'development' && !descripitor.name) {
    throw new Error(`field missing name is not allowed.`);
  }

  if (process.env.NODE_ENV === 'production' && !C) {
    return <NoMatch def={descripitor} />;
  }

  const Wrapper = props.wrapper ?? Form.Item;

  const { renderLabel, renderTooltip } = schema;

  const label = renderLabel
    ? renderLabel(schema, props.form)
    : T(wrapperProps.label);

  const tooltip = renderTooltip
    ? renderTooltip(schema, props.form)
    : T(wrapperProps.tooltip);

  return (
    <Wrapper
      {...wrapperProps}
      {...props.wrapperProps}
      label={label}
      tooltip={tooltip}
      className="imhs-sf-item"
      rules={rules as FormRule[]}
    >
      <UniversalInterceptC
        ref={componentDivWrap}
        // no mutation
        schema={schema}
        // nenver be mutated
        form={props.form}
        // nenver be mutated.
        C={C}
        T={T}
        // never be mutated
        cProps={componentProps}
      />
    </Wrapper>
  );
});

interface InterceptCProps extends AntdFormControlPropsBase {
  form: SchemaFormInstance;
  schema: SchemaField;
  C: React.FC;
  T: (txt: string) => string;
  cProps: any;
}

const UniversalInterceptC = React.forwardRef((props: InterceptCProps, ref) => {
  const { C, schema, value, onChange, T } = props;
  const { beforeChange, afterChanged, renderPlaceholder } = schema;

  const willOverride = Boolean(beforeChange) || Boolean(afterChanged);

  const _onChange = willOverride
    ? async (val) => {
        if (beforeChange) {
          const res = await beforeChange(val, schema, props.form);
          if (res === false) return;
        }

        onChange(val);

        if (afterChanged) {
          afterChanged(val, schema, props.form);
        }
      }
    : onChange;

  // control the component always.
  const _value = value === undefined ? null : value;

  const placeholder = renderPlaceholder
    ? renderPlaceholder(schema, props.form)
    : T(props.cProps.placeholder);

  return (
    <div ref={ref as any} className="imhs-div-for-focus">
      <C
        {...props.cProps}
        placeholder={placeholder}
        value={_value}
        onChange={_onChange}
      />
    </div>
  );
});

export default Match;
