import React, { useContext, useEffect, useState } from 'react';

import { Button, Col, Form, Row, Skeleton } from 'antd';
import { SFProviderProps, SchemaFormProvider } from './Provider';
import sfc, { registerSFComponent, registerSFValidator } from './context';
import {
  CoreSchemaForJsonBasedWesForm,
  SchemaFormInstance,
  SchemaFieldEnhancement,
  GenericFormSchema,
} from './interfaces';
import Match from './Match';
import { merge } from './util';
import context from './context';
import { SchemaFormImpl } from './enhance';
import Section from './Section';
import delay from './delay';

/**
 * true - pass
 * false - block.
 *
 * Promise.reject - block.
 */
type GuardReturns = Promise<boolean> | boolean;
type OnSubmitSingal = any;

interface Props<D = {}> extends RunFormProps<D>, SFProviderProps {}

/**
 * @todo:
 *
 * 1. Grid Layout
 * 2. custom Submit ui
 * 3. User can touch form ref
 * 4. User can touch field refs.
 */
const SchemaForm = (props: React.PropsWithChildren<Props>) => {
  const { validators, components, ...formProps } = props;

  return (
    <SchemaFormProvider validators={validators} components={components}>
      <RunForm {...formProps} children={props.children} />
    </SchemaFormProvider>
  );
};

interface RunFormProps<D = {}> {
  schema: CoreSchemaForJsonBasedWesForm;
  getDefaultValue?: () => Promise<Partial<D>> | Partial<D>;
  getInitialValue?: () => Promise<Partial<D>> | Partial<D>;
  beforeSubmit?: (values: D) => GuardReturns;
  onSubmit?: (values: D) => Promise<OnSubmitSingal> | OnSubmitSingal;
  onSubmitFailed?: (error: object) => void;
}

/**
 * @todo submit ui should be moved away.
 */
const RunForm = (props: React.PropsWithChildren<RunFormProps>) => {
  const ctxVal = useContext(context.__ctx__);
  const { schema } = props;

  const [form] = Form.useForm() as [SchemaFormInstance];

  const [fields] = useState(() => {
    return Object.entries(schema.fields).map(([name, field]) => {
      field.name = name;
      return field;
    });
  });

  const [initState, initialize] = useState(() => {
    return {
      initialized: false,
      defaultVal: {},
      initialVal: {},
    };
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Object.setPrototypeOf(form, SchemaFormImpl.prototype);
    // initialize form
    Object.assign(form, { ...new SchemaFormImpl() });

    (async () => {
      let defaultVal = (await props.getDefaultValue?.()) ?? {};
      let initialVal = (await props.getInitialValue?.()) ?? {};

      defaultVal = merge({}, sfc.resolveSFDefault(props.schema), defaultVal);
      initialVal = merge({}, defaultVal, initialVal);

      initialize({
        initialized: true,
        defaultVal,
        initialVal,
      });
    })();

    return () => {};
  }, []);

  if (!initState.initialized) {
    return <Skeleton loading />;
  }

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      await form.validateFields();
      const values = form.getFieldsValue();

      if (props.beforeSubmit) {
        const pass = await props.beforeSubmit(values);
        if (pass === false) return;
      }

      if (props.onSubmit) {
        await props.onSubmit({
          ...initState.defaultVal,
          ...values,
        });
      }
    } catch (error) {
      props.onSubmitFailed && props.onSubmitFailed(error);
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    form.resetFields();
  };

  const columns = schema.formProps.columns
    ? Number(schema.formProps.columns)
    : 1;

  const colSpan = Math.floor(24 / columns);

  form.$ctx = ctxVal;
  form.$defaultSubmit = onSubmit;
  form.$defaultReset = onReset;
  form.$schema = schema;
  form.$submitting = submitting;

  return (
    <Form
      form={form}
      {...schema.formProps}
      className="imhs-sf"
      initialValues={initState.initialVal}
    >
      <Row gutter={16} justify="start" align="middle">
        {fields.map((schema) => {
          return (
            <Col key={schema.name} span={colSpan}>
              {schema.section && <Section {...schema.section} />}
              <Match key={schema.name} form={form} schema={schema} />
            </Col>
          );
        })}
      </Row>
      <div className="imhs-sf-submit">
        {props.children ? (
          props.children
        ) : (
          <>
            <Button loading={submitting} type="primary" onClick={onSubmit}>
              Submit
            </Button>
            <Button danger onClick={onReset}>
              Reset
            </Button>
          </>
        )}
      </div>
    </Form>
  );
};

interface SubmitProps {
  children: (options: {
    form: SchemaFormInstance;
    schema: CoreSchemaForJsonBasedWesForm;
    onSubmit: VoidFunction;
    onReset: VoidFunction;
    submitting: boolean;
  }) => React.ReactNode;
}
SchemaForm.Submit = (props: SubmitProps) => {
  const form = SchemaForm.useFormInstance();
  const child = props.children as any;

  if (typeof child === 'function') {
    return child({
      form: form,
      submitting: form.$submitting,
      schema: form.$schema,
      onSubmit: form.$defaultSubmit,
      onReset: form.$defaultReset,
    });
  }

  return null;
};

type UseIhmsFormInstance = () => SchemaFormInstance;

SchemaForm.useFormInstance = Form.useFormInstance as UseIhmsFormInstance;
SchemaForm.registerSFValidator = registerSFValidator;
SchemaForm.registerSFComponent = registerSFComponent;

SchemaForm.enhanceSchema = function <S extends GenericFormSchema>(
  /**
   * raw schema, static and often come from json.
   */
  schema: S,
  config: Partial<Record<keyof S['fields'], SchemaFieldEnhancement>>
) {
  const enhancements = Object.fromEntries(
    Object.entries(config).map(([name, enhancement]) => {
      const field = schema.fields[name];

      if (!field) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[enhanceSchema] field ${name} has not defined in schema.`
          );
        }

        return null;
      }

      return [
        name,
        {
          ...field,
          ...enhancement,
        },
      ];
    })
  );

  return {
    ...schema,
    fields: {
      ...schema.fields,
      ...enhancements,
    },
  };
};

SchemaForm._debug_delay = delay;

export default SchemaForm;
