import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'management-role-list',
  imports: [
    MatIcon,
    MatButton
],
  templateUrl: './role-list.html',
})
export default class RoleList { }
