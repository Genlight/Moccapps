import { Component, OnInit } from '@angular/core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-customizepanel',
  templateUrl: './customizepanel.component.html',
  styleUrls: ['./customizepanel.component.scss']
})
export class CustomizepanelComponent implements OnInit {

  faEllipsisV = faEllipsisV;

  constructor() { }

  ngOnInit() {
  }

  onToggleCustomize() {
    const panel = document.getElementById('customizepanel');
    panel.classList.toggle('showoptions');
  }

}
