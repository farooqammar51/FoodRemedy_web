import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IngredientModel } from 'src/app/models/database.model';
import { DatabaseService } from 'src/app/services/database-service/database.service';
import { tagsModel } from 'src/app/models/tags.model';

declare var bootstrap: any;

@Component({
  selector: 'app-database-management',
  templateUrl: './database-management.component.html',
  styleUrls: ['./database-management.component.css']
})
export class DatabaseManagementComponent implements OnInit, AfterViewInit {

  Object = Object;

  dataSource: any = undefined;
  ingredients: IngredientModel[] = [];
  ingredientId!: number;

  displayedColumns: string[] = ["index", "description", "details"];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  tags!: tagsModel;
  tagList: any = null;

  modalOpen: boolean = false;
  isItemSelected: boolean = false;
  editClicked: boolean = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private databaseService: DatabaseService) { }

  @ViewChild('ingredientTagsModal', { static: false }) ingredientTagsModal!: ElementRef;

  ngOnInit(): void {
    this.getIngredients();
  }

  ngAfterViewInit(): void {
    this.databaseService.getIngredients(0, 10).subscribe(ingredients => {
      //console.log(ingredients);
      if (ingredients) {
        let index = 0;
        for (let i = 0; i < ingredients.count; i++) {
          index++;
          const newIngredient: IngredientModel = {
            id: ingredients.results[i].id,
            description: ingredients.results[i].description,
            index: index
          }
          this.ingredients.push(newIngredient);
        }
      }
      this.dataSource = new MatTableDataSource<IngredientModel>(this.ingredients);
      //this.dataSource = this.ingredients;
    }, error => {
      console.log(error.message);
    })
  }

  getIngredients() {
    if (this.dataSource != undefined) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  GoBack() {
    this.router.navigate(['database'], { relativeTo: this.route });
    this.editClicked = false;
  }

  onClickDetails(ingredientId: string) {
    this.databaseService.getIngredient(ingredientId).subscribe(
      (response: any) => {
        this.tags = response;
        this.tagList = this.tags.tags;
        //console.log(this.tagList);

        const modalElement = this.ingredientTagsModal.nativeElement;
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.parentNode!.removeChild(backdrop);
        }
      });
  }

  filterchange(data: Event) {
    const value = (data.target as HTMLInputElement).value;
    this.dataSource.filter = value;
  }

  onClickIngredient(ingredientId: number) {
    this.isItemSelected = true
    this.ingredientId = ingredientId;
  }

  onAddUpdateIngredient(action: number) {
    if (action === 1) {
      //update ingredient
      this.router.navigate([this.ingredientId], { relativeTo: this.route });
      this.editClicked = true;
    } else {
      //add ingredient
      this.router.navigate(['add'], { relativeTo: this.route });
      this.editClicked = true;
    }
  }

  shouldRenderHomeContent() {
    const currentRoute = this.route.snapshot;
    return !currentRoute.firstChild;
  }

}