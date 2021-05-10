import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-resize-dragger',
  template: `
    <p>
      resize-dragger works!
    </p>
  `,
  styleUrls: ['./resize-dragger.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResizeDraggerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
