import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tag, tagsModel } from 'src/app/models/tags.model';
import { DatabaseService } from 'src/app/services/database-service/database.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs/internal/Observable';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { catchError, map, startWith, take } from 'rxjs';

@Component({
  selector: 'app-edit-ingredient',
  templateUrl: './edit-ingredient.component.html',
  styleUrl: './edit-ingredient.component.css',
})
export class EditIngredientComponent implements OnInit {
  Object = Object;
  isEdit: boolean = false;
  ingredientId!: string;
  ingredientDescription!: string;
  ingredientForm!: FormGroup;

  categories: string[] = [];
  tagCategories: tagsModel[] = [];

  tagList: any;

  tagListsByIndex: string[][] = [];
  selectedList: string[][] = [];

  index!: number;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags!: Observable<string[] | undefined>;

  @ViewChild('tagInput') tagInput!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  constructor(
    private route: ActivatedRoute,
    private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params['id'] != undefined || null) {
        this.ingredientId = params['id'];
        this.isEdit = true;
      }

      this.initForm();
    });

    if (this.isEdit) {
      this.databaseService
        .getIngredient(this.ingredientId)
        .subscribe((response: tagsModel) => {
          this.ingredientDescription = response.description;
          this.tagList = response.tags;
        });
    }
  }

  private initForm() {
    this.databaseService.getCategories(0, 10)
      .subscribe(
        (categories: any) => {
          this.tagCategories = categories;
          for (let i = 0; i < categories.count; i++) {
            this.categories[i] = categories.results[i].name;
          }
        });
    let ingredientTags = new FormArray([]);

    if (this.isEdit) {
      //const recipe = this.recipeService.getRecipe(this.recipeId);
      //recipeName = recipe.name;
      //recipeImagePath = recipe.imagePath;
      //recipeDescription = recipe.description;
      // if(recipe['ingredients']) {
      //   for (let ingredient of recipe.ingredients) {
      //     recipeIngredients.push(new FormGroup({
      //       'name': new FormControl(ingredient.name, Validators.required),
      //       'amount': new FormControl(ingredient.amount,
      //         [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)])
      //     }))
      //   }
      // }
    }

    this.ingredientForm = new FormGroup({
      'description': new FormControl(null, Validators.required),
      'tags': ingredientTags,
    });
  }

  onAddTag() {
    const selectedTags: string[] = [];
    const newFormGroup = new FormGroup({
      'category': new FormControl(this.categories, Validators.required),
      'ingTags': new FormControl({ value: selectedTags, disabled: true }),
    });
    (<FormArray>this.ingredientForm.get('tags')).push(newFormGroup);
  }

  onDeleteTag(index: number) {
    (<FormArray>this.ingredientForm.get('tags')).removeAt(index);
  }

  get controls() {
    return (<FormArray>this.ingredientForm.get('tags')).controls;
  }


  onCategorySelect(index: number, category: string): string {
    // (<FormArray>this.ingredientForm.get('category')).at(index).valueChanges.subscribe(
    //   (value: string) => { console.log(value) }
    // );
    let responseTags: { category: string, tag: string }[] = [];

    this.databaseService.getTags(category, 0, 10).
      subscribe(
        (tags: any) => {
          for (let i = 0; i < tags.count; i++) {
            responseTags[i] = { category: "", tag: "" };
            responseTags[i].category = tags.results[i].tagCategory;
            responseTags[i].tag = tags.results[i].name;
          }
          let tempTags = responseTags.filter(tag => tag.category === category).map(tag => tag.tag);
          //console.log(tempTags);
          this.tagListsByIndex[index] = this.filterTagList(index, tempTags, this.selectedList)
          //this.tagListsByIndex[index] = tempTags;
          console.log(this.tagListsByIndex[index]);
        }
      );

    (<FormArray>this.ingredientForm.get('tags')).at(index).get('ingTags')?.enable();

    this.selectedList[index] = (<FormArray>this.ingredientForm.get('tags'))
      .at(index)
      .get('ingTags')?.value

    console.log(this.selectedList);

    // this.filteredTags = (<FormArray>this.ingredientForm.get('tags'))
    //   .at(index)
    //   .get('ingTags')
    //   ?.valueChanges.pipe(
    //     startWith(null),
    //     map((tag: string | null) =>
    //       tag ? this._filter(index, tag) : this.tagListsByIndex[index].slice()
    //     )
    //   )!;
    // this.filteredTags = this.tagCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((tag: string | null) =>
    //     tag ? this._filter(tag) : this.tagListsByIndex[index].slice()
    //   )
    // );
    //console.log(this.tagList);
    return category;
  }

  filterTagList(index: number, tempTags: string[], selectedList: string[][]): string[] {
    const tagsToRemove: string[] = [];
    for (const tag of tempTags) {
      if (selectedList[index].includes(tag)) {
        tagsToRemove.push(tag);
      }
    }
    tempTags = tempTags.filter(tag => !tagsToRemove.includes(tag))
    return tempTags;
  }

  removeTag(index: number, tag: string): void {
    const tagIndex = this.selectedList[index].indexOf(tag);

    if (tagIndex >= 0) {
      this.selectedList[index].splice(tagIndex, 1);

      this.tagListsByIndex[index].push(tag);

      this.announcer.announce(`Removed ${tag}`);
    }
  }

  addTag(index: number, event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.selectedList[index].push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  edit(index: number, tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tag if it no longer has a name
    if (!value) {
      this.removeTag(index, tag);
      return;
    }

    // Edit existing tag
    const tagIndex = this.selectedList[index].indexOf(tag);
    if (tagIndex >= 0) {
      this.selectedList[index][tagIndex] = value;
    }
  }

  selected(index: number, event: MatAutocompleteSelectedEvent): void {
    this.selectedList[index].push(event.option.viewValue);

    const tagIndex = this.tagListsByIndex[index].indexOf(event.option.viewValue);
    if (tagIndex >= 0) {
      this.tagListsByIndex[index].splice(tagIndex, 1);
    }

    this.tagInput.nativeElement.value = '';
    this.tagCtrl.setValue(null);
  }

  private _filter(index: number, value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.tagListsByIndex[index].filter((tag: string) =>
      tag.toLowerCase().includes(filterValue)
    );
  }

  onSubmit() {
    if (this.ingredientForm.valid) {
      console.log(this.ingredientForm.value);
    } else {
      console.log("Fill out required fields");
    }
  }

}
