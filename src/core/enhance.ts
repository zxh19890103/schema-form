import { FormInstance } from 'antd';
import {
  CoreSchemaForJsonBasedWesForm,
  SchemaFormInstanceAbstract,
} from './interfaces';
import { ContextValue } from './context';
import { ReactNode } from 'react';

class SchemaFormImpl implements SchemaFormInstanceAbstract {
  $ctx: ContextValue;
  $schema: CoreSchemaForJsonBasedWesForm;
  $defaultSubmit: VoidFunction;
  $defaultReset: VoidFunction;

  private div2inputCache: WeakMap<HTMLDivElement, HTMLInputElement>;

  private queryInput(name): HTMLInputElement {
    const { el } = this.getMeta(name);

    if (!this.div2inputCache) {
      this.div2inputCache = new WeakMap();
    }

    if (this.div2inputCache.has(el)) {
      const input = this.div2inputCache.get(el);
      if (input.isConnected) {
        return input;
      } else {
        this.div2inputCache.delete(el);
      }
    }

    let input = el.querySelector('input,select,textarea,checkbox,radio');

    if (!input) {
      input = el.querySelector('[tabindex]');
    }

    if (input) {
      this.div2inputCache.set(el, input as HTMLInputElement);
    }

    return input as HTMLInputElement;
  }

  focus(name: string): void {
    const input = this.queryInput(name);
    if (input) input.focus();
  }

  blur(name: string): void {
    const input = this.queryInput(name);
    if (input) input.blur();
  }

  getMeta(name: string) {
    return this.$ctx.getMeta(name);
  }

  isRequired(name: string): boolean {
    throw new Error('Method not implemented.');
  }
  isEnabled(name: string): boolean {
    throw new Error('Method not implemented.');
  }
  isDisabled(name: string): boolean {
    throw new Error('Method not implemented.');
  }
  isReadonly(name: string): boolean {
    throw new Error('Method not implemented.');
  }
  isVisible(name: string): boolean {
    throw new Error('Method not implemented.');
  }
  isHidden(name: string): boolean {
    throw new Error('Method not implemented.');
  }
  setRequired(name: string, required: boolean): void {
    const { tick, descripitor, rules } = this.$ctx.getMeta(name);
    const { wrapperProps } = descripitor;

    wrapperProps.required = required;

    const rule = rules.find((r) => r.required !== undefined);

    if (required) {
      if (rule) rule.required = true;
      else rules.unshift({ required: true });
    } else {
      if (rule) rule.required = false;
    }

    this.validateFields([name]);

    tick();
  }
  setTooltip(name: string, tooltip: ReactNode): void {
    const { tick, descripitor } = this.$ctx.getMeta(name);
    descripitor.wrapperProps.tooltip = tooltip as any;
    tick();
  }
  setLabel(name: string, label: React.ReactNode) {
    const { tick, descripitor } = this.$ctx.getMeta(name);
    descripitor.wrapperProps.label = label as any;
    tick();
  }
  disable(name: string): void {
    const { tick, descripitor } = this.$ctx.getMeta(name);
    descripitor.componentProps.disabled = true;
    tick();
  }
  endable(name: string): void {
    const { tick, descripitor } = this.$ctx.getMeta(name);
    descripitor.componentProps.disabled = false;
    tick();
  }
  setReadOnly(name: string, value: boolean): void {
    const { tick, descripitor } = this.$ctx.getMeta(name);
    descripitor.componentProps.readOnly = value;
    tick();
  }
  setVisible(name: string, visible: boolean): void {
    const { tick, descripitor } = this.$ctx.getMeta(name);
    descripitor.wrapperProps.hidden = !visible;
    tick();
  }
}

interface SchemaFormImpl extends FormInstance {}

export default SchemaFormImpl.prototype;
