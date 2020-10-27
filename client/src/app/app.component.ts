import { Component } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms'
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Expenses Calculator';
  name = 'Expenses Calculator';

  public myForm: FormGroup;
  public results: Object;

  constructor(
    private fb:FormBuilder,
    private appService: AppService
  ) {
    this.myForm = this.fb.group({
      students: this.fb.array([]),
    })
  }

  ngOnInit() {
    this.addStudent();
  }

  students(): FormArray {
    return this.myForm.get("students") as FormArray;
  }

  newStudent(): FormGroup {
    return this.fb.group({
      name: '',
      expenses: this.fb.array([])
    });
  }

  addStudent() {
    this.students().push(this.newStudent());
  }
  removeStudent() {
    this.students().removeAt(this.students().length - 1);
  }

  reset() {
    this.students().clear();
  }

  expenses(i: number): FormArray {
    return this.students().at(i).get("expenses") as FormArray
  }

  addExpense(i: number) {
      this.expenses(i).push(new FormControl(0));
  }

  removeExpense(i: number, expIndex:number) {
    this.expenses(i).removeAt(expIndex);
  }

  onSubmit() {
    this.appService.calculate(this.myForm.value).subscribe({
      next: (data) => {
        console.log(data);
        this.results = data.result;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
