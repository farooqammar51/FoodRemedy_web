import { ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/services/authentication-service/auth.service';


@Component({
  selector: 'app-idle-state-detection',
  templateUrl: './idle-state-detection.component.html',
  styleUrl: './idle-state-detection.component.css'
})
export class IdleStateDetectionComponent implements OnInit, DoCheck {

  idleStatus!: string;
  timeOutCounter: any;
  isTimedOut: boolean = false;

  isUserIdleSubject = new BehaviorSubject<boolean>(this.isTimedOut);
  dialogBox!: boolean;

  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private authService: AuthService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {

    this.authService.getIdleStateSubject(this.isUserIdleSubject);

    this.idle.setIdle(1800); //set to 30 minutes
    this.idle.setTimeout(10);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleStart.subscribe(
      () => {
        this.idleStatus = 'Youve gone idle!, Click anywhere to resume browsing...';
        this.dialogBox = true;
      });
    this.idle.onTimeoutWarning.subscribe(
      (countdown) => {
        this.timeOutCounter = `You will time out in ${countdown} seconds!`;
        this.dialogBox = true;
      });
    this.idle.onIdleEnd.subscribe(() => {
      this.idleStatus = 'No longer idle.';
      this.dialogBox = true;
    });
    this.idle.onInterrupt.subscribe(() => {
      this.dialogBox = false;
    });
    this.idle.onTimeout.subscribe(() => {
      this.timeOutCounter = 'Timed out!';
      this.isTimedOut = true;
      this.isUserIdleSubject.next(this.isTimedOut);
      this.dialogBox = false;
      this.authService.logout();
    });

    //this.keepalive.interval(15);
    //this.keepalive.onPing.subscribe(() => this.lastPingSubject.next(new Date()));

    this.reset();
  }

 ngDoCheck(): void {
   if(!this.dialogBox) {
    this.onClose();
    this.cd.detectChanges();
   }
 }

  reset() {
    this.idle.watch();
    this.idleStatus = 'Started.';
  }

  onClose() {
    this.dialogBox = false;
  }

}