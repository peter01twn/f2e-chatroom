import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { SharedModule } from '../../shared.module';

import { ForwardBtnComponent } from './forward-btn.component';

type ForwardBtnStory = Story<ForwardBtnComponent & { content: any }>;

export default {
  title: 'forward-btn',
  component: ForwardBtnComponent,
  decorators: [
    moduleMetadata({
      imports: [SharedModule],
    }),
  ],
  parameters: {
    actions: {
      handles: ['click'],
    },
  },
} as Meta;

// We create a “template” of how args map to rendering
const Template: ForwardBtnStory = args => ({
  props: args,
  template: `
      <button app-forward-btn>${args.content}</button>
    `,
});

export const normal = Template.bind({});
normal.args = {
  content: 'normal',
};
