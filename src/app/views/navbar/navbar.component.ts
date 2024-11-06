import { ComponentType } from '@angular/cdk/portal';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  protected loginComponent: ComponentType<any> = LoginComponent;
  protected registerComponent: ComponentType<any> = RegisterComponent;

  constructor(
    protected authService: AuthService,
    private dialog: MatDialog,
    private firestoreService: FirestoreService
  ) {

  };

  public ngOnInit(): void {

    this.subscriptions.push(
      this.authService.authTrigger().subscribe(() => {
        if (this.authService.isAuthenticated()) {
          this.dialog.closeAll();
          if (this.authService.user)
            this.firestoreService.getPlayersList(this.authService.user.uid).subscribe(val => {
              console.log(val);
            });
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subs => {
      subs.unsubscribe();
    });
  }

  public openDialog(component: ComponentType<any>): void {
    this.dialog.open(component);
  }

  public logOut(): void {
    this.authService.signOut();
  }
}
