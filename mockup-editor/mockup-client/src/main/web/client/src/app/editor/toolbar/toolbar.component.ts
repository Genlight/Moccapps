import { Component, OnInit } from '@angular/core';
import { faMousePointer, faFont, faLayerGroup, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { faHandPaper, faSquare, faCircle } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  faMousePointer = faMousePointer;
  faHandPointer = faHandPaper;
  faSquare = faSquare;
  faCircle = faCircle;
  faFont = faFont;
  faLayerGroup = faLayerGroup;
  faThLarge = faThLarge;

  constructor() { }

  ngOnInit() {
  }

}
