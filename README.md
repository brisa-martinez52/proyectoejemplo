# 🐾 Veterinaria Patitas - Sistema Completo

Sistema web completo para veterinaria con gestión de mascotas, turnos, productos y historial médico.

## 🎨 Diseño
- **Colores:** Paleta celeste pastel (#83d4d7, #acf2f5, #dffdfe)
- **Responsive:** Adaptable a todas las pantallas
- **Menú hamburguesa:** En dispositivos móviles

## ✨ Funcionalidades

### Para Clientes:
- ✅ Registro e inicio de sesión con DNI
- ✅ Gestión de mascotas (agregar, editar, eliminar)
- ✅ Tienda de productos con carrito de compras
- ✅ Solicitar y cancelar turnos veterinarios
- ✅ Ver historial médico completo de mascotas
- ✅ FAQ - Preguntas frecuentes

### Para Administradores:
- ✅ Panel de estadísticas
- ✅ Gestión de productos (agregar, editar stock, eliminar)
- ✅ Gestión de veterinarios
- ✅ Ver todos los turnos
- ✅ Ver todas las mascotas
- ✅ Ver historial de compras
- ✅ Crear registros médicos

## 🔑 Credenciales de Acceso

### Administrador:
- **DNI:** admin
- **Contraseña:** admin123

### Cliente:
- Regístrate con tus propios datos

## 🛠 Tecnologías

### Backend:
- FastAPI (Python)
- MongoDB (Base de datos)
- JWT (Autenticación)
- Bcrypt (Hash de contraseñas)

### Frontend:
- React 19
- React Router
- Axios
- Context API (Estado global)

## 📊 Base de Datos

### Colecciones:
- **usuarios:** Clientes y administradores
- **mascotas:** Datos de mascotas
- **productos:** Catálogo de productos
- **veterinarios:** Profesionales
- **turnos:** Reservas de turnos
- **compras:** Historial de compras
- **historial_medico:** Registros médicos

## 🚀 Datos Precargados

### Veterinarios:
- María González - Medicina General
- Carlos Rodríguez - Cirugía
- Ana Martínez - Dermatología

### Productos (6 items):
- Alimento Perro Adulto
- Alimento Gato Adulto
- Collar Antipulgas
- Juguete Interactivo
- Cama Ortopédica
- Shampoo Medicado

## 📱 Páginas

1. **Home (/):** Página principal con presentación
2. **Login (/login):** Inicio de sesión
3. **Register (/register):** Registro de usuarios
4. **Productos (/productos):** Catálogo y carrito de compras
5. **Mis Mascotas (/mis-mascotas):** Gestión de mascotas
6. **Solicitar Turno (/solicitar-turno):** Reserva de turnos
7. **Historial Médico (/historial-medico):** Ver historial de mascotas
8. **Panel Admin (/admin):** Solo para administradores
9. **FAQ (/faq):** Preguntas frecuentes

## 🎯 Características Técnicas

- ✅ Sistema de autenticación con JWT
- ✅ Protección de rutas privadas
- ✅ Hash seguro de contraseñas
- ✅ Carrito de compras persistente (localStorage)
- ✅ Actualización automática de stock
- ✅ Validaciones en formularios
- ✅ Diseño responsive con media queries
- ✅ Animaciones CSS
- ✅ Data-testids para testing

## 📞 Contacto
- **Teléfono:** +54 299 123456
- **Ubicación:** Neuquén, Argentina

## 🎨 Estilo y UX
El diseño sigue fielmente el concepto original con:
- Colores celeste pastel como base
- Tarjetas con sombras suaves
- Botones redondeados
- Navegación intuitiva
- Menú hamburguesa en móvil
- Transiciones suaves
- Iconos descriptivos

---

**Desarrollado con ❤️ para el cuidado de tus mascotas**
