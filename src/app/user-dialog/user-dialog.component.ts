import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent {
  userForm: FormGroup;
  departamentos: any[] = [{id:1,label:'Tecnologías de la Información'}, {id:2,label:'Recursos Humanos'}, {id:3,label:'Finanzas'}];
  cargos: any[] = [{id:1,label:'Administrador'}, {id:2,label:'Líder Frontend'}, {id:3,label:'Desarrollador Frontend'}];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    // Inicializa el formulario con los datos recibidos o vacío
    this.userForm = this.fb.group({
      usuario: [data?.usuario || '', Validators.required],
      nombres: [data?.nombres || '', Validators.required],
      segundo_nombres: [data?.segundo_nombres || '', Validators.required],
      apellidos: [data?.apellidos || '', Validators.required],
      segundo_apellidos: [data?.segundo_apellidos || '', Validators.required],
      departamento: [Number(data?.departamento) || 0, Validators.required],
      cargo: [Number(data?.cargo) || 0, Validators.required]
    });
  }

  guardarUsuario(): void {
    if (this.userForm.valid) {
      const usuario = this.userForm.value;
      const url = 'http://127.0.0.1:8000/api/user';
      console.log(usuario);
      const nuevoUsuario = {
        id: this.data?.id || undefined, // Usa el ID si está presente (modo edición)
        username: usuario.usuario,
        first_name: usuario.nombres,
        second_name: usuario.segundo_nombres,
        first_last_name: usuario.apellidos,
        second_last_name: usuario.segundo_apellidos,
        department_id: usuario.departamento,
        job_title_id: usuario.cargo
      };
      console.log(nuevoUsuario);

      const request = this.data ? this.http.put(url, nuevoUsuario) : this.http.post(url, nuevoUsuario);

      request.subscribe({
        next: (response) => {
          console.log('Usuario guardado o actualizado exitosamente:', response);
          this.dialogRef.close(nuevoUsuario); // Cierra el diálogo y envía los datos al componente padre
        },
        error: (error) => {
          console.error('Error al guardar el usuario:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Cierra el diálogo sin guardar
  }
}
