import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'management-user-list',
  imports: [
    MatIcon,
    MatButton
  ],
  templateUrl: './user-list.html',
})
export default class UserList { }
