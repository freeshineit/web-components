import { ensureGlobalStyles } from './utils/dom';
import { themeCss } from './styles/theme';
import './styles/theme.scss';

import '@/components/wc-button';
import '@/components/wc-checkbox';
import '@/components/wc-form';
import '@/components/wc-input';
import '@/components/wc-item';
import '@/components/wc-list';
import '@/components/wc-option';
import '@/components/wc-radio';
import '@/components/wc-select';
import '@/components/wc-switch';
import '@/components/wc-textarea';

ensureGlobalStyles('wc-theme', themeCss);

export { WCButtonElement } from '@/components/wc-button';
export { WCCheckboxElement } from '@/components/wc-checkbox';
export { WCFormElement } from '@/components/wc-form';
export { WCInputElement } from '@/components/wc-input';
export { WCItemElement } from '@/components/wc-item';
export { WCListElement } from '@/components/wc-list';
export { WCOptionElement } from '@/components/wc-option';
export { WCRadioElement } from '@/components/wc-radio';
export { WCSelectElement } from '@/components/wc-select';
export { WCSwitchElement } from '@/components/wc-switch';
export { WCTextareaElement } from '@/components/wc-textarea';
