import {Component, OnInit} from '@angular/core';
import {TokenStorageService} from "../auth/token-storage.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

  constructor(private router: Router, private tokenStorage: TokenStorageService) {
  }

  ngOnInit() {
    if (!this.tokenStorage.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }
}
