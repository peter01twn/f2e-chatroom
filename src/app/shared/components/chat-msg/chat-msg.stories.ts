import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { SharedModule } from '../../shared.module';
import { ChatMsgComponent } from './chat-msg.component';

type ChatMsgStory = Story<ChatMsgComponent & { content: any }>;

export default {
  title: 'Chat Message',
  component: ChatMsgComponent,
  decorators: [
    moduleMetadata({
      imports: [SharedModule, BrowserAnimationsModule],
    }),
  ],
  argTypes: {
    discussionCount: { control: 'number' },
  },
  args: {
    direction: 'ltr',
    discussionCount: 0,
  },
} as Meta;

const Template: ChatMsgStory = args => ({
  props: args,
  template: `
      <app-chat-msg
        [discussionCount]="${args.discussionCount}"
        direction="${args.direction}"
      >
        ${args.content}
      </app-chat-msg>
    `,
});

export const normal = Template.bind({});
normal.args = {
  content: 'normal',
};

export const hasDiscuss = Template.bind({});
hasDiscuss.args = {
  content: 'has discuss',
  discussionCount: 5,
};

export const rightToLeft = Template.bind({});
rightToLeft.args = {
  content: 'right to left',
  direction: 'rtl',
};
