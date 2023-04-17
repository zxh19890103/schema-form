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
  const { components, validators, collect, recycle } = useContext(sfc.__ctx__);

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
      .flat();

    return { descripitor, C, rules };
  });

  const { descripitor, C, rules } = field;

  useEffect(() => {
    collect(descripitor.name, {
      tick,
      descripitor,
      rules,
      el: componentDivWrap.current,
    });

    (async () => {
      const schema = descripitor._def;
      if (schema.initialState) {
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
      }
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

  return (
    <Wrapper
      {...descripitor.wrapperProps}
      {...props.wrapperProps}
      className="imhs-sf-item"
      rules={rules as FormRule[]}
    >
      <UniversalInterceptC
        ref={componentDivWrap}
        // no mutation
        schema={descripitor._def}
        // nenver be mutated
        form={props.form}
        // nenver be mutated.
        C={C}
        // never be mutated
        cProps={descripitor.componentProps}
      />
    </Wrapper>
  );
});

interface InterceptCProps extends AntdFormControlPropsBase {
  form: SchemaFormInstance;
  schema: SchemaField;
  C: React.FC;
  cProps: any;
}

const UniversalInterceptC = React.forwardRef((props: InterceptCProps, ref) => {
  const { C, schema, value, onChange } = props;
  const { beforeChange, afterChanged, initialState } = schema;

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

  return (
    <div ref={ref as any} className="imhs-div-for-focus">
      <C {...props.cProps} value={_value} onChange={_onChange} />
    </div>
  );
});

export default Match;
