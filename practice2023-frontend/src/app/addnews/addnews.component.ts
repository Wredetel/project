import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-addnews',
  templateUrl: './addnews.component.html',
  styleUrls: ['./addnews.component.css']
})

export class AddnewsComponent {
  AddnewsForm = new FormGroup({
    text: new FormControl('', [Validators.maxLength(4095)]),
    file: new FormControl(''),
    fileSource: new FormControl('')
  });

  baseUrl = '';

  @Output() submitted: EventEmitter<any> = new EventEmitter();
  
  constructor(private http: HttpClient, @Inject('BASE_API_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get text() {
    return this.AddnewsForm.controls['text'];
  }

  onSubmit() {

    const formData = new FormData();
    formData.append('Text', this.AddnewsForm.get('text')?.value!);
    if (this.AddnewsForm.get('fileSource')?.value) {

      formData.append('File', this.AddnewsForm.get('fileSource')?.value!);

    }



    this.http.post(this.baseUrl + '/NewsFeed', formData).subscribe(
      {
        next: (result) => {
          this.submitted.emit();
          this.AddnewsForm.reset();
          this.AddnewsForm.setErrors({ 'atLeastRequired': true });
        },
        error: (e) => console.error(e)
      }
      );
  }
  ngOnInit() {
    this.AddnewsForm.get("text")?.addValidators([Validators.maxLength(4096)])
    this.AddnewsForm.addValidators(this.atLeastFile());
  }


  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.AddnewsForm.patchValue({ fileSource: file });
    }
  }
  atLeastFile(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const text = this.AddnewsForm.get("text")?.value;
      const file = this.AddnewsForm.get("file")?.value;
      if (file == "" && text == "") {
        return { 'atLeastRequired': true }
      }
      return null;
    }
  }
}

