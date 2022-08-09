import { TrainingService } from './../training.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { StopTrainingComponent } from './stop-training.compoenent';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit {
  // @Output() trainingExit = new EventEmitter();
  progress = 0 ;
  timer!: number;
  constructor(private dialog: MatDialog, private trainingService: TrainingService) {}

  ngOnInit(): void {
    this.startOrResumeTimer();
  }

  startOrResumeTimer(){
   const step = this.trainingService.getRunningExercise().duration / 100 * 1000;  //100/30ms*1000 (30ms is the duration for crunches exrecise defined in training.service.ts)
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    }, step);

  }
  onStopSpinner() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }});
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          // this.trainingExit.emit();
          this.trainingService.cancelExercise(this.progress);
        } else {
          this.startOrResumeTimer();
        }
        // console.log(result);
      })
  }
}
