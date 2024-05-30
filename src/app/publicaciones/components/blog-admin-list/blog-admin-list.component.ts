import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Message } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { TableModule } from 'primeng/table';
import { PostService } from '../../services/post.service';
import { TooltipModule } from 'primeng/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-admin-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    MessagesModule,
    FormsModule,
    TooltipModule
  ],
  template: `
        @if (state().data) {
        <p-table
            [value]="state().data"
            [tableStyle]="{ 'min-width': '50rem' }"
            styleClass="p-datatable-striped"
            [paginator]="true"
            [rows]="5"
            [selectionPageOnly]="true"
            
            [rowsPerPageOptions]="[5, 10, 20]"
            [globalFilterFields]="['name']"
            dataKey="id"
        >
            <ng-template pTemplate="header">
                <tr>
                    <th pSortableColumn="id" style="width: 3rem">ID <p-sortIcon field="id" /></th>
                    <th pSortableColumn="titulo">Título<p-sortIcon field="titulo" /></th>
                    <th pSortableColumn="fechaCreacion">Fecha creacion <p-sortIcon field="fechaCreacion" /></th>
                    <th pSortableColumn="tag">Tipo<p-sortIcon field="tag" /></th>
                    <th >Acciones</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-postLista let-expanded="expanded">
                @if (state().data.length > 0) {
                <tr>
                    <td>{{ postLista.id }}</td>
                    <td>{{ postLista.titulo }}</td>
                    <td>{{ postLista.fechaCreacion | date }}</td>
                    <td>{{ postLista.tag }}</td>
                    <td>
                        <button
                            pButton
                            icon="pi pi-eye"
                            class="p-button-rounded p-button-info"
                            pTooltip="Ver post" tooltipPosition="top"
                            (click)="nagivateToPost(postLista.uniqueTitleId)"
                        ></button>
                        <button
                            pButton
                            icon="pi pi-trash"
                            class="p-button-rounded p-button-danger"
                            pTooltip="eliminar post" tooltipPosition="top"
                            (click)="deletePost(postLista.id)"
                        ></button>
                    </td>
                </tr>
                }
            </ng-template>
        </p-table>
        } @else {
          <p-messages [value]="messages" [enableService]="false" [closable]="false"></p-messages>
        }


  `,
    styles: `
    :host {
      display: block;
    }
    td, th {
      text-align: center;
    }`,

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogAdminListComponent implements OnInit {

  post: any = []
  state = signal<any>({
    loading: true,
    data: null,
    error: null,
  })

  messages: Message[] = [{ severity: 'info', summary: 'Lista vacia', detail: 'No hay pqrs por mostrar' }];

  constructor(
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void { 
    this.postService.listarPost().subscribe({
      next: (res) => {
        this.state.set({
          loading: false,
          data: res,
          error: null
        })
      }
    })
  }

  deletePost(uniqueId: string){
    this.postService.eliminarPost(uniqueId).subscribe({
      next: (res) => {
        window.location.reload()
      },
      error: (err) => {
        window.location.reload()
      }
    })
  }

  nagivateToPost(postId: string){
    // que se abra en una nueva pestaña
    console.log(postId);
    
    this.router.navigate([`/publicaciones/${postId}`])
  }


}
