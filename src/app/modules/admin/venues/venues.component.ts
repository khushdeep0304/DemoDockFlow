import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import algoliasearch from 'algoliasearch/lite';
import { LineLayout, PlainGalleryConfig, PlainGalleryStrategy, Image, ModalGalleryService, ModalGalleryRef, ModalGalleryConfig } from '@ks89/angular-modal-gallery';
import { MatTableDataSource } from '@angular/material/table';

const searchClient = algoliasearch(
    'MIM28LALQL',
    'f3bca2db6db658f4553d76197746b6ad'
);
const indexName = "soomeet_portal_venues_search"
const index = searchClient.initIndex(indexName);
@Component({
    selector: 'venues',
    templateUrl: './venues.component.html',
    styles: [`.example-container {
        //  height: 400px;
        overflow: auto;
      }
      
      table {
        width: 100%;
      }
      .mat-column-name img {
        height: 100%;
        object-fit: cover;
        aspect-ratio: 1;
      }
      .mat-column-venue_top_tags, .mat-column-name, 
      .mat-column-lieu {
          min-width: 250px !important;
          padding-right: 30px !important;
      }
      .mat-column-lieu{
        min-width: 200px !important;
        padding-right: 30px !important;
      }
      `],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})

export class VenuesComponent implements OnInit {
    searchInputControl: FormControl = new FormControl('');
    nbHits = 0;
    baseUrl = "https://www.soomeet.com/salles/";
    imagePrefix = 'https://res.cloudinary.com/soomeet/image/upload/';
    images: Image[];
    columns: string[] = [];
    dataSource = new MatTableDataSource();
    // MatPaginator Inputs
    length = 100;
    pageSize = 50;
    pageIndex = 0;
    pageSizeOptions: number[] = [50, 100, 250];
    // MatPaginator Output
    pageEvent: PageEvent;
    facetsAttribute: any[] = [
        { title: 'Capacity', attribute: 'capa_assis_total_max' },
        { title: 'Capacity', attribute: 'capa_debout_total_max' },
        { title: 'Capacity', attribute: 'capaGlobalTotalMin' },
        { title: 'Location', attribute: 'all_locations' },
        { title: 'Transportation', attribute: 'transport' },
        { title: 'Venues', attribute: 'lieu' },
        { title: 'Styles', attribute: 'style' },
        { title: 'Privacy', attribute: 'privatisation' },
        { title: ' Catering', attribute: 'restauration' },
        { title: 'Event type', attribute: 'eventTypes' },
        { title: 'Equipment', attribute: 'equipements' },
        { title: 'Activities', attribute: 'animations' },
        { title: ' List', attribute: 'customLists' },
        { title: 'Favourite', attribute: 'isFavorite' },

    ];
    facets: any = {};
    filteredAttributes: any = [{ id: 1, title: "test" }, { id: 2, title: "test" }];
    tags: any = [{ id: 1, title: "test" }, { id: 2, title: "test" }];
    attributesEditMode: boolean = false;
    /**
     * Constructor
     */
    constructor(private modalGalleryService: ModalGalleryService

    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.getColumns();
        this.getData();
    }

    filterAttributes(event): void {
        {
            // Get the value
            const value = event.target.value.toLowerCase();

            // Filter the tags
            this.filteredAttributes = this.tags.filter(tag => tag.title.toLowerCase().includes(value));
        }
    }

    toggleAttributesEditMode() {

        this.attributesEditMode = !this.attributesEditMode;


    }

    toggleProductAttributes(attribute: any, change: MatCheckboxChange): void {

    }



    getData(pageIndex?, pageSize?) {
        debugger
        this.pageIndex = pageIndex != undefined ? pageIndex : this.pageIndex;
        this.pageSize = pageSize != undefined ? pageSize : this.pageSize;
        index.search(this.searchInputControl.value, {
            page: this.pageIndex,
            hitsPerPage: this.pageSize,
            facets: this.facetsAttribute.map(function (item) { return item['attribute']; })

        }).then((res) => {
            debugger
            this.nbHits = res.nbHits;
            this.dataSource.data = res.hits;
            this.facets = res.facets;
            console.log(this.facets)
        });

    }
    drop(event: CdkDragDrop<string[]>) {
        // debugger
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
        localStorage.setItem('venue_table_columns', JSON.stringify(this.columns))
    }


    getColumns() {
        if (localStorage.getItem('venue_table_columns')) {
            this.columns = JSON.parse(localStorage.getItem('venue_table_columns'));
        }
        else {
            this.columns = ['name', 'localisation', 'lieu', 'venue_top_tags', 'capa_debout_total_max', 'capa_assis_total_max', 'rooms', 'surface_total', 'all_offers'];
            localStorage.setItem('venue_table_columns', JSON.stringify(this.columns))
        }
    }
    goToUrl(slug) {
        window.open(
            this.baseUrl + slug, "_blank");
    }
    openGalleryModal(id: number, images): void {
        this.images = [];
        images.forEach((image, index) => {
            this.images.push(new Image(
                index,
                { // modal
                    img: this.imagePrefix + image,
                    extUrl: 'http://www.google.com'
                }
            ))
        });
        const dialogRef: ModalGalleryRef = this.modalGalleryService.open({
            id: Number(id),
            images: this.images,
            currentImage: this.images[0],
        } as ModalGalleryConfig) as ModalGalleryRef;
    }

    sortChange(event) {
        if (event.active.length > 0 && event.direction.length > 0) {
            let indexName_with_sorting = indexName
            switch (event.active) {
                case "localisation":
                    indexName_with_sorting += "_venueLocation"
                    break;
                case "lieu":
                    indexName_with_sorting += "_venueType"
                    break;
                case "capa_debout_total_max":
                    indexName_with_sorting += "_capaStanding"
                    break;
                case "capa_assis_total_max":
                    indexName_with_sorting += "_capaSitting"
                    break;
                case "all_offers":
                    indexName_with_sorting += "_minPrice"
                    break;
            }
            switch (event.direction) {
                case "asc":
                    indexName_with_sorting += "_asc"
                    break;
                case "desc":
                    indexName_with_sorting += "_desc"
                    break;
            }
            searchClient.initIndex(indexName_with_sorting).search(this.searchInputControl.value).then((res) => {
                this.nbHits = res.nbHits;
                this.dataSource.data = res.hits;
            });
        }

    }
    searchForFacetValues() {
        // index.setSettings({
        //     attributesForFaceting: [
        //       'searchable(all_locations)'
        //     ]
        //   });
        debugger
        index.searchForFacetValues('all_locations', 'stephen').then(({ facetHits }) => {
            console.log(facetHits);
        });
    }

}
