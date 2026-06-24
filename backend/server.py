from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
SECRET_KEY = os.environ.get('SECRET_KEY', 'patitas-secret-key-2024-veterinaria')
ALGORITHM = "HS256"

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# ===================== MODELS =====================

class Usuario(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    dni: str
    nombre: str
    apellido: str
    email: EmailStr
    telefono: str
    password_hash: str
    es_admin: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UsuarioCreate(BaseModel):
    dni: str
    nombre: str
    apellido: str
    email: EmailStr
    telefono: str
    password: str

class UsuarioLogin(BaseModel):
    dni: str
    password: str

class UsuarioResponse(BaseModel):
    id: str
    dni: str
    nombre: str
    apellido: str
    email: EmailStr
    telefono: str
    es_admin: bool

class Mascota(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    usuario_id: str
    nombre: str
    raza: str
    sexo: str
    edad: int
    peso: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MascotaCreate(BaseModel):
    nombre: str
    raza: str
    sexo: str
    edad: int
    peso: float

class MascotaUpdate(BaseModel):
    nombre: Optional[str] = None
    raza: Optional[str] = None
    sexo: Optional[str] = None
    edad: Optional[int] = None
    peso: Optional[float] = None

class Veterinario(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nombre: str
    apellido: str
    especialidad: str
    telefono: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VeterinarioCreate(BaseModel):
    nombre: str
    apellido: str
    especialidad: str
    telefono: str

class Turno(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    usuario_id: str
    mascota_id: str
    veterinario_id: str
    fecha: str
    hora: str
    estado: str = "activo"  # activo, cancelado, completado
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TurnoCreate(BaseModel):
    mascota_id: str
    veterinario_id: str
    fecha: str
    hora: str

class TurnoUpdate(BaseModel):
    estado: str

class Producto(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nombre: str
    descripcion: str
    precio: float
    stock: int
    imagen_url: Optional[str] = None
    categoria: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProductoCreate(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    stock: int
    imagen_url: Optional[str] = None
    categoria: str

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[float] = None
    stock: Optional[int] = None
    imagen_url: Optional[str] = None
    categoria: Optional[str] = None

class CompraItem(BaseModel):
    producto_id: str
    cantidad: int
    precio_unitario: float

class Compra(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    usuario_id: str
    items: List[CompraItem]
    total: float
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CompraCreate(BaseModel):
    items: List[CompraItem]

class HistorialMedico(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mascota_id: str
    veterinario_id: str
    fecha: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    diagnostico: str
    tratamiento: str
    vacunas: Optional[str] = None
    estudios: Optional[str] = None
    peso: float
    observaciones: Optional[str] = None

class HistorialMedicoCreate(BaseModel):
    mascota_id: str
    veterinario_id: str
    diagnostico: str
    tratamiento: str
    vacunas: Optional[str] = None
    estudios: Optional[str] = None
    peso: float
    observaciones: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    usuario: UsuarioResponse

# ===================== HELPER FUNCTIONS =====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario_id: str = payload.get("sub")
        if usuario_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        usuario = await db.usuarios.find_one({"id": usuario_id}, {"_id": 0})
        if usuario is None:
            raise HTTPException(status_code=401, detail="User not found")
        return Usuario(**usuario)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_admin(current_user: Usuario = Depends(get_current_user)):
    if not current_user.es_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user

# ===================== AUTH ENDPOINTS =====================

@api_router.post("/auth/register", response_model=Token)
async def register(usuario: UsuarioCreate):
    # Check if DNI already exists
    existing = await db.usuarios.find_one({"dni": usuario.dni})
    if existing:
        raise HTTPException(status_code=400, detail="DNI already registered")
    
    # Hash password
    password_hash = hash_password(usuario.password)
    
    # Create user
    usuario_dict = usuario.model_dump(exclude={"password"})
    usuario_obj = Usuario(**usuario_dict, password_hash=password_hash)
    doc = usuario_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.usuarios.insert_one(doc)
    
    # Create token
    access_token = create_access_token(data={"sub": usuario_obj.id})
    usuario_response = UsuarioResponse(**usuario_obj.model_dump())
    
    return Token(access_token=access_token, token_type="bearer", usuario=usuario_response)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UsuarioLogin):
    usuario = await db.usuarios.find_one({"dni": credentials.dni}, {"_id": 0})
    if not usuario:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(credentials.password, usuario["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    usuario_obj = Usuario(**usuario)
    access_token = create_access_token(data={"sub": usuario_obj.id})
    usuario_response = UsuarioResponse(**usuario_obj.model_dump())
    
    return Token(access_token=access_token, token_type="bearer", usuario=usuario_response)

@api_router.get("/auth/me", response_model=UsuarioResponse)
async def get_me(current_user: Usuario = Depends(get_current_user)):
    return UsuarioResponse(**current_user.model_dump())

# ===================== MASCOTAS ENDPOINTS =====================

@api_router.post("/mascotas", response_model=Mascota)
async def create_mascota(mascota: MascotaCreate, current_user: Usuario = Depends(get_current_user)):
    mascota_obj = Mascota(**mascota.model_dump(), usuario_id=current_user.id)
    doc = mascota_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.mascotas.insert_one(doc)
    return mascota_obj

@api_router.get("/mascotas", response_model=List[Mascota])
async def get_mascotas(current_user: Usuario = Depends(get_current_user)):
    query = {"usuario_id": current_user.id} if not current_user.es_admin else {}
    mascotas = await db.mascotas.find(query, {"_id": 0}).to_list(1000)
    for m in mascotas:
        if isinstance(m.get('created_at'), str):
            m['created_at'] = datetime.fromisoformat(m['created_at'])
    return mascotas

@api_router.get("/mascotas/{mascota_id}", response_model=Mascota)
async def get_mascota(mascota_id: str, current_user: Usuario = Depends(get_current_user)):
    mascota = await db.mascotas.find_one({"id": mascota_id}, {"_id": 0})
    if not mascota:
        raise HTTPException(status_code=404, detail="Mascota not found")
    if mascota["usuario_id"] != current_user.id and not current_user.es_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    if isinstance(mascota.get('created_at'), str):
        mascota['created_at'] = datetime.fromisoformat(mascota['created_at'])
    return Mascota(**mascota)

@api_router.put("/mascotas/{mascota_id}", response_model=Mascota)
async def update_mascota(mascota_id: str, mascota_update: MascotaUpdate, current_user: Usuario = Depends(get_current_user)):
    mascota = await db.mascotas.find_one({"id": mascota_id})
    if not mascota:
        raise HTTPException(status_code=404, detail="Mascota not found")
    if mascota["usuario_id"] != current_user.id and not current_user.es_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = {k: v for k, v in mascota_update.model_dump().items() if v is not None}
    if update_data:
        await db.mascotas.update_one({"id": mascota_id}, {"$set": update_data})
    
    updated_mascota = await db.mascotas.find_one({"id": mascota_id}, {"_id": 0})
    if isinstance(updated_mascota.get('created_at'), str):
        updated_mascota['created_at'] = datetime.fromisoformat(updated_mascota['created_at'])
    return Mascota(**updated_mascota)

@api_router.delete("/mascotas/{mascota_id}")
async def delete_mascota(mascota_id: str, current_user: Usuario = Depends(get_current_user)):
    mascota = await db.mascotas.find_one({"id": mascota_id})
    if not mascota:
        raise HTTPException(status_code=404, detail="Mascota not found")
    if mascota["usuario_id"] != current_user.id and not current_user.es_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.mascotas.delete_one({"id": mascota_id})
    return {"message": "Mascota deleted"}

# ===================== VETERINARIOS ENDPOINTS =====================

@api_router.post("/veterinarios", response_model=Veterinario)
async def create_veterinario(veterinario: VeterinarioCreate, current_user: Usuario = Depends(get_current_admin)):
    veterinario_obj = Veterinario(**veterinario.model_dump())
    doc = veterinario_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.veterinarios.insert_one(doc)
    return veterinario_obj

@api_router.get("/veterinarios", response_model=List[Veterinario])
async def get_veterinarios():
    veterinarios = await db.veterinarios.find({}, {"_id": 0}).to_list(1000)
    for v in veterinarios:
        if isinstance(v.get('created_at'), str):
            v['created_at'] = datetime.fromisoformat(v['created_at'])
    return veterinarios

@api_router.get("/veterinarios/{veterinario_id}", response_model=Veterinario)
async def get_veterinario(veterinario_id: str):
    veterinario = await db.veterinarios.find_one({"id": veterinario_id}, {"_id": 0})
    if not veterinario:
        raise HTTPException(status_code=404, detail="Veterinario not found")
    if isinstance(veterinario.get('created_at'), str):
        veterinario['created_at'] = datetime.fromisoformat(veterinario['created_at'])
    return Veterinario(**veterinario)

# ===================== TURNOS ENDPOINTS =====================

@api_router.post("/turnos", response_model=Turno)
async def create_turno(turno: TurnoCreate, current_user: Usuario = Depends(get_current_user)):
    # Verify mascota belongs to user
    mascota = await db.mascotas.find_one({"id": turno.mascota_id})
    if not mascota or mascota["usuario_id"] != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    turno_obj = Turno(**turno.model_dump(), usuario_id=current_user.id)
    doc = turno_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.turnos.insert_one(doc)
    return turno_obj

@api_router.get("/turnos", response_model=List[Turno])
async def get_turnos(current_user: Usuario = Depends(get_current_user)):
    query = {"usuario_id": current_user.id} if not current_user.es_admin else {}
    turnos = await db.turnos.find(query, {"_id": 0}).to_list(1000)
    for t in turnos:
        if isinstance(t.get('created_at'), str):
            t['created_at'] = datetime.fromisoformat(t['created_at'])
    return turnos

@api_router.put("/turnos/{turno_id}", response_model=Turno)
async def update_turno(turno_id: str, turno_update: TurnoUpdate, current_user: Usuario = Depends(get_current_user)):
    turno = await db.turnos.find_one({"id": turno_id})
    if not turno:
        raise HTTPException(status_code=404, detail="Turno not found")
    if turno["usuario_id"] != current_user.id and not current_user.es_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    await db.turnos.update_one({"id": turno_id}, {"$set": turno_update.model_dump()})
    updated_turno = await db.turnos.find_one({"id": turno_id}, {"_id": 0})
    if isinstance(updated_turno.get('created_at'), str):
        updated_turno['created_at'] = datetime.fromisoformat(updated_turno['created_at'])
    return Turno(**updated_turno)

# ===================== PRODUCTOS ENDPOINTS =====================

@api_router.post("/productos", response_model=Producto)
async def create_producto(producto: ProductoCreate, current_user: Usuario = Depends(get_current_admin)):
    producto_obj = Producto(**producto.model_dump())
    doc = producto_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    await db.productos.insert_one(doc)
    return producto_obj

@api_router.get("/productos", response_model=List[Producto])
async def get_productos():
    productos = await db.productos.find({}, {"_id": 0}).to_list(1000)
    for p in productos:
        if isinstance(p.get('created_at'), str):
            p['created_at'] = datetime.fromisoformat(p['created_at'])
    return productos

@api_router.get("/productos/{producto_id}", response_model=Producto)
async def get_producto(producto_id: str):
    producto = await db.productos.find_one({"id": producto_id}, {"_id": 0})
    if not producto:
        raise HTTPException(status_code=404, detail="Producto not found")
    if isinstance(producto.get('created_at'), str):
        producto['created_at'] = datetime.fromisoformat(producto['created_at'])
    return Producto(**producto)

@api_router.put("/productos/{producto_id}", response_model=Producto)
async def update_producto(producto_id: str, producto_update: ProductoUpdate, current_user: Usuario = Depends(get_current_admin)):
    update_data = {k: v for k, v in producto_update.model_dump().items() if v is not None}
    if update_data:
        await db.productos.update_one({"id": producto_id}, {"$set": update_data})
    
    updated_producto = await db.productos.find_one({"id": producto_id}, {"_id": 0})
    if not updated_producto:
        raise HTTPException(status_code=404, detail="Producto not found")
    if isinstance(updated_producto.get('created_at'), str):
        updated_producto['created_at'] = datetime.fromisoformat(updated_producto['created_at'])
    return Producto(**updated_producto)

@api_router.delete("/productos/{producto_id}")
async def delete_producto(producto_id: str, current_user: Usuario = Depends(get_current_admin)):
    await db.productos.delete_one({"id": producto_id})
    return {"message": "Producto deleted"}

# ===================== COMPRAS ENDPOINTS =====================

@api_router.post("/compras", response_model=Compra)
async def create_compra(compra: CompraCreate, current_user: Usuario = Depends(get_current_user)):
    # Calculate total and verify stock
    total = 0
    for item in compra.items:
        producto = await db.productos.find_one({"id": item.producto_id})
        if not producto:
            raise HTTPException(status_code=404, detail=f"Producto {item.producto_id} not found")
        if producto["stock"] < item.cantidad:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {producto['nombre']}")
        total += item.precio_unitario * item.cantidad
        # Update stock
        await db.productos.update_one(
            {"id": item.producto_id},
            {"$inc": {"stock": -item.cantidad}}
        )
    
    compra_obj = Compra(**compra.model_dump(), usuario_id=current_user.id, total=total)
    doc = compra_obj.model_dump()
    doc['fecha'] = doc['fecha'].isoformat()
    await db.compras.insert_one(doc)
    return compra_obj

@api_router.get("/compras", response_model=List[Compra])
async def get_compras(current_user: Usuario = Depends(get_current_user)):
    query = {"usuario_id": current_user.id} if not current_user.es_admin else {}
    compras = await db.compras.find(query, {"_id": 0}).to_list(1000)
    for c in compras:
        if isinstance(c.get('fecha'), str):
            c['fecha'] = datetime.fromisoformat(c['fecha'])
    return compras

# ===================== HISTORIAL MEDICO ENDPOINTS =====================

@api_router.post("/historial-medico", response_model=HistorialMedico)
async def create_historial(historial: HistorialMedicoCreate, current_user: Usuario = Depends(get_current_admin)):
    historial_obj = HistorialMedico(**historial.model_dump())
    doc = historial_obj.model_dump()
    doc['fecha'] = doc['fecha'].isoformat()
    await db.historial_medico.insert_one(doc)
    return historial_obj

@api_router.get("/historial-medico/mascota/{mascota_id}", response_model=List[HistorialMedico])
async def get_historial_by_mascota(mascota_id: str, current_user: Usuario = Depends(get_current_user)):
    # Verify mascota belongs to user or user is admin
    mascota = await db.mascotas.find_one({"id": mascota_id})
    if not mascota:
        raise HTTPException(status_code=404, detail="Mascota not found")
    if mascota["usuario_id"] != current_user.id and not current_user.es_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    historial = await db.historial_medico.find({"mascota_id": mascota_id}, {"_id": 0}).to_list(1000)
    for h in historial:
        if isinstance(h.get('fecha'), str):
            h['fecha'] = datetime.fromisoformat(h['fecha'])
    return historial

# ===================== ADMIN STATS =====================

@api_router.get("/admin/stats")
async def get_admin_stats(current_user: Usuario = Depends(get_current_admin)):
    usuarios_count = await db.usuarios.count_documents({})
    mascotas_count = await db.mascotas.count_documents({})
    productos_count = await db.productos.count_documents({})
    turnos_activos = await db.turnos.count_documents({"estado": "activo"})
    compras_count = await db.compras.count_documents({})
    
    return {
        "usuarios": usuarios_count,
        "mascotas": mascotas_count,
        "productos": productos_count,
        "turnos_activos": turnos_activos,
        "compras_totales": compras_count
    }

# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

@app.on_event("startup")
async def startup_db():
    # Create admin user if not exists
    admin = await db.usuarios.find_one({"dni": "admin"})
    if not admin:
        admin_password = hash_password("admin123")
        admin_user = Usuario(
            dni="admin",
            nombre="Administrador",
            apellido="Sistema",
            email="admin@patitas.com",
            telefono="2991234567",
            password_hash=admin_password,
            es_admin=True
        )
        doc = admin_user.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.usuarios.insert_one(doc)
        logger.info("Admin user created: DNI=admin, Password=admin123")
