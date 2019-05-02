import { TestBed } from '@angular/core/testing';

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User } from '../../models/User';

import { UserinfoService } from './userinfo.service';



describe('UserinfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserinfoService = TestBed.get(UserinfoService);
    expect(service).toBeTruthy();
  });
});
