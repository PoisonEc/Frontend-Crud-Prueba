import { Component, OnInit  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';  // Importa MatDialog
import { UserDialogComponent } from '../user-dialog/user-dialog.component'; // Importa el componente de diálogo
import { HttpClient } from '@angular/common/http';

export interface Usuario {
  id: number; //
  usuario: string;
  nombres: string;
  apellidos: string;
  departamento: string;
  cargo: string;
  
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  displayedColumns: string[] = ['usuario', 'nombres', 'apellidos', 'departamento', 'cargo', 'acciones'];
  usuarios: Usuario[] = [
    // { usuario: 'ppicapiedra', nombres: 'Pedro', apellidos: 'Picapiedra', departamento: 'Tecnologías de la Información', cargo: 'Administrador' },
    // { usuario: 'pmarmol', nombres: 'Pablo', apellidos: 'Marmol', departamento: 'Tecnologías de la Información', cargo: 'Líder Frontend' },
    // { usuario: 'wwhite', nombres: 'Walter', apellidos: 'White', departamento: 'Tecnologías de la Información', cargo: 'Desarrollador Frontend' }
  ];

  departamentos: any[] = [{id:1,label:'Tecnologías de la Información'}, {id:2,label:'Recursos Humanos'}, {id:3,label:'Finanzas'}];
  cargos: any[] = [{id:1,label:'Administrador'}, {id:2,label:'Líder Frontend'}, {id:3,label:'Desarrollador Frontend'}];


  usuariosFiltrados: Usuario[] = [];
  filtroDepartamento: number = 0; // 0 para mostrar todos los departamentos
  filtroCargo: number = 0;       // 0 para mostrar todos los cargos
  // Inyecta MatDialog en el constructor
  constructor(public dialog: MatDialog, private http: HttpClient,) {}

  ngOnInit(): void {
    this.listarUsuarios();

  }

  // Método para abrir el diálogo de registro de usuario
  openUserDialog(usuario?: any): void {
    console.log(usuario);
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: usuario // Pasa los datos del usuario al diálogo (será undefined si es nuevo)
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.listarUsuarios(); // Actualiza la lista después de agregar o editar
      }
    });
  }

  filtrarUsuarios(): void {
    this.usuariosFiltrados = this.usuarios.filter(usuario => {
      const filtrarDepartamento = this.filtroDepartamento === 0 || usuario.departamento === this.filtroDepartamento.toString();
      const filtrarCargo = this.filtroCargo === 0 || usuario.cargo === this.filtroCargo.toString();
      return filtrarDepartamento && filtrarCargo;
    });
  }

  buscarUsuario(id: number): void {
    const url = `http://127.0.0.1:8000/api/user/${id}`;
    this.http.get<any>(url).subscribe({
      next: (user) => {
        // Pasa los datos obtenidos sin formatearlos
        const usuario = {
          id: user.id,
          usuario: user.username,
          nombres: user.first_name,
          segundo_nombres: user.second_name,
          apellidos: user.first_last_name,
          segundo_apellidos: user.second_last_name,
          departamento: user.department_id,
          cargo: user.job_title_id,
        };
        this.openUserDialog(usuario); // Abre el diálogo de edición con los datos obtenidos
      },
      error: (error) => {
        console.error(`Error al buscar el usuario con ID ${id}:`, error);
      }
    });
  }
  
  listarUsuarios(): void {
    const url = 'http://127.0.0.1:8000/api/user';
    this.http.get<any[]>(url).subscribe({
      next: (response) => {
        console.log(response)
        // Mapeo de los datos para ajustarlos al formato esperado por la tabla
        this.usuarios = response.map(user => ({
          id : user.id,
          usuario: user.username,
          nombres: `${user.first_name} ${user.second_name ? user.second_name.trim() : ''}`.trim(),
          apellidos: `${user.first_last_name} ${user.second_last_name ? user.second_last_name.trim() : ''}`.trim(),
          departamento: user.department_id,
          cargo: user.job_title_id,
        }));
      },
      error: (error) => {
        console.error('Error al listar usuarios:', error);
      }
    });
  }
 
  actualizarUsuario(usuario: any): void {
    const url = `http://127.0.0.1:8000/api/user`;
    const usuarioActualizado = {
      id: usuario.id,
      username: usuario.usuario,
      first_name: usuario.nombres.split(' ')[0] || '',
      second_name: usuario.nombres.split(' ')[1] || '',
      first_last_name: usuario.apellidos.split(' ')[0] || '',
      second_last_name: usuario.apellidos.split(' ')[1] || '',
      department_id: usuario.departamento,
      job_title_id: usuario.cargo
    };

    this.http.put(url, usuarioActualizado).subscribe({
      next: (response) => {
        console.log('Usuario actualizado exitosamente:', response);
        this.listarUsuarios(); // Actualiza la lista de usuarios después de la actualización
      },
      error: (error) => {
        console.error('Error al actualizar el usuario:', error);
      }
    });
  }
  eliminarUsuario(id: number): void {
    console.log(id);
    const url = `http://127.0.0.1:8000/api/user/${id}`;
  
    this.http.delete(url).subscribe({
      next: () => {
        console.log(`Usuario con ID ${id} eliminado exitosamente`);
        // Actualiza la lista de usuarios después de eliminar
        this.listarUsuarios(); // Asegúrate de tener este método implementado
      },
      error: (error) => {
        console.error(`Error al eliminar el usuario con ID ${id}:`, error);
      }
    });
  }
  
}
